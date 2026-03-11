import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  Volume2,
  Music,
} from 'lucide-react';
import { useMediaAnalytics } from '../../analytics/useMediaAnalytics';
import { dispatchMediaPlayIntent } from './mediaEvents';

/**
 * Single track definition for the playlist player.
 */
export interface Track {
  src: string;
  title: string;
}

interface PlaylistAudioPlayerProps {
  tracks: Track[];
  className?: string;
}

interface Section {
  id: string;
  directive: string;
  title: string;
  trackIndices: number[];
  defaultCollapsed: boolean;
}

interface PlayableTrack extends Track {
  sectionId: string;
}

const AUDIO_SOURCE_PATTERN = /\.(mp3|wav|m4a|aac|ogg|flac)(?:\?.*)?$/i;
const VIDEO_HERO_AUTOPLAY_EVENT = 'videohero:autoplay-request';
const VIDEO_HERO_PREPEND_MODE_EVENT = 'videohero:prepend-mode';
const MAIN_SCROLL_CONTAINER_ID = 'new-main-page-scroll-container';
const VIDEO_HERO_SECTION_ID = 'videos';

const isAudioSource = (src: string) => AUDIO_SOURCE_PATTERN.test(src);
const isCollapsedDirective = (directive: string) => /collapsed/i.test(directive);

/**
 * PlaylistAudioPlayer — a sleek, slim audio player that manages a playlist
 * of tracks with sequential playback, seek, skip, rewind, and track selection.
 */
