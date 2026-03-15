import React, { useState } from "react";
import { ArrowUp, Plus } from "lucide-react";
import { useAmaAssistant } from "../hooks/useAmaAssistant";

interface AmaPanelProps {
  mode?: "floating" | "embedded";
  onClose?: () => void;
  className?: string;
}

export const AmaPanel: React.FC<AmaPanelProps> = ({
  mode = "floating",
  onClose,
  className,
}) => {
  const [humanProofInput, setHumanProofInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [questionPlaceholder, setQuestionPlaceholder] = useState("Enter a question...");
  const assistant = useAmaAssistant();

  const submitHumanProof = async () => {
    const proof = humanProofInput.trim();
    if (!proof || assistant.isSubmitting) {
      return;
    }
    await assistant.verifyHuman(proof);
  };

  const submitQuestion = async () => {
    const question = questionInput.trim();
    if (!question) {
      return;
    }
    if (assistant.isSubmitting) {
      assistant.enqueueQuestion(question);
      setQuestionInput("");
      setQuestionPlaceholder("Queued. Press Up to edit.");
      window.setTimeout(() => {
        setQuestionPlaceholder("Enter a question...");
      }, 1800);
      return;
    }
    const sent = await assistant.askQuestion(question);
    if (sent) {
      setQuestionInput("");
    }
  };

  const handleHumanProofKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitHumanProof();
    }
  };

  const handleQuestionKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "ArrowUp" && !event.shiftKey && questionInput.trim() === "" && assistant.queuedQuestion) {
      event.preventDefault();
      const queued = assistant.popQueuedQuestionForEdit();
      if (queued) {
        setQuestionInput(queued);
      }
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitQuestion();
    }
  };

  return (
    <section
      className={`rounded-2xl border border-cyan-400/30 bg-black/85 text-white shadow-2xl ${className ?? ""}`}
      aria-label="Ask Me Anything panel"
    >
      <div className="flex items-center justify-between gap-3 border-b border-cyan-400/20 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold tracking-wide text-cyan-300">Ask Me Anything</h3>
          <p className="text-xs text-gray-300">Grounded in Michael Simoneau text corpus</p>
        </div>
        {mode === "floating" && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-300 hover:text-white"
          >
            Close
          </button>
        )}
      </div>

      {!assistant.hasTermsAccess && (
        <div className="space-y-3 p-4 text-sm">
          <p className="text-gray-200">
            Access is gated by terms acceptance. This follows the same timing policy used across protected media.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <a href="/terms" className="text-cyan-300 underline underline-offset-2">
              Terms
            </a>
            <a href="/privacy" className="text-cyan-300 underline underline-offset-2">
              Privacy
            </a>
          </div>
          <button
            type="button"
            onClick={assistant.ensureTermsAccepted}
            className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-black"
          >
            I Have Read & Agree to Continue
          </button>
        </div>
      )}

      {assistant.hasTermsAccess && !assistant.isHumanVerified && (
        <form
          className="space-y-3 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submitHumanProof();
          }}
        >
          <p className="text-sm font-semibold text-cyan-200">Prove you are human.</p>
          <p className="text-xs text-gray-300">
            Natural confusion is fine. Go with what you know. You do not need a perfect answer.
          </p>
          <div className="rounded-lg border border-gray-700 bg-black/60 p-2 focus-within:border-cyan-400">
            <textarea
              value={humanProofInput}
              onChange={(event) => setHumanProofInput(event.target.value)}
              onKeyDown={handleHumanProofKeyDown}
              placeholder="Respond naturally in your own words..."
              className="h-24 w-full resize-none bg-transparent p-1 text-sm outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                title="later..."
                aria-label="Attach (later)"
                className="rounded-md border border-gray-600 p-2 text-gray-400 hover:text-gray-200"
              >
                <Plus size={14} />
              </button>
              <button
                type="submit"
                disabled={assistant.isSubmitting || !humanProofInput.trim()}
                aria-label="Send proof"
                className="rounded-md bg-cyan-400 p-2 text-black disabled:opacity-60"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
          {assistant.gateFeedback && (
            <p
              className={`text-xs ${
                assistant.gateVerdict === "human"
                  ? "text-emerald-300"
                  : assistant.gateVerdict === "reject"
                    ? "text-rose-300"
                    : "text-gray-300"
              }`}
            >
              {assistant.gateFeedback}
            </p>
          )}
        </form>
      )}

      {assistant.isUnlocked && (
        <>
          <div className="max-h-[300px] space-y-3 overflow-y-auto px-4 py-3">
            {assistant.messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === "assistant"
                    ? "border border-cyan-400/20 bg-cyan-400/10"
                    : "border border-gray-700 bg-gray-900/60"
                }`}
              >
                <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-400">
                  {message.role === "assistant" ? "Assistant" : "You"}
                </p>
                <p className="whitespace-pre-wrap text-gray-100">{message.text}</p>
              </article>
            ))}
            {assistant.isSubmitting && (
              <article className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm">
                <span className="sr-only">Assistant is typing</span>
                <span aria-hidden="true" className="typing-dot" />
                <span aria-hidden="true" className="typing-dot typing-dot-delay-1" />
                <span aria-hidden="true" className="typing-dot typing-dot-delay-2" />
              </article>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitQuestion();
            }}
            className="space-y-2 border-t border-cyan-400/20 p-4"
          >
            <div className="rounded-lg border border-gray-700 bg-black/60 p-2 focus-within:border-cyan-400">
              <textarea
                value={questionInput}
                onChange={(event) => setQuestionInput(event.target.value)}
                onKeyDown={handleQuestionKeyDown}
                placeholder={questionPlaceholder}
                className="h-20 w-full resize-none bg-transparent p-1 text-sm outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  title="later..."
                  aria-label="Attach (later)"
                  className="rounded-md border border-gray-600 p-2 text-gray-400 hover:text-gray-200"
                >
                  <Plus size={14} />
                </button>
                <button
                  type="submit"
                  disabled={assistant.isSubmitting || !questionInput.trim()}
                  aria-label="Send question"
                  className="rounded-md bg-cyan-400 p-2 text-black disabled:opacity-60"
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
            {assistant.lastCitations.length > 0 && (
              <div className="space-y-1 pt-1 text-xs text-gray-300">
                {assistant.lastCitations.slice(0, 4).map((citation) => (
                  <p key={`${citation.path}-${citation.snippet.slice(0, 20)}`}>
                    Source: <span className="text-cyan-300">{citation.path}</span>
                  </p>
                ))}
              </div>
            )}
          </form>
        </>
      )}
    </section>
  );
};
