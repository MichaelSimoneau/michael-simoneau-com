import { useCallback, useEffect, useMemo, useState } from "react";
import { cookieService } from "../../../services/cookieService";
import { getRecentAmaErrorContext } from "./useErrorContextCapture";

type GateVerdict = "human" | "ambiguous" | "reject";

export interface AmaMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: AmaCitation[];
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
const QUEUED_PREVIEW_MESSAGE_ID = "queued-preview-message";

const DEBUG_INTENT_PATTERN =
  /\b(error|bug|debug|stack|trace|crash|failing|failed|failure|exception|hydration|hydrate|console|not working|broken|fix)\b/i;

const hasDebugIntent = (question: string): boolean => DEBUG_INTENT_PATTERN.test(question);

export function useAmaAssistant() {
  const [authVersion, setAuthVersion] = useState(0);
  const [messages, setMessages] = useState<AmaMessage[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gateFeedback, setGateFeedback] = useState<string>("");
  const [gateVerdict, setGateVerdict] = useState<GateVerdict | null>(null);
  const [queuedQuestion, setQueuedQuestion] = useState("");

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

  const removeQueuedPreviewMessage = useCallback(() => {
    setMessages((prev) => prev.filter((message) => message.id !== QUEUED_PREVIEW_MESSAGE_ID));
  }, []);

  const renderQueuedPreviewMessage = useCallback((value: string) => {
    setMessages((prev) => {
      const withoutQueuedPreview = prev.filter((message) => message.id !== QUEUED_PREVIEW_MESSAGE_ID);
      if (!value.trim()) {
        return withoutQueuedPreview;
      }
      return [
        ...withoutQueuedPreview,
        {
          id: QUEUED_PREVIEW_MESSAGE_ID,
          role: "user",
          text: `Queued: ${value}`,
        },
      ];
    });
  }, []);

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
      const reason = payload.reason || "Verification complete.";
      setGateFeedback(reason);
      setGateVerdict(payload.verdict);
      setMessages((prev) => [
        ...prev,
        {
          id: buildMessageId(),
          role: "assistant",
          text: reason,
        },
      ]);
      refreshAuthState();
      return payload.verdict;
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : "Verification failed.";
      setGateFeedback(fallbackMessage);
      setGateVerdict("ambiguous");
      setMessages((prev) => [
        ...prev,
        {
          id: buildMessageId(),
          role: "assistant",
          text: fallbackMessage,
        },
      ]);
      refreshAuthState();
      return "ambiguous";
    } finally {
      setIsSubmitting(false);
      refreshAuthState();
    }
  }, [refreshAuthState]);

  const askQuestion = useCallback(async (question: string): Promise<boolean> => {
    const trimmed = question.trim();
    if (!trimmed || isSubmitting) return false;

    if (!cookieService.hasActiveMediaTermsAgreement()) {
      throw new Error("Please accept terms first.");
    }
    if (!cookieService.hasActiveAmaHumanVerification()) {
      throw new Error("Please complete the human check first.");
    }

    cookieService.touchMediaTermsAgreement();
    cookieService.touchAmaHumanVerification();
    const debugIntent = hasDebugIntent(trimmed);
    setIsSubmitting(true);
    setMessages((prev) => [...prev, { id: buildMessageId(), role: "user", text: trimmed }]);
    try {
      const response = await fetch("/.netlify/functions/gemini-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          recentErrors: debugIntent ? getRecentAmaErrorContext(5) : [],
          debugIntent,
          route: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Assistant request failed: ${details.slice(0, 160)}`);
      }
      const payload = (await response.json()) as { answer: string; citations?: AmaCitation[] };
      const responseCitations = Array.isArray(payload.citations) ? payload.citations : [];
      const normalizedAnswer = payload.answer?.trim() || "I do not know from the available corpus.";
      const answerText =
        responseCitations.length > 0 &&
        /^i do not know from the available corpus\.?$/i.test(normalizedAnswer)
          ? "I found source material related to your question, but I could not produce a grounded synthesis."
          : normalizedAnswer;
      setMessages((prev) => [
        ...prev,
        {
          id: buildMessageId(),
          role: "assistant",
          text: answerText,
          citations: responseCitations,
        },
      ]);
      return true;
    } finally {
      await new Promise<void>((resolve) => {
        if (typeof window === "undefined") {
          resolve();
          return;
        }
        window.requestAnimationFrame(() => resolve());
      });
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const enqueueQuestion = useCallback((question: string) => {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }
    setQueuedQuestion((previousQueuedQuestion) => {
      const nextQueuedQuestion = previousQueuedQuestion
        ? `${previousQueuedQuestion}\n${trimmed}`
        : trimmed;
      renderQueuedPreviewMessage(nextQueuedQuestion);
      return nextQueuedQuestion;
    });
  }, [renderQueuedPreviewMessage]);

  const popQueuedQuestionForEdit = useCallback((): string => {
    const queued = queuedQuestion;
    setQueuedQuestion("");
    removeQueuedPreviewMessage();
    return queued;
  }, [queuedQuestion, removeQueuedPreviewMessage]);

  useEffect(() => {
    if (!isUnlocked || isSubmitting || !queuedQuestion.trim()) {
      return;
    }
    const nextQuestion = queuedQuestion;
    setQueuedQuestion("");
    removeQueuedPreviewMessage();
    void askQuestion(nextQuestion);
  }, [askQuestion, isSubmitting, isUnlocked, queuedQuestion, removeQueuedPreviewMessage]);

  return useMemo(
    () => ({
      messages,
      isSubmitting,
      gateFeedback,
      gateVerdict,
      queuedQuestion,
      hasTermsAccess,
      isHumanVerified,
      isUnlocked,
      ensureTermsAccepted,
      verifyHuman,
      askQuestion,
      enqueueQuestion,
      popQueuedQuestionForEdit,
      authVersion,
    }),
    [
      askQuestion,
      ensureTermsAccepted,
      gateFeedback,
      gateVerdict,
      queuedQuestion,
      hasTermsAccess,
      isHumanVerified,
      isSubmitting,
      isUnlocked,
      messages,
      verifyHuman,
      enqueueQuestion,
      popQueuedQuestionForEdit,
      authVersion,
    ],
  );
}
