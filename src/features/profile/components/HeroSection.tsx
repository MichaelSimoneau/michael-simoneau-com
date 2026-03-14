import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaylistAudioPlayer } from "../../../ui/players/PlaylistAudioPlayer";
import type { BlogData } from "../../../data/blogData";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cleanPlaylist } from "../../../data/playlists";
import { useProfileFlowDispatch, useProfileFlowState } from "../flow";

interface HeroSectionProps {
  featuredBlog?: BlogData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredBlog }) => {
  const dispatch = useProfileFlowDispatch();
  const { override } = useProfileFlowState();

  useEffect(() => {
    if (override.value.playlist.track !== undefined) {
      dispatch({
        type: "PLAYLIST_TRACK_CHANGED",
        trackIndex: Math.max(0, override.value.playlist.track - 1),
      });
    }
    if (override.value.playlist.autoplay) {
      dispatch({ type: "PLAYLIST_PLAYING" });
    }
  }, [
    dispatch,
    override.value.playlist.autoplay,
    override.value.playlist.track,
  ]);

  return (
    <section
      id="new-hero"
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 pt-16 pb-24 relative overflow-hidden"
    >
      {/* Background Styling - more abstract and futuristic */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900/30 opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          Michael Simoneau
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2">
          <span className="font-bold">Saving </span>the<span className="font-bold"> US Dollar...</span>
          <i> by <span className="font-bold">Saving the World</span>!</i>
        </h2>
        <div className="w-full max-w-3xl mx-auto mt-4 mb-8 px-1 sm:px-0">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-5 sm:p-6 text-center">
            <div className="mx-auto mb-4 w-full max-w-4xl px-1 sm:px-2 grid grid-cols-4 gap-y-0.5 gap-x-1 sm:gap-x-2 items-center">
              <div className="w-full">
                <a
                  href="https://TheHumanDollar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-amber-300 decoration-amber-300/70 underline-offset-2 transition-colors hover:text-amber-200 hover:underline focus:outline-none focus:ring-1 focus:ring-amber-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    The Human Dollar
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full">
                <a
                  href="https://HashWeb.Network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-cyan-300 decoration-cyan-300/70 underline-offset-2 transition-colors hover:text-cyan-200 hover:underline focus:outline-none focus:ring-1 focus:ring-cyan-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    HashWeb.Network
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full">
                <a
                  href="https://ZerothTheory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-sky-300 decoration-sky-300/70 underline-offset-2 transition-colors hover:text-sky-200 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    Zeroth Theory
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full">
                <a
                  href="https://CryptoFabric.Cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-fuchsia-300 decoration-fuchsia-300/70 underline-offset-2 transition-colors hover:text-fuchsia-200 hover:underline focus:outline-none focus:ring-1 focus:ring-fuchsia-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    #CryptoFabric
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              THD is your employee. Put it to work and it pays you back for
              every $1 spent that grows to the $65,535 cap. Stagnation is a
              firing offense — idle capital enters early retirement. This is not
              speculation. This is Metabolic Reality.
            </p>
          </div>
        </div>
      </motion.div>

      {featuredBlog && (
        <motion.div
          className="w-full max-w-2xl mx-auto z-10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-amber-400 mb-3">
              {featuredBlog.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {featuredBlog.excerpt}
            </p>
            <Link
              to={`/blog/${featuredBlog.id}`}
              rel="noopener noreferrer"
              target="_self"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              Read the full essay {"\u2192"}
            </Link>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-2xl mx-auto z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PlaylistAudioPlayer
          tracks={cleanPlaylist}
          defaultPlaylistTitle="Learn About Michael Simoneau"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <ChevronDown size={32} className="text-gray-400" />
      </motion.div>
    </section>
  );
};
