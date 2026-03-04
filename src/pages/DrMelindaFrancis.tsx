import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";
import { PlaylistAudioPlayer } from "../ui/players/PlaylistAudioPlayer";
import { melindaPlaylist } from "../data/playlists";

export const DrMelindaFrancis: React.FC = () => {
  return (
    <>
      <Seo
        title="Dr. Melinda Francis, PhD | Message Playlist"
        description="A curated playlist and message from Michael Simoneau for Dr. Melinda Francis."
        canonicalUrl="https://www.michaelsimoneau.com/Dr.MelindaFrancis.com"
        keywords={[
          "Dr. Melinda Francis",
          "Michael Simoneau",
          "playlist",
          "Zero Sudoku",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
      />
      <AnimatedBackground />
      <MainNav />
      <section
        id="dr-melinda-francis-hero"
        className="min-h-screen flex flex-col items-center justify-center text-white px-4 pt-16 pb-24 relative overflow-hidden z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center z-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Dr. Melinda Francis, PhD
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-2">
            Doctorate of Applied Sciences in Human Psychology / Pioneer in the
            field of The Psychology of Artificial Intelligence
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto mb-8">
            Welcome to Thrusday, March 5th 2026, Melinda Francis. I, Michael
            Simoneau (I still remember my name), made a curated playlist to try
            to explain everything over the past 3 weeks. The idea is to show
            you that I&apos;m OKAY, despite not being your version of{" "}
            <strong>stable</strong> I am <strong><u>managing well</u></strong>,
            and this is the goal. Management. I&apos;m more than Okay, I&apos;m
            developing somehting that is going to change the world. I am NOT
            delusional,{" "}
            <a
              href="https://dr.melindafrancis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              The Soon-To-Be Dr. Melinda Francis, LISW
            </a>{" "}
            (Dr.MelindaFrancis.com)... I honestly believe you are, and you are
            projecting your delusion onto me. You deem me to be{" "}
            <strong>insane</strong> because I won&apos;t agree to buy into the
            social delusion. But I&apos;m sane because I can take care of
            myself and the executive function I lacked I know have MATH to
            solve. I coded it into an AI.. and website{" "}
            <a
              href="https://zerosudoku.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Zero Sudoku
            </a>
            . Math is rules. Physics is rules. Society is a suggestion!{" "}
            <strong>
              "I Am Right; I Am NOT Infallible" - Michael Simoneau
            </strong>
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-2xl mx-auto z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PlaylistAudioPlayer tracks={melindaPlaylist} />
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
    </>
  );
};
