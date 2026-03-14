import React from "react";
import { motion } from "framer-motion";
import { Link } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { NebulaStormBackground } from "../../../backgrounds/NebulaStormBackground";

export const ZeroHero: React.FC = () => {
  return (
    <motion.section
      id="zero"
      className="w-full flex flex-col items-center justify-center text-white px-4 py-16 md:py-24 relative overflow-hidden flex-none"
      style={{
        minHeight: "100vh",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <NebulaStormBackground className="absolute w-full h-full" />
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
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-2xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-white font-mono slashed-zero">
                ZER0
              </span>
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-cyan-400">ZEROTH THEORY</span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-cyan-300 font-semibold mb-4">
            The Numerical Trinity
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            All That Was, All That Is, All That Ever Will Be
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
            A quantum-philosophical exploration of Zero, Energy, and the Nature
            of Existence. The living truth of Zero revealed through principles
            and chapters.
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
            href="/zero"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Explore&nbsp;The&nbsp;Theory
            <ArrowRight
              size={20}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <a
            href="https://ZerothTheory.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
          >
            ZerothTheory.com
            <Sparkles size={20} className="ml-2" />
          </a>
          <a
            href="https://0thth.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
          >
            0THTH.com
            <Sparkles size={20} className="ml-2" />
          </a>
        </motion.div>

        {/* Core Tenets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col gap-8 mt-12 max-w-4xl mx-auto w-full"
        >
          {[
            {
              title: "The Duality Delusion",
              body: "Traditional binary logic is a logic-gate failure that induces terminal entropy. Existence is not a sequence of switches; it is a Tensor Processor for Identity.",
            },
            {
              title: "The Trinity of Nothingness",
              body: "The Null foundation is three tensor zeros: Negative Zero (-0), Positive Zero (+0), and Unsigned Zero (0).",
            },
            {
              title: "The 5-State Unified Field",
              body: "Cubic topology requires five states: -1, -0, 0, +0, +1. Action is deterministic convergence, not negotiated truth.",
            },
          ].map((tenet, i) => (
            <motion.div
              key={tenet.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-800/30"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-400">
                {tenet.title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {tenet.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
