import React, { useCallback, useEffect, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { musicPlaylist } from '../../../data/playlists';
import { useProfileFlowDispatch, useProfileFlowState } from '../flow';
import { PlaylistAudioPlayer } from '../../../ui/players';

const SOUNDON_BIO_URL = 'https://www.soundon.global/bio/immikecrane';
const IFRAME_LOAD_TIMEOUT_MS = 8000;

export const MusicSection: React.FC = () => {
  const dispatch = useProfileFlowDispatch();
  const { music, override } = useProfileFlowState();

  useEffect(() => {
    dispatch({ type: 'MUSIC_IFRAME_LOADING' });
    const handleMessage = (event: MessageEvent) => {
      if (
        typeof event.data === 'object' &&
        event.data !== null &&
        typeof event.data.height === 'number' &&
        event.data.height > 0
      ) {
        dispatch({ type: 'MUSIC_IFRAME_HEIGHT_UPDATED', height: event.data.height });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch]);

  useEffect(() => {
    if (music.hasLoaded || override.value.music.iframe === 'ready') {
      return;
    }

    const timeoutId = setTimeout(() => {
      dispatch({ type: 'MUSIC_IFRAME_FAILED' });
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, [dispatch, music.hasLoaded, override.value.music.iframe]);

  useEffect(() => {
    if (override.value.music.iframe === 'failed') {
      dispatch({ type: 'MUSIC_IFRAME_FAILED' });
      return;
    }
    if (override.value.music.iframe === 'ready') {
      dispatch({ type: 'MUSIC_IFRAME_READY' });
    }
  }, [dispatch, override.value.music.iframe]);

  const handleIframeLoad = useCallback(() => {
    dispatch({ type: 'MUSIC_IFRAME_READY' });
  }, [dispatch]);

  const iframeContainerStyle: CSSProperties = {
    width: '100vw',
    maxHeight: '150vh',
    overflow: 'hidden',
  };

  const iframeStyle: CSSProperties = {
    width: '100vw',
    height: `${music.iframeHeight}px`,
    border: 'none',
    overflow: 'hidden',
    display: 'block',
  };

  return (
    <div id="music" className="relative">
      <div className="relative z-10 overflow-hidden bg-gradient-to-b from-black/65 via-gray-950/75 to-transparent px-4 pt-16 md:pt-24 pb-10">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/60 to-cyan-950/40 opacity-80" />
          <div className="absolute top-8 left-1/3 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-8 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="container mx-auto max-w-5xl text-center"
        >
          <p className="text-sm sm:text-base uppercase tracking-[0.28em] text-cyan-300/85 mb-4">
            Music
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Mike <span className="text-cyan-400">Crane</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-3">
            A few unreleased tracks, available exclusively on this site.
          </p>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Latest album: <span className="text-cyan-300 font-semibold">Horizons</span> - released January 16, 2026.
          </p>
          <div className="mb-10 max-w-4xl mx-auto">
            <a
              href="https://www.pandora.com/artist/mike-crane/horizons/ALVZz4373xPh9nP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={'"Horizons" by Mike Crane - Listen Now on Pandora'}
              className="group flex w-full flex-col items-center gap-4 rounded-2xl border border-white/20 bg-purple-800/20 px-6 py-4 text-white shadow-2xl shadow-purple-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-purple-700/20 md:flex-row md:items-center md:justify-center md:gap-12"
            >
              <span className="text-center text-sm sm:text-base font-semibold uppercase tracking-[0.16em] text-purple-100">
                Listen Now on Pandora
              </span>
              <span className="flex items-center justify-center gap-4 pt-4 pb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-700 shadow-lg shadow-black/30">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
                    <path d="M12 2.5a9.5 9.5 0 1 0 0 19h3.2a4.4 4.4 0 0 0 0-8.8H12a2 2 0 1 1 0-4h5.5a1.5 1.5 0 0 0 0-3H12z" />
                  </svg>
                </span>
                <span className="text-left">
                  <span className="block text-xs uppercase tracking-[0.18em] text-blue-100/90">Pandora</span>
                  <span className="block text-base sm:text-lg font-bold">
                    &quot;Horizons&quot; by Mike Crane
                  </span>
                </span>
              </span>
            </a>
          </div>

          <div className="text-left max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 text-center">
              Unreleased Tracks
            </p>
            <PlaylistAudioPlayer tracks={musicPlaylist} className="max-w-4xl" />
          </div>
        </motion.div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-black/20 to-black/45" />
      </div>
      <div style={iframeContainerStyle}>
        {music.machine === 'failed' ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-900/60 text-white">
            <p className="text-lg text-gray-300 mb-4">
              Michael&apos;s Music Preview failed to load, view on SoundOn:
            </p>
            <a
              href={SOUNDON_BIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Michael Simoneau is &apos;Mike Crane&apos;
            </a>
          </div>
        ) : (
          <iframe
            src={SOUNDON_BIO_URL}
            title="Mike Crane on SoundOn"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            scrolling="no"
            style={iframeStyle}
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
};

