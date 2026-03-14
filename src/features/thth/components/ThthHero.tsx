import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ThthHero: React.FC = () => {
  return (
    <motion.section 
      id="thth"
      className="w-full flex flex-col items-center justify-center text-white px-4 py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex-none"
      style={{ 
        minHeight: '100vh',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-purple-900/30 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full py-8 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 w-full"
        >
          {/* Logo placeholder - will use /thth.jpeg when available */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-400 shadow-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-white">THTH</span>
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-purple-400">
              THTH
            </span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-purple-300 font-semibold mb-4">
            The First Token with Intrinsic Value
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Built on Zeroth, a living cryptographic economy where value emerges from positional truth, not speculation.
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
            Every hash carries its price. Every block remembers its worth. 
            Experience the first token where value is intrinsic, not speculative.
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
            to="/thth"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            Explore THTH
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://0thth.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
          >
            Visit Dashboard
            <Sparkles size={20} className="ml-2" />
          </a>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid md:grid-cols-4 gap-6 mt-12"
        >
          <a
            href="https://0thth.com/dashboard"
            target="_blank"
            rel="noopener"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">Dashboard</h3>
            <p className="text-gray-300 text-sm">
              Track the live economy of Zeroth. Monitor hash values, block worth, and the intrinsic value of THTH.
            </p>
          </a>
          <a
            href="https://0thth.com/mint"
            target="_blank"
            rel="noopener"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">Mint</h3>
            <p className="text-gray-300 text-sm">
              Mint your first THTH tokens and become part of the Zeroth cryptographic economy.
            </p>
          </a>
          <a
            href="https://0thth.com/whitepapers"
            target="_blank"
            rel="noopener"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">Whitepaper</h3>
            <p className="text-gray-300 text-sm">
              Deep dive into the technical architecture and economic model of Zeroth and THTH.
            </p>
          </a>
          <a
            href="https://ZerothTheory.com"
            target="_blank"
            rel="noopener"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">Visualization</h3>
            <p className="text-gray-300 text-sm">
              Explore the 3D visualization of the Zeroth economy and see value emerge in real-time.
            </p>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};
