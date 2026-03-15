import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCaptionsViewport } from './CaptionsViewportProvider';

const START_DELAY_SECONDS = 0.8;
const ACCELERATION_WINDOW_SECONDS = 1.5;
const BASE_SPEED_DAMPING = 0.35;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const CaptionsViewportOverlay: React.FC = () => {
  const {
    isCaptionsEnabled,
    activeAudio,
    speedCoefficient,
    increaseSpeed,
    decreaseSpeed,
    transcriptStatus,
    transcriptText,
  } = useCaptionsViewport();
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [travelDistancePx, setTravelDistancePx] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);

  const isTranscriptMissing = transcriptStatus === 'missing' || transcriptStatus === 'error';
  const speedMultiplier = useMemo(() => 1 + speedCoefficient, [speedCoefficient]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;
    if (!viewport || !text) {
      return;
    }

    const updateTravelDistance = () => {
      const viewportWidth = viewport.clientWidth;
      const textWidth = text.scrollWidth;
      setTravelDistancePx(Math.max(0, textWidth - viewportWidth));
    };

    updateTravelDistance();
    const observer = new ResizeObserver(() => updateTravelDistance());
    observer.observe(viewport);
    observer.observe(text);

    return () => {
      observer.disconnect();
    };
  }, [transcriptText, isCaptionsEnabled]);

  useEffect(() => {
    if (!isCaptionsEnabled || !activeAudio?.audioRef || !transcriptText || travelDistancePx <= 0) {
      setOffsetPx(0);
      return;
    }

    let animationFrameId = 0;
    let previousFrameMs = performance.now();
    let smoothedProgress = 0;

    const animate = (frameMs: number) => {
      const audio = activeAudio.audioRef.current;
      const deltaSeconds = Math.max(0, (frameMs - previousFrameMs) / 1000);
      previousFrameMs = frameMs;

      if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        setOffsetPx(0);
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      const baseProgress = clamp(audio.currentTime / audio.duration, 0, 1);
      const elapsedSinceStart = Math.max(0, audio.currentTime - START_DELAY_SECONDS);
      const rampPhase = clamp(elapsedSinceStart / ACCELERATION_WINDOW_SECONDS, 0, 1);
      const rampFactor = rampPhase * rampPhase;
      const effectiveSpeedMultiplier = speedMultiplier * BASE_SPEED_DAMPING * rampFactor;
      const targetProgress = audio.paused
        ? baseProgress
        : clamp((audio.currentTime + deltaSeconds * effectiveSpeedMultiplier) / audio.duration, 0, 1);

      smoothedProgress += (targetProgress - smoothedProgress) * 0.28;
      setOffsetPx(-travelDistancePx * smoothedProgress);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeAudio, isCaptionsEnabled, speedMultiplier, transcriptText, travelDistancePx]);

  const captionText = useMemo(() => {
    if (transcriptStatus === 'loading' || transcriptStatus === 'idle') {
      return 'Loading captions...';
    }
    if (isTranscriptMissing) {
      return 'Captions unavailable for this track.';
    }
    return transcriptText;
  }, [isTranscriptMissing, transcriptStatus, transcriptText]);

  if (!isCaptionsEnabled || !activeAudio?.audioSrc) {
    return null;
  }

  const handleIncreaseSpeed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    increaseSpeed();
  };

  const handleDecreaseSpeed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    decreaseSpeed();
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[140] w-[72vw] max-w-[72vw] -translate-x-1/2 rounded-md border border-white/15 bg-black/75 px-3 py-2 shadow-[inset_0_0_18px_rgba(255,255,255,0.06)]"
      aria-live="off"
    >
      <div className="flex items-center gap-2">
        <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
          <span
            ref={textRef}
            className="inline-block text-xs text-gray-100"
            style={{
              transform: `translate3d(${offsetPx}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {captionText}
          </span>
        </div>
        <div className="flex w-5 flex-shrink-0 flex-col items-center justify-center gap-0.5">
          <button
            type="button"
            aria-label="Increase caption scroll speed"
            onClick={handleIncreaseSpeed}
            onPointerDown={(event) => event.stopPropagation()}
            className="rounded-sm p-0.5 text-gray-300 transition-colors hover:text-white"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Decrease caption scroll speed"
            onClick={handleDecreaseSpeed}
            onPointerDown={(event) => event.stopPropagation()}
            className="rounded-sm p-0.5 text-gray-300 transition-colors hover:text-white"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
