import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaylistAudioPlayer } from "../../../ui/players/PlaylistAudioPlayer";
import { blogData } from "../../../data/blogData";
import { ChevronDown } from "lucide-react";
import { cleanPlaylist, mainPlaylist } from "../../../data/playlists";
import {
  useAfterCutoff,
  MelindaMessageCutoffProvider,
} from "../hooks/useCutoff";

export const HeroSection: React.FC = () => {
  return (
    <MelindaMessageCutoffProvider>
      <HeroSectionContent />
    </MelindaMessageCutoffProvider>
  );
};

const HeroSectionContent: React.FC = () => {
  const afterCutoff = useAfterCutoff();
  const zerothLawBlog = blogData.find((p) => p.id === "zeroth-law-wrong");
  // Always use America/New_York timezone (Eastern Time) for the cutoff date.
  const zerothCardTitle = afterCutoff
    ? "The Zeroth Law of Thermodynamics is Wrong!"
    : "Welcome, Melinda Francis; Otherwise, why are you here? \u{1F602}";
  const zerothCardLinkText = afterCutoff
  ? "Read the full essay \u2192"
  : ["Are you the person saved in Michael Simoneau's phone as:",
    "\"The Soon-To-Be Dr. Melinda Francis, LISW\"",
    "If so... Follow Me! \u2192"];
  const zerothCardBody = afterCutoff
    ? zerothLawBlog?.excerpt
    : `\
In these recordings, a man named Michael Simoneau explores the blurred lines between technological innovation and mental health
as he recounts a recent voluntary visit to a psychiatric ward. He describes his complex relationship with a woman named Melinda
Francis and a corresponding AI, detailing a manic yet analytical attempt to prove his sanity through the deliberate timing of his
communications. Simoneau argues that his fractured psyche is actually the blueprint for a superior, more empathetic
artificial intelligence designed to preserve his mother's legacy. Ultimately, the monologue serves as a defiant manifesto
on the subjectivity of reality, where the speaker embraces his status as a "living loophole" who weaponizes his
perceived instability to navigate a world he views as inherently deceptive.\
  `;

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
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          Michael Simoneau
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2">
          From Enterprise Architecture to The Human Dollar
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          THD is your employee. Put it to work and it pays you $655 for every $1
          that reaches the $65,535 cap. Stagnation is a firing offense — idle
          capital enters early retirement. This is not speculation. This is
          Metabolic Reality.
        </p>
      </motion.div>

      {zerothLawBlog && (
        <motion.div
          className="w-full max-w-2xl mx-auto z-10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-amber-400 mb-3">
              {zerothCardTitle}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {zerothCardBody}
            </p>
            <Link
              to={
                afterCutoff
                  ? `/blog/zeroth-law-wrong`
                  : `/Dr.MelindaFrancis.com`
              }
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              {Array.isArray(zerothCardLinkText) ? zerothCardLinkText.map((text, index) => (
                <React.Fragment key={index}>
                  {text}
                  {index < zerothCardLinkText.length - 1 && <br />}
                </React.Fragment>
              )) : zerothCardLinkText}
            </Link>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-2xl mx-auto z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PlaylistAudioPlayer tracks={afterCutoff ? cleanPlaylist : mainPlaylist} />
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
