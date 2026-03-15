import React, { useState } from "react";
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
  const assistant = useAmaAssistant();

  const submitHumanProof = async (event: React.FormEvent) => {
    event.preventDefault();
    await assistant.verifyHuman(humanProofInput);
  };

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!questionInput.trim()) return;
    await assistant.askQuestion(questionInput);
    setQuestionInput("");
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
            Agree & Continue
          </button>
        </div>
      )}

      {assistant.hasTermsAccess && !assistant.isHumanVerified && (
        <form className="space-y-3 p-4" onSubmit={submitHumanProof}>
          <p className="text-sm font-semibold text-cyan-200">Prove you are human.</p>
          <textarea
            value={humanProofInput}
            onChange={(event) => setHumanProofInput(event.target.value)}
            placeholder="Respond naturally in your own words..."
            className="h-24 w-full rounded-lg border border-gray-700 bg-black/60 p-2 text-sm outline-none focus:border-cyan-400"
          />
          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={assistant.isSubmitting}
              className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {assistant.isSubmitting ? "Verifying..." : "Submit Proof"}
            </button>
            {assistant.gateFeedback && (
              <p className="text-right text-xs text-gray-300">{assistant.gateFeedback}</p>
            )}
          </div>
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
          </div>

          <form onSubmit={submitQuestion} className="space-y-2 border-t border-cyan-400/20 p-4">
            <textarea
              value={questionInput}
              onChange={(event) => setQuestionInput(event.target.value)}
              placeholder="Ask about Michael Simoneau..."
              className="h-20 w-full rounded-lg border border-gray-700 bg-black/60 p-2 text-sm outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={assistant.isSubmitting}
              className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {assistant.isSubmitting ? "Thinking..." : "Ask"}
            </button>
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
