import { readdir, readFile, stat } from "node:fs/promises";
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
  contentHash?: string;
  summary?: string;
  topicTags?: string[];
  relatedKeys?: string[];
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
  debugIntent?: boolean;
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

class GeminiHttpError extends Error {
  public readonly status: number;
  public readonly providerMessage?: string;

  constructor(status: number, message: string, providerMessage?: string) {
    super(message);
    this.status = status;
    this.providerMessage = providerMessage;
    this.name = "GeminiHttpError";
  }
}
const MAX_GEMINI_RETRIES = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelayMs = (response: Response, attempt: number): number => {
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.min(5000, Math.trunc(retryAfterSeconds * 1000));
  }
  return Math.min(4000, 450 * 2 ** attempt);
};

async function fetchGeminiWithRetry(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_GEMINI_RETRIES; attempt += 1) {
    const response = await fetch(url, init);
    if (response.ok) {
      return response;
    }
    const shouldRetry =
      (response.status === 429 || response.status === 503) && attempt < MAX_GEMINI_RETRIES;
    if (!shouldRetry) {
      return response;
    }
    await sleep(getRetryDelayMs(response, attempt));
  }
  throw new Error("Gemini request retry loop exited unexpectedly");
}

const DEFAULT_MODEL = "gemini-3.1-pro-preview";
const MAX_CONTEXT_CHUNKS = 6;
const DEFAULT_PREFILTER_LIMIT = 20;
const DEFAULT_MAX_CHUNKS_PER_DOC = 2;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};
const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 150;

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

function parsePositiveIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.trunc(parsed);
}

function parseBooleanEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.toLowerCase() === "true";
}

const DEBUG_INTENT_PATTERN =
  /\b(error|bug|debug|stack|trace|crash|failing|failed|failure|exception|hydration|hydrate|console|not working|broken|fix)\b/i;

function hasDebugIntent(question: string): boolean {
  return DEBUG_INTENT_PATTERN.test(question);
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

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/gu, "\n")
    .replace(/\t/gu, " ")
    .replace(/[ ]{2,}/gu, " ")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function chunkText(value: string): KnowledgeChunk[] {
  if (!value) return [];
  const chunks: KnowledgeChunk[] = [];
  let start = 0;
  let chunkIndex = 0;
  while (start < value.length) {
    const hardEnd = Math.min(value.length, start + CHUNK_SIZE);
    let end = hardEnd;
    if (hardEnd < value.length) {
      const nearestBreak = value.lastIndexOf("\n", hardEnd);
      if (nearestBreak > start + 120) {
        end = nearestBreak;
      }
    }
    const text = value.slice(start, end).trim();
    if (text) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        text,
        tokens: normalizeToTokens(text),
      });
      chunkIndex += 1;
    }
    if (end >= value.length) break;
    start = Math.max(0, end - CHUNK_OVERLAP);
  }
  return chunks;
}

async function collectTxtFilesRecursive(rootDir: string, currentRelative = ""): Promise<string[]> {
  const absoluteDir = path.resolve(rootDir);
  const entries = await readdir(absoluteDir);
  const results: string[] = [];
  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry);
    const entryStats = await stat(absolutePath);
    const relativePath = path.posix.join(currentRelative, entry);
    if (entryStats.isDirectory()) {
      results.push(...(await collectTxtFilesRecursive(absolutePath, relativePath)));
      continue;
    }
    if (entry.toLowerCase().endsWith(".txt")) {
      results.push(relativePath);
    }
  }
  return results.sort((a, b) => a.localeCompare(b));
}

