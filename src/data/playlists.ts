import { Track } from "src/ui/players/PlaylistAudioPlayer";

const podcastsToPlaylist = (podcasts: Record<string, string>): Track[] => {
  return Object.entries(podcasts).map(([title, src]) => ({ title, src }));
};

// Dynamically import all .mp3 files under the public/ directory
const getAllMP3Files = () => {
  if (typeof require !== "undefined" && typeof require.context === "function") {
    // For Webpack (not typical in Expo apps)
    const context = require.context("../../public/", true, /\.mp3$/);
    return context.keys().reduce<Record<string, string>>((acc, relPath) => {
      const fname =
        relPath
          .split("/")
          .pop()
          ?.replace(/_/g, " ")
          .replace(/\.mp3$/i, "") ?? relPath;
      acc[fname] = context(relPath);
      return acc;
    }, {});
  } else {
    // Fallback: static (manually keep in sync with /public directory)
    return {};
  }
};

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

const allPodcasts = Object.entries(getAllMP3Files())
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
  .reduce<Record<string, string>>(
    (acc, [title, src]) => {
      if (src.includes("music/")) {
        return acc;
      }
      const date = extractDateFromSrc(src);
      if (date) {
        acc[date.toISOString().split("T")[0] + " - " + title] = src;
      } else {
        acc[title] = src;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

const cleanPlaylist = podcastsToPlaylist({
  // Track #3 - 2026-03-12
  "Michael Simoneau - A Quick Introduction":
    "2026-03-12/Michael_Simoneau-A_Quick_Introduction.mp3",
  // Track #4 - 2026-03-11
  "Learn About Michael Simoneau and His Work":
    "/2026-03-11/Michael_Simoneau.mp3",
  // Track #5 - 2026-03-09
  "How the Zeroth Theory Fixes The Global Economy":
    "/2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
  // Track #6 - 2026-03-11
  "Forensic mapping of the Zeroth stack":
    "/2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
});

const melindaFrancisPlaylist = podcastsToPlaylist({
  // Track #0 - 2026-03-12
  "Michael Simoneau: The Patient Who 5150'd His Therapist...":
    "/2026-03-12/The_patient_who_5150d_his_therapist.mp3",
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
  // Track #5 - 2026-03-08
  "Why Michael's Psychologist Rescheduled March 19, 2026.":
    "/2026-03-08/Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
  // Track #6 - 2026-03-11
  "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
    "/2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
  // Track #7 - 2026-03-12
  "March 12, 2026 - Good Morning, Michael Simoneau...":
    "/2026-03-12/Engineering_the_9_AM_therapy_trap.mp3",
  // The rest of the podcasts
  ...allPodcasts,
});

const musicPlaylist = podcastsToPlaylist({
  // Track #1
  '"She\'s a Freak" - Mike Crane': "/music/ShesAFreak.mp3",
  // Track #2
  '"I\'m In Deep" - Mike Crane': "/music/ImInDeep.mp3",
  // Track #3
  '"This Is Why We Do It" - Mike Crane': "/music/ThisIsWhyWeDoIt.mp3",
  // Nerd Warning...
  nerdy: "... after that, it get's really nerdy... but in a good way!",
});

export { cleanPlaylist, musicPlaylist, melindaFrancisPlaylist };
