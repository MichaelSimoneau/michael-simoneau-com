import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";
import { AudioPlayer } from "../ui/players/AudioPlayer";
import { BUILDING_WEB_4_TRANSCRIPT } from "../features/thd/data/buildingWeb4Transcript";

export const Thd: React.FC = () => {
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  return (
    <>
      <Seo
        title="The Human Dollar (THD) | Anti-Crypto"
        description="The Human Dollar (THD) is money that works. Money is an employee — $327 for every $1 put to work at the 32,767 cap. Stagnation is a firing offense. 1 THD = 1 USDC floor. This is Metabolic Reality."
        canonicalUrl="https://www.michaelsimoneau.com/thd"
        keywords={[
          "The Human Dollar",
          "THD",
          "32767",
          "Genesis Dividend",
          "stagnation firing offense",
          "#WEB",
          "Anti-Crypto",
          "Building Web 4",
          "put it to work",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "The Human Dollar (THD)",
            description:
              "The Human Dollar (THD) is a revolutionary digital asset — the Anti-Crypto. It creates an Attention Economy and is the Currency of the Future.",
            url: "https://www.michaelsimoneau.com/thd",
            author: {
              "@type": "Organization",
              name: "The Human Dollar",
              url: "https://thehumandollar.com/",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.michaelsimoneau.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "The Human Dollar (THD)",
                item: "https://www.michaelsimoneau.com/thd",
              },
            ],
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
              <div className="relative max-w-sm md:max-w-md">
                {/* Per-coin radial glows */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 27% 50%, rgba(255,255,255,0.14) 0%, transparent 55%), ' +
                      'radial-gradient(circle at 73% 50%, rgba(255,255,255,0.14) 0%, transparent 55%)',
                    filter: 'blur(32px)',
                  }}
                />
                <img
                  src="/THD.png"
                  alt="The Human Dollar — front and back"
                  className="relative w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                The Human Dollar
              </h1>
              <p className="text-2xl text-amber-300 mb-2">
                The Human Dollar · Anti-Crypto
              </p>
              <p className="text-xl text-gray-400 mb-4">
                Currency of the Future
              </p>
              <p className="text-lg text-gray-300 max-w-3xl">
                Money is an employee. Put it to work and earn $327 for every $1 at the 32,767 cap. Stagnation is a firing offense — idle capital enters early retirement. Observation is oxygen. Usage is mining. The concept is detailed in Building Web 4 With Money That Lives.
              </p>
            </div>
          </motion.div>

          {/* Money That Lives – Audio + optional Transcript */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="text-center mb-6">
              <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-4">
                The Human Dollar is the Currency of the Future. The architecture is detailed in the audio below: <em>Building Web4 With Money That Lives</em>.
              </p>
            </div>
            <div className="flex justify-center mb-6">
              <AudioPlayer
                src="/Building_Web_4_With_Money_That_Lives.mp3"
                title="Building Web 4 With Money That Lives"
              />
            </div>
            {/* Collapsible Transcript – optional view */}
            <div className="rounded-xl bg-gray-900/50 border border-amber-800/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setTranscriptExpanded((e) => !e)}
                className="w-full flex items-center justify-between gap-2 px-6 py-4 text-left text-amber-400 font-semibold hover:bg-gray-800/50 transition-colors"
                aria-expanded={transcriptExpanded}
              >
                <span>Transcript</span>
                {transcriptExpanded ? (
                  <ChevronUp size={20} className="flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="flex-shrink-0" />
                )}
              </button>
              {transcriptExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-amber-800/30">
                  <div className="max-h-[60vh] overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4 pr-2">
                    {BUILDING_WEB_4_TRANSCRIPT.split(/\n\n+/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Core value: Metabolic money, Anti-Crypto, Attention Economy */}
          <motion.section
            className="mb-12 rounded-xl bg-gray-900/50 p-8 border border-amber-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-amber-400">
              Core Value
            </h2>
            <p className="text-xl text-gray-200 mb-4 italic">
              "Money is an employee. Put it to work."
            </p>
            <p className="text-gray-300 mb-4">
              THD is <strong className="text-amber-300">The Human Dollar</strong>. Money is an employee — put it to work and it pays $327 for every $1 at the 32,767 cap. Stagnation is a firing offense: if an asset is not observed, used, or transacted with, its relevance converges toward zero via base-three half-life. The system incentivizes the velocity of money and rewards participation. That is the Anti-Crypto: Metabolic Reality, not sentiment.
            </p>
            <p className="text-gray-300 mb-4">
              The <strong className="text-amber-300">redemption constraint</strong> is the safety net: 1 THD is always redeemable for 1 USDC. The smart contract physically rejects any transaction valuing THD below the floor. There is only value — or the dollar retires.
            </p>
            <p className="text-gray-300">
              As detailed in Building Web 4 With Money That Lives — The Human Dollar creates an economy where stagnation is a firing offense and capital that works hard earns the Genesis Dividend. This is not speculation. This is Metabolic Reality.
            </p>
          </motion.section>

          {/* Key concepts cards */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-amber-400">
              Key Concepts
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-amber-300">
                  The Genesis Dividend
                </h3>
                <p className="text-gray-300">
                  $327 for every $1 put to work. Every THD works toward the 32,767 cap — a deterministic reward for capital velocity. Observation is oxygen. Usage is mining.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-amber-300">
                  Money is an Employee
                </h3>
                <p className="text-gray-300">
                  Each THD is a worker. It has a job, a performance cap (32,767), and a biological clock. The price is in the money — stitched into the DNA of the hash. There is only value — or the dollar retires.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-amber-300">
                  Stagnation is a Firing Offense
                </h3>
                <p className="text-gray-300">
                  Idle capital enters early retirement. Base-three half-life. But 1 THD is always redeemable for 1 USDC — the retirement floor. There is only value — or the dollar retires.
                </p>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="rounded-xl bg-gradient-to-r from-amber-900/50 to-yellow-900/50 p-8 border border-amber-800/50">
              <h2 className="text-3xl font-bold mb-4 text-amber-400">
                Learn More
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Visit The Human Dollar for the full vision. Explore Zeroth and Crypto Fabric for related work.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://thehumandollar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
                >
                  TheHumanDollar.com
                </a>
                <Link
                  to="/zero"
                  className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  Zeroth Theory
                </Link>
                <Link
                  to="/cryptofabric"
                  className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  Crypto Fabric
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </>
  );
};