async function buildIndexFromPublicDirectory(): Promise<KnowledgeIndex | null> {
  const publicDir = path.resolve(process.cwd(), "public");
  try {
    const txtRelativePaths = await collectTxtFilesRecursive(publicDir);
    if (txtRelativePaths.length === 0) {
      return null;
    }

    const documents: KnowledgeDocument[] = [];
    for (let i = 0; i < txtRelativePaths.length; i += 1) {
      const relativePath = txtRelativePaths[i];
      const absolutePath = path.join(publicDir, relativePath);
      const raw = await readFile(absolutePath, "utf8");
      const normalized = normalizeText(raw);
      documents.push({
        id: `doc_${i}`,
        path: `/${relativePath}`,
        charCount: normalized.length,
        chunks: chunkText(normalized),
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      version: 1,
      source: {
        publicDir: "/public",
        totalDocuments: documents.length,
        totalChunks: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
      },
      documents,
    };
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
  const fromTxtFallback = await buildIndexFromPublicDirectory();
  if (fromTxtFallback) {
    inMemoryIndex = fromTxtFallback;
    return fromTxtFallback;
  }
  throw new Error("Knowledge index unavailable. Could not load public/*.txt corpus.");
}

function buildLexicalCandidates(index: KnowledgeIndex, question: string, prefilterLimit: number) {
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
  return scoredChunks.slice(0, prefilterLimit);
}

function buildCandidateId(doc: KnowledgeDocument, chunk: KnowledgeChunk): string {
  return `${doc.id}:${chunk.id}`;
}

async function rerankCandidatesWithGemini({
  apiKey,
  model,
  question,
  candidates,
}: {
  apiKey: string;
  model: string;
  question: string;
  candidates: Array<{ doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }>;
}): Promise<string[] | null> {
  if (!candidates.length) {
    return [];
  }

  const candidateLines = candidates.map((item, idx) => {
    const candidateId = buildCandidateId(item.doc, item.chunk);
    const summary = item.chunk.summary?.trim() || item.chunk.text.slice(0, 150);
    const topicTags = (item.chunk.topicTags ?? []).slice(0, 6).join(", ");
    const relatedKeys = (item.chunk.relatedKeys ?? []).slice(0, 6).join(", ");
    return [
      `Candidate ${idx + 1}`,
      `id: ${candidateId}`,
      `path: ${item.doc.path}`,
      `summary: ${summary}`,
      `topicTags: ${topicTags || "none"}`,
      `relatedKeys: ${relatedKeys || "none"}`,
    ].join("\n");
  });

  const prompt = [
    "You are ranking retrieval chunks for a user question.",
    "Return strict JSON only: {\"rankedChunkIds\": [string, ...]}",
    "Rules:",
    "- Rank most semantically relevant chunks highest.",
    "- Prefer complementary coverage over duplicates.",
    "- Keep only ids from provided candidates.",
    "",
    `Question: ${question}`,
    "",
    "Candidates:",
    candidateLines.join("\n\n"),
  ].join("\n");

  const response = await fetchGeminiWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );
  if (!response.ok) {
    return null;
  }
  try {
    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    const parsed = JSON.parse(raw) as { rankedChunkIds?: string[] };
    if (!Array.isArray(parsed.rankedChunkIds)) {
      return null;
    }
    const allowed = new Set(candidates.map((item) => buildCandidateId(item.doc, item.chunk)));
    return parsed.rankedChunkIds.filter((id) => allowed.has(id));
  } catch {
    return null;
  }
}

function selectDiverseChunks({
  candidates,
  rankedChunkIds,
  finalChunkLimit,
  maxChunksPerDoc,
}: {
  candidates: Array<{ doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }>;
  rankedChunkIds: string[] | null;
  finalChunkLimit: number;
  maxChunksPerDoc: number;
}) {
  const byId = new Map<string, { doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }>();
  for (const item of candidates) {
    byId.set(buildCandidateId(item.doc, item.chunk), item);
  }

  const ordered = rankedChunkIds?.length
    ? rankedChunkIds.map((id) => byId.get(id)).filter(Boolean)
    : candidates;

  const perDocCounter = new Map<string, number>();
  const selected: Array<{ doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }> = [];
  for (const item of ordered) {
    if (!item) continue;
    if (selected.length >= finalChunkLimit) break;
    const currentCount = perDocCounter.get(item.doc.id) ?? 0;
    if (currentCount >= maxChunksPerDoc) continue;
    perDocCounter.set(item.doc.id, currentCount + 1);
    selected.push(item);
  }

  return selected;
}

function buildContextFromSelection(
  selectedChunks: Array<{ doc: KnowledgeDocument; chunk: KnowledgeChunk; score: number }>,
): { context: string; citations: AssistantCitation[] } {
  const topChunks = selectedChunks.slice(0, MAX_CONTEXT_CHUNKS);

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

function buildFallbackAnswerFromCitations(citations: AssistantCitation[]): string {
  if (!citations.length) {
    return "The assistant is temporarily unavailable due to model quota limits. I cannot provide a grounded answer right now.";
  }
  const preview = citations
    .slice(0, 3)
    .map((citation, index) => `${index + 1}. ${citation.snippet}`)
    .join("\n");
  return [
    "The model is temporarily quota-limited, so I cannot run full AI synthesis right now.",
    "Here are the most relevant source excerpts I found:",
    preview,
  ].join("\n\n");
}

function sanitizeAnswerForNonDebugMode(answer: string): string {
  if (!answer.trim()) {
    return answer;
  }

  const debugSectionPattern =
    /(?:\n|\r|^)(?:\*{2}Debugging Guidance[^]*$|Debugging Guidance[^]*$|###\s*Debugging[^]*$)/i;
  const stripped = answer.replace(debugSectionPattern, "").trim();
  return stripped || "I do not know from the available corpus.";
}

async function callGemini({
  apiKey,
  model,
  question,
  route,
  recentErrors,
  debugMode,
  context,
}: {
  apiKey: string;
  model: string;
  question: string;
  route?: string;
  recentErrors?: string[];
  debugMode: boolean;
  context: string;
}): Promise<string> {
  const systemPrompt = [
    "You are the Michael Simoneau AMA assistant.",
    "Answer only using the provided SOURCE_CONTEXT from /public/**/*.txt corpus.",
    "If the answer is not explicitly grounded in SOURCE_CONTEXT, say you do not know from the available corpus.",
    "Be concise and factual.",
    "Only provide debugging guidance when DEBUG_MODE is true and the user asked for troubleshooting.",
    "When DEBUG_MODE is false, do not include any debug appendix, diagnostics, or troubleshooting instructions.",
  ].join("\n");

  const userPrompt = [
    `ROUTE: ${route ?? "unknown"}`,
    `DEBUG_MODE: ${debugMode ? "true" : "false"}`,
    debugMode && recentErrors?.length
      ? `RECENT_ERRORS:\n- ${recentErrors.slice(0, 5).join("\n- ")}`
      : "RECENT_ERRORS: none",
    "",
    `QUESTION: ${question}`,
    "",
    "SOURCE_CONTEXT:",
    context || "No relevant source chunks matched.",
  ].join("\n");

  const response = await fetchGeminiWithRetry(
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
    if (response.status === 429) {
      throw new GeminiHttpError(429, "Gemini quota exceeded", details.slice(0, 300));
    }
    throw new GeminiHttpError(response.status, `Gemini request failed (${response.status})`, details.slice(0, 300));
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
  const rerankModel = process.env.GEMINI_RERANK_MODEL || model;
  const prefilterLimit = parsePositiveIntEnv("AMA_PREFILTER_LIMIT", DEFAULT_PREFILTER_LIMIT);
  const finalChunkLimit = parsePositiveIntEnv("AMA_FINAL_CHUNK_LIMIT", MAX_CONTEXT_CHUNKS);
  const maxChunksPerDoc = parsePositiveIntEnv("AMA_MAX_CHUNKS_PER_DOC", DEFAULT_MAX_CHUNKS_PER_DOC);
  const enableRerank = parseBooleanEnv("AMA_ENABLE_AI_RERANK", true);
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
    const lexicalCandidates = buildLexicalCandidates(index, question, prefilterLimit);
    const debugMode = body.debugIntent === true || hasDebugIntent(question);

    let rerankedIds: string[] | null = null;
    if (enableRerank && lexicalCandidates.length > 0) {
      rerankedIds = await rerankCandidatesWithGemini({
        apiKey,
        model: rerankModel,
        question,
        candidates: lexicalCandidates,
      });
    }

    const selectedChunks = selectDiverseChunks({
      candidates: lexicalCandidates,
      rankedChunkIds: rerankedIds,
      finalChunkLimit,
      maxChunksPerDoc,
    });

    const { context, citations } = buildContextFromSelection(selectedChunks);

    if (selectedChunks.length === 0) {
      const payload: AssistantResponse = {
        answer: "I do not know from the available corpus.",
        citations: [],
      };
      return json(200, payload);
    }

    let answer = "";
    try {
      answer = await callGemini({
        apiKey,
        model,
        question,
        route: body.route,
        recentErrors: debugMode && Array.isArray(body.recentErrors) ? body.recentErrors : [],
        debugMode,
        context,
      });
    } catch (error) {
      if (error instanceof GeminiHttpError && error.status === 429) {
        answer = buildFallbackAnswerFromCitations(citations);
      } else {
        throw error;
      }
    }

    const payload: AssistantResponse = {
      answer: debugMode
        ? answer || "I do not know from the available corpus."
        : sanitizeAnswerForNonDebugMode(answer || "I do not know from the available corpus."),
      citations,
    };
    return json(200, payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json(500, { error: message });
  }
};

export default handler;
