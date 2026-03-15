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
          .split("/audio/")
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
  const match = src.match(/([12]\d{3})[-_](\d{2})[-_](\d{2})/gi);
  if (match) {
    if (match.length > 1) {
      for (const _m of match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, y, m, d] = _m.match(/([12]\d{3})[-_](\d{2})[-_](\d{2})/gi) ?? [];
        if (y && m && d) {
          return new Date(Number(y), Number(m) - 1, Number(d));
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, y, m, d] = match[0].match(/([12]\d{3})[-_](\d{2})[-_](\d{2})/gi) ?? [];
      if (y && m && d) {
        return new Date(Number(y), Number(m) - 1, Number(d));
      }
    }
  }
  return null;
}

export const allPodcasts = Object.entries(getAllMP3Files())
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
  // Track #1 - 2026-03-12
  "Michael Simoneau - A Quick Introduction":
    "/audio/2026-03-12/Michael_Simoneau-A_Quick_Introduction.mp3",
  // Track #2 - 2026-03-11
  "Learn About Michael Simoneau and His Work":
    "/audio/2026-03-11/Michael_Simoneau.mp3",
  //>> GROUP: "HashWeb.Network & The Human Dollar"
  EXPANDED_0: "HashWeb.Network & The Human Dollar",
  "Michael Simoneau Saves The World...":
    "/audio/2026-03-14/Michael_Simoneau_Saves_The_World.mp3",
  "...by Building a New One Where Money Actually Decays":
    "/audio/2026-03-14/The_Internet_Where_Money_Actually_Rots.mp3",
  COLLAPSE_0: "Further Down The Rabbit Hole...",
  "Why Michael Simoneau Engineered Expiring Money":
    "/audio/2026-03-14/Why_Michael_Simoneau_engineered_expiring_money.mp3",
  // Track #5 - 2026-03-12
  "Planning The Future Without A Past":
    "/audio/2026-03-13/Planning_the_future_without_a_past.mp3",
  // Track #5 - 2026-03-12
  "Your Face Is the HashWeb Wallet":
    "/audio/2026-03-13/Your_Face_Is_the_HashWeb_Wallet.mp3",
  // Track #7 - 2026-03-13
  "Reality as a 16-bit Headless Server":
    "/audio/2026-03-13/Reality_as_a_16-bit_Headless_Server.mp3",
  // Track #8 - 2026-03-13
  "The Meritocracy of the Decaying Human Dollar":
    "/audio/2026-03-14/The_meritocracy_of_the_decaying_Human_Dollar.mp3",
  // Track #11 - 2026-03-14
  "Should Your Digital Dollars Literally Decay?":
    "/audio/2026-03-14/Should_Your_Digital_Dollars_Literally_Decay_.mp3",
  // Track #9 - 2026-03-14
  "The Physics of the Decaying Human Dollar":
    "/audio/2026-03-14/The_Physics_of_the_Rotting_Human_Dollar.mp3",
  // Track #3 - 2026-03-09
  "How the The Human Dollar Fixes The Global Economy":
    "/audio/2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
  // Track #4 - 2026-03-11
  "Forensic mapping of the Zeroth stack":
    "/audio/2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
  //>> GROUP: "Mind of Michael Simoneau"
  EXPANDED_1: "From the Mind of Michael Simoneau...",
  // Track #10 - 2026-03-14
  '"Agency is Authority Not Control" - Michael Simoneau':
    "/audio/2026-03-14/Agency_is_Authority_Not_Control.mp3",
  // Track #11 - 2026-03-05
  '"The High-Five Trick" - Michael Simoneau':
    "/audio/2026-02-20/Chardon_Rd.mp3",
  // Track #12 - 2026-03-05
  '"The High-Five Trick - Extended Version" - Michael Simoneau':
    "/audio/Stop_Watching_Cartoons__It_is_Saturday_Morning__.mp3",
});

const melindaFrancisPlaylist = podcastsToPlaylist({
  // Track #-1 - 2026-02-20
  'The First File I Sent via Google Drive: "Chardon Rd" (my 2nd SMS)':
    "/audio/2026-02-20/Chardon_Rd.mp3",
  EXPANDED_0: "Why Michael Simoneau Trapped Melinda Francis...",
  "Michael Simoneau Cured His Sanity by Diagnosing Everyone Else":
    "/audio/2026-03-14/Why_Michael_Simoneau_engineered_expiring_money.mp3",
  EXPANDED_1: "AI Exposes Michael Simoneau's Behavior",
  "Google's Latest AI Exposes Michael Simoneau's Behavior": "/audio/2026-03-15/Google's_Latest_AI_Analyzed_Michael_Simoneau's_Behavior.mp3",
  COLLAPSE_0: "How Michael Simoneau is 'The Living Loophole'...",
  "...and How He Trapped Melinda Francis":
    "/audio/2026-03-13/Zero-Sudoku-Implementation.mp3",
  "*NOT A PSYCHIATRIC CASE*...this might be a Psychiatric Case... lol. ":
    "/audio/Stop_Watching_Cartoons__It_is_Saturday_Morning__.mp3",
  // "Group: the "White Noise"
  // COLLAPSE_0:
  //   '"Trap":  ["White Noise" / "Manufactured Mania" / "Psychotic Delusion"]',
  // // Track #1 - 2026-03-07
  // "Should Michael Simoneau Fire His Psychologist?":
  //   "/audio/2026-03-07/Should_Michael_Simoneau_delete_his_psychologist.mp3",
  // // Track #2 - 2026-03-07
  // "Michael Simoneau's Mathematical Proof of Sanity":
  //   "/audio/2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
  // // Track #3 - 2026-03-04
  // "Rewriting Einstein to Buy Your Milk":
  //   "/audio/2026-03-04/Rewriting_Einstein_to_buy_your_milk.mp3",
  // // Track #4 - 2026-03-08
  // "Michael's Sunday Morning Brief: Sunday, March 8, 2026. Good Morning, Michael Simoneau...":
  //   "/audio/2026-03-08/Prompt_for-Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
  // // Track #5 - 2026-03-08
  // "Why Michael's Psychologist Rescheduled March 19, 2026.":
  //   "/audio/2026-03-08/Why_Michael_hung_up_on_Melinda_and_why_she_should_schedule_March_19_and_why_Michael_could_not_care_less_either_way.mp3",
  // // Track #6 - 2026-03-11
  // "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
  //   "/audio/2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
  // // Track #7 - 2026-03-12
  // "March 12, 2026 - Good Morning, Michael Simoneau...":
  //   "/audio/2026-03-12/Engineering_the_9_AM_therapy_trap.mp3",
  // // The rest of the podcasts
  // ...allPodcasts,
});

const musicPlaylist = podcastsToPlaylist({
  // Track #1
  '"I\'m In Deep" - Mike Crane': "/music/ImInDeep.mp3",
  // Track #2
  '"She\'s a Freak" - Mike Crane': "/music/ShesAFreak.mp3",
  // Track #3
  '"This Is Why We Do It" - Mike Crane': "/music/ThisIsWhyWeDoIt.mp3",
  // Track #4
  '"The Drugs Work" - Mike Crane': "/music/TheDrugsWork.mp3",
});

export { cleanPlaylist, musicPlaylist, melindaFrancisPlaylist };
