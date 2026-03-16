import React, { useCallback, useEffect, useState } from "react";
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
  const [isEmbeddedAmaInView, setIsEmbeddedAmaInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const embeddedSelector = '[data-ama-embedded="true"]';
    const intersectingNodes = new Set<Element>();
    let intersectionObserver: IntersectionObserver | null = null;

    const updateVisibility = () => {
      setIsEmbeddedAmaInView(intersectingNodes.size > 0);
    };

    const attachObservers = () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      intersectingNodes.clear();
      updateVisibility();

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              intersectingNodes.add(entry.target);
            } else {
              intersectingNodes.delete(entry.target);
            }
          }
          updateVisibility();
        },
        {
          threshold: 0.2,
        },
      );

      const embeddedAmaNodes = document.querySelectorAll(embeddedSelector);
      embeddedAmaNodes.forEach((node) => intersectionObserver?.observe(node));
    };

    attachObservers();

    const mutationObserver = new MutationObserver(() => {
      attachObservers();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      intersectingNodes.clear();
    };
  }, []);

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

  const launcherVisibilityClass = isTemporarilyHidden || isEmbeddedAmaInView
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
        className={`ama-lapel-pin group fixed bottom-4 right-4 z-[40] hidden h-14 items-center justify-center overflow-hidden rounded-full px-2 text-cyan-100 transition-all duration-500 hover:w-[220px] hover:justify-start md:flex ${launcherVisibilityClass} ${launcherOopsClass}`}
        style={{ width: "68px" }}
        aria-label="Ask Me Anything"
      >
        <span className="ama-lapel-pin-rim" aria-hidden="true" />
        <span className="ama-lapel-pin-gloss" aria-hidden="true" />
        <span className="ama-lapel-pin-core" aria-hidden="true" />
        <span className="ama-lapel-pin-text text-sm font-black tracking-wider">A.M.A.</span>
        <span className="ama-lapel-pin-label ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100">
          Ask Me Anything!
        </span>
      </button>

      <button
        type="button"
        onClick={handleLauncherPress}
        className={`fixed inset-x-3 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-[40] rounded-full border border-cyan-400/50 bg-black/85 px-4 py-3 text-sm font-semibold text-cyan-200 shadow-lg transition-all duration-500 md:hidden ${launcherVisibilityClass} ${launcherOopsClass}`}
        aria-label="Ask Me Anything"
      >
        Ask Me Anything
      </button>
    </>
  );
};
