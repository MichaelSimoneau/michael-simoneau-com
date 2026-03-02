import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Volume2,
  Music,
} from 'lucide-react';

/**
 * Single track definition for the playlist player.
 */
export interface Track {
  src: string;
  title: string;
}

interface PlaylistAudioPlayerProps {
  tracks: Track[];
}

/**
 * PlaylistAudioPlayer — a sleek, slim audio player that manages a playlist
 * of tracks with sequential playback, seek, skip, rewind, and track selection.
 */
export const PlaylistAudioPlayer: React.FC<PlaylistAudioPlayerProps> = ({ tracks }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);

  // Flag to auto-play after a deliberate track change (skip/select)
  const shouldAutoPlay = useRef(false);

  const currentTrack = tracks[currentTrackIndex];

  // ── Audio event listeners ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };

    const onEnded = () => {
      // Sequential playback: advance to next track or stop at end
      if (currentTrackIndex < tracks.length - 1) {
        shouldAutoPlay.current = true;
        setCurrentTrackIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex, tracks.length, isSeeking]);

  // ── Sync audio source when track changes ───────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldAutoPlay.current) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      shouldAutoPlay.current = false;
    } else {
      setIsPlaying(false);
    }
  }, [currentTrackIndex, currentTrack.src]);

  // ── Controls ───────────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const handleSkipForward = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      shouldAutoPlay.current = true;
      setCurrentTrackIndex((prev) => prev + 1);
    }
  }, [currentTrackIndex, tracks.length]);

  const handleSkipBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If more than 3 seconds into current track, restart it
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else if (currentTrackIndex > 0) {
      shouldAutoPlay.current = true;
      setCurrentTrackIndex((prev) => prev - 1);
    } else {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  }, [currentTrackIndex]);

  const handleSelectTrack = useCallback((index: number) => {
    if (index === currentTrackIndex) {
      // Toggle play/pause on current track
      handlePlayPause();
      return;
    }
    shouldAutoPlay.current = true;
    setCurrentTrackIndex(index);
  }, [currentTrackIndex, handlePlayPause]);

  // ── Seek via progress bar click ────────────────────────────────────────
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

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto select-none">
      <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/5">
        {/* Subtle top glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

        {/* ── Control Bar ─────────────────────────────────────────── */}
        <div className="relative z-10 px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            {/* Skip Back */}
            <motion.button
              onClick={handleSkipBack}
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4 text-gray-300" />
            </motion.button>

            {/* Play / Pause */}
            <motion.button
              onClick={handlePlayPause}
              className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center shadow-lg shadow-cyan-400/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black/80" />
              ) : (
                <Play className="w-5 h-5 text-black/80 ml-0.5" />
              )}
            </motion.button>

            {/* Skip Forward */}
            <motion.button
              onClick={handleSkipForward}
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Next track"
              disabled={currentTrackIndex >= tracks.length - 1}
            >
              <SkipForward className="w-4 h-4 text-gray-300" />
            </motion.button>

            {/* Track title + time */}
            <div className="flex-1 min-w-0 ml-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-white text-sm font-medium truncate">
                  {currentTrack.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-gray-500 text-xs tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <span className="text-gray-600 text-xs">/</span>
                <span className="text-gray-500 text-xs tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Expand / Collapse toggle */}
            <motion.button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label={isExpanded ? 'Hide track list' : 'Show track list'}
            >
              <Music className="w-4 h-4 text-gray-400" />
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-gray-400 -ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-400 -ml-0.5" />
              )}
            </motion.button>
          </div>

          {/* ── Progress Bar (seekable) ───────────────────────────── */}
          <div
            ref={progressRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek playlist position"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            onPointerDown={handleProgressPointerDown}
            onPointerMove={handleProgressPointerMove}
            onPointerUp={handleProgressPointerUp}
            onPointerCancel={handleProgressPointerUp}
            onKeyDown={handleProgressKeyDown}
            className="relative h-1.5 mt-3 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer touch-none"
          >
            {/* Filled portion */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-cyan-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: isSeeking ? 0 : 0.1 }}
            />
            {/* Seek handle (visible on hover) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-300 rounded-full shadow-md pointer-events-none"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
        </div>

        {/* ── Track List (expandable) ─────────────────────────────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="tracklist"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-4 py-2 max-h-56 overflow-y-auto">
                {tracks.map((track, index) => {
                  const isActive = index === currentTrackIndex;
                  const isCurrentlyPlaying = isActive && isPlaying;

                  return (
                    <motion.button
                      key={track.src}
                      onClick={() => handleSelectTrack(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                        isActive
                          ? 'bg-cyan-400/10'
                          : 'hover:bg-white/5'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Track number / playing indicator */}
                      <span
                        className={`flex-shrink-0 w-5 text-xs text-right tabular-nums ${
                          isActive ? 'text-cyan-400 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        {isCurrentlyPlaying ? (
                          <span className="inline-flex gap-px items-end h-3">
                            <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse" style={{ height: '60%' }} />
                            <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.15s' }} />
                            <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.3s' }} />
                          </span>
                        ) : (
                          index + 1
                        )}
                      </span>

                      {/* Track title */}
                      <span
                        className={`flex-1 text-sm truncate ${
                          isActive
                            ? 'text-cyan-400 font-medium'
                            : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {track.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};
