import React, { useCallback, useState } from "react";
import { AmaPanel } from "./AmaPanel";

const UNAVAILABLE_HIDE_MS = 2400;

const probeAmaAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch("/.netlify/functions/human-gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofText: "Quick availability check from launcher." }),
    });
    if (!response.ok) {
      return false;
    }
    const payload = (await response.json()) as { verdict?: string };
    return typeof payload.verdict === "string";
  } catch {
    return false;
  }
};

export const AmaLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOopsAnimating, setIsOopsAnimating] = useState(false);
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);

  const handleLauncherPress = useCallback(async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const isAvailable = await probeAmaAvailability();
    if (!isAvailable) {
      setIsOopsAnimating(true);
      setTimeout(() => {
        setIsOopsAnimating(false);
        setIsTemporarilyHidden(true);
      }, 900);
      setTimeout(() => {
        setIsTemporarilyHidden(false);
      }, UNAVAILABLE_HIDE_MS);
      return;
    }
    setIsOpen(true);
  }, [isOpen]);

  const launcherVisibilityClass = isTemporarilyHidden
    ? "pointer-events-none opacity-0"
    : "opacity-100";
  const launcherOopsClass = isOopsAnimating ? "ama-oops-animation" : "";

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[45] hidden w-[380px] max-w-[calc(100vw-2rem)] md:block">
          <AmaPanel mode="floating" onClose={() => setIsOpen(false)} />
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 z-[45] md:hidden">
          <AmaPanel mode="floating" onClose={() => setIsOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={handleLauncherPress}
        className={`group fixed bottom-4 right-4 z-[40] hidden h-14 items-center overflow-hidden rounded-full border border-cyan-400/60 bg-black/85 px-4 text-cyan-200 shadow-xl transition-all duration-500 hover:w-[220px] md:flex ${launcherVisibilityClass} ${launcherOopsClass}`}
        style={{ width: "56px" }}
        aria-label="Ask Me Anything"
      >
        <span className="text-sm font-black tracking-wider">A.M.A</span>
        <span className="ml-2 max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
          Ask Me Anything!
        </span>
      </button>

      <button
        type="button"
        onClick={handleLauncherPress}
        className={`fixed inset-x-3 bottom-3 z-[40] rounded-full border border-cyan-400/50 bg-black/85 px-4 py-3 text-sm font-semibold text-cyan-200 shadow-lg transition-all duration-500 md:hidden ${launcherVisibilityClass} ${launcherOopsClass}`}
        aria-label="Ask Me Anything"
      >
        Ask Me Anything
      </button>
    </>
  );
};
