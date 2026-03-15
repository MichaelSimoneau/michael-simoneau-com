import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useMediaAnalytics } from '../../analytics/useMediaAnalytics';
import { InlineMediaConsentPrompt } from './InlineMediaConsentPrompt';
import { useMediaConsentGate } from './useMediaConsentGate';
import { useAudioTranscript } from './audioCaptions';
import { useCaptionsViewport } from './CaptionsViewportProvider';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title = 'Zeroth Vision' }) => {
  const { trackMediaEvent } = useMediaAnalytics();
  const { isGateVisible, requestConsentAwareAction, requestConsentAwarePlay, acceptAndResume } = useMediaConsentGate({
    source: 'audio-player',
  });
  const { isCaptionsEnabled, setActiveAudio, clearActiveAudio, toggleCaptions } = useCaptionsViewport();
  const { status: transcriptStatus } = useAudioTranscript(src);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const previousIsPlayingRef = useRef(false);
  const startedSourceRef = useRef<string | null>(null);
  const endedSourceRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      endedSourceRef.current = src;
      startedSourceRef.current = null;
      trackMediaEvent('complete', {
        media_type: 'audio',
        component: 'AudioPlayer',
        track_title: title,
        track_src: src,
        position_seconds: audio.currentTime,
        duration_seconds: audio.duration,
      });
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isSeeking, src, title, trackMediaEvent]);

  useEffect(() => {
    const wasPlaying = previousIsPlayingRef.current;

    if (!wasPlaying && isPlaying) {
      trackMediaEvent('play', {
        media_type: 'audio',
        component: 'AudioPlayer',
        track_title: title,
        track_src: src,
        position_seconds: currentTime,
        duration_seconds: duration,
      });
      if (startedSourceRef.current !== src) {
        startedSourceRef.current = src;
        trackMediaEvent('start', {
          media_type: 'audio',
          component: 'AudioPlayer',
          track_title: title,
          track_src: src,
          position_seconds: currentTime,
          duration_seconds: duration,
        });
      }
    }

    if (wasPlaying && !isPlaying) {
      if (endedSourceRef.current === src) {
        endedSourceRef.current = null;
      } else {
        trackMediaEvent('pause', {
          media_type: 'audio',
          component: 'AudioPlayer',
          track_title: title,
          track_src: src,
          position_seconds: currentTime,
          duration_seconds: duration,
        });
      }
    }

    previousIsPlayingRef.current = isPlaying;
  }, [currentTime, duration, isPlaying, src, title, trackMediaEvent]);

  useEffect(() => {
    startedSourceRef.current = null;
    endedSourceRef.current = null;
    previousIsPlayingRef.current = false;
  }, [src]);

  useEffect(() => {
    if (isCaptionsEnabled) {
      setActiveAudio({ audioRef, audioSrc: src });
    }
  }, [isCaptionsEnabled, setActiveAudio, src]);

  useEffect(() => {
    return () => {
      clearActiveAudio(audioRef);
    };
  }, [clearActiveAudio]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      requestConsentAwarePlay(() => {
        setActiveAudio({ audioRef, audioSrc: src });
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const setAudioTime = useCallback((nextTime: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const clamped = Math.max(0, Math.min(nextTime, duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  const seekFromClientX = useCallback((clientX: number) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    setAudioTime(pct * duration);
  }, [duration, setAudioTime]);

  const handleProgressPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsSeeking(true);
    seekFromClientX(e.clientX);
  }, [seekFromClientX]);

  const handleProgressPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSeeking) return;
    seekFromClientX(e.clientX);
  }, [isSeeking, seekFromClientX]);

  const handleProgressPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsSeeking(false);
  }, []);

  const handleProgressKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;

    const step = Math.min(10, Math.max(1, duration / 100));
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setAudioTime(currentTime + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setAudioTime(currentTime - step);
        break;
      case 'Home':
        e.preventDefault();
        setAudioTime(0);
        break;
      case 'End':
        e.preventDefault();
        setAudioTime(duration);
        break;
      default:
        break;
    }
  }, [currentTime, duration, setAudioTime]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCaptionUnavailable = transcriptStatus === 'missing' || transcriptStatus === 'error';

  const handleCaptionsToggle = () => {
    if (isCaptionUnavailable) {
      return;
    }
    requestConsentAwareAction(() => {
      setActiveAudio({ audioRef, audioSrc: src });
      toggleCaptions();
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <div className="relative z-10 p-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            {/* Play/Pause Button */}
            <motion.button
              onClick={handlePlayPause}
              className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black/80" />
              ) : (
                <Play className="w-6 h-6 text-black/80 ml-0.5" />
              )}
            </motion.button>

            {/* Audio Info and Progress */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Volume2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white font-medium text-sm break-words [overflow-wrap:anywhere] sm:truncate">
                    {title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCaptionsToggle}
                  disabled={isCaptionUnavailable}
                  aria-pressed={isCaptionsEnabled}
                  aria-label={isCaptionsEnabled ? 'Disable closed captions' : 'Enable closed captions'}
                  className="flex-shrink-0 rounded border border-gray-500/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-200 transition-colors hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  CC
                </button>
              </div>

              {/* Progress Bar */}
              <div
                ref={progressRef}
                role="slider"
                tabIndex={0}
                aria-label="Seek audio position"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                onPointerDown={handleProgressPointerDown}
                onPointerMove={handleProgressPointerMove}
                onPointerUp={handleProgressPointerUp}
                onPointerCancel={handleProgressPointerUp}
                onKeyDown={handleProgressKeyDown}
                className="relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer touch-none"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-300 rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>

              {/* Time Display */}
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
                <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InlineMediaConsentPrompt visible={isGateVisible} onAgree={acceptAndResume} className="mt-2" />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};
