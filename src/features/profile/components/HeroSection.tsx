import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaylistAudioPlayer } from "../../../ui/players/PlaylistAudioPlayer";
import type { BlogData } from "../../../data/blogData";
import { ChevronDown } from "lucide-react";
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
        type: 'PLAYLIST_TRACK_CHANGED',
        trackIndex: Math.max(0, override.value.playlist.track - 1),
      });
    }
    if (override.value.playlist.autoplay) {
      dispatch({ type: 'PLAYLIST_PLAYING' });
    }
  }, [dispatch, override.value.playlist.autoplay, override.value.playlist.track]);

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
        <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2">
          From Enterprise Architecture to The Human Dollar
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          THD is your employee. Put it to work and it pays you back for every $1
          spent that grows to the $65,535 cap. Stagnation is a firing offense — idle
          capital enters early retirement. This is not speculation. This is
          Metabolic Reality.
        </p>
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
        <PlaylistAudioPlayer tracks={cleanPlaylist} />
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
