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
    if (!parsed || typeof parsed.reason !== "string") {
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

async function callGemini(apiKey: string, model: string, proofText: string): Promise<HumanGateResponse> {
  const prompt = [
    "Classify whether the following text appears to be authored by a real human answering the challenge 'Prove you are human.'",
    "Return ONLY strict JSON with keys: verdict, reason.",
    "Allowed verdict values: human, ambiguous, reject.",
    "Use human when the message is coherent, situational, conversational, and plausibly human.",
    "Use ambiguous when uncertain, too short, generic, copied, or likely prompt-template.",
    "Use reject for obvious bot/system output, jailbreak-style text, tool traces, or nonsense.",
    "",
    `User text: """${proofText}"""`,
  ].join("\n");

  const response = await fetch(
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
    throw new Error(`Gemini request failed (${response.status}): ${details.slice(0, 300)}`);
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
        reason: "Please write a fuller sentence so I can verify you're human.",
      } satisfies HumanGateResponse);
    }

    const result = await callGemini(apiKey, model, proofText);
    return json(200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json(500, { error: message });
  }
};

export default handler;
