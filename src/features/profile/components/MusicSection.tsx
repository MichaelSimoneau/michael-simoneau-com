import React, { useCallback, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { musicPlaylist } from "../../../data/playlists";
import { useProfileFlowDispatch, useProfileFlowState } from "../flow";
import { PlaylistAudioPlayer } from "../../../ui/players";
import { ChevronDown } from "lucide-react";
import { useWindowDimensions } from "react-native";

const SOUNDON_BIO_URL = "https://www.soundon.global/bio/immikecrane";
const IFRAME_LOAD_TIMEOUT_MS = 8000;

export const MusicSection: React.FC = () => {
  const dispatch = useProfileFlowDispatch();
  const { music, override } = useProfileFlowState();
  const { height } = useWindowDimensions();
  const musicLoaded = React.useMemo(
    () =>
      music.hasLoaded ||
      (music.machine === "ready" && music.iframeHeight) ||
      (music.machine !== "failed" && music.machine !== "loading"),
    [music.machine, music.hasLoaded, music.iframeHeight],
  );
  const iframeHeight = React.useMemo(
    () => Math.min(music.iframeHeight, height * 1.55),
    [music.iframeHeight, height],
  );
  useEffect(() => {
    dispatch({ type: "MUSIC_IFRAME_LOADING" });
    const handleMessage = (event: Event) => {
      if (event.target instanceof HTMLIFrameElement) {
        dispatch({
          type: "MUSIC_IFRAME_HEIGHT_UPDATED",
          height: event.target.contentWindow?.document.body.clientHeight ?? 0,
        });
      }
    };
    window.addEventListener("DOMContentLoaded", handleMessage as EventListener);
    return () =>
      window.removeEventListener(
        "DOMContentLoaded",
        handleMessage as EventListener,
      );
  }, [dispatch]);

  useEffect(() => {
    if (music.hasLoaded || override.value.music.iframe === "ready") {
      return;
    }

    const timeoutId = setTimeout(() => {
      dispatch({ type: "MUSIC_IFRAME_FAILED" });
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, [dispatch, music.hasLoaded, override.value.music.iframe]);

  useEffect(() => {
    if (override.value.music.iframe === "failed") {
      dispatch({ type: "MUSIC_IFRAME_FAILED" });
      return;
    }
    if (override.value.music.iframe === "ready") {
      dispatch({ type: "MUSIC_IFRAME_READY" });
    }
  }, [dispatch, override.value.music.iframe]);

  const handleIframeLoad = useCallback(() => {
    dispatch({ type: "MUSIC_IFRAME_READY" });
  }, [dispatch]);

  const iframeContainerStyle: CSSProperties = {
    width: "100vw",
    overflow: "hidden",
  };

  const iframeStyle: CSSProperties = React.useMemo(
    () => ({
      width: "100vw",
      height: `${iframeHeight}px`,
      border: "none",
      overflow: "hidden",
      display: "block",
    }),
    [iframeHeight],
  );

  return (
    <div id="music" className="relative p-0 m-0">
      <div className="relative z-10 overflow-hidden bg-gradient-to-b from-black/65 via-gray-950/75 to-transparent px-4 pt-16 md:pt-24 pb-10">
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

          <div className="text-left max-w-4xl mx-auto">
            <PlaylistAudioPlayer tracks={musicPlaylist} className="max-w-4xl" />
          </div>
          {musicLoaded && (
            <div className="text-left max-w-4xl mx-auto mt-8 text-center transition-all duration-300 ease-in-out">
              <motion.p
                className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mt-8 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
              >
                Latest album:{" "}
                <span className="text-cyan-300 font-semibold">Horizons</span> -
                released January 16, 2026.
              </motion.p>
              <ChevronDown className="w-6 h-6 mx-auto text-cyan-400" />
            </div>
          )}
        </motion.div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-black/20 to-black/45" />
      </div>
      <div style={musicLoaded ? iframeContainerStyle : { display: "none" }}>
        <motion.iframe
          className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto m-0 p-0 transition-all duration-300 ease-in-out"
          initial={{ height: 0 }}
          whileInView={{ height: iframeHeight }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          src={SOUNDON_BIO_URL}
          title="Mike Crane on SoundOn"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          scrolling="no"
          style={iframeStyle}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};
