import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NebulaStormBackground } from '../../../backgrounds/NebulaStormBackground';

export const ZeroHero: React.FC = () => {
  return (
    <motion.section 
      id="zero"
      className="w-full flex flex-col text-white px-4 py-16 md:py-24 relative overflow-hidden flex-none"
      style={{ 
        minHeight: '100vh',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0 -z-10">
        <NebulaStormBackground className="absolute w-full h-full" />
      </div>
      <div className="container mx-auto max-w-6xl relative z-10 w-full py-8 flex flex-col flex-grow min-h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8 w-full"
          >
            {/* Logo */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-2xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-white font-mono slashed-zero">ZER0</span>
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-500">
                ZEROTH THEORY
              </span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-cyan-300 font-semibold mb-4">
              The Numerical Trinity
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              All That Was, All That Is, All That Ever Will Be
            </p>
            <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
              A quantum-philosophical exploration of Zero, Energy, and the Nature of Existence. 
              The living truth of Zero revealed through principles and chapters.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link
              to="/zero"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Explore Zeroth Theory
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://0thth.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
            >
              Visit Zeroth Platform
              <Sparkles size={20} className="ml-2" />
            </a>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-800/30">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Philosophical Framework</h3>
              <p className="text-gray-300 text-sm">
                Explore the quantum-philosophical principles that define the nature of Zero, Energy, and Existence.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-800/30">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Living Truth</h3>
              <p className="text-gray-300 text-sm">
                Experience the living truth of Zero through interactive chapters and principles that reveal deeper understanding.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-800/30">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Numerical Trinity</h3>
              <p className="text-gray-300 text-sm">
                Discover the interconnected nature of Zero, Energy, and the fundamental principles of existence.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
  );
};
