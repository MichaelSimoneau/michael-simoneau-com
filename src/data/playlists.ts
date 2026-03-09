import { Track } from "src/ui/players/PlaylistAudioPlayer";

const cleanPodcasts: Record<string, string> = {
  "COLLAPSED_0": "Is Your Name Melinda Francis? If Not, Move Along... Nothing To See Here.",
  // --- COLLAPSED_0 ---
  // Track #1 - 2026-03-07
  "Should Michael Simoneau Fire His Psychologist?":
  "2026-03-07/Should_Michael_Simoneau_delete_his_psychologist.mp3",
  // Track #2 - 2026-03-07
  "Michael Simoneau's Mathematical Proof of Sanity":
  "2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
  // Track #3 - 2026-03-04
  "Rewriting Einstein to Buy Your Milk":
  "2026-03-04/Rewriting_Einstein_to_buy_your_milk.mp3",
  // Track #4 - 2026-03-08
  "Michael's Sunday Morning Brief: Sunday, March 8, 2026. Good Morning, Michael Simoneau...":
  "2026-03-08/Prompt_for-Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
  // Track #5 - 2026-03-08
  "Why Michael Hung-Up on Melinda and Why She Should Schedule March 19 and Why Michael Could Not Care Less Either Way...":
  "2026-03-08/Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
  // --- EXPANDED_1 ---
  "EXPANDED_1": "Our New Reality: Rewriting Einstein to Fix the Global Economy",
  // Track #6 - 2026-03-09
  "How the Zeroth Theory Fixes The Global Economy":
  "2026-03-09/How_the_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
  // Track #7 - 2026-03-09
  "Good Morning, Michael Simoneau...":
  "2026-03-09/Teaching_Mari_to_teach_the_world_about_the_Zeroth_Theory.mp3",
  // Track #8 - 2026-03-09
  // "The Architect and his Autonomous Digital Organism":
  //   "2026-03-09/The_Architect_and_his_autonomous_digital_organism.mp3",
  // Track #9 - 2026-03-06
  // "Michael Simoneau and the Zeroth Theory":
  //   "2026-03-06/Michael_Simoneau_and_the_Zeroth_Theory.mp3",
  // Track #10 - 2026-03-04
  // "The Zeroth Theory of Digital Organisms":
  //   "2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
  // Track #11 - 2026-03-06
  // "Michael Simoneau's Zeroth Theory and Human Dollar":
  //   "2026-03-06/Michael_Simoneau_s_Zeroth_Theory_and_Human_Dollar.mp3",
};

const podcastsToPlaylist = (
  podcasts: Record<string, string>,
): Track[] => {
  return Object.entries(podcasts).map(([title, src]) => ({ title, src }));
};

const cleanPlaylist = podcastsToPlaylist(cleanPodcasts);

export {
  cleanPlaylist,
};
