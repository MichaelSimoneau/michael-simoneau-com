import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * ThdHero – Main-page hero section for The Human Dollar (THD).
 * Presents THD as The Anti-Currency and legal digital bartering chip.
 * Links to the full /thd page and TheHumanDollar.com.
 */
export const ThdHero: React.FC = () => {
  return (
    <motion.section
      id="thd"
      className="w-full flex flex-col items-center justify-center text-white px-4 py-16 md:py-12 relative overflow-hidden bg-gradient-to-br from-gray-900 via-amber-900/20 to-gray-900 flex-none"
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

      <div className="container mx-auto max-w-6xl relative z-10 w-full pt-2 pb-16 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 w-full"
        >
          <motion.div
            className="flex justify-center mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative max-w-xs md:max-w-sm">
              {/* Per-coin radial glows */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 27% 50%, rgba(255,255,255,0.12) 0%, transparent 55%), ' +
                    'radial-gradient(circle at 73% 50%, rgba(255,255,255,0.12) 0%, transparent 55%)',
                  filter: 'blur(24px)',
                }}
              />
              <img
                src="/THD.png"
                alt="The Human Dollar — front and back"
                className="relative w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-amber-400">
              The Human Dollar
            </span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-amber-300 font-semibold mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="whitespace-nowrap">The Working Dollar</span>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap">The Anti-Currency</span>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap">A Cryptographic Concert Ticket</span>
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            THD is legally a digital bartering chip, not a currency. It does not replace money.<br />It costs $1 and functions as a cryptographic concert ticket for participation.
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-8">
            1 THD is always redeemable for 1 USDC.<br />The smart contract physically rejects any transaction valuing THD below the floor, so your $1 principal is preserved.<br />Darwinian maximism at the edge, principal protection at the core.
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
            rel="noopener"
            className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-300 border border-gray-700"
          >
            Visit TheHumanDollar.com
            <Sparkles size={20} className="ml-2" />
          </a>
        </motion.div>

        <motion.a
          href="https://topsmokevape.com/"
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
                <Sparkles size={14} />
                Very First Organization to Accept THD
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Top Smoke &amp; Vape
              </h3>
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
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </motion.a>

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
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">The Genesis Dividend</h3>
            <p className="text-gray-300 text-sm">
              $655 for every $1 put to work. Every THD works toward the 65,535 cap. Observation is oxygen. Usage is mining.
            </p>
          </Link>
          <Link
            to="/thd"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-800/30 hover:border-amber-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">Stagnation is a Firing Offense</h3>
            <p className="text-gray-300 text-sm">
              Idle capital enters early retirement. Base-three half-life. But 1 THD is always redeemable for 1 USDC — the retirement floor.
            </p>
          </Link>
          <Link
            to="/thd"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-800/30 hover:border-amber-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-bold mb-3 text-amber-400 group-hover:text-amber-300 transition-colors">Redemption Floor</h3>
            <p className="text-gray-300 text-sm">
              1 THD is always redeemable for 1 USDC. The smart contract rejects any transaction below the floor. There is only value — or the dollar retires.
            </p>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};
