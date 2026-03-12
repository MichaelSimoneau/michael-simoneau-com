import { Track } from "src/ui/players/PlaylistAudioPlayer";
import { beforeAndAfter, MARCH_12_2026_9_15_AM, MARCH_12_2026_12_00_PM } from "src/hooks/useBeforeAndAfter";

const COLLAPSED_0 = beforeAndAfter({
  when: MARCH_12_2026_9_15_AM,
  before: "Is Your Name Melinda Francis? If Not, Move Along... Nothing To See Here.",
  after: "Are you a Psychologist? If Not, Move Along... Nothing To See Here.",
}) as string;

const EXPANDED_0 = beforeAndAfter({
  when: MARCH_12_2026_9_15_AM,
  before: "Our New Reality: Rewriting Einstein to Fix the Global Economy",
  after: "Welcome to Michael Simoneau's Podcast...",
}) as string;

const psychologistPodcasts = beforeAndAfter({
  when: MARCH_12_2026_12_00_PM,
  before: {
    // Track #1 - 2026-03-07
    "Should Michael Simoneau Fire His Psychologist?":
    "/2026-03-07/Should_Michael_Simoneau_delete_his_psychologist.mp3",
    // Track #2 - 2026-03-07
    "Michael Simoneau's Mathematical Proof of Sanity":
    "/2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
    // Track #3 - 2026-03-04
    "Rewriting Einstein to Buy Your Milk":
    "/2026-03-04/Rewriting_Einstein_to_buy_your_milk.mp3",
    // Track #4 - 2026-03-08
    "Michael's Sunday Morning Brief: Sunday, March 8, 2026. Good Morning, Michael Simoneau...":
    "/2026-03-08/Prompt_for-Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
    // Temporary Grouping before `MARCH_12_2026_9_15_AM` (collapsed)
    ...(beforeAndAfter<Record<string, string>>({
      when: MARCH_12_2026_9_15_AM,
      before: { "COLLAPSE_1": "Why Michael Couldn't Care Less About Hanging-Up on Melinda, and..." },
      after: {},
    }) as Record<string, string>),
    // Track #5 - 2026-03-08
    "Why Michael's Psychologist Rescheduled March 19, 2026.":
    "/2026-03-08/Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
    // Track #6 - 2026-03-11
    "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
    "/2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
    // Track #7 - 2026-03-12
    "March 12, 2026 - Good Morning, Michael Simoneau...":
    "/2026-03-12/Engineering_the_9_AM_therapy_trap.mp3",
  },
  after: {
    // Track #1 - 2026-03-07
    "Michael Simoneau's Mathematical Proof of Sanity":
    "/2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
    // Track #2 - 2026-03-11
    "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
    "/2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
  },
}) as Record<string, string>;

const zerothPodcasts = beforeAndAfter({
  when: MARCH_12_2026_9_15_AM,
  before: {
    // Track #7 - 2026-03-09
    "How the Zeroth Theory Fixes The Global Economy":
    "/2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
    // Track #8 - 2026-03-11
    "Forensic Mapping of the 'Zeroth' Stack":
    "/2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
  },
  after: {
    // Track #7 - 2026-03-11
    "Introduction to Michael Simoneau":
    "/2026-03-11/Michael_Simoneau.mp3",
    // Track #8 - 2026-03-09
    "How the Zeroth Theory Fixes The Global Economy":
    "/2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
    // Track #9 - 2026-03-11
    "Forensic mapping of the Zeroth stack":
    "/2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
    // // Track #10 - 2026-03-09
    // "Good Morning, Michael Simoneau...":
    // "/2026-03-09/Teaching_Mari_to_teach_the_Puppeteer.mp3",
    // // Track #11 - 2026-03-09
    // "The Architect and his Autonomous Digital Organism":
    //   "/2026-03-09/The_Architect_and_his_autonomous_digital_organism.mp3",
    // // Track #12 - 2026-03-06
    // "Michael Simoneau and the Zeroth Theory":
    //   "/2026-03-06/Michael_Simoneau_and_the_Zeroth_Theory.mp3",
    // // Track #13 - 2026-03-04
    // "The Zeroth Theory of Digital Organisms":
    //   "/2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
    // // Track #14 - 2026-03-06
    // "Michael Simoneau's Zeroth Theory and Human Dollar":
    //   "/2026-03-06/Michael_Simoneau_s_Zeroth_Theory_and_Human_Dollar.mp3",
  },
}) as Record<string, string>;

