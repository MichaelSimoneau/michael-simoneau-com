import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useMediaAnalytics } from '../../../analytics/useMediaAnalytics';
import { APP_MEDIA_PLAY_INTENT_EVENT } from '../../../ui/players/mediaEvents';
import { useProfileFlowDispatch, useProfileFlowState } from '../flow';
import { useWindowDimensions } from 'react-native';
import { InlineMediaConsentPrompt, useMediaConsentGate } from '../../../ui/players';

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
  pauseVideo?: () => void;
  mute?: () => void;
  unMute?: () => void;
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

const STANDARD_VIDEO_ID = 'hWs6-09_Y0g';
const HANDOFF_PLAYLIST_ID = 'PLgqAhNtHkRy8PiSUfWBu1Z4KhPuwuEVwj';
const LOCAL_FALLBACK_VIDEO_SRC = '/videos/Michael-Simoneau-present--The-Human-Dollar.mp4';
const PREEND_TRIGGER_SECONDS = 1;
const PREEND_POLL_INTERVAL_MS = 200;
const VIDEO_HERO_THIRD_CONTEXT_EVENT = 'videohero:third-context-ready';
const VIDEO_HERO_MEDIA_SOURCE = 'video-hero';
type PlaybackPhase = 'primary' | 'playlist';
type VideoHeroStartMode = 'standard' | 'playlist';

/**
 * Full-screen hero section featuring the Zeroth Theory YouTube video.
 * Shows a static thumbnail until the user clicks "Watch Now", then loads the
 * iframe with autoplay, controls, and captions.
 */
