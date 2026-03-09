import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useMediaAnalytics } from '../../../analytics/useMediaAnalytics';

interface YouTubePlayer {
  loadVideoById?: (videoId: string) => void;
  cueVideoById?: (videoId: string) => void;
  loadPlaylist?: (playlist: string | {
    listType?: string;
    list: string;
    index?: number;
    startSeconds?: number;
  }) => void;
  playVideo?: () => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  destroy: () => void;
}

interface YouTubePlayerState {
  ENDED: number;
  PLAYING: number;
  BUFFERING: number;
  CUED: number;
  PAUSED: number;
}

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerReadyEvent {
  target: YouTubePlayer;
}

interface YouTubeGlobal {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady?: (event: YouTubePlayerReadyEvent) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: YouTubePlayerState;
}

interface YouTubeWindow extends Window {
  YT?: YouTubeGlobal;
  onYouTubeIframeAPIReady?: () => void;
}

const STANDARD_VIDEO_ID = '_Y1GTUrtWjE';
const PREPENDED_VIDEO_ID = '_KKJTVyxb_A';
const SECOND_VIDEO_ID = '6BTyy4kTywo';
const HANDOFF_PLAYLIST_ID = 'PLgqAhNtHkRy8PiSUfWBu1Z4KhPuwuEVwj';
const HANDOFF_PLAYLIST_START_VIDEO_ID = 'uKXwADJaKAs';
const HANDOFF_PLAYLIST_START_INDEX = 2;
const HANDOFF_DELAY_MS = 5000;
const PREEND_TRIGGER_SECONDS = 1;
const PREEND_POLL_INTERVAL_MS = 200;
const VIDEO_HERO_AUTOPLAY_EVENT = 'videohero:autoplay-request';
const VIDEO_HERO_PREPEND_MODE_EVENT = 'videohero:prepend-mode';
type PlaybackPhase = 'prepended' | 'primary' | 'second' | 'playlist';
type VideoHeroStartMode = 'standard' | 'playlist';

/**
 * Full-screen hero section featuring the Zeroth Theory YouTube video.
 * Shows a static thumbnail until the user clicks "Watch Now", then loads the
 * iframe with autoplay, controls, and captions.
 */
