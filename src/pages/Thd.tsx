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
        title="The Human Dollar (THD) | The Anti-Currency"
        description="The Human Dollar (THD) is The Anti-Currency. THD is legally a digital bartering chip, not a currency: it does not replace money, it costs $1, and your $1 principal is always redeemable (1 THD = 1 USDC floor)."
        canonicalUrl="https://www.michaelsimoneau.com/thd"
        keywords={[
          "The Human Dollar",
          "THD",
          "65535",
          "Genesis Dividend",
          "stagnation firing offense",
          "#WEB",
          "Anti-Currency",
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
              "The Human Dollar (THD) is a cryptographic concert ticket and The Anti-Currency. THD is legally a digital bartering chip, not a currency: it does not replace money, it costs $1, and your $1 principal is always redeemable.",
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
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
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
              <h1 className="text-5xl font-bold mb-4 text-amber-400">
                The Human Dollar
              </h1>
              <p className="text-2xl text-amber-300 mb-2">
                The Human Dollar · The Anti-Currency
              </p>
              <p className="text-xl text-gray-400 mb-4">
                A Cryptographic Concert Ticket
              </p>
              <p className="text-lg text-gray-300 max-w-3xl">
                THD is legally a digital bartering chip, not a currency. It does not replace money, it costs $1, and your $1 principal is always redeemable via the 1 THD = 1 USDC floor. In practice, it behaves like a cryptographic concert ticket: a programmable right to participate in a high-velocity economy where stagnation is a firing offense.
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
                The Human Dollar is The Anti-Currency. THD is legally a digital bartering chip, not a currency: not a replacement for money, but a $1 cryptographic concert ticket with a principal floor. The architecture is detailed in the audio below: <em>Building Web4 With Money That Lives</em>.
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

          {/* Core value: Anti-Currency with principal protection */}
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
              "The Anti-Currency: a legal digital bartering chip for participation."
            </p>
            <p className="text-gray-300 mb-4">
              THD is <strong className="text-amber-300">The Human Dollar</strong>, positioned as <strong className="text-amber-300">The Anti-Currency</strong>. THD is legally a digital bartering chip, not a currency. It does not replace money; it costs $1; and it treats that dollar as protected principal. The mechanism is a cryptographic concert ticket that grants access to a Darwinian market game where value competes on usage, observation, and participation.
            </p>
            <p className="text-gray-300 mb-4">
              The <strong className="text-amber-300">redemption constraint</strong> is the safety net: 1 THD is always redeemable for 1 USDC. The smart contract physically rejects any transaction valuing THD below the floor, so your principal remains anchored at $1.
            </p>
            <p className="text-gray-300">
              As detailed in Building Web 4 With Money That Lives, THD combines competitive incentives and shared floor guarantees: Darwinian maximism at the edge, principal protection at the core. This is framed as a blend of capitalism and communism executed in code.
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
                  $655 for every $1 put to work. Every THD works toward the 65,535 cap — a deterministic reward for capital velocity. Observation is oxygen. Usage is mining.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-amber-300">
                  Money is an Employee
                </h3>
                <p className="text-gray-300">
                  Each THD is a worker. It has a job, a performance cap (65,535), and a biological clock. The price is in the money — stitched into the DNA of the hash. There is only value — or the dollar retires.
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

          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <a
              href="https://topsmokevape.com/"
              target="_blank"
              rel="noopener"
              className="group block rounded-2xl bg-gradient-to-br from-amber-900/30 via-gray-900/80 to-gray-900/90 border border-amber-700/40 hover:border-amber-400/70 shadow-2xl shadow-black/40 hover:shadow-amber-900/30 transition-all duration-300 p-6 md:p-8"
              aria-label="Visit Top Smoke & Vape, the first organization to accept THD"
            >
              <div className="grid md:grid-cols-[220px,1fr] gap-6 md:gap-8 items-center">
                <div className="rounded-xl border border-amber-800/40 bg-black p-4 flex items-center justify-center">
                  <img
                    src="/partners/top-smoke-vape-logo.png"
                    alt="Top Smoke & Vape logo"
                    className="w-full max-w-[190px] h-auto object-contain -rotate-1"
                  />
                </div>

                <div className="text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 bg-amber-400/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4">
                    Very First Organization to Accept THD
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Top Smoke &amp; Vape
                  </h2>
                  <p className="text-amber-200/90 text-sm md:text-base mb-4">
                    Top Smoke &amp; Vape | Premium Smoke Shop
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs md:text-sm text-gray-200 bg-gray-800/80 border border-gray-700 rounded-full px-3 py-1">Authorized Dealer</span>
                    <span className="text-xs md:text-sm text-gray-200 bg-gray-800/80 border border-gray-700 rounded-full px-3 py-1">Est. 2022</span>
                    <span className="text-xs md:text-sm text-gray-200 bg-gray-800/80 border border-gray-700 rounded-full px-3 py-1">10:00 AM - 10:00 PM Daily</span>
                  </div>

                  <p className="text-sm md:text-base text-gray-300 mb-1">
                    2804 SOM Center Rd., Willoughby Hills, OH 44094
                  </p>
                  <p className="text-sm md:text-base text-gray-300 mb-1">
                    440-710-6072
                  </p>
                  <p className="text-sm md:text-base text-gray-300 mb-6">
                    @TopSmoke_Vape
                  </p>

                  <span className="inline-flex items-center px-5 py-3 bg-amber-500 group-hover:bg-amber-400 text-black font-bold rounded-lg transition-colors">
                    Visit TopSmokeVape.com
                  </span>
                </div>
              </div>
            </a>
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
                  rel="noopener"
                  className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
                >
                  TheHumanDollar.com
                </a>
                <Link
                  to="/zeroth/theory/chapter/1/principal/1"
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
      </div>
    </>
  );
};
