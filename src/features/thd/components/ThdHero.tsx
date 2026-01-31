import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * ThdHero – Main-page hero section for The Human Dollar (THD).
 * Presents THD as the Anti-Crypto, Attention Economy, and embodiment of the HashWeb.
 * Links to the full /thd page and thehumandollar.com.
 */
export const ThdHero: React.FC = () => {
  return (
    <motion.section
      id="thd"
      className="w-full flex flex-col text-white px-4 py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-amber-900/20 to-gray-900 flex-none"
      style={{
        minHeight: '100vh',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Effects – amber/gold for human / attention */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-amber-900/30 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full py-8 flex flex-col flex-grow min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 w-full"
        >
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-white">THD</span>
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
              The Human Dollar
            </span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-amber-300 font-semibold mb-4">
            The Anti-Crypto · Attention Economy
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Metabolic money: if you don&apos;t observe it, it decays. Value flows from human attention — observation is oxygen, usage is mining.
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
            The embodiment of the HashWeb. One THD is always redeemable for at least one USDC; the system kills the bubble but protects the asset. Detailed in Metabolic Money and the Digital Organism.
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
            to="/thd"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
          >
            Explore THD
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://thehumandollar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
          >
            Visit TheHumanDollar.com
            <Sparkles size={20} className="ml-2" />
          </a>
        </motion.div>

        {/* Key concepts grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <Link
            to="/thd"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-800/30 hover:border-amber-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">Observation is oxygen</h3>
            <p className="text-gray-300 text-sm">
              You mine value by using the data. If the world stops looking, value decays back to potential.
            </p>
          </Link>
          <Link
            to="/thd"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-800/30 hover:border-amber-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">HashWeb</h3>
            <p className="text-gray-300 text-sm">
              Metabolic money and the digital organism — the Human Dollar is the embodiment of the HashWeb.
            </p>
          </Link>
          <Link
            to="/thd"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-800/30 hover:border-amber-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">Redemption floor</h3>
            <p className="text-gray-300 text-sm">
              One THD always redeemable for at least one USDC. Birth, life, completion — not decay to zero.
            </p>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};
