import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AudioPlayer } from '../../../ui/players/AudioPlayer';

export const CryptoFabricHero: React.FC = () => {
  return (
    <motion.section 
      id="cryptofabric"
      className="w-full flex flex-col items-center justify-center text-white px-4 py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex-none"
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
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900/30 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full py-8 flex flex-col">
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
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-2xl">
              <img
                src="/crypto-fabric.jpeg"
                alt="Crypto Fabric Logo"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-cyan-400">
              Crypto Fabric
            </span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-cyan-300 font-semibold mb-4">
            Profitability-First Automation Platform
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Built by Michael Simoneau and supported by EtherHive, LLC
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
            Deploy revenue-generating crypto services – Ethereum staking, automated trading, 
            and decentralized infrastructure – with zero configuration. The AI does it all for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full mb-8"
        >
          <AudioPlayer src="/The_AI_Built_for_Deterministic_Crypto.mp3" title="The AI Built for Deterministic Crypto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Link
            to="/cryptofabric"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Explore Crypto Fabric
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/blog/crypto-fabric-business-plan"
            className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
          >
            Read Business Plan
            <Sparkles size={20} className="ml-2" />
          </Link>
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
            <h3 className="text-xl font-bold mb-3 text-cyan-400">Zero Configuration</h3>
            <p className="text-gray-300 text-sm">
              Sign in with Google, click "Setup," and the system begins generating income. No technical expertise required.
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-800/30">
            <h3 className="text-xl font-bold mb-3 text-cyan-400">Profit-Sharing Model</h3>
            <p className="text-gray-300 text-sm">
              Pay nothing upfront. EtherHive only earns a 10% share when you're profitable, aligning our success with yours.
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-800/30">
            <h3 className="text-xl font-bold mb-3 text-cyan-400">Solar-Powered</h3>
            <p className="text-gray-300 text-sm">
              100% solar-powered infrastructure dramatically lowers costs and carbon footprint, making it ESG-positive.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