export const VideoHeroSection: React.FC = () => {
  const { trackMediaEvent } = useMediaAnalytics();
  const [isWatching, setIsWatching] = useState(false);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [displayVideoId, setDisplayVideoId] = useState(STANDARD_VIDEO_ID);
  const [isDelayOverlayVisible, setIsDelayOverlayVisible] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const playerElementRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const handoffTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoffCountdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preEndPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAutoPlayRequestRef = useRef(false);
  const prependModeEnabledRef = useRef(false);
  const previousPlayerStateRef = useRef<number | null>(null);
  const startedPlaybackKeyRef = useRef<string | null>(null);
  const awaitingPostHandoffPlaybackRef = useRef(false);
  const hasPreEndTriggeredForPhaseRef = useRef(false);
  const playbackPhaseRef = useRef<PlaybackPhase>('primary');
  const startModeRef = useRef<VideoHeroStartMode>('standard');

  const getCurrentVideoContext = useCallback(() => {
    if (playbackPhaseRef.current === 'prepended') {
      return { phase: 'prepended', videoId: PREPENDED_VIDEO_ID };
    }
    if (playbackPhaseRef.current === 'primary') {
      return { phase: 'primary', videoId: STANDARD_VIDEO_ID };
    }
    if (playbackPhaseRef.current === 'second') {
      return { phase: 'second', videoId: SECOND_VIDEO_ID };
    }
    return { phase: 'playlist', videoId: HANDOFF_PLAYLIST_ID };
  }, []);

  const resetDelayOverlay = useCallback(() => {
    setIsDelayOverlayVisible(false);
    setCountdownValue(null);
  }, []);

  const clearHandoffTimeout = useCallback(() => {
    if (handoffTimeoutRef.current !== null) {
      clearTimeout(handoffTimeoutRef.current);
      handoffTimeoutRef.current = null;
    }
    if (handoffCountdownIntervalRef.current !== null) {
      clearInterval(handoffCountdownIntervalRef.current);
      handoffCountdownIntervalRef.current = null;
    }
    awaitingPostHandoffPlaybackRef.current = false;
    hasPreEndTriggeredForPhaseRef.current = false;
    resetDelayOverlay();
  }, [resetDelayOverlay]);

  const startStandardVideo = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    playbackPhaseRef.current = 'primary';

    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(STANDARD_VIDEO_ID);
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.cueVideoById === 'function') {
      player.cueVideoById(STANDARD_VIDEO_ID);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.playVideo === 'function') {
      player.playVideo();
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    return false;
  }, []);

  const startPrependedVideo = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    playbackPhaseRef.current = 'prepended';

    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(PREPENDED_VIDEO_ID);
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.cueVideoById === 'function') {
      player.cueVideoById(PREPENDED_VIDEO_ID);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.playVideo === 'function') {
      player.playVideo();
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    return false;
  }, []);

  const startSecondVideo = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    playbackPhaseRef.current = 'second';

    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(SECOND_VIDEO_ID);
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.cueVideoById === 'function') {
      player.cueVideoById(SECOND_VIDEO_ID);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    return false;
  }, []);

  const startInitialAutoplaySequence = useCallback(() => {
    startedPlaybackKeyRef.current = null;
    if (prependModeEnabledRef.current) {
      return startPrependedVideo();
    }
    return startStandardVideo();
  }, [startPrependedVideo, startStandardVideo]);

  const startPlaylistFromThirdItem = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    playbackPhaseRef.current = 'playlist';

    if (typeof player.loadPlaylist === 'function') {
      player.loadPlaylist({
        listType: 'playlist',
        list: HANDOFF_PLAYLIST_ID,
        index: HANDOFF_PLAYLIST_START_INDEX,
        startSeconds: 0,
      });
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(HANDOFF_PLAYLIST_START_VIDEO_ID);
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    if (typeof player.cueVideoById === 'function') {
      player.cueVideoById(HANDOFF_PLAYLIST_START_VIDEO_ID);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
      hasPreEndTriggeredForPhaseRef.current = false;
      return true;
    }

    return false;
  }, []);

  const startPlaybackForCurrentMode = useCallback(() => {
    if (startModeRef.current === 'playlist') {
      return startPlaylistFromThirdItem();
    }
    return startInitialAutoplaySequence();
  }, [startInitialAutoplaySequence, startPlaylistFromThirdItem]);

  const runNextPlaybackStep = useCallback(() => {
    if (playbackPhaseRef.current === 'prepended') {
      return startStandardVideo();
    }
    if (playbackPhaseRef.current === 'primary') {
      return startSecondVideo();
    }
    if (playbackPhaseRef.current === 'second') {
      return startPlaylistFromThirdItem();
    }
    return false;
  }, [startStandardVideo, startSecondVideo, startPlaylistFromThirdItem]);

  const scheduleHandoff = useCallback((nextStep: () => boolean) => {
    clearHandoffTimeout();
    setIsDelayOverlayVisible(true);
    setCountdownValue(5);
    let nextCountdownValue = 5;
    handoffCountdownIntervalRef.current = setInterval(() => {
      nextCountdownValue -= 1;
      setCountdownValue(Math.max(nextCountdownValue, 0));
      if (nextCountdownValue <= 0 && handoffCountdownIntervalRef.current !== null) {
        clearInterval(handoffCountdownIntervalRef.current);
        handoffCountdownIntervalRef.current = null;
      }
    }, 1000);

    handoffTimeoutRef.current = setTimeout(() => {
      handoffTimeoutRef.current = null;
      if (handoffCountdownIntervalRef.current !== null) {
        clearInterval(handoffCountdownIntervalRef.current);
        handoffCountdownIntervalRef.current = null;
      }
      setCountdownValue(0);
      awaitingPostHandoffPlaybackRef.current = true;
      nextStep();
    }, HANDOFF_DELAY_MS);
  }, [clearHandoffTimeout]);

  const handlePlayerStateChange = useCallback((event: YouTubePlayerEvent) => {
    const ytWindow = window as YouTubeWindow;
    const yt = ytWindow.YT;
    if (!yt) return;

    const context = getCurrentVideoContext();
    const previousState = previousPlayerStateRef.current;

    if (event.data === yt.PlayerState.PLAYING && previousState !== yt.PlayerState.PLAYING) {
      const positionSeconds = playerRef.current?.getCurrentTime?.();
      const durationSeconds = playerRef.current?.getDuration?.();
      trackMediaEvent('play', {
        media_type: 'video',
        component: 'VideoHeroSection',
        phase: context.phase,
        video_id: context.videoId,
        position_seconds: positionSeconds,
        duration_seconds: durationSeconds,
      });

      const startKey = `${context.phase}:${context.videoId}`;
      if (startedPlaybackKeyRef.current !== startKey) {
        startedPlaybackKeyRef.current = startKey;
        trackMediaEvent('start', {
          media_type: 'video',
          component: 'VideoHeroSection',
          phase: context.phase,
          video_id: context.videoId,
          position_seconds: positionSeconds,
          duration_seconds: durationSeconds,
        });
      }
    }

    if (
      event.data === yt.PlayerState.PAUSED &&
      previousState === yt.PlayerState.PLAYING
    ) {
      trackMediaEvent('pause', {
        media_type: 'video',
        component: 'VideoHeroSection',
        phase: context.phase,
        video_id: context.videoId,
        position_seconds: playerRef.current?.getCurrentTime?.(),
        duration_seconds: playerRef.current?.getDuration?.(),
      });
    }

    if (
      awaitingPostHandoffPlaybackRef.current &&
      (event.data === yt.PlayerState.PLAYING || event.data === yt.PlayerState.BUFFERING)
    ) {
      awaitingPostHandoffPlaybackRef.current = false;
      hasPreEndTriggeredForPhaseRef.current = false;
      resetDelayOverlay();
      previousPlayerStateRef.current = event.data;
      return;
    }

    if (event.data === yt.PlayerState.ENDED) {
      trackMediaEvent('complete', {
        media_type: 'video',
        component: 'VideoHeroSection',
        phase: context.phase,
        video_id: context.videoId,
        position_seconds: playerRef.current?.getCurrentTime?.(),
        duration_seconds: playerRef.current?.getDuration?.(),
      });
      // Fallback in case pre-end polling missed the timing window.
      if (handoffTimeoutRef.current !== null || awaitingPostHandoffPlaybackRef.current) {
        previousPlayerStateRef.current = event.data;
        return;
      }
      if (playbackPhaseRef.current !== 'playlist') {
        scheduleHandoff(runNextPlaybackStep);
      }
      previousPlayerStateRef.current = event.data;
      return;
    }

    if (handoffTimeoutRef.current === null) {
      previousPlayerStateRef.current = event.data;
      return;
    }

    const interactionStateCodes = [
      yt.PlayerState.PLAYING,
      yt.PlayerState.BUFFERING,
      yt.PlayerState.CUED,
    ];

    if (interactionStateCodes.includes(event.data)) {
      clearHandoffTimeout();
    }
    previousPlayerStateRef.current = event.data;
  }, [clearHandoffTimeout, getCurrentVideoContext, resetDelayOverlay, runNextPlaybackStep, scheduleHandoff, trackMediaEvent]);

  useEffect(() => {
    if (!isWatching || !isPlayerReady) {
      if (preEndPollIntervalRef.current !== null) {
        clearInterval(preEndPollIntervalRef.current);
        preEndPollIntervalRef.current = null;
      }
      return;
    }

    const pollForPreEnd = () => {
      const player = playerRef.current;
      if (!player || playbackPhaseRef.current === 'playlist') {
        return;
      }
      if (handoffTimeoutRef.current !== null || awaitingPostHandoffPlaybackRef.current) {
        return;
      }
      if (hasPreEndTriggeredForPhaseRef.current) {
        return;
      }

      const duration = player.getDuration?.();
      const currentTime = player.getCurrentTime?.();
      if (!duration || duration <= 0 || currentTime === undefined) {
        return;
      }

      const remainingSeconds = duration - currentTime;
      if (remainingSeconds <= PREEND_TRIGGER_SECONDS) {
        hasPreEndTriggeredForPhaseRef.current = true;
        scheduleHandoff(runNextPlaybackStep);
      }
    };

    preEndPollIntervalRef.current = setInterval(pollForPreEnd, PREEND_POLL_INTERVAL_MS);
    return () => {
      if (preEndPollIntervalRef.current !== null) {
        clearInterval(preEndPollIntervalRef.current);
        preEndPollIntervalRef.current = null;
      }
    };
  }, [isWatching, isPlayerReady, runNextPlaybackStep, scheduleHandoff]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ytWindow = window as YouTubeWindow;
    if (ytWindow.YT?.Player) {
      setIsYouTubeApiReady(true);
      return;
    }

    let isCancelled = false;
    const previousReadyHandler = ytWindow.onYouTubeIframeAPIReady;
    const handleYouTubeReady = () => {
      previousReadyHandler?.();
      if (!isCancelled) {
        setIsYouTubeApiReady(true);
      }
    };

    ytWindow.onYouTubeIframeAPIReady = handleYouTubeReady;

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (ytWindow.onYouTubeIframeAPIReady === handleYouTubeReady) {
        ytWindow.onYouTubeIframeAPIReady = previousReadyHandler;
      }
    };
  }, []);

  useEffect(() => {
    if (!isWatching || !isYouTubeApiReady || !playerElementRef.current || playerRef.current) {
      return;
    }

    const ytWindow = window as YouTubeWindow;
    const yt = ytWindow.YT;
    if (!yt) return;

    setIsPlayerReady(false);
    playbackPhaseRef.current = 'primary';
    hasPreEndTriggeredForPhaseRef.current = false;
    playerRef.current = new yt.Player(playerElementRef.current, {
      videoId: displayVideoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        cc_load_policy: 1,
        cc_lang_pref: 'en',
      },
      events: {
        onReady: () => setIsPlayerReady(true),
        onStateChange: handlePlayerStateChange,
      },
    });
  }, [displayVideoId, isWatching, isYouTubeApiReady, handlePlayerStateChange]);

  useEffect(() => {
    if (!isWatching || !isPlayerReady || !pendingAutoPlayRequestRef.current) {
      return;
    }

    clearHandoffTimeout();
    if (startPlaybackForCurrentMode()) {
      pendingAutoPlayRequestRef.current = false;
    }
  }, [isWatching, isPlayerReady, clearHandoffTimeout, startPlaybackForCurrentMode]);

  useEffect(() => {
    const handleAutoplayRequest = () => {
      clearHandoffTimeout();
      startModeRef.current = 'standard';
      if (!isWatching || !isPlayerReady) {
        pendingAutoPlayRequestRef.current = true;
        setIsWatching(true);
        return;
      }

      startPlaybackForCurrentMode();
    };

    window.addEventListener(VIDEO_HERO_AUTOPLAY_EVENT, handleAutoplayRequest);
    return () => {
      window.removeEventListener(VIDEO_HERO_AUTOPLAY_EVENT, handleAutoplayRequest);
    };
  }, [clearHandoffTimeout, isWatching, isPlayerReady, startPlaybackForCurrentMode]);

  useEffect(() => {
    const handlePrependMode = (event: Event) => {
      const customEvent = event as CustomEvent<{ enabled?: boolean }>;
      const isEnabled = Boolean(customEvent.detail?.enabled);
      prependModeEnabledRef.current = isEnabled;
      const nextDisplayVideoId = isEnabled ? PREPENDED_VIDEO_ID : STANDARD_VIDEO_ID;
      setDisplayVideoId(nextDisplayVideoId);

      // Apply immediately while watching so the visible player reflects the toggle.
      if (isWatching && isPlayerReady) {
        clearHandoffTimeout();
        if (isEnabled) {
          startPrependedVideo();
        } else {
          startStandardVideo();
        }
      }
    };

    window.addEventListener(VIDEO_HERO_PREPEND_MODE_EVENT, handlePrependMode);
    return () => {
      window.removeEventListener(VIDEO_HERO_PREPEND_MODE_EVENT, handlePrependMode);
    };
  }, [clearHandoffTimeout, isPlayerReady, isWatching, startPrependedVideo, startStandardVideo]);

  useEffect(() => {
    return () => {
      clearHandoffTimeout();
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsPlayerReady(false);
      playbackPhaseRef.current = 'primary';
      hasPreEndTriggeredForPhaseRef.current = false;
      previousPlayerStateRef.current = null;
      startedPlaybackKeyRef.current = null;
    };
  }, [clearHandoffTimeout]);

  const handleLearnZerothTheoryClick = useCallback(() => {
    startModeRef.current = 'standard';
    pendingAutoPlayRequestRef.current = false;
    setIsWatching(true);
  }, []);

  const handleLearnMichaelClick = useCallback(() => {
    startModeRef.current = 'playlist';
    clearHandoffTimeout();
    if (!isWatching || !isPlayerReady) {
      pendingAutoPlayRequestRef.current = true;
      setIsWatching(true);
      return;
    }

    startPlaybackForCurrentMode();
  }, [clearHandoffTimeout, isPlayerReady, isWatching, startPlaybackForCurrentMode]);

  const thumbnailUrl = `https://img.youtube.com/vi/${displayVideoId}/maxresdefault.jpg`;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        {isWatching ? (
          <div className="relative w-full" style={{ aspectRatio: '16 / 9', maxHeight: '100%' }}>
            <div
              ref={playerElementRef}
              title="Zeroth Theory and The Ricochet Theorem video player"
              className="w-full h-full border-0"
            />

            <AnimatePresence>
              {isDelayOverlayVisible && (
                <motion.div
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/15 backdrop-blur-[1px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {countdownValue !== null && (
                    <motion.div
                      key={countdownValue}
                      initial={{ opacity: 0.35, scale: 0.9 }}
                      animate={{ opacity: 0.9, scale: 1.04 }}
                      exit={{ opacity: 0.2, scale: 1.12 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="text-white/90 font-semibold text-4xl sm:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                    >
                      {countdownValue}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt="Zeroth Theory and The Ricochet Theorem thumbnail"
            className="w-full object-cover"
            style={{ aspectRatio: '16 / 9', maxHeight: '100%' }}
          />
        )}
      </div>

      <AnimatePresence>
        {!isWatching && (
          <>
            <motion.div
              className="absolute inset-0 z-10 bg-black/50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className="relative z-20 flex flex-col items-center justify-center text-center px-4"
              style={{ minHeight: '100vh' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="block text-white font-semibold">
                  Michael Simoneau presents his
                </span>
                <span className="block text-cyan-300 font-extrabold">
                  &ldquo;Zeroth Theory&rdquo;
                </span>
                <span className="block text-white font-semibold">
                  and
                </span>
                <span className="block text-emerald-300 font-extrabold">
                  &ldquo;The Ricochet Theorem&rdquo;
                </span>
              </motion.h2>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button
                  type="button"
                  onClick={handleLearnZerothTheoryClick}
                  className="group relative isolate inline-flex w-full min-w-0 sm:flex-1 sm:basis-0 justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 border border-white text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-pointer overflow-hidden"
                >
                  <span className="pointer-events-none absolute inset-0 z-0 bg-white/10" />
                  <Play size={22} className="relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10 whitespace-nowrap">Learn About Zeroth Theory</span>
                </button>
                <button
                  type="button"
                  onClick={handleLearnMichaelClick}
                  className="group inline-flex w-full min-w-0 sm:flex-1 sm:basis-0 justify-center items-center gap-3 px-8 py-4 bg-cyan-500/25 hover:bg-cyan-500/40 border border-white text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-300/30 cursor-pointer"
                >
                  <Play size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Learn About Michael Simoneau</span>
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
