import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCaptionsViewport } from './CaptionsViewportProvider';

const START_DELAY_SECONDS = 1.0;
const ACCELERATION_WINDOW_SECONDS = 5.0;
const BASE_SCROLL_DAMPING = 0.46;
const BASE_SPEED_OFFSET = 0.72;

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
  const hasLoggedRendererRef = useRef(false);
  const [travelDistancePx, setTravelDistancePx] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);

  const isTranscriptMissing = transcriptStatus === 'missing' || transcriptStatus === 'error';
  const speedMultiplier = useMemo(() => 1 + BASE_SPEED_OFFSET + speedCoefficient, [speedCoefficient]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || hasLoggedRendererRef.current) {
      return;
    }
    hasLoggedRendererRef.current = true;
    console.info('[captions] viewport overlay renderer active');
  }, []);

  useEffect(() => {
    const audio = activeAudio?.audioRef?.current;
    if (!audio) {
      setHasPlaybackStarted(false);
      return;
    }

    const updatePlaybackStarted = () => {
      const hasStarted = audio.currentTime > 0 || !audio.paused;
      setHasPlaybackStarted(hasStarted);
    };

    updatePlaybackStarted();
    audio.addEventListener('play', updatePlaybackStarted);
    audio.addEventListener('playing', updatePlaybackStarted);
    audio.addEventListener('timeupdate', updatePlaybackStarted);

    return () => {
      audio.removeEventListener('play', updatePlaybackStarted);
      audio.removeEventListener('playing', updatePlaybackStarted);
      audio.removeEventListener('timeupdate', updatePlaybackStarted);
    };
  }, [activeAudio]);

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
    let smoothedProgress = 0;

    const animate = () => {
      const audio = activeAudio.audioRef.current;

      if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        setOffsetPx(0);
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      const delayedPlaybackSeconds = Math.max(0, audio.currentTime - START_DELAY_SECONDS);
      const effectiveDuration = Math.max(0.001, audio.duration - START_DELAY_SECONDS);
      const delayedBaseProgress = clamp(delayedPlaybackSeconds / effectiveDuration, 0, 1);
      const rampPhase = clamp(delayedPlaybackSeconds / ACCELERATION_WINDOW_SECONDS, 0, 1);
      const rampFactor = rampPhase * rampPhase;
      const rampedDamping = BASE_SCROLL_DAMPING * (0.25 + 0.75 * rampFactor);
      const effectiveSpeedMultiplier = speedMultiplier * rampedDamping;
      const targetProgress = clamp(delayedBaseProgress * effectiveSpeedMultiplier, 0, 1);

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

  if (!isCaptionsEnabled || !activeAudio?.audioSrc || !hasPlaybackStarted) {
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
      className="fixed inset-x-0 z-[140] flex justify-center px-2 sm:px-3"
      style={{ bottom: 'calc(var(--app-footer-offset, 2.1rem) + env(safe-area-inset-bottom, 0px))' }}
      aria-live="off"
    >
      <div className="w-full rounded-full border border-white/20 bg-black/80 px-3 py-1.5 shadow-[inset_0_0_18px_rgba(255,255,255,0.06)] lg:w-[72vw] lg:px-4">
        <div className="flex items-center gap-1.5">
          <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            <span
              ref={textRef}
              className="inline-block text-xs leading-4 text-gray-100"
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
    </div>
  );
};
