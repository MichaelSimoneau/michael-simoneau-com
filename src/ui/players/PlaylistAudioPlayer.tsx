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
import { useProfileFlowDispatch, useProfileFlowState } from '../../features/profile/flow';
import { InlineMediaConsentPrompt } from './InlineMediaConsentPrompt';
import { useMediaConsentGate } from './useMediaConsentGate';
import { useAudioTranscript } from './audioCaptions';
import { useCaptionsViewport } from './CaptionsViewportProvider';

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
  defaultPlaylistTitle?: string;
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
const MELINDA_COLLAPSE_SIDEEFFECT_PATTERN = /^collapse_[01]$/i;
const DATE_DISPLAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const isAudioSource = (src: string) => AUDIO_SOURCE_PATTERN.test(src);
const isCollapsedDirective = (directive: string) => /collapsed/i.test(directive) || /^collapse_/i.test(directive);
const isMelindaCollapseDirective = (directive: string) => MELINDA_COLLAPSE_SIDEEFFECT_PATTERN.test(directive.trim());
const URL_IN_TEXT_PATTERN = /(https?:\/\/[^\s]+)/i;
const PLAYLIST_METADATA_CACHE_UPDATED_EVENT = 'playlist-metadata-cache-updated';

type MetadataParseResult = {
  format: { creationTime?: Date };
  common: {
    date?: string;
    originaldate?: string;
    year?: number;
    originalyear?: number;
  };
};

type ParseBlobFn = (
  blob: Blob,
  options?: { skipCovers?: boolean; duration?: boolean },
) => Promise<MetadataParseResult>;

const sharedTrackDurationsBySrc: Record<string, number | null> = {};
const sharedTrackCreatedDatesBySrc: Record<string, Date | null> = {};
const durationProbeInFlight = new Set<string>();
const createdDateProbeInFlight = new Set<string>();
const metadataReadySubscribers = new Set<() => void>();
let isMetadataEnrichmentReady = false;
let hasInitializedMetadataReadyTrigger = false;
let metadataParserPromise: Promise<ParseBlobFn | null> | null = null;

const emitPlaylistMetadataCacheUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PLAYLIST_METADATA_CACHE_UPDATED_EVENT));
  }
};

const markMetadataEnrichmentReady = () => {
  if (isMetadataEnrichmentReady) {
    return;
  }
  isMetadataEnrichmentReady = true;
  metadataReadySubscribers.forEach((notify) => notify());
};

const subscribeMetadataEnrichmentReady = (notify: () => void) => {
  metadataReadySubscribers.add(notify);
  return () => {
    metadataReadySubscribers.delete(notify);
  };
};

const ensureMetadataEnrichmentTrigger = () => {
  if (typeof window === 'undefined' || hasInitializedMetadataReadyTrigger || isMetadataEnrichmentReady) {
    return;
  }
  hasInitializedMetadataReadyTrigger = true;

  const windowWithIdle = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const cleanups: Array<() => void> = [];
  let hasSettled = false;
  const settle = () => {
    if (hasSettled) {
      return;
    }
    hasSettled = true;
    cleanups.forEach((cleanup) => cleanup());
    markMetadataEnrichmentReady();
  };

  const interactionEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart'];
  interactionEvents.forEach((eventName) => {
    const listener = () => settle();
    window.addEventListener(eventName, listener, { once: true, passive: true });
    cleanups.push(() => window.removeEventListener(eventName, listener));
  });

  if (typeof windowWithIdle.requestIdleCallback === 'function') {
    const idleId = windowWithIdle.requestIdleCallback(() => settle(), { timeout: 2500 });
    cleanups.push(() => windowWithIdle.cancelIdleCallback?.(idleId));
  } else {
    const timeoutId = window.setTimeout(() => settle(), 2500);
    cleanups.push(() => window.clearTimeout(timeoutId));
  }
};

const loadMetadataParserOnce = async (): Promise<ParseBlobFn | null> => {
  if (!metadataParserPromise) {
    metadataParserPromise = import('music-metadata-browser')
      .then((metadataModule) => metadataModule.parseBlob as ParseBlobFn)
      .catch(() => null);
  }
  return metadataParserPromise;
};

