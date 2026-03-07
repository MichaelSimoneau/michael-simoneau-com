import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * Full-screen hero section featuring the Zeroth Theory YouTube video.
 * Shows a static thumbnail until the user clicks "Watch Now", then loads the
 * iframe with autoplay, controls, and captions.
 */
export const VideoHeroSection: React.FC = () => {
  const videoId = '_Y1GTUrtWjE';
  const [isWatching, setIsWatching] = useState(false);

  const activeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&playsinline=1&cc_load_policy=1&cc_lang_pref=en`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        {isWatching ? (
          <iframe
            src={activeUrl}
            title="Zeroth Theory and The Ricochet Theorem"
            className="w-full border-0"
            style={{ aspectRatio: '16 / 9', maxHeight: '100%' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
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

              <motion.button
                type="button"
                onClick={() => setIsWatching(true)}
                className="mt-10 group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Play size={22} className="group-hover:scale-110 transition-transform" />
                Watch Now
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
