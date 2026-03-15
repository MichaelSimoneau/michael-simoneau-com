import React, { useEffect, useState } from 'react';

interface InlineMediaConsentPromptProps {
  visible: boolean;
  onAgree: () => void;
  className?: string;
}

export const InlineMediaConsentPrompt: React.FC<InlineMediaConsentPromptProps> = ({
  visible,
  onAgree,
  className,
}) => {
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    if (visible) {
      setIsChecked(true);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-cyan-400/30 bg-black/70 p-3 ${className ?? ''}`}>
      <p className="text-sm text-white mb-2">
        Do you agree to the terms and conditions that protect your privacy?
      </p>
      <label className="mb-2 flex items-center gap-2 text-xs text-gray-300">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => setIsChecked(event.target.checked)}
          className="h-3.5 w-3.5 accent-cyan-400"
        />
        I have read and agree to the terms and conditions
      </label>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <a href="/terms" className="font-semibold text-cyan-200 hover:text-cyan-100 underline underline-offset-2">
            Terms
          </a>
          <a href="/privacy" className="font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
            Privacy
          </a>
        </div>
        <button
          type="button"
          onClick={onAgree}
          disabled={!isChecked}
          className="rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50"
        >
          Agree & Resume
        </button>
      </div>
    </div>
  );
};