export const VideoHeroSection: React.FC = () => {
  const { trackMediaEvent } = useMediaAnalytics();
  const { isGateVisible, requestConsentAwarePlay, acceptAndResume } = useMediaConsentGate({
    source: 'video-hero',
  });
  const flowDispatch = useProfileFlowDispatch();
  const flowState = useProfileFlowState();
  const [isWatching, setIsWatching] = useState(false);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);
  const [isYouTubeApiFailed, setIsYouTubeApiFailed] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [activeVideoSource, setActiveVideoSource] = useState<'youtube' | 'local'>('youtube');
  const [isDelayOverlayVisible, setIsDelayOverlayVisible] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [playerMountNonce, setPlayerMountNonce] = useState(0);
  const playerElementRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const handoffTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoffCountdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preEndPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAutoPlayRequestRef = useRef(false);
  const hasInitialLoadSettledRef = useRef(false);
  const previousPlayerStateRef = useRef<number | null>(null);
  const startedPlaybackKeyRef = useRef<string | null>(null);
  const awaitingPostHandoffPlaybackRef = useRef(false);
  const hasPreEndTriggeredForPhaseRef = useRef(false);
  const playbackPhaseRef = useRef<PlaybackPhase>('primary');
  const startModeRef = useRef<VideoHeroStartMode>('standard');
  const hasThirdContextSignalEmittedRef = useRef(false);

  const resetPlayerInstance = useCallback(() => {
    playerRef.current?.destroy();
    playerRef.current = null;
    if (playerElementRef.current) {
      playerElementRef.current.innerHTML = '';
    }
    setIsPlayerReady(false);
    setPlayerMountNonce((previous) => previous + 1);
    previousPlayerStateRef.current = null;
    startedPlaybackKeyRef.current = null;
    hasPreEndTriggeredForPhaseRef.current = false;
    awaitingPostHandoffPlaybackRef.current = false;
    hasThirdContextSignalEmittedRef.current = false;
  }, []);

  const getCurrentVideoContext = useCallback(() => {
    if (playbackPhaseRef.current === 'primary') {
      return { phase: 'primary', videoId: STANDARD_VIDEO_ID };
    }
    return { phase: 'playlist', videoId: HANDOFF_PLAYLIST_ID };
  }, []);

  const resetDelayOverlay = useCallback(() => {
    setIsDelayOverlayVisible(false);
    setCountdownValue(null);
    flowDispatch({ type: 'VIDEO_HANDOFF_COUNTDOWN_UPDATED', countdown: null, visible: false });
  }, [flowDispatch]);

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
    flowDispatch({ type: 'VIDEO_PHASE_CHANGED', phase: 'primary' });

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
  }, [flowDispatch]);

  const startInitialAutoplaySequence = useCallback(() => {
    startedPlaybackKeyRef.current = null;
    return startStandardVideo();
  }, [startStandardVideo]);

  const startPlaylistFromFirstItem = useCallback(() => {
    const player = playerRef.current;
    if (!player) return false;
    playbackPhaseRef.current = 'playlist';
    flowDispatch({ type: 'VIDEO_PHASE_CHANGED', phase: 'playlist' });

    if (typeof player.loadPlaylist === 'function') {
      player.loadPlaylist({
        listType: 'playlist',
        list: HANDOFF_PLAYLIST_ID,
        startSeconds: 0,
      });
      hasPreEndTriggeredForPhaseRef.current = false;
      hasThirdContextSignalEmittedRef.current = false;
      return true;
    }

    return false;
  }, [flowDispatch]);

  const startPlaybackForCurrentMode = useCallback(() => {
    if (startModeRef.current === 'playlist') {
      return startPlaylistFromFirstItem();
    }
    return startInitialAutoplaySequence();
  }, [startInitialAutoplaySequence, startPlaylistFromFirstItem]);

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
  }, [clearHandoffTimeout, getCurrentVideoContext, resetDelayOverlay, trackMediaEvent]);

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
      if (!player) {
        return;
      }
      if (playbackPhaseRef.current === 'playlist') {
        const playlistCurrentTime = player.getCurrentTime?.();
        if (
          !hasThirdContextSignalEmittedRef.current &&
          typeof playlistCurrentTime === 'number' &&
          playlistCurrentTime >= 10
        ) {
          hasThirdContextSignalEmittedRef.current = true;
          window.dispatchEvent(new CustomEvent(VIDEO_HERO_THIRD_CONTEXT_EVENT));
        }
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
      }
    };

    preEndPollIntervalRef.current = setInterval(pollForPreEnd, PREEND_POLL_INTERVAL_MS);
    return () => {
      if (preEndPollIntervalRef.current !== null) {
        clearInterval(preEndPollIntervalRef.current);
        preEndPollIntervalRef.current = null;
      }
    };
  }, [isWatching, isPlayerReady]);

  useEffect(() => {
    const settleId = setTimeout(() => {
      hasInitialLoadSettledRef.current = true;
    }, 0);
    return () => clearTimeout(settleId);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ytWindow = window as YouTubeWindow;
    if (ytWindow.YT?.Player) {
      setIsYouTubeApiFailed(false);
      setIsYouTubeApiReady(true);
      flowDispatch({ type: 'VIDEO_API_READY' });
      return;
    }

    let isCancelled = false;
    const previousReadyHandler = ytWindow.onYouTubeIframeAPIReady;
    const handleYouTubeReady = () => {
      previousReadyHandler?.();
      if (!isCancelled) {
        setIsYouTubeApiFailed(false);
        setIsYouTubeApiReady(true);
        flowDispatch({ type: 'VIDEO_API_READY' });
      }
    };

    ytWindow.onYouTubeIframeAPIReady = handleYouTubeReady;

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => {
        if (!isCancelled) {
          setIsYouTubeApiFailed(true);
          setActiveVideoSource('local');
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (ytWindow.onYouTubeIframeAPIReady === handleYouTubeReady) {
        ytWindow.onYouTubeIframeAPIReady = previousReadyHandler;
      }
    };
  }, [flowDispatch]);

  useEffect(() => {
    if (!isWatching || !isYouTubeApiReady || !playerElementRef.current || playerRef.current) {
      return;
    }

    const ytWindow = window as YouTubeWindow;
    const yt = ytWindow.YT;
    if (!yt) {
      setActiveVideoSource('local');
      return;
    }

    setIsPlayerReady(false);
    playbackPhaseRef.current = 'primary';
    hasPreEndTriggeredForPhaseRef.current = false;
    playerRef.current = new yt.Player(playerElementRef.current, {
      videoId: STANDARD_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        cc_load_policy: 1,
        cc_lang_pref: 'en',
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          setIsPlayerReady(true);
          flowDispatch({ type: 'VIDEO_PLAYER_READY' });
        },
        onStateChange: handlePlayerStateChange,
      },
    });
  }, [isWatching, isYouTubeApiReady, handlePlayerStateChange, flowDispatch]);

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
    const handleGlobalMediaPlayIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: string }>;
      if (customEvent.detail?.source === VIDEO_HERO_MEDIA_SOURCE) {
        return;
      }
      playerRef.current?.pauseVideo?.();
      clearHandoffTimeout();
    };

    window.addEventListener(APP_MEDIA_PLAY_INTENT_EVENT, handleGlobalMediaPlayIntent);
    return () => {
      window.removeEventListener(APP_MEDIA_PLAY_INTENT_EVENT, handleGlobalMediaPlayIntent);
    };
  }, [clearHandoffTimeout]);

  useEffect(() => {
    return () => {
      clearHandoffTimeout();
      flowDispatch({ type: 'RELOAD_TIMER_CLEARED' });
      resetPlayerInstance();
      flowDispatch({ type: 'VIDEO_HIDDEN' });
      playbackPhaseRef.current = 'primary';
      hasPreEndTriggeredForPhaseRef.current = false;
      previousPlayerStateRef.current = null;
      startedPlaybackKeyRef.current = null;
    };
  }, [clearHandoffTimeout, resetPlayerInstance, flowDispatch]);

  const handleLearnZerothTheoryClick = useCallback(() => {
    requestConsentAwarePlay(() => {
      flowDispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'standard' });
      startModeRef.current = 'standard';
      setIsYouTubeApiFailed(false);
      setActiveVideoSource('youtube');
      pendingAutoPlayRequestRef.current = false;
      setIsWatching(true);
    });
  }, [flowDispatch, requestConsentAwarePlay]);

  const handleLearnMichaelClick = useCallback(() => {
    requestConsentAwarePlay(() => {
      flowDispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'playlist' });
      startModeRef.current = 'playlist';
      setIsYouTubeApiFailed(false);
      setActiveVideoSource('youtube');
      clearHandoffTimeout();
      if (!isWatching || !isPlayerReady) {
        pendingAutoPlayRequestRef.current = true;
        setIsWatching(true);
        return;
      }
      startPlaybackForCurrentMode();
    });
  }, [clearHandoffTimeout, flowDispatch, isPlayerReady, isWatching, requestConsentAwarePlay, startPlaybackForCurrentMode]);

  useEffect(() => {
    if (flowState.deepLink.machine !== 'resolved') {
      return;
    }
    const deepLinkIntent = flowState.deepLink.intent;
    if (!deepLinkIntent || deepLinkIntent.target !== 'videos' || deepLinkIntent.consume !== true) {
      return;
    }

    setIsWatching(true);
    setIsYouTubeApiFailed(false);
    setActiveVideoSource('youtube');
    flowDispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'standard' });

    if (flowState.deepLink.autoplayAllowed) {
      startModeRef.current = 'standard';
      if (!isWatching || !isPlayerReady) {
        pendingAutoPlayRequestRef.current = true;
      } else {
        startPlaybackForCurrentMode();
      }
    } else {
      pendingAutoPlayRequestRef.current = false;
    }

    flowDispatch({ type: 'DEEPLINK_INTENT_CONSUMED' });
  }, [
    flowDispatch,
    flowState.deepLink.autoplayAllowed,
    flowState.deepLink.intent,
    flowState.deepLink.machine,
    isPlayerReady,
    isWatching,
    startPlaybackForCurrentMode,
  ]);

  useEffect(() => {
    if (!isWatching || startModeRef.current !== 'standard' || activeVideoSource === 'local') {
      return;
    }
    if (isYouTubeApiFailed) {
      setActiveVideoSource('local');
      return;
    }
    if (isYouTubeApiReady || isPlayerReady) {
      return;
    }
    const fallbackTimer = setTimeout(() => {
      if (!isYouTubeApiReady && !isPlayerReady) {
        setActiveVideoSource('local');
      }
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [activeVideoSource, isPlayerReady, isWatching, isYouTubeApiFailed, isYouTubeApiReady]);

  const { width, height } = useWindowDimensions();

  const thumbnailUrl = `https://img.youtube.com/vi/${STANDARD_VIDEO_ID}/maxresdefault.jpg`;

  return (
    <section
      className={`relative w-full overflow-hidden py-16 ${width > height ? 'min-h-screen' : 'min-h-auto'}`}
      style={{ minHeight: width > height ? '100vh' : '50vh' }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        {isWatching ? (
          <div className="relative w-full" style={{ aspectRatio: '16 / 9', maxHeight: '100%' }}>
            {activeVideoSource === 'youtube' ? (
              <div
                key={playerMountNonce}
                ref={playerElementRef}
                title="Zeroth Theory and The Ricochet Theorem video player"
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={LOCAL_FALLBACK_VIDEO_SRC}
                className="w-full h-full"
                controls
                autoPlay
                preload="metadata"
                playsInline
              />
            )}

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
              className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto"
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
              <div className="mt-4 w-full max-w-xl">
                <InlineMediaConsentPrompt visible={isGateVisible} onAgree={acceptAndResume} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
