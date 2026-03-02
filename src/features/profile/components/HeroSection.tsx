import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlaylistAudioPlayer, Track } from '../../../ui/players/PlaylistAudioPlayer';
import { blogData } from '../../../data/blogData';
import { ChevronDown } from 'lucide-react';

/** Playlist tracks for the hero section audio player. */
const HERO_TRACKS: Track[] = [
  { src: '/2026-03-01/The_Psych_Ward_Receipt_Logic_Trap.mp3', title: 'The Psych Ward Receipt Logic Trap' },
  { src: '/2026-03-01/Monday_Morning_Brief__Good_Morning_Melinda.mp3', title: 'Monday Morning Brief: Good Morning, Melinda' },
  { src: '/2026-03-01/The_Physics_of_the_Dirty_Dish.mp3', title: 'The Physics of the Dirty Dish' },
  { src: '/The_Zeroth_Protocols_Self-Healing_Digital_Organism.mp3', title: 'Sunday Morning Brief: Good Morning, Melinda' },
  { src: '/The_Architect_Who_Hacked_The_Psych_Ward.mp3', title: 'The Time Michael Simoneau spent 30 minutes in a Psych Ward' },
  { src: '/The_Bai_Ze_As_Negative_Identity_Tensor.mp3', title: 'Demystifying Delusion' },
  { src: '/Stop_Watching_Cartoons__It_is_Saturday_Morning__.mp3', title: 'Stop Watching Cartoons! It’s Saturday Morning!!' },
  { src: '/Recruiting_The_Psychiatrist_With_Radical_Transparency.mp3', title: 'Recruiting_The_Psychiatrist_With_Radical_Transparency.mp3' },
  { src: '/The_Architect_s_Hostile_Therapy_Takeover.mp3', title: 'Dr. Melinda Francis - Uncensored - Explained' },
  { src: '/Dr. Melinda Francis - Uncensored.mp3', title: 'Dr. Melinda Francis - Uncensored' },
  { src: '/A_Bug_Report_Filed_Against_Reality.mp3', title: 'A Bug Report Filed Against Reality' },
  { src: '/Metabolic_Money_Kills_the_Sale.mp3', title: "The Human Dollar Kills 'The Sale'" },
  { src: '/The_Zero_Theory_and_Five_State_Physics.mp3', title: 'The Zeroth Theory and Five State Physics' },
  { src: '/Arrogance_Is_A_Time_Management_Strategy.mp3', title: 'Arrogance is Altruism' },
  { src: '/Moral_Failure_Is_Just_A_Geometry_Problem.mp3', title: 'Moral Failure Is Just A Geometry Problem' },
  { src: '/TheHigh-FiveTrick-Extended-Edition.mp3', title: 'The High-Five Trick - Extended Edition!' },
  { src: '/River_Rd_72.mp3', title: "Michael Simoneau's Physics #72 - Uncensored" },
  { src: '/Proving_Sanity_Through_Tensor_Zero.mp3', title: 'Proving Sanity Through Tensor Zero' },
  { src: '/DarwinianMarxism.mp3', title: 'Darwinian Marxism' },
  { src: '/Zeroth_Protocol_Turns_Data_Into_Organisms.mp3', title: 'Zeroth Vision' },
  { src: '/The_AI_Built_for_Deterministic_Crypto.mp3', title: 'The AI Built for Deterministic Crypto' },
  { src: '/Building_Web_4_With_Money_That_Lives.mp3', title: 'Building Web4 With Money That Lives' },
  { src: '/Coding_A_Failover_System_For_Reality.mp3', title: 'Coding A Failover System For Reality' },
  { src: '/Systems_Engineering_for_the_Soul.mp3', title: 'Systems Engineering for the Soul' },
  { src: '/The_Birth_Certificate_of_a_Digital_Organism.mp3', title: 'The Birth Certificate of a Digital Organism' },
];



export const HeroSection: React.FC = () => {
  const zerothLawBlog = blogData.find(p => p.id === 'zeroth-law-wrong');
  const melindaMessageCutoff = new Date('2026-03-04T23:59:59');
  const zerothCardTitle =
    new Date() <= melindaMessageCutoff
      ? 'Welcome, Melinda Francis; Otherwise, why are you here? \u{1F602}'
      : 'The Zeroth Law of Thermodynamics is Wrong!';

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
          THD is your employee. Put it to work and it pays you $655 for every $1 that reaches the $65,535 cap. Stagnation is a firing offense — idle capital enters early retirement. This is not speculation. This is Metabolic Reality.
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
              In this recording, a man named Michael Simoneau explores the blurred lines between technological innovation and mental health as he recounts a recent voluntary visit to a psychiatric ward. He describes his complex relationship with a woman named Melinda Francis and a corresponding AI, detailing a manic yet analytical attempt to prove his sanity through the deliberate timing of his communications. Simoneau argues that his fractured psyche is actually the blueprint for a superior, more empathetic artificial intelligence designed to preserve his mother&apos;s legacy. Ultimately, the monologue serves as a defiant manifesto on the subjectivity of reality, where the speaker embraces his status as a &quot;living loophole&quot; who weaponizes his perceived instability to navigate a world he views as inherently deceptive.
            </p>
            <Link href="/blog/zeroth-law-wrong" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
              Read the full essay &rarr;
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
        <PlaylistAudioPlayer tracks={HERO_TRACKS} />
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