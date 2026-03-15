import { useCallback, useMemo, useState } from "react";
import { cookieService } from "../../../services/cookieService";
import { getRecentAmaErrorContext } from "./useErrorContextCapture";

type GateVerdict = "human" | "ambiguous" | "reject";

export interface AmaMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface AmaCitation {
  path: string;
  snippet: string;
}

const initialMessages: AmaMessage[] = [
  {
    id: "assistant-init",
    role: "assistant",
    text: "Ask me anything about Michael Simoneau. I will answer only from the published text corpus.",
  },
];

const buildMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function useAmaAssistant() {
  const [authVersion, setAuthVersion] = useState(0);
  const [messages, setMessages] = useState<AmaMessage[]>(initialMessages);
  const [lastCitations, setLastCitations] = useState<AmaCitation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gateFeedback, setGateFeedback] = useState<string>("");
  const [gateVerdict, setGateVerdict] = useState<GateVerdict | null>(null);

  const refreshAuthState = useCallback(() => {
    setAuthVersion((value) => value + 1);
  }, []);

  const hasTermsAccess = cookieService.hasActiveMediaTermsAgreement();
  const isHumanVerified = cookieService.hasActiveAmaHumanVerification();
  const isUnlocked = hasTermsAccess && isHumanVerified;

  const ensureTermsAccepted = useCallback(() => {
    cookieService.setMediaTermsAgreement(true);
    refreshAuthState();
  }, [refreshAuthState]);

  const verifyHuman = useCallback(async (proofText: string): Promise<GateVerdict> => {
    setIsSubmitting(true);
    setGateFeedback("");
    setGateVerdict(null);
    try {
      const response = await fetch("/.netlify/functions/human-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofText }),
      });
      if (!response.ok) {
        throw new Error("Human verification is unavailable. Please try again.");
      }
      const payload = (await response.json()) as { verdict: GateVerdict; reason: string };
      if (payload.verdict === "human") {
        cookieService.setAmaHumanVerified(true);
        cookieService.touchAmaHumanVerification();
      }
      setGateFeedback(payload.reason || "");
      setGateVerdict(payload.verdict);
      refreshAuthState();
      return payload.verdict;
    } catch (error) {
      setGateFeedback(error instanceof Error ? error.message : "Verification failed.");
      setGateVerdict("ambiguous");
      refreshAuthState();
      return "ambiguous";
    } finally {
      setIsSubmitting(false);
      refreshAuthState();
    }
  }, [refreshAuthState]);

  const askQuestion = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    if (!cookieService.hasActiveMediaTermsAgreement()) {
      throw new Error("Please accept terms first.");
    }
    if (!cookieService.hasActiveAmaHumanVerification()) {
      throw new Error("Please complete the human check first.");
    }

    cookieService.touchMediaTermsAgreement();
    cookieService.touchAmaHumanVerification();
    setIsSubmitting(true);
    setLastCitations([]);
    setMessages((prev) => [...prev, { id: buildMessageId(), role: "user", text: trimmed }]);
    try {
      const response = await fetch("/.netlify/functions/gemini-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          recentErrors: getRecentAmaErrorContext(5),
          route: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Assistant request failed: ${details.slice(0, 160)}`);
      }
      const payload = (await response.json()) as { answer: string; citations?: AmaCitation[] };
      setMessages((prev) => [
        ...prev,
        {
          id: buildMessageId(),
          role: "assistant",
          text: payload.answer?.trim() || "I do not know from the available corpus.",
        },
      ]);
      setLastCitations(Array.isArray(payload.citations) ? payload.citations : []);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return useMemo(
    () => ({
      messages,
      lastCitations,
      isSubmitting,
      gateFeedback,
      gateVerdict,
      hasTermsAccess,
      isHumanVerified,
      isUnlocked,
      ensureTermsAccepted,
      verifyHuman,
      askQuestion,
      authVersion,
    }),
    [
      askQuestion,
      ensureTermsAccepted,
      gateFeedback,
      gateVerdict,
      hasTermsAccess,
      isHumanVerified,
      isSubmitting,
      isUnlocked,
      lastCitations,
      messages,
      verifyHuman,
      authVersion,
    ],
  );
}
