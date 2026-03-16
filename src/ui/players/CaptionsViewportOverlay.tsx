import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCaptionsViewport } from './CaptionsViewportProvider';

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const CaptionsViewportOverlay: React.FC = () => {
  const {
    isCaptionsEnabled,
    activeAudio,
    transcriptStatus,
    transcriptText,
  } = useCaptionsViewport();
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const travelDistanceRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const hasLoggedRendererRef = useRef(false);
  const [travelDistancePx, setTravelDistancePx] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);

  const isTranscriptMissing = transcriptStatus === 'missing' || transcriptStatus === 'error';

  useEffect(() => {
    travelDistanceRef.current = travelDistancePx;
  }, [travelDistancePx]);

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

    setHasPlaybackStarted(audio.currentTime > 0);
    const markPlaybackStarted = () => setHasPlaybackStarted(true);
    audio.addEventListener('play', markPlaybackStarted);
    audio.addEventListener('playing', markPlaybackStarted);

    return () => {
      audio.removeEventListener('play', markPlaybackStarted);
      audio.removeEventListener('playing', markPlaybackStarted);
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
    if (!isCaptionsEnabled || !activeAudio?.audioRef || !transcriptText || travelDistanceRef.current <= 0) {
      setOffsetPx(0);
      smoothedProgressRef.current = 0;
      return;
    }

    let animationFrameId = 0;
    const audioAtStart = activeAudio.audioRef.current;
    if (audioAtStart && Number.isFinite(audioAtStart.duration) && audioAtStart.duration > 0) {
      smoothedProgressRef.current = clamp(audioAtStart.currentTime / audioAtStart.duration, 0, 1);
    } else {
      smoothedProgressRef.current = 0;
    }

    const animate = () => {
      const audio = activeAudio.audioRef.current;

      if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        setOffsetPx(0);
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      const targetProgress = clamp(audio.currentTime / audio.duration, 0, 1);

      smoothedProgressRef.current += (targetProgress - smoothedProgressRef.current) * 0.28;
      setOffsetPx(-travelDistanceRef.current * smoothedProgressRef.current);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeAudio, isCaptionsEnabled, transcriptText, travelDistancePx]);

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

  return (
    <div
      className="fixed inset-x-0 z-[140] flex justify-center px-2 sm:px-3"
      style={{ bottom: 'calc(var(--app-footer-offset, 2.1rem) + env(safe-area-inset-bottom, 0px))' }}
      aria-live="off"
    >
      <div className="w-full rounded-full border border-white/20 bg-black/80 px-3 py-1.5 shadow-[inset_0_0_18px_rgba(255,255,255,0.06)] lg:w-[72vw] lg:px-4">
        <div ref={viewportRef} className="min-w-0 overflow-hidden whitespace-nowrap">
          <span
            ref={textRef}
            className="inline-block text-xs leading-4 text-gray-100"
            style={{
              transform: `translate3d(${offsetPx}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {hasPlaybackStarted ? captionText : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