const cleanPodcasts: Record<string, string> = {
  // -------------------
  // --- COLLAPSED Playlist (for Psychologists) ---
  "COLLAPSE_0": COLLAPSED_0 as string,
  ...psychologistPodcasts,
  // ------------------
  // --- EXPANDED Playlist (for Zeroth Theory) ---
  "EXPANDED_0": EXPANDED_0,
  ...zerothPodcasts,
};

const podcastsToPlaylist = (
  podcasts: Record<string, string>,
): Track[] => {
  return Object.entries(podcasts).map(([title, src]) => ({ title, src }));
};

const cleanPlaylist = podcastsToPlaylist(cleanPodcasts);

// Dynamically import all .mp3 files under the public/ directory as Melinda Francis podcasts

// This automatic import assumes use of Vite or Webpack with require.context or import.meta.glob support.
// If running in a Node.js environment or with Metro (Expo), you may need a build step or static declaration instead.

let melindaFrancisPodcasts: Record<string, string> = {};

if (typeof require !== "undefined" && typeof require.context === "function") {
  // For Webpack (not typical in Expo apps)
  const context = require.context('../../public/', true, /\.mp3$/);
  melindaFrancisPodcasts = context.keys().reduce<Record<string, string>>((acc, relPath) => {
    const fname = relPath.split('/').pop()?.replace(/_/g, ' ').replace(/\.mp3$/i, '') ?? relPath;
    acc[fname] = context(relPath);
    return acc;
  }, {});
} else {
  // Fallback: static (manually keep in sync with /public directory)
  melindaFrancisPodcasts = {
  };
}

// Sort the podcasts by the actual creation date parsed from the filename in the value (src) of each record.
// Assumes the file path contains a date in YYYY-MM-DD or YYYY_MM_DD format near the start.

function extractDateFromSrc(src: string): Date | null {
  // Match YYYY-MM-DD or YYYY_MM_DD or /YYYY-MM-DD/
  const match = src.match(/([12]\d{3})[-_](\d{2})[-_](\d{2})/);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, y, m, d] = match;
    // Month is 0-based in JS Date
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return null;
}

const melindaFrancisPlaylist = podcastsToPlaylist(
  Object.entries(melindaFrancisPodcasts)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_titleA, srcA], [_titleB, srcB]) => {
      const dateA = extractDateFromSrc(srcA);
      const dateB = extractDateFromSrc(srcB);
      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;
      // If no date found, fall back to alphabetical by src
      return srcA.localeCompare(srcB);
    })
    .reduce<Record<string, string>>((acc, [title, src]) => {
      if (src.includes('music/')) {
        return acc;
      }
      const date = extractDateFromSrc(src);
      if (date) {
        acc[date.toISOString().split('T')[0] + ' - ' + title] = src;
      } else {
        acc[title] = src;
      }
      return acc;
    }, {} as Record<string, string>)
);

const musicBeforeAndAfter = beforeAndAfter({
  when: MARCH_12_2026_12_00_PM,
  before: 
  {
    // Track #1
    "\"I'm In Deep\" - Mike Crane": "/music/ImInDeep.mp3",
    // Track #2
    "\"This Is Why We Do It\" - Mike Crane": "/music/ThisIsWhyWeDoIt.mp3",
    // Track #3
    "\"She's a Freak\" - Mike Crane": "/music/ShesAFreak.mp3",
  },
  after:
  {
    // Track #1
    "\"She's a Freak\" - Mike Crane": "/music/ShesAFreak.mp3",
    // Track #2
    "\"I'm In Deep\" - Mike Crane": "/music/ImInDeep.mp3",
    // Track #3
    "\"This Is Why We Do It\" - Mike Crane": "/music/ThisIsWhyWeDoIt.mp3",
  },
  end: {
    // Nerd Warning...
    "nerdy": "... after that, it get's really nerdy... but in a good way!",
  },
}) as Record<string, string>;

const musicPlaylist = podcastsToPlaylist(musicBeforeAndAfter);

export {
  cleanPlaylist,
  musicPlaylist,
  melindaFrancisPlaylist,
};