const isFakeTrackSrc = (src: string) => /fake\.mp3$/i.test(src.trim());
const extractFirstUrl = (text: string): string | null => {
  const match = text.match(URL_IN_TEXT_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const candidate = match[1].replace(/[),.;!?]+$/, '');
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * PlaylistAudioPlayer — a sleek, slim audio player that manages a playlist
 * of tracks with sequential playback, seek, skip, rewind, and track selection.
 */
export const PlaylistAudioPlayer: React.FC<PlaylistAudioPlayerProps> = ({
  tracks,
  className,
  defaultPlaylistTitle = 'Playlist',
}) => {
  const { trackMediaEvent } = useMediaAnalytics();
  const { isGateVisible, requestConsentAwareAction, requestConsentAwarePlay, acceptAndResume } = useMediaConsentGate({
    source: 'playlist-audio',
  });
  const { isCaptionsEnabled, setActiveAudio, clearActiveAudio, toggleCaptions } = useCaptionsViewport();
  const flowDispatch = useProfileFlowDispatch();
  const flowState = useProfileFlowState();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const previousIsPlayingRef = useRef(false);
  const melindaSectionExpansionSnapshotRef = useRef<Record<string, boolean>>({});
  const startedTrackKeyRef = useRef<string | null>(null);
  const endedTrackKeyRef = useRef<string | null>(null);
  const hasVideoAutoTransitionTriggeredRef = useRef(false);
  const lastKnownUrlRef = useRef<string | null>(null);
  const restrictedFlowLockedUntilReloadRef = useRef(false);
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
        createSection(defaultPlaylistTitle, false, 'EXPANDED_DEFAULT');
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
  }, [defaultPlaylistTitle, tracks]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(sectionDefaultCollapsed);
  const [, setTrackDurationsBySrc] = useState<Record<string, number | null>>(
    () => ({ ...sharedTrackDurationsBySrc }),
  );
  const [trackCreatedDatesBySrc, setTrackCreatedDatesBySrc] = useState<Record<string, Date | null>>(
    () => ({ ...sharedTrackCreatedDatesBySrc }),
  );
  const [isMetadataEnrichmentEnabled, setIsMetadataEnrichmentEnabled] = useState(
    () => typeof window === 'undefined' || isMetadataEnrichmentReady,
  );
  const [isRestrictedFlowActive, setIsRestrictedFlowActive] = useState(false);
  const [activeMelindaSectionId, setActiveMelindaSectionId] = useState<string | null>(null);

  // Flag to auto-play after a deliberate track change (skip/select)
  const shouldAutoPlay = useRef(false);

  const currentTrack = playableTracks[currentTrackIndex];
  const { status: transcriptStatus } = useAudioTranscript(currentTrack?.src);
  const currentSectionIndex = playableIndexToSectionIndex[currentTrackIndex] ?? -1;

  useEffect(() => {
    if (isCaptionsEnabled && currentTrack?.src) {
      setActiveAudio({ audioRef, audioSrc: currentTrack.src });
    }
  }, [currentTrack?.src, isCaptionsEnabled, setActiveAudio]);

  useEffect(() => {
    return () => {
      clearActiveAudio(audioRef);
    };
  }, [clearActiveAudio]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const syncSharedMetadata = () => {
      setTrackDurationsBySrc((previous) => ({ ...previous, ...sharedTrackDurationsBySrc }));
      setTrackCreatedDatesBySrc((previous) => ({ ...previous, ...sharedTrackCreatedDatesBySrc }));
    };

    syncSharedMetadata();
    window.addEventListener(PLAYLIST_METADATA_CACHE_UPDATED_EVENT, syncSharedMetadata as EventListener);
    return () => {
      window.removeEventListener(
        PLAYLIST_METADATA_CACHE_UPDATED_EVENT,
        syncSharedMetadata as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (isMetadataEnrichmentReady) {
      setIsMetadataEnrichmentEnabled(true);
      return;
    }

    ensureMetadataEnrichmentTrigger();
    return subscribeMetadataEnrichmentReady(() => {
      setIsMetadataEnrichmentEnabled(true);
    });
  }, []);

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
  const melindaCollapseSections = useMemo(() => {
    return sections.filter((section) => isMelindaCollapseDirective(section.directive));
  }, [sections]);
  const activeMelindaSection = useMemo(() => {
    if (!activeMelindaSectionId) {
      return null;
    }
    return melindaCollapseSections.find((section) => section.id === activeMelindaSectionId) ?? null;
  }, [activeMelindaSectionId, melindaCollapseSections]);
  const activeMelindaSectionSecondTrackIndex = useMemo(() => {
    return activeMelindaSection?.trackIndices[1] ?? null;
  }, [activeMelindaSection]);

  const centerScrollToVideoHero = useCallback(async () => {
    // Legacy cross-section auto-scroll is intentionally disabled.
  }, []);

  const resetRestrictedFlow = useCallback((options?: { force?: boolean }) => {
    const force = options?.force ?? false;
    if (!force && restrictedFlowLockedUntilReloadRef.current) {
      return;
    }
    restrictedFlowLockedUntilReloadRef.current = false;
    setIsRestrictedFlowActive(false);
  }, []);

  const isBeforeNoon = useCallback(() => false, []);

  const isBaizeBypassEnabled = useCallback(() => true, []);

  const startRestrictedFlowFromAutoplay = useCallback(() => {
    resetRestrictedFlow({ force: true });
  }, [resetRestrictedFlow]);

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
    return () => {
      resetRestrictedFlow({ force: true });
    };
  }, [resetRestrictedFlow]);

  useEffect(() => {
    const overrideTrack = flowState.override.value.playlist.track;
    if (overrideTrack === undefined || playableTracks.length === 0) {
      return;
    }
    const normalizedTrackIndex = Math.max(0, Math.min(playableTracks.length - 1, overrideTrack - 1));
    shouldAutoPlay.current = Boolean(flowState.override.value.playlist.autoplay);
    setCurrentTrackIndex(normalizedTrackIndex);
  }, [
    flowState.override.value.playlist.autoplay,
    flowState.override.value.playlist.track,
    playableTracks.length,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleSoftNavigation = () => {
      lastKnownUrlRef.current = window.location.href;
      if (isBaizeBypassEnabled()) {
        resetRestrictedFlow({ force: true });
        return;
      }
      resetRestrictedFlow();
    };

    window.addEventListener('hashchange', handleSoftNavigation);
    window.addEventListener('popstate', handleSoftNavigation);
    return () => {
      window.removeEventListener('hashchange', handleSoftNavigation);
      window.removeEventListener('popstate', handleSoftNavigation);
    };
  }, [isBaizeBypassEnabled, resetRestrictedFlow]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentHref = window.location.href;
    if (lastKnownUrlRef.current === null) {
      lastKnownUrlRef.current = currentHref;
      if (isBaizeBypassEnabled()) {
        resetRestrictedFlow({ force: true });
      }
      return;
    }
    if (lastKnownUrlRef.current !== currentHref) {
      lastKnownUrlRef.current = currentHref;
      if (isBaizeBypassEnabled()) {
        resetRestrictedFlow({ force: true });
      } else {
        resetRestrictedFlow();
      }
    }
  }, [isBaizeBypassEnabled, resetRestrictedFlow]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window.location.hash.toLowerCase() !== '#videos') {
      return;
    }
    if (isBaizeBypassEnabled()) {
      resetRestrictedFlow({ force: true });
    } else {
      resetRestrictedFlow();
    }
    flowDispatch({ type: 'POST_REFRESH_CONTROL_NORMALIZED' });
  }, [flowDispatch, isBaizeBypassEnabled, resetRestrictedFlow]);

  useEffect(() => {
    if (isBaizeBypassEnabled()) {
      resetRestrictedFlow({ force: true });
    }

    const intervalId = setInterval(() => {
      if (isBaizeBypassEnabled()) {
        resetRestrictedFlow({ force: true });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isBaizeBypassEnabled, resetRestrictedFlow]);

  useEffect(() => {
    if (!activeMelindaSectionId) {
      return;
    }
    const activeStillExists = melindaCollapseSections.some((section) => section.id === activeMelindaSectionId);
    if (!activeStillExists) {
      const fallbackSectionId = melindaCollapseSections[0]?.id ?? null;
      setActiveMelindaSectionId(fallbackSectionId);
    }
  }, [activeMelindaSectionId, melindaCollapseSections]);

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
    if (melindaCollapseSections.length === 0) {
      melindaSectionExpansionSnapshotRef.current = {};
      return;
    }
    // Legacy section-driven autoplay transitions are intentionally disabled.
    melindaSectionExpansionSnapshotRef.current = {};
  }, [melindaCollapseSections.length]);

  // ── Audio event listeners ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      startRestrictedFlowFromAutoplay();
    };

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

      // Sequential playback: advance to next track or stop at end
      if (nextExpandedTrackIndex !== null) {
        shouldAutoPlay.current = true;
        setCurrentTrackIndex(nextExpandedTrackIndex);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [
    activeMelindaSectionId,
    activeMelindaSectionSecondTrackIndex,
    centerScrollToVideoHero,
    currentTrackIndex,
    flowDispatch,
    playableTracks,
    trackMediaEvent,
    isSeeking,
    nextExpandedTrackIndex,
    isBeforeNoon,
    startRestrictedFlowFromAutoplay,
  ]);

  useEffect(() => {
    hasVideoAutoTransitionTriggeredRef.current = false;
  }, [currentTrackIndex]);

  useEffect(() => {
    flowDispatch({ type: 'PLAYLIST_TRACK_CHANGED', trackIndex: currentTrackIndex });
  }, [currentTrackIndex, flowDispatch]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    if (!isRestrictedFlowActive) {
      return;
    }

    const preventInteraction = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      const blockedKeys = [' ', 'Spacebar', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const eventNames: Array<keyof DocumentEventMap> = [
      'click',
      'mousedown',
      'mouseup',
      'pointerdown',
      'pointerup',
      'touchstart',
      'touchmove',
      'wheel',
    ];
    eventNames.forEach((eventName) => {
      document.addEventListener(eventName, preventInteraction, { capture: true, passive: false });
    });
    document.addEventListener('keydown', preventScrollKeys, { capture: true });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      eventNames.forEach((eventName) => {
        document.removeEventListener(eventName, preventInteraction, { capture: true });
      });
      document.removeEventListener('keydown', preventScrollKeys, { capture: true });
    };
  }, [isRestrictedFlowActive]);

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
    flowDispatch({ type: isPlaying ? 'PLAYLIST_PLAYING' : 'PLAYLIST_PAUSED' });
  }, [currentTrackIndex, currentTime, duration, isPlaying, playableTracks, trackMediaEvent, flowDispatch]);

  useEffect(() => {
    flowDispatch({ type: 'PLAYLIST_RESTRICTED_TOGGLED', active: isRestrictedFlowActive });
  }, [flowDispatch, isRestrictedFlowActive]);

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
      requestConsentAwarePlay(() => {
        audio.play().then(() => {
          setIsPlaying(true);
          startRestrictedFlowFromAutoplay();
        }).catch(() => setIsPlaying(false));
      });
      shouldAutoPlay.current = false;
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, requestConsentAwarePlay, startRestrictedFlowFromAutoplay]);

  useEffect(() => {
    if (!isMetadataEnrichmentEnabled || typeof Audio === 'undefined') {
      return;
    }

    let isDisposed = false;
    const cleanupCallbacks: Array<() => void> = [];
    const uniqueSources = Array.from(new Set(playableTracks.map((track) => track.src)));

    const timerId = window.setTimeout(() => {
      uniqueSources.forEach((src) => {
        if (!isAudioSource(src) || isFakeTrackSrc(src)) {
          return;
        }
        if (sharedTrackDurationsBySrc[src] !== undefined || durationProbeInFlight.has(src)) {
          return;
        }
        durationProbeInFlight.add(src);

        const probe = new Audio();
        probe.preload = 'metadata';

        const finalizeDuration = (nextDuration: number | null) => {
          durationProbeInFlight.delete(src);
          if (isDisposed) {
            return;
          }
          if (sharedTrackDurationsBySrc[src] !== undefined) {
            return;
          }
          sharedTrackDurationsBySrc[src] = nextDuration;
          setTrackDurationsBySrc((previous) => ({ ...previous, [src]: nextDuration }));
          emitPlaylistMetadataCacheUpdated();
        };

        const handleLoadedMetadata = () => {
          const nextDuration = Number.isFinite(probe.duration) && probe.duration > 0
            ? probe.duration
            : null;
          finalizeDuration(nextDuration);
        };
        const handleError = () => {
          finalizeDuration(null);
        };

        probe.addEventListener('loadedmetadata', handleLoadedMetadata);
        probe.addEventListener('error', handleError);
        probe.src = src;
        probe.load();

        cleanupCallbacks.push(() => {
          durationProbeInFlight.delete(src);
          probe.removeEventListener('loadedmetadata', handleLoadedMetadata);
          probe.removeEventListener('error', handleError);
          probe.removeAttribute('src');
          probe.load();
        });
      });
    }, 0);

    return () => {
      isDisposed = true;
      window.clearTimeout(timerId);
      cleanupCallbacks.forEach((cleanup) => cleanup());
    };
  }, [isMetadataEnrichmentEnabled, playableTracks]);

  useEffect(() => {
    if (!isMetadataEnrichmentEnabled || typeof fetch === 'undefined') {
      return;
    }

    let isDisposed = false;
    const abortControllers: AbortController[] = [];
    const uniqueSources = Array.from(new Set(playableTracks.map((track) => track.src)));

    const tryParseDate = (value: unknown): Date | null => {
      if (value instanceof Date && Number.isFinite(value.getTime())) {
        return value;
      }
      if (typeof value === 'number' && Number.isFinite(value)) {
        const asDate = new Date(value, 0, 1);
        return Number.isFinite(asDate.getTime()) ? asDate : null;
      }
      if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = new Date(value);
        if (Number.isFinite(parsed.getTime())) {
          return parsed;
        }
      }
      return null;
    };

    const timerId = window.setTimeout(() => {
      void (async () => {
        const parseBlob = await loadMetadataParserOnce();

        if (!parseBlob || isDisposed) {
          return;
        }

        uniqueSources.forEach((src) => {
          if (!isAudioSource(src) || isFakeTrackSrc(src)) {
            return;
          }
          if (sharedTrackCreatedDatesBySrc[src] !== undefined || createdDateProbeInFlight.has(src)) {
            return;
          }
          createdDateProbeInFlight.add(src);

          const finalizeCreatedDate = (nextCreatedDate: Date | null) => {
            createdDateProbeInFlight.delete(src);
            if (isDisposed) {
              return;
            }
            if (sharedTrackCreatedDatesBySrc[src] !== undefined) {
              return;
            }
            sharedTrackCreatedDatesBySrc[src] = nextCreatedDate;
            setTrackCreatedDatesBySrc((previous) => ({ ...previous, [src]: nextCreatedDate }));
            emitPlaylistMetadataCacheUpdated();
          };

          const controller = new AbortController();
          abortControllers.push(controller);

          fetch(src, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch metadata for ${src}`);
              }
              return response.blob();
            })
            .then((blob) => parseBlob?.(blob, { skipCovers: true, duration: false }))
            .then((metadata) => {
              if (!metadata) {
                finalizeCreatedDate(null);
                return;
              }
              const nextCreatedDate = (
                tryParseDate(metadata.format.creationTime)
                ?? tryParseDate(metadata.common.date)
                ?? tryParseDate(metadata.common.originaldate)
                ?? tryParseDate(metadata.common.year)
                ?? tryParseDate(metadata.common.originalyear)
              );
              finalizeCreatedDate(nextCreatedDate);
            })
            .catch(() => {
              finalizeCreatedDate(null);
            });
        });
      })();
    }, 0);

    return () => {
      isDisposed = true;
      window.clearTimeout(timerId);
      abortControllers.forEach((controller) => controller.abort());
    };
  }, [isMetadataEnrichmentEnabled, playableTracks]);

  // ── Controls ───────────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (isRestrictedFlowActive) return;
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      requestConsentAwarePlay(() => {
        if (currentTrack?.src) {
          setActiveAudio({ audioRef, audioSrc: currentTrack.src });
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
    }
  }, [currentTrack, isPlaying, isRestrictedFlowActive, requestConsentAwarePlay, setActiveAudio]);

  const handleSkipForward = useCallback(() => {
    if (isRestrictedFlowActive) return;
    if (nextExpandedTrackIndex !== null) {
      shouldAutoPlay.current = true;
      setCurrentTrackIndex(nextExpandedTrackIndex);
    }
  }, [nextExpandedTrackIndex, isRestrictedFlowActive]);

  const handleSkipToNextSection = useCallback(() => {
    if (isRestrictedFlowActive) return;
    if (nextSectionStartTrackIndex === null) return;
    shouldAutoPlay.current = true;
    setCurrentTrackIndex(nextSectionStartTrackIndex);
  }, [nextSectionStartTrackIndex, isRestrictedFlowActive]);

  const handleSkipBack = useCallback(() => {
    if (isRestrictedFlowActive) return;
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
  }, [currentTrack, previousExpandedTrackIndex, isRestrictedFlowActive]);

  const handleSelectTrack = useCallback((index: number) => {
    if (isRestrictedFlowActive) return;
    if (index === currentTrackIndex) {
      // Toggle play/pause on current track
      handlePlayPause();
      return;
    }
    const targetTrack = playableTracks[index];
    if (targetTrack) {
      const targetSection = sections.find((section) => section.id === targetTrack.sectionId);
      if (targetSection && isMelindaCollapseDirective(targetSection.directive)) {
        setActiveMelindaSectionId(targetSection.id);
      }
    }
    shouldAutoPlay.current = true;
    setCurrentTrackIndex(index);
  }, [currentTrackIndex, handlePlayPause, isRestrictedFlowActive, playableTracks, sections]);

  // ── Seek via progress bar click ────────────────────────────────────────
  const setAudioTime = useCallback((nextTime: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const clamped = Math.max(0, Math.min(nextTime, duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  useEffect(() => {
    if (flowState.override.value.playlist.time === undefined) {
      return;
    }
    const audio = audioRef.current;
    if (!audio || !duration) {
      return;
    }
    setAudioTime(flowState.override.value.playlist.time);
  }, [duration, flowState.override.value.playlist.time, setAudioTime]);

  const seekFromClientX = useCallback((clientX: number) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    setAudioTime(pct * duration);
  }, [duration, setAudioTime]);

  const handleProgressPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isRestrictedFlowActive) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsSeeking(true);
    seekFromClientX(e.clientX);
  }, [seekFromClientX, isRestrictedFlowActive]);

  const handleProgressPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isRestrictedFlowActive) return;
    if (!isSeeking) return;
    seekFromClientX(e.clientX);
  }, [isSeeking, seekFromClientX, isRestrictedFlowActive]);

  const handleProgressPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isRestrictedFlowActive) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsSeeking(false);
  }, [isRestrictedFlowActive]);

  const handleProgressKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isRestrictedFlowActive) return;
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
  }, [currentTime, duration, setAudioTime, isRestrictedFlowActive]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTrackCreatedDate = (value: Date | null | undefined) => {
    if (!value || !Number.isFinite(value.getTime())) {
      return '';
    }
    return DATE_DISPLAY_FORMATTER.format(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCaptionUnavailable = transcriptStatus === 'missing' || transcriptStatus === 'error';
  const isCcToggleDisabled = isRestrictedFlowActive || !currentTrack || isCaptionUnavailable;

  const handleCaptionsToggle = useCallback(() => {
    if (isCcToggleDisabled) {
      return;
    }
    requestConsentAwareAction(() => {
      if (currentTrack?.src) {
        setActiveAudio({ audioRef, audioSrc: currentTrack.src });
      }
      toggleCaptions();
    });
  }, [currentTrack?.src, isCcToggleDisabled, requestConsentAwareAction, setActiveAudio, toggleCaptions]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={`w-full mx-auto select-none ${className ?? ''}`}>
      <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/5">
        {/* Subtle top glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

        {/* ── Control Bar ─────────────────────────────────────────── */}
        <div className="relative z-10 px-4 pt-4 pb-3">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Skip Back */}
            <motion.button
              onClick={handleSkipBack}
              className="flex-shrink-0 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Previous track"
            >
              <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center">
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
              </span>
            </motion.button>

            {/* Play / Pause */}
            <motion.button
              onClick={handlePlayPause}
              className="flex-shrink-0 h-11 w-11 sm:h-10 sm:w-10 rounded-full transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center shadow-lg shadow-cyan-400/20">
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-black/80" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-black/80 ml-0.5" />
              )}
              </span>
            </motion.button>

            {/* Skip Forward */}
            <motion.button
              onClick={handleSkipForward}
              className="flex-shrink-0 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
              aria-label="Next track"
              disabled={nextExpandedTrackIndex === null}
            >
              <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center">
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
              </span>
            </motion.button>

            {/* Skip to next section */}
            <motion.button
              onClick={handleSkipToNextSection}
              className="flex-shrink-0 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
              aria-label="Skip to next section"
              disabled={nextSectionStartTrackIndex === null}
            >
              <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center">
                <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
              </span>
            </motion.button>

            {/* Track title + time */}
            <div className="flex-1 min-w-0 ml-0.5 sm:ml-1">
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
              onClick={handleCaptionsToggle}
              className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full border border-gray-500/60 hover:border-cyan-300 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
              aria-label={isCaptionsEnabled ? 'Disable closed captions' : 'Enable closed captions'}
              aria-pressed={isCaptionsEnabled}
              disabled={isCcToggleDisabled}
            >
              <span className="text-[10px] font-semibold tracking-wide text-gray-300">CC</span>
            </motion.button>

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
            className="playlist-seekbar relative h-1.5 mt-3 rounded-full overflow-hidden cursor-pointer touch-none"
          >
            {/* Filled portion */}
            <motion.div
              className="playlist-seekbar-fill absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: isSeeking ? 0 : 0.1 }}
            />
            {/* Seek handle (visible on hover) */}
            <div
              className="playlist-seekbar-thumb absolute top-1/2 -translate-y-1/2 shadow-md pointer-events-none"
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
                        disabled={isRestrictedFlowActive}
                        onClick={() => {
                          if (isRestrictedFlowActive) {
                            return;
                          }
                          // Any playlist section interaction should pause active video playback.
                          dispatchMediaPlayIntent('playlist-audio');
                          setCollapsedSections((previous) => ({
                            ...previous,
                            [section.id]: !isCollapsed,
                          }));
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-70"
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
                            const linkUrl = extractFirstUrl(track.title);
                            const isLinkRow = isFakeTrackSrc(track.src) && linkUrl !== null;
                            const trackCreatedDateLabel = !isAudioSource(track.src) || isFakeTrackSrc(track.src)
                              ? ''
                              : formatTrackCreatedDate(trackCreatedDatesBySrc[track.src]);

                            const trackRowContent = (
                              <>
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

                                {/* Timeline date slot */}
                                <span
                                  className="relative flex-shrink-0 w-2 h-6 overflow-visible"
                                  aria-hidden="true"
                                >
                                  <span
                                    className={`absolute left-1/2 -translate-x-1/2 -top-3 -bottom-3 w-px ${
                                      isActive ? 'bg-cyan-400/60' : 'bg-white/15'
                                    }`}
                                  />
                                  {trackCreatedDateLabel && (
                                    <span
                                      className={`absolute right-full mr-1 top-1/2 -translate-y-1/2 z-10 px-1 rounded-sm text-[9px] tabular-nums leading-none whitespace-nowrap ${
                                        isActive
                                          ? 'text-cyan-200 bg-cyan-500/20'
                                          : 'text-gray-300 bg-gray-900/75'
                                      }`}
                                    >
                                      {trackCreatedDateLabel}
                                    </span>
                                  )}
                                </span>

                                {/* Track title */}
                                <span
                                  className={`flex-1 min-w-0 text-sm truncate ${
                                    isActive
                                      ? 'text-cyan-400 font-medium'
                                      : 'text-gray-300 group-hover:text-white'
                                  }`}
                                >
                                  {track.title}
                                </span>
                              </>
                            );

                            if (isLinkRow && linkUrl) {
                              return (
                                <motion.a
                                  key={`${section.id}-${track.src}-${trackIndex}`}
                                  href={linkUrl}
                                  target="_blank"
                                  rel="noopener"
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                                    isActive
                                      ? 'bg-cyan-400/10'
                                      : 'hover:bg-white/5'
                                  }`}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {trackRowContent}
                                </motion.a>
                              );
                            }

                            return (
                              <motion.button
                                key={`${section.id}-${track.src}-${trackIndex}`}
                                disabled={isRestrictedFlowActive}
                                onClick={() => handleSelectTrack(trackIndex)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                                  isActive
                                    ? 'bg-cyan-400/10'
                                    : 'hover:bg-white/5'
                                } disabled:opacity-80`}
                                whileTap={{ scale: 0.98 }}
                              >
                                {trackRowContent}
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
      <InlineMediaConsentPrompt visible={isGateVisible} onAgree={acceptAndResume} className="mt-2" />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />
      {isRestrictedFlowActive && (
        <div
          className="fixed inset-0 z-[9999] bg-transparent"
          aria-hidden="true"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerMove={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerUp={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onTouchStart={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onTouchEnd={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onWheel={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      )}
    </div>
  );
};
