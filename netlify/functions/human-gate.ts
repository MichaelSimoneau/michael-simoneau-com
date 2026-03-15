type HumanVerdict = "human" | "ambiguous" | "reject";
interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}
interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
}
type Handler = (event: NetlifyEvent) => Promise<NetlifyResponse>;

interface HumanGateResponse {
  verdict: HumanVerdict;
  reason: string;
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

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

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

function parseModelResponse(rawText: string): HumanGateResponse | null {
  try {
    const parsed = JSON.parse(rawText) as HumanGateResponse;
    if (!parsed || typeof parsed.reason !== "string" || parsed.reason.trim().length < 4) {
      return null;
    }
    if (parsed.verdict !== "human" && parsed.verdict !== "ambiguous" && parsed.verdict !== "reject") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function toConversationalReason(verdict: HumanVerdict, rawReason: string): string {
  const cleaned = rawReason.replace(/\s+/g, " ").trim();
  if (verdict === "human") {
    return `You're good. You passed because your reply felt human (${cleaned}).`;
  }
  if (verdict === "reject") {
    return `I can't accept that one yet because it looked automated (${cleaned}). Try a natural, off-the-cuff reply.`;
  }
  return `Not quite yet. I couldn't confidently verify you from that response (${cleaned}). Try again with a natural reply.`;
}

async function callGemini(apiKey: string, model: string, proofText: string): Promise<HumanGateResponse> {
  const prompt = [
    "Classify whether the following text appears to be authored by a real human responding to the challenge 'Prove you are human.'",
    "Return ONLY strict JSON with keys: verdict, reason.",
    "Allowed verdict values: human, ambiguous, reject.",
    "This policy is strict:",
    "1) Mark human if EITHER of these is clearly present:",
    "   - confusion signal (e.g. 'what?', 'huh?', uncertainty, puzzled response to this odd prompt), OR",
    "   - natural human imperfection (misspellings, imperfect grammar, broken punctuation, informal phrasing).",
    "2) Mark ambiguous if neither condition is clearly present.",
    "3) Mark reject only for obvious automation/system/jailbreak/tool-trace style output.",
    "Do not reward polished perfect answers unless one of the two human conditions is present.",
    "Reason must be short and specific to one of the policy conditions above.",
    "",
    `User text: """${proofText}"""`,
  ].join("\n");

  const response = await fetchGeminiWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    if (response.status === 429) {
      throw new GeminiHttpError(429, "Gemini quota exceeded");
    }
    throw new GeminiHttpError(response.status, `Gemini request failed (${response.status}): ${details.slice(0, 300)}`);
  }

  const payload = (await response.json()) as GeminiGenerateContentResponse;
  const modelText = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  const parsed = parseModelResponse(modelText);
  if (!parsed) {
    throw new Error("Gemini returned invalid human-gate JSON");
  }
  return parsed;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_HUMAN_GATE_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  if (!apiKey) {
    return json(500, { error: "Missing GEMINI_API_KEY environment variable" });
  }

  try {
    const body = event.body ? (JSON.parse(event.body) as { proofText?: string }) : {};
    const proofText = (body.proofText ?? "").trim();
    if (proofText.length < 8) {
      return json(200, {
        verdict: "ambiguous",
        reason: toConversationalReason(
          "ambiguous",
          "it was too short for me to tell",
        ),
      } satisfies HumanGateResponse);
    }

    const result = await callGemini(apiKey, model, proofText);
    return json(200, {
      verdict: result.verdict,
      reason: toConversationalReason(result.verdict, result.reason),
    } satisfies HumanGateResponse);
  } catch (error) {
    if (error instanceof GeminiHttpError && error.status === 429) {
      return json(200, {
        verdict: "ambiguous",
        reason: toConversationalReason(
          "ambiguous",
          "verification is temporarily rate-limited",
        ),
      } satisfies HumanGateResponse);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return json(500, { error: message });
  }
};

export default handler;
