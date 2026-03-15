import { readFile } from "node:fs/promises";
import path from "node:path";

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string | undefined>;
}
interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
}
type Handler = (event: NetlifyEvent) => Promise<NetlifyResponse>;

interface KnowledgeChunk {
  id: string;
  text: string;
  tokens: string[];
}

interface KnowledgeDocument {
  id: string;
  path: string;
  charCount: number;
  chunks: KnowledgeChunk[];
}

interface KnowledgeIndex {
  generatedAt: string;
  version: number;
  source: {
    publicDir: string;
    totalDocuments: number;
    totalChunks: number;
  };
  documents: KnowledgeDocument[];
}

interface AssistantRequest {
  question?: string;
  recentErrors?: string[];
  route?: string;
}

interface AssistantCitation {
  path: string;
  snippet: string;
}

interface AssistantResponse {
  answer: string;
  citations: AssistantCitation[];
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

const DEFAULT_MODEL = "gemini-3.1-pro-preview";
const MAX_CONTEXT_CHUNKS = 6;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

let inMemoryIndex: KnowledgeIndex | null = null;

function json(statusCode: number, payload: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
    body: JSON.stringify(payload),
  };
}

function normalizeToTokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/gu)
    .filter((token) => token.length >= 3);
}

function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  if (queryTokens.length === 0) return 0;
  const tokenSet = new Set(chunk.tokens);
  let score = 0;
  for (const token of queryTokens) {
    if (tokenSet.has(token)) {
      score += token.length >= 8 ? 2 : 1;
    }
  }
  return score;
}

async function loadFromFileSystem(): Promise<KnowledgeIndex | null> {
  const candidates = [
    path.resolve(process.cwd(), "public/ama-knowledge-index.json"),
    path.resolve(process.cwd(), "dist/ama-knowledge-index.json"),
  ];
  for (const filePath of candidates) {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as KnowledgeIndex;
    } catch {
      continue;
    }
  }
  return null;
}

async function loadFromPublicFetch(event: NetlifyEvent): Promise<KnowledgeIndex | null> {
  const host = event.headers?.host;
  const proto = event.headers?.["x-forwarded-proto"] || "https";
  if (!host) return null;
  try {
    const response = await fetch(`${proto}://${host}/ama-knowledge-index.json`);
    if (!response.ok) return null;
    return (await response.json()) as KnowledgeIndex;
  } catch {
    return null;
  }
}

async function getKnowledgeIndex(event: NetlifyEvent): Promise<KnowledgeIndex> {
  if (inMemoryIndex) return inMemoryIndex;
  const fromFs = await loadFromFileSystem();
  if (fromFs) {
    inMemoryIndex = fromFs;
    return fromFs;
  }
  const fromFetch = await loadFromPublicFetch(event);
  if (fromFetch) {
    inMemoryIndex = fromFetch;
    return fromFetch;
  }
  throw new Error("Knowledge index unavailable. Run build-ama-knowledge-index first.");
}

function buildContext(index: KnowledgeIndex, question: string): { context: string; citations: AssistantCitation[] } {
  const queryTokens = normalizeToTokens(question);
  const scoredChunks: Array<{ doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }> = [];
  for (const doc of index.documents) {
    for (const chunk of doc.chunks) {
      const score = scoreChunk(queryTokens, chunk);
      if (score > 0) {
        scoredChunks.push({ doc, chunk, score });
      }
    }
  }

  scoredChunks.sort((a, b) => b.score - a.score);
  const topChunks = scoredChunks.slice(0, MAX_CONTEXT_CHUNKS);

  const context = topChunks
    .map((entry, indexInList) => {
      return `Source ${indexInList + 1} (${entry.doc.path}):\n${entry.chunk.text}`;
    })
    .join("\n\n---\n\n");

  const citations = topChunks.map((entry) => ({
    path: entry.doc.path,
    snippet: entry.chunk.text.slice(0, 220),
  }));

  return { context, citations };
}

async function callGemini({
  apiKey,
  model,
  question,
  route,
  recentErrors,
  context,
}: {
  apiKey: string;
  model: string;
  question: string;
  route?: string;
  recentErrors?: string[];
  context: string;
}): Promise<string> {
  const systemPrompt = [
    "You are the Michael Simoneau AMA assistant.",
    "Answer only using the provided SOURCE_CONTEXT from /public/**/*.txt corpus.",
    "If the answer is not explicitly grounded in SOURCE_CONTEXT, say you do not know from the available corpus.",
    "Be concise and factual.",
    "If error context is present, use it to help with debugging-oriented guidance but do not fabricate root cause.",
  ].join("\n");

  const userPrompt = [
    `ROUTE: ${route ?? "unknown"}`,
    recentErrors?.length ? `RECENT_ERRORS:\n- ${recentErrors.slice(0, 5).join("\n- ")}` : "RECENT_ERRORS: none",
    "",
    `QUESTION: ${question}`,
    "",
    "SOURCE_CONTEXT:",
    context || "No relevant source chunks matched.",
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.2 },
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details.slice(0, 300)}`);
  }

  const payload = (await response.json()) as GeminiGenerateContentResponse;
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_ASSISTANT_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  if (!apiKey) {
    return json(500, { error: "Missing GEMINI_API_KEY environment variable" });
  }

  try {
    const body = event.body ? (JSON.parse(event.body) as AssistantRequest) : {};
    const question = (body.question ?? "").trim();
    if (question.length < 3) {
      return json(400, { error: "Question is required" });
    }

    const index = await getKnowledgeIndex(event);
    const { context, citations } = buildContext(index, question);

    const answer = await callGemini({
      apiKey,
      model,
      question,
      route: body.route,
      recentErrors: Array.isArray(body.recentErrors) ? body.recentErrors : [],
      context,
    });

    const payload: AssistantResponse = {
      answer: answer || "I do not know from the available corpus.",
      citations,
    };
    return json(200, payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json(500, { error: message });
  }
};

export default handler;
