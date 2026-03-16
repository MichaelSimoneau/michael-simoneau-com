import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaylistAudioPlayer } from "../../../ui/players/PlaylistAudioPlayer";
import type { BlogData } from "../../blog/data/posts";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cleanPlaylist } from "../../../data/playlists";
import { AmaEmbedded } from "../../ama/components";

interface HeroSectionProps {
  featuredBlog?: BlogData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredBlog }) => {
  const [isNarrativeExpanded, setIsNarrativeExpanded] = useState(false);
  const [isAmaExpanded, setIsAmaExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const heroPanelWidthClass = "w-full max-w-3xl mx-auto";

  return (
    <section
      id="new-hero"
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 pt-16 pb-24 relative overflow-hidden"
    >
      {/* Background Styling - more abstract and futuristic */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900/30 opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 break-words [overflow-wrap:anywhere]">
          Michael Simoneau
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2 break-words [overflow-wrap:anywhere]">
          <span className="font-bold">Saving </span>the
          <span className="font-bold"> US Dollar...</span>
          <i>
            {" "}
            by <span className="font-bold">Saving the World</span>!
          </i>
        </h2>
        <div className={`${heroPanelWidthClass} mt-4 mb-8 px-1 sm:px-0`}>
          <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-5 sm:p-6 text-center">
            <div className="mx-auto mb-4 w-full max-w-4xl px-1 sm:px-2 grid grid-cols-2 md:grid-cols-4 gap-y-0.5 gap-x-1 sm:gap-x-2 items-center">
              <div className="w-full md:block hidden">
                <a
                  href="https://TheHumanDollar.com"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-amber-300 decoration-amber-300/70 underline-offset-2 transition-colors hover:text-amber-200 hover:underline focus:outline-none focus:ring-1 focus:ring-amber-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    The Human Dollar
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full">
                <a
                  href="https://HashWeb.Network"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-cyan-300 decoration-cyan-300/70 underline-offset-2 transition-colors hover:text-cyan-200 hover:underline focus:outline-none focus:ring-1 focus:ring-cyan-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    HashWeb.Network
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full">
                <a
                  href="https://ZerothTheory.com"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-sky-300 decoration-sky-300/70 underline-offset-2 transition-colors hover:text-sky-200 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    Zeroth Theory
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
              <div className="w-full md:block hidden">
                <a
                  href="https://CryptoFabric.Cloud"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-full items-center justify-center gap-1 px-0 py-0 text-center text-[11px] sm:text-xs leading-none font-medium text-fuchsia-300 decoration-fuchsia-300/70 underline-offset-2 transition-colors hover:text-fuchsia-200 hover:underline focus:outline-none focus:ring-1 focus:ring-fuchsia-400/80 focus:ring-offset-1 focus:ring-offset-black/50"
                >
                  <span className="text-inherit whitespace-nowrap">
                    #CryptoFabric
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-inherit"
                  />
                </a>
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              <span className="block mb-4">
                <span className="relative inline-block pb-2">
                  <motion.span
                    className="inline-block font-semibold text-yellow-500"
                    animate={
                      !isNarrativeExpanded && !prefersReducedMotion
                        ? { x: [0, -2, 0] }
                        : { x: 0 }
                    }
                    transition={
                      !isNarrativeExpanded && !prefersReducedMotion
                        ? {
                            duration: 5,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                          }
                        : { duration: 0.2, ease: "easeOut" }
                    }
                  >
                    Your journey begins with a {"\u00A0"}
                  </motion.span>
                  {isNarrativeExpanded && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-green-200">
                        {"\u00A0single\u00A0U.S.\u00A0dollar.\u00A0"}
                      </span>
                      <span className="font-semibold text-green-200">
                        {"$1\u00A0USD."}
                      </span>
                    </div>
                  )}
                  {!isNarrativeExpanded && (
                    <span className="block sm:inline whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none relative inline-block w-0 align-baseline"
                      >
                        <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2" />
                      </span>
                      <motion.span
                        className="inline-block font-semibold text-yellow-500"
                        animate={
                          !prefersReducedMotion ? { x: [0, 2, 0] } : { x: 0 }
                        }
                        transition={
                          !prefersReducedMotion
                            ? {
                                duration: 5,
                                times: [0, 0.5, 1],
                                ease: "easeInOut",
                                repeat: Infinity,
                              }
                            : { duration: 0.2, ease: "easeOut" }
                        }
                      >
                        {" Deterministic\u00A0Truth"}
                      </motion.span>
                      .
                    </span>
                  )}

                  <button
                    type="button"
                    aria-expanded={isNarrativeExpanded}
                    aria-controls="hero-narrative-middle-copy"
                    onClick={() => setIsNarrativeExpanded((prev) => !prev)}
                    className="absolute inset-0 z-20 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
                  >
                    <span className="sr-only">
                      {isNarrativeExpanded
                        ? "Collapse narrative details"
                        : "Expand narrative details"}
                    </span>
                  </button>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[8px]"
                  >
                    {[-12, -2, 8].map((dotOffset, segmentIndex) => (
                      <motion.span
                        key={segmentIndex}
                        className="absolute bg-yellow-500"
                        style={{ top: 0 }}
                        animate={
                          isNarrativeExpanded
                            ? {
                                left: `${segmentIndex * 33.333}%`,
                                x: 0,
                                width: "33.5%",
                                height: "2px",
                                borderRadius: "999px",
                                y: 6,
                                opacity: 0.92,
                              }
                            : prefersReducedMotion
                              ? {
                                  left: "50%",
                                  x: dotOffset,
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "999px",
                                  y: 0,
                                  opacity: 0.82,
                                }
                              : {
                                  left: [
                                    "50%",
                                    "50%",
                                    `${segmentIndex * 33.333}%`,
                                    `${segmentIndex * 33.333}%`,
                                    "50%",
                                  ],
                                  x: [dotOffset, dotOffset, 0, 0, dotOffset],
                                  width: [
                                    "6px",
                                    "6px",
                                    "33.5%",
                                    "33.5%",
                                    "6px",
                                  ],
                                  height: ["6px", "6px", "2px", "2px", "6px"],
                                  borderRadius: [
                                    "999px",
                                    "999px",
                                    "999px",
                                    "999px",
                                    "999px",
                                  ],
                                  y: [0, 0, 6, 6, 0],
                                  opacity: [0.74, 0.74, 0.92, 0.92, 0.74],
                                }
                        }
                        transition={
                          isNarrativeExpanded || prefersReducedMotion
                            ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                            : {
                                duration: 5,
                                times: [0, 0.2, 0.5, 0.7, 1],
                                ease: [0.42, 0, 0.58, 1],
                                repeat: Infinity,
                              }
                        }
                      />
                    ))}
                  </span>
                </span>
              </span>

              <AnimatePresence initial={false}>
                {isNarrativeExpanded && (
                  <motion.span
                    id="hero-narrative-middle-copy"
                    className="block overflow-hidden"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, height: "auto" }
                        : { opacity: 0, height: 0 }
                    }
                    animate={{ opacity: 1, height: "auto" }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 1, height: "auto" }
                        : { opacity: 0, height: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <span className="block mb-4">
                      <strong className="font-semibold text-white">
                        The Human Dollar (THD)
                      </strong>{" "}
                      is the world's first metabolic digital bartering chip
                      system. It is not an asset you hoard; it is an asset that
                      lives, breathes, and expires based on the velocity of your
                      attention. Ownership is mathematically restricted to
                      exactly one container per unique identity. You can step
                      into this new economic reality today with a maximum
                      initial deposit of exactly{" "}
                      <span className="font-semibold">$1 USD</span>.
                    </span>

                    <span className="block mb-4">
                      Your access key is the{" "}
                      <strong className="font-semibold text-fuchsia-200">
                        CryptoFabric App
                      </strong>
                      . By combining a simple biometric face scan with a
                      password, CryptoFabric uses Plaid and Stripe to
                      automatically provision your Web3 wallet, your THD
                      container, and your genesis block entirely under the hood.
                    </span>

                    <span className="block mb-4">
                      This app is your direct entry point into the{" "}
                      <strong className="font-semibold text-cyan-200">
                        HashWeb.Network
                      </strong>
                      —a living, self-healing internet where data owns itself
                      and truth is a mathematical inevitability. This is not a
                      traditional blockchain; it is a directed acyclic graph
                      where the runtime itself is the chain.
                    </span>

                    <span className="block mb-4">
                      The entire ecosystem is powered by{" "}
                      <strong className="font-semibold text-sky-200">
                        Zeroth Theory
                      </strong>
                      , the immutable computational physics that proves
                      stagnation is death, and velocity is wealth.
                    </span>

                    <span className="block mb-4">
                      <span className="font-semibold text-amber-200">
                        Welcome to{" "}
                      </span>
                      <span className="font-semibold text-amber-400">
                        Deterministic Truth.
                      </span>
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
          </div>
        </div>
      </motion.div>

      {featuredBlog && (
        <motion.div
          className="w-full max-w-2xl mx-auto z-10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-amber-400 mb-3">
              {featuredBlog.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {featuredBlog.excerpt}
            </p>
            <Link
              to={`/blog/${featuredBlog.id}`}
              rel="noopener"
              target="_self"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              Read the full essay {"\u2192"}
            </Link>
          </div>
        </motion.div>
      )}

      <motion.div
        className={`${heroPanelWidthClass} z-10`}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PlaylistAudioPlayer
          tracks={cleanPlaylist}
          defaultPlaylistTitle="Learn About Michael Simoneau"
        />
      </motion.div>

      <motion.div
        className={`${heroPanelWidthClass} z-10 mt-8`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl overflow-hidden">
          <button
            type="button"
            aria-expanded={isAmaExpanded}
            aria-controls="hero-ama-panel"
            onClick={() => setIsAmaExpanded((prev) => !prev)}
            className="w-full px-5 py-4 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-cyan-300">
                  Ask About Michael Simoneau...
                </h3>
                <p className="text-sm text-gray-300">
                  Click to {isAmaExpanded ? "Close" : "Ask Me Anything..."}.
                </p>
              </div>
              <motion.span
                aria-hidden="true"
                className="text-xl text-cyan-300"
                animate={{ rotate: isAmaExpanded ? 180 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                ▾
              </motion.span>
            </div>
          </button>
          <AnimatePresence initial={false}>
            {isAmaExpanded && (
              <motion.div
                id="hero-ama-panel"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                animate={{ opacity: 1, height: "auto" }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.28, ease: "easeOut" }
                }
                className="px-5 pb-5"
              >
                <AmaEmbedded
                  title="Ask About Michael"
                  subtitle="Get grounded answers from his journals and audio transcripts.!"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <ChevronDown size={32} className="text-gray-400" />
      </motion.div>
    </section>
  );
};