export const PlaylistAudioPlayer: React.FC<PlaylistAudioPlayerProps> = ({ tracks, className }) => {
  const { trackMediaEvent } = useMediaAnalytics();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const previousIsPlayingRef = useRef(false);
  const wasFirstCollapsedSectionExpandedRef = useRef<boolean | null>(null);
  const startedTrackKeyRef = useRef<string | null>(null);
  const endedTrackKeyRef = useRef<string | null>(null);
  const {
    playableTracks,
    sections,
    playableIndexToSectionIndex,
    sectionDefaultCollapsed,
  } = useMemo(() => {
    const nextSections: Section[] = [];
    const nextPlayableTracks: PlayableTrack[] = [];
    const nextPlayableIndexToSectionIndex: number[] = [];
    const nextSectionDefaultCollapsed: Record<string, boolean> = {};
    let currentSectionIndex = -1;

    const createSection = (title: string, defaultCollapsed: boolean, directive: string) => {
      const id = `section-${nextSections.length}`;
      nextSections.push({
        id,
        directive,
        title,
        trackIndices: [],
        defaultCollapsed,
      });
      nextSectionDefaultCollapsed[id] = defaultCollapsed;
      currentSectionIndex = nextSections.length - 1;
    };

    tracks.forEach((track) => {
      if (!isAudioSource(track.src)) {
        createSection(track.src.trim() || track.title, isCollapsedDirective(track.title), track.title);
        return;
      }

      if (currentSectionIndex === -1) {
        createSection('Playlist', false, 'EXPANDED_DEFAULT');
      }

      const playableIndex = nextPlayableTracks.length;
      const activeSection = nextSections[currentSectionIndex];
      nextPlayableTracks.push({
        ...track,
        sectionId: activeSection.id,
      });
      activeSection.trackIndices.push(playableIndex);
      nextPlayableIndexToSectionIndex.push(currentSectionIndex);
    });

    return {
      playableTracks: nextPlayableTracks,
      sections: nextSections,
      playableIndexToSectionIndex: nextPlayableIndexToSectionIndex,
      sectionDefaultCollapsed: nextSectionDefaultCollapsed,
    };
  }, [tracks]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(sectionDefaultCollapsed);

  // Flag to auto-play after a deliberate track change (skip/select)
  const shouldAutoPlay = useRef(false);

  const currentTrack = playableTracks[currentTrackIndex];
  const currentSectionIndex = playableIndexToSectionIndex[currentTrackIndex] ?? -1;
  const expandedTrackIndices = useMemo(() => {
    return sections.flatMap((section) => {
      const isCollapsed = collapsedSections[section.id] ?? section.defaultCollapsed;
      return isCollapsed ? [] : section.trackIndices;
    });
  }, [sections, collapsedSections]);
  const nextExpandedTrackIndex = useMemo(() => {
    for (const trackIndex of expandedTrackIndices) {
      if (trackIndex > currentTrackIndex) {
        return trackIndex;
      }
    }
    return null;
  }, [expandedTrackIndices, currentTrackIndex]);
  const previousExpandedTrackIndex = useMemo(() => {
    for (let index = expandedTrackIndices.length - 1; index >= 0; index -= 1) {
      if (expandedTrackIndices[index] < currentTrackIndex) {
        return expandedTrackIndices[index];
      }
    }
    return null;
  }, [expandedTrackIndices, currentTrackIndex]);
  const nextSectionStartTrackIndex = useMemo(() => {
    if (currentSectionIndex === -1) {
      return null;
    }

    for (let index = currentSectionIndex + 1; index < sections.length; index += 1) {
      const section = sections[index];
      const isCollapsed = collapsedSections[section.id] ?? section.defaultCollapsed;
      if (!isCollapsed && section.trackIndices.length > 0) {
        return section.trackIndices[0];
      }
    }

    return null;
  }, [currentSectionIndex, sections, collapsedSections]);
  const collapsedSectionFirstTrackIndex = useMemo(() => {
    const firstCollapsedSection = sections.find((section) => isCollapsedDirective(section.directive));
    if (!firstCollapsedSection) {
      return null;
    }
    return firstCollapsedSection.trackIndices[0] ?? null;
  }, [sections]);
  const collapsedSectionSecondTrackIndex = useMemo(() => {
    const firstCollapsedSection = sections.find((section) => isCollapsedDirective(section.directive));
    if (!firstCollapsedSection) {
      return null;
    }
    return firstCollapsedSection.trackIndices[1] ?? null;
  }, [sections]);
  const firstCollapsedDirectiveSectionId = useMemo(() => {
    const firstCollapsedSection = sections.find((section) => isCollapsedDirective(section.directive));
    return firstCollapsedSection?.id ?? null;
  }, [sections]);
  const isFirstCollapsedDirectiveSectionExpanded = useMemo(() => {
    if (!firstCollapsedDirectiveSectionId) {
      return false;
    }
    return !(collapsedSections[firstCollapsedDirectiveSectionId] ?? true);
  }, [collapsedSections, firstCollapsedDirectiveSectionId]);

  const centerScrollToVideoHero = useCallback(async () => {
    const scrollContainer = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    const videoSection = document.getElementById(VIDEO_HERO_SECTION_ID);
    if (!scrollContainer || !videoSection) {
      return;
    }

    const containerRect = scrollContainer.getBoundingClientRect();
    const sectionRect = videoSection.getBoundingClientRect();
    const sectionTopWithinContainer = sectionRect.top - containerRect.top + scrollContainer.scrollTop;
    const targetScrollTop = sectionTopWithinContainer + sectionRect.height / 2 - scrollContainer.clientHeight / 2;
    const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
    const clampedTargetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
    const settleThresholdPx = 6;
    const maxWaitMs = 3500;
    const settleTimeoutAt = Date.now() + maxWaitMs;

    scrollContainer.scrollTo({
      top: clampedTargetScrollTop,
      behavior: 'smooth',
    });

    await new Promise<void>((resolve) => {
      const waitForSettle = () => {
        const distance = Math.abs(scrollContainer.scrollTop - clampedTargetScrollTop);
        if (distance <= settleThresholdPx || Date.now() >= settleTimeoutAt) {
          resolve();
          return;
        }
        requestAnimationFrame(waitForSettle);
      };
      requestAnimationFrame(waitForSettle);
    });
  }, []);

  useEffect(() => {
    setCollapsedSections((previous) => {
      const next: Record<string, boolean> = {};
      sections.forEach((section) => {
        next[section.id] = previous[section.id] ?? sectionDefaultCollapsed[section.id] ?? section.defaultCollapsed;
      });
      return next;
    });
  }, [sections, sectionDefaultCollapsed]);

  useEffect(() => {
    if (typeof window === 'undefined' || !firstCollapsedDirectiveSectionId) {
      return;
    }
    const isCollapsed = collapsedSections[firstCollapsedDirectiveSectionId] ?? true;
    window.dispatchEvent(
      new CustomEvent(VIDEO_HERO_PREPEND_MODE_EVENT, {
        detail: { enabled: !isCollapsed },
      }),
    );
  }, [collapsedSections, firstCollapsedDirectiveSectionId]);

  useEffect(() => {
    if (playableTracks.length === 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
      return;
    }

    if (expandedTrackIndices.length === 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
      return;
    }

    setCurrentTrackIndex((previous) => {
      const clamped = Math.min(previous, playableTracks.length - 1);
      return expandedTrackIndices.includes(clamped) ? clamped : expandedTrackIndices[0];
    });
  }, [playableTracks.length, expandedTrackIndices]);

  useEffect(() => {
    if (expandedTrackIndices.length === 0) {
      setIsPlaying(false);
      return;
    }

    if (!expandedTrackIndices.includes(currentTrackIndex)) {
      const nextCandidate = expandedTrackIndices.find((index) => index > currentTrackIndex);
      const previousCandidate = [...expandedTrackIndices].reverse().find((index) => index < currentTrackIndex);
      const fallbackIndex = nextCandidate ?? previousCandidate ?? expandedTrackIndices[0];
      setCurrentTrackIndex(fallbackIndex);
      shouldAutoPlay.current = false;
    }
  }, [expandedTrackIndices, currentTrackIndex]);

  useEffect(() => {
    if (collapsedSectionFirstTrackIndex === null) {
      wasFirstCollapsedSectionExpandedRef.current = null;
      return;
    }

    if (!isFirstCollapsedDirectiveSectionExpanded) {
      wasFirstCollapsedSectionExpandedRef.current = false;
      return;
    }

    const wasExpanded = wasFirstCollapsedSectionExpandedRef.current;
    wasFirstCollapsedSectionExpandedRef.current = true;
    if (wasExpanded === true) {
      return;
    }

    const targetTrack = playableTracks[collapsedSectionFirstTrackIndex];
    if (!targetTrack) {
      return;
    }

    // Avoid redundant retrigger when already playing the target.
    if (
      currentTrackIndex === collapsedSectionFirstTrackIndex &&
      isPlaying &&
      currentTrack?.src === targetTrack.src
    ) {
      return;
    }

    shouldAutoPlay.current = true;
    startedTrackKeyRef.current = null;

    if (currentTrackIndex === collapsedSectionFirstTrackIndex) {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }
      dispatchMediaPlayIntent('playlist-audio');
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      return;
    }

    setCurrentTrackIndex(collapsedSectionFirstTrackIndex);
  }, [
    collapsedSectionFirstTrackIndex,
    currentTrack,
    currentTrackIndex,
    isFirstCollapsedDirectiveSectionExpanded,
    isPlaying,
    playableTracks,
  ]);

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
      const finishedTrack = playableTracks[currentTrackIndex];
      if (finishedTrack) {
        endedTrackKeyRef.current = finishedTrack.src;
        startedTrackKeyRef.current = null;
        trackMediaEvent('complete', {
          media_type: 'audio',
          component: 'PlaylistAudioPlayer',
          track_title: finishedTrack.title,
          track_src: finishedTrack.src,
          position_seconds: audio.currentTime,
          duration_seconds: audio.duration,
        });
      }

      const shouldTriggerVideoAutoplay = isFirstCollapsedDirectiveSectionExpanded
        ? collapsedSectionSecondTrackIndex !== null && currentTrackIndex === collapsedSectionSecondTrackIndex
        : nextExpandedTrackIndex === null;

      if (shouldTriggerVideoAutoplay) {
        setIsPlaying(false);
        centerScrollToVideoHero()
          .then(() => {
            window.dispatchEvent(new CustomEvent(VIDEO_HERO_AUTOPLAY_EVENT));
          })
          .catch(() => {
            window.dispatchEvent(new CustomEvent(VIDEO_HERO_AUTOPLAY_EVENT));
          });
        return;
      }

      // Sequential playback: advance to next track or stop at end
      if (nextExpandedTrackIndex !== null) {
        shouldAutoPlay.current = true;
        setCurrentTrackIndex(nextExpandedTrackIndex);
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
  }, [
    centerScrollToVideoHero,
    collapsedSectionSecondTrackIndex,
    currentTrackIndex,
    isFirstCollapsedDirectiveSectionExpanded,
    playableTracks,
    trackMediaEvent,
    isSeeking,
    nextExpandedTrackIndex,
  ]);

  useEffect(() => {
    const track = playableTracks[currentTrackIndex];
    if (!track) {
      previousIsPlayingRef.current = false;
      return;
    }

    const wasPlaying = previousIsPlayingRef.current;
    if (!wasPlaying && isPlaying) {
      trackMediaEvent('play', {
        media_type: 'audio',
        component: 'PlaylistAudioPlayer',
        track_title: track.title,
        track_src: track.src,
        position_seconds: currentTime,
        duration_seconds: duration,
      });

      if (startedTrackKeyRef.current !== track.src) {
        startedTrackKeyRef.current = track.src;
        trackMediaEvent('start', {
          media_type: 'audio',
          component: 'PlaylistAudioPlayer',
          track_title: track.title,
          track_src: track.src,
          position_seconds: currentTime,
          duration_seconds: duration,
        });
      }
    }

    if (wasPlaying && !isPlaying) {
      if (endedTrackKeyRef.current === track.src) {
        endedTrackKeyRef.current = null;
      } else {
        trackMediaEvent('pause', {
          media_type: 'audio',
          component: 'PlaylistAudioPlayer',
          track_title: track.title,
          track_src: track.src,
          position_seconds: currentTime,
          duration_seconds: duration,
        });
      }
    }

    previousIsPlayingRef.current = isPlaying;
  }, [currentTrackIndex, currentTime, duration, isPlaying, playableTracks, trackMediaEvent]);

  // ── Sync audio source when track changes ───────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldAutoPlay.current) {
      dispatchMediaPlayIntent('playlist-audio');
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      shouldAutoPlay.current = false;
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack]);

  // ── Controls ───────────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      dispatchMediaPlayIntent('playlist-audio');
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack]);

  const handleSkipForward = useCallback(() => {
    if (nextExpandedTrackIndex !== null) {
      shouldAutoPlay.current = true;
      setCurrentTrackIndex(nextExpandedTrackIndex);
    }
  }, [nextExpandedTrackIndex]);

  const handleSkipToNextSection = useCallback(() => {
    if (nextSectionStartTrackIndex === null) return;
    shouldAutoPlay.current = true;
    setCurrentTrackIndex(nextSectionStartTrackIndex);
  }, [nextSectionStartTrackIndex]);

  const handleSkipBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // If more than 3 seconds into current track, restart it
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else if (previousExpandedTrackIndex !== null) {
      shouldAutoPlay.current = true;
      setCurrentTrackIndex(previousExpandedTrackIndex);
    } else {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  }, [currentTrack, previousExpandedTrackIndex]);

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
    <div className={`w-full max-w-2xl mx-auto select-none ${className ?? ''}`}>
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
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
              aria-label="Next track"
              disabled={nextExpandedTrackIndex === null}
            >
              <SkipForward className="w-4 h-4 text-gray-300" />
            </motion.button>

            {/* Skip to next section */}
            <motion.button
              onClick={handleSkipToNextSection}
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
              aria-label="Skip to next section"
              disabled={nextSectionStartTrackIndex === null}
            >
              <ChevronsRight className="w-4 h-4 text-gray-300" />
            </motion.button>

            {/* Track title + time */}
            <div className="flex-1 min-w-0 ml-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-white text-sm font-medium truncate">
                  {currentTrack?.title ?? 'No tracks available'}
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
                {sections.map((section) => {
                  const isCollapsed = collapsedSections[section.id] ?? false;
                  const hasTracks = section.trackIndices.length > 0;

                  return (
                    <div key={section.id} className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCollapsedSections((previous) => ({
                            ...previous,
                            [section.id]: !isCollapsed,
                          }));
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label={isCollapsed ? `Expand ${section.title}` : `Collapse ${section.title}`}
                      >
                        <span className="truncate">{section.title}</span>
                        <span className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-gray-500 normal-case tracking-normal">
                            {hasTracks ? `${section.trackIndices.length} tracks` : ''}
                          </span>
                          {isCollapsed ? (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          ) : (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                          )}
                        </span>
                      </button>

                      {!isCollapsed && hasTracks && (
                        <div className="space-y-0.5">
                          {section.trackIndices.map((trackIndex) => {
                            const track = playableTracks[trackIndex];
                            const isActive = trackIndex === currentTrackIndex;
                            const isCurrentlyPlaying = isActive && isPlaying;

                            return (
                              <motion.button
                                key={`${section.id}-${track.src}-${trackIndex}`}
                                onClick={() => handleSelectTrack(trackIndex)}
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
                                    trackIndex + 1
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
                      )}
                    </div>
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
