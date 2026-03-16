import React from 'react';
import { motion } from 'framer-motion';

export const Testimonials: React.FC = () => {
  return (
    <motion.section 
      className="py-16 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-cyan-400">Testimonials</span>
          </h2>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gray-800/40 p-8 md:p-12 rounded-lg shadow-xl border border-cyan-800/30">
            <div className="flex justify-center mb-6">
              <span className="text-6xl text-cyan-400/30 font-serif leading-none">"</span>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-200 mb-8 italic text-center leading-relaxed">
              "Michael Simoneau has the ruth of Jobs and the smarts of Wozniak if he was on whatever Benjamin Franklin was smoking! #noruth"
            </blockquote>
            <div className="text-center">
              <p className="text-lg text-gray-300 mb-2">
                <span className="font-semibold text-cyan-400">David Rodriguez</span>
              </p>
              <p className="text-base text-gray-400">
                <a 
                  href="https://sentinellegal.us" 
                  target="_blank" 
                  rel="noopener"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 underline"
                >
                  SentinelLitigation.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

