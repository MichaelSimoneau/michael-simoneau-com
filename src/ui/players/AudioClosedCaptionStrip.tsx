import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAudioTranscript } from './audioCaptions';

interface AudioClosedCaptionStripProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc?: string;
  enabled: boolean;
  className?: string;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const AudioClosedCaptionStrip: React.FC<AudioClosedCaptionStripProps> = ({
  audioRef,
  audioSrc,
  enabled,
  className,
}) => {
  const { status, transcript } = useAudioTranscript(audioSrc);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [travelDistancePx, setTravelDistancePx] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);

  const isTranscriptMissing = status === 'missing' || status === 'error';

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
  }, [transcript, enabled]);

  useEffect(() => {
    if (!enabled || !transcript || travelDistancePx <= 0) {
      setOffsetPx(0);
      return;
    }

    let animationFrameId = 0;
    let smoothedProgress = 0;

    const animate = () => {
      const audio = audioRef.current;

      if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        setOffsetPx(0);
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      const baseProgress = clamp(audio.currentTime / audio.duration, 0, 1);
      const targetProgress = baseProgress;
      smoothedProgress += (targetProgress - smoothedProgress) * 0.28;

      setOffsetPx(-travelDistancePx * smoothedProgress);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [audioRef, enabled, transcript, travelDistancePx]);

  const captionText = useMemo(() => {
    if (status === 'loading' || status === 'idle') {
      return 'Loading captions...';
    }
    if (isTranscriptMissing) {
      return 'Captions unavailable for this track.';
    }
    return transcript;
  }, [isTranscriptMissing, status, transcript]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-[140] w-[72vw] max-w-[72vw] -translate-x-1/2 rounded-md border border-white/15 bg-black/75 px-3 py-2 shadow-[inset_0_0_18px_rgba(255,255,255,0.06)] ${
        className ?? ''
      }`}
      aria-live="off"
    >
      <div ref={viewportRef} className="min-w-0 overflow-hidden whitespace-nowrap">
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
    </div>
  );
};
