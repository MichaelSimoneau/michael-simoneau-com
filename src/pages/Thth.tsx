import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";

export const Thth: React.FC = () => {
  return (
    <>
      <Seo
        title="THTH | The First Token with Intrinsic Value - Zeroth Economy"
        description="THTH is the first token with intrinsic value, built on Zeroth, a living cryptographic economy where value emerges from positional truth, not speculation. Every hash carries its price. Every block remembers its worth."
        canonicalUrl="https://www.michaelsimoneau.com/thth"
        keywords={[
          "THTH",
          "THTH token",
          "intrinsic value token",
          "Zeroth",
          "Zeroth economy",
          "cryptographic economy",
          "positional truth",
          "blockchain intrinsic value",
          "hash value",
          "block worth",
          "cryptocurrency",
          "token economics",
          "value emergence",
          "non-speculative token",
        ]}
        image="https://www.michaelsimoneau.com/thth.jpeg"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'THTH',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web, Blockchain',
            description: 'THTH is the first token with intrinsic value, built on Zeroth, a living cryptographic economy where value emerges from positional truth, not speculation. Every hash carries its price. Every block remembers its worth.',
            url: 'https://www.michaelsimoneau.com/thth',
            image: 'https://www.michaelsimoneau.com/thth.jpeg',
            publisher: {
              '@type': 'Organization',
              name: 'Zeroth',
              url: 'https://0thth.com/',
            },
            featureList: [
              'Intrinsic Value Token',
              'Zeroth Economy Integration',
              'Dashboard Tracking',
              'Mint Functionality',
              'Whitepaper Documentation',
              '3D Visualization',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.michaelsimoneau.com/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'THTH',
                item: 'https://www.michaelsimoneau.com/thth'
              }
            ]
          },
        ]}
      />
      <AnimatedBackground />
      <MainNav />
      <motion.div
        className="min-h-screen text-white p-8 relative z-10 pt-24 md:pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header Section with Logo */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start mb-12"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:mr-8 mb-6 md:mb-0 flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-purple-400 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-6xl md:text-7xl font-bold text-white">THTH</span>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                THTH
              </h1>
              <p className="text-2xl text-purple-300 mb-2">
                The First Token with Intrinsic Value
              </p>
              <p className="text-xl text-gray-400 mb-4">
                Built on Zeroth
              </p>
              <p className="text-lg text-gray-300 max-w-3xl">
                A living cryptographic economy where value emerges from positional truth, not speculation. 
                Every hash carries its price. Every block remembers its worth.
              </p>
            </div>
          </motion.div>

          {/* Core Value Proposition */}
          <motion.section
            className="mb-12 rounded-xl bg-gray-900/50 p-8 border border-purple-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Core Value Proposition
            </h2>
            <p className="text-xl text-gray-200 mb-4 italic">
              "The first token where value is intrinsic, not speculative."
            </p>
            <p className="text-gray-300 mb-4">
              Unlike traditional cryptocurrencies that derive value from market speculation, THTH is built on Zeroth, 
              a cryptographic economy where value emerges from positional truth. Every hash in the system carries its 
              own price, and every block remembers its worth.
            </p>
            <p className="text-gray-300">
              This fundamental shift means THTH has intrinsic value from the moment it's created, 
              based on the computational and cryptographic work that goes into each block and hash.
            </p>
          </motion.section>

          {/* Key Features */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Explore THTH
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Dashboard
                </h3>
                <p className="text-gray-300 mb-4">
                  Track the live economy of Zeroth. Monitor hash values, block worth, and the intrinsic value 
                  of THTH in real-time.
                </p>
                <a
                  href="https://0thth.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View Dashboard →
                </a>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Mint THTH
                </h3>
                <p className="text-gray-300 mb-4">
                  Mint your first THTH tokens and become part of the Zeroth cryptographic economy. 
                  Each token carries intrinsic value from the moment it's created.
                </p>
                <a
                  href="https://0thth.com/mint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Mint THTH →
                </a>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Whitepaper
                </h3>
                <p className="text-gray-300 mb-4">
                  Deep dive into the technical architecture and economic model of Zeroth and THTH. 
                  Understand how intrinsic value emerges from positional truth.
                </p>
                <a
                  href="https://0thth.com/whitepapers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Read Whitepaper →
                </a>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  3D Visualization
                </h3>
                <p className="text-gray-300 mb-4">
                  Explore the 3D visualization of the Zeroth economy. See value emerge in real-time as 
                  blocks are created and hashes are computed.
                </p>
                <a
                  href="https://ZerothTheory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Explore Visualization →
                </a>
              </div>
            </div>
          </motion.section>

          {/* Zeroth Economy Explanation */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              The Zeroth Economy
            </h2>
            <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
              <p className="text-gray-300 mb-4">
                Zeroth is a living cryptographic economy where value emerges from positional truth, not speculation. 
                In this system:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Every hash carries its price</strong> - Computational work has inherent value</li>
                <li><strong>Every block remembers its worth</strong> - Historical value is preserved and tracked</li>
                <li><strong>Value emerges from truth</strong> - Positional truth creates intrinsic value</li>
                <li><strong>No speculation required</strong> - Value exists independently of market sentiment</li>
              </ul>
              <p className="text-gray-300">
                THTH tokens are the native representation of this economy, carrying intrinsic value from the moment 
                they're minted based on the cryptographic and computational work that goes into the Zeroth system.
              </p>
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-purple-800/50">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Positional Truth
                </h3>
                <p className="text-gray-300">
                  Value emerges from the position and truth of each hash and block in the Zeroth economy. 
                  This creates intrinsic value that doesn't depend on market speculation.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-purple-800/50">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Hash Pricing
                </h3>
                <p className="text-gray-300">
                  Every hash in the system carries its own price, determined by the computational work 
                  and cryptographic properties that went into creating it.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-purple-800/50">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  Block Memory
                </h3>
                <p className="text-gray-300">
                  Every block remembers its worth, preserving the value history of the Zeroth economy 
                  and ensuring intrinsic value is maintained over time.
                </p>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="rounded-xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 border border-purple-800/50">
              <h2 className="text-3xl font-bold mb-4 text-purple-400">
                Ready to Explore THTH?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Visit the Zeroth dashboard to see the economy in action, mint your first THTH tokens, 
                or explore the 3D visualization.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://0thth.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors"
                >
                  View Dashboard
                </a>
                <a
                  href="https://0thth.com/mint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  Mint THTH
                </a>
                <a
                  href="https://ZerothTheory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  Explore Visualization
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </>
  );
};
