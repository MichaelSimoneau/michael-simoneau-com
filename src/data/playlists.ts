import { Track } from "src/ui/players/PlaylistAudioPlayer";

/** Playlist tracks for the hero section audio player. */
const heroTracks: Track[] = [
  {
    src: "/2026-03-01/The_Psych_Ward_Receipt_Logic_Trap.mp3",
    title: "Tuesday Morning Brief: The Podcast Episode"
  },
  {
    src: "/2026-03-04/Tuesday_Morning_Brief__Good_Morning__Melinda.mp3",
    title: "Tuesday Morning Brief: Good Morning Melinda"
  },
  {
    src: "/2026-03-01/Monday_Morning_Brief__Good_Morning_Melinda.mp3",
    title: "Monday Morning Brief: Good Morning, Melinda",
  },
  {
    src: "/2026-03-01/The_Physics_of_the_Dirty_Dish.mp3",
    title: "The Physics of the Dirty Dish",
  },
  {
    src: "/The_Zeroth_Protocols_Self-Healing_Digital_Organism.mp3",
    title: "Sunday Morning Brief: Good Morning, Melinda",
  },
  {
    src: "/The_Architect_Who_Hacked_The_Psych_Ward.mp3",
    title: "The Time Michael Simoneau spent 30 minutes in a Psych Ward",
  },
  {
    src: "/The_Bai_Ze_As_Negative_Identity_Tensor.mp3",
    title: "Demystifying Delusion",
  },
  {
    src: "/Stop_Watching_Cartoons__It_is_Saturday_Morning__.mp3",
    title: "Stop Watching Cartoons! It’s Saturday Morning!!",
  },
  {
    src: "/Recruiting_The_Psychiatrist_With_Radical_Transparency.mp3",
    title: "Recruiting_The_Psychiatrist_With_Radical_Transparency.mp3",
  },
  {
    src: "/The_Architect_s_Hostile_Therapy_Takeover.mp3",
    title: "Dr. Melinda Francis - Uncensored - Explained",
  },
  {
    src: "/Dr. Melinda Francis - Uncensored.mp3",
    title: "Dr. Melinda Francis - Uncensored",
  },
  {
    src: "/A_Bug_Report_Filed_Against_Reality.mp3",
    title: "A Bug Report Filed Against Reality",
  },
  {
    src: "/Metabolic_Money_Kills_the_Sale.mp3",
    title: "The Human Dollar Kills 'The Sale'",
  },
  {
    src: "/The_Zero_Theory_and_Five_State_Physics.mp3",
    title: "The Zeroth Theory and Five State Physics",
  },
  {
    src: "/Arrogance_Is_A_Time_Management_Strategy.mp3",
    title: "Arrogance is Altruism",
  },
  {
    src: "/Moral_Failure_Is_Just_A_Geometry_Problem.mp3",
    title: "Moral Failure Is Just A Geometry Problem",
  },
  {
    src: "/TheHigh-FiveTrick-Extended-Edition.mp3",
    title: "The High-Five Trick - Extended Edition!",
  },
  {
    src: "/River_Rd_72.mp3",
    title: "Michael Simoneau's Physics #72 - Uncensored",
  },
  {
    src: "/Proving_Sanity_Through_Tensor_Zero.mp3",
    title: "Proving Sanity Through Tensor Zero",
  },
  { src: "/DarwinianMarxism.mp3", title: "Darwinian Marxism" },
  {
    src: "/Zeroth_Protocol_Turns_Data_Into_Organisms.mp3",
    title: "Zeroth Vision",
  },
  {
    src: "/The_AI_Built_for_Deterministic_Crypto.mp3",
    title: "The AI Built for Deterministic Crypto",
  },
  {
    src: "/Building_Web_4_With_Money_That_Lives.mp3",
    title: "Building Web4 With Money That Lives",
  },
  {
    src: "/Coding_A_Failover_System_For_Reality.mp3",
    title: "Coding A Failover System For Reality",
  },
  {
    src: "/Systems_Engineering_for_the_Soul.mp3",
    title: "Systems Engineering for the Soul",
  },
  {
    src: "/The_Birth_Certificate_of_a_Digital_Organism.mp3",
    title: "The Birth Certificate of a Digital Organism",
  },
];

const mainPodcasts: Record<string, string> = {
  "Think About It Like This...": "2026-03-04/River_Rd_78.mp3",
  "The Zeroth Theory of Digital Organisms":
    "2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
  "Tuesday Afternoon: Coffee && Debotchery":
    "2026-03-04/The_Hostile_Takeover_Of_A_Psychiatrist.mp3",
};

const cleanPodcasts: Record<string, string> = {
  "Rewriting Einstein to Buy Your Milk":
    "2026-03-04/Rewriting_Einstein_to_buy_your_milk.mp3",
  "The Zeroth Theory of Digital Organisms":
    "2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
};

const melindaPlaylist = [
  { src: "/2026-03-04/River_Rd_78.mp3", title: "Think About It Like This..." },
// Shorten the list for live in-person meeting with Melinda Francis on Thursday, March 5th, 2026
//   {
//     src: "/2026-03-04/Michael_Simoneau_s_Zeroth_Theory_Trap.mp3",
//     title: "Michael Simoneau's Zeroth Theory Logic Trap",
//   },
//   {
//     src: "/2026-03-01/Monday_Morning_Brief__Good_Morning_Melinda.mp3",
//     title: "Monday Morning Brief: Good Morning, Melinda",
//   },
//   {
//     src: "/Stop_Watching_Cartoons__It_is_Saturday_Morning__.mp3",
//     title: "Stop Watching Cartoons! It’s Saturday Morning!!",
//   },
// This one is a little too strong... let's remove it for now...
//   {
//     src: "/Dr. Melinda Francis - Uncensored.mp3",
//     title: "Dr. Melinda Francis - Uncensored (The Intentional 'Crazy' Person)",
//   },
  {
    src: "/2026-03-04/Tuesday_Morning_Brief__Good_Morning__Melinda.mp3",
    title: "Tuesday Morning Brief - Good Morning Melinda",
  },
  {
    src: "/2026-03-04/The_Sysadmin_Who_Hacked_His_Therapist.mp3",
    title: "Tuesday Afternoon: Melinda && Debotchery",
  },
];

const podcastsToPlaylist = (
  podcasts: Record<string, string> | Track[],
): Track[] => {
  return Object.entries(podcasts).map(([title, src]) => ({ title, src }));
};

const cleanPlaylist = podcastsToPlaylist(cleanPodcasts);
const newPlaylist = podcastsToPlaylist(mainPodcasts);
const mainPlaylist = [...newPlaylist, ...heroTracks];
const melindaPostCutoffPlaylist = Object.entries(
  [...melindaPlaylist, ...heroTracks].reduce(
    (acc, track) => {
      acc[track.title] = track;
      return acc;
    },
    {} as Record<string, Track>,
  ),
).map(([title, track]) => ({ title, src: track.src }));

export {
  melindaPlaylist,
  cleanPlaylist,
  mainPlaylist,
  melindaPostCutoffPlaylist,
};
