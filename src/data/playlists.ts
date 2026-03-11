import { Track } from "src/ui/players/PlaylistAudioPlayer";

const MARCH_12_2026_9_15_AM = new Date(2026, 2, 12, 9, 15, 0, 0);
const MARCH_12_2026_12_00_PM = new Date(2026, 2, 12, 12, 0, 0, 0);

/**
 * useBeforeAndAfter
 * 
 * Returns either the `before` or `after` string, depending on whether the current time
 * is before or after the provided `when` timestamp (local time).
 *
 * @param when - The Date or timestamp to compare against (default: March 12th 2026, 9:15AM local time)
 * @param before - The string to return if the current time is BEFORE the `when` date
 * @param after - The string to return if the current time is AFTER the `when` date
 *
 * Usage:
 *   const message = useBeforeAndAfter({
 *     when: new Date(2026, 2, 12, 9, 15), // Months are zero-indexed
 *     before: 'Not time yet!',
 *     after: 'It happened!',
 *   });
 */
export function beforeAndAfter({
  when = MARCH_12_2026_9_15_AM,
  before,
  after,
}: {
  when?: Date;
  before: string | Record<string, string>;
  after: string | Record<string, string>;
}): string | Record<string, string> {
  const now = new Date();
  return now.getTime() < when.getTime() ? before : after;
}

const COLLAPSED_0 = beforeAndAfter({
  when: MARCH_12_2026_9_15_AM,
  before: "Is Your Name Melinda Francis? If Not, Move Along... Nothing To See Here.",
  after: "Are you a Psychologist? If Not, Move Along... Nothing To See Here.",
}) as string;

const EXPANDED_0 = beforeAndAfter({
  when: MARCH_12_2026_9_15_AM,
  before: "Our New Reality: Rewriting Einstein to Fix the Global Economy",
  after: "Simoneau's Physics: Rewriting Einstein to Fix the Global Economy",
}) as string;

const psychologistPodcasts = beforeAndAfter({
  when: MARCH_12_2026_12_00_PM,
  before: {
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
    // Track #6 - 2026-03-11
    "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
    "2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
  },
  after: {
    // Track #1 - 2026-03-07
    "Michael Simoneau's Mathematical Proof of Sanity":
    "2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
    // Track #2 - 2026-03-11
    "The $20 Dollar Bet - Michael Simoneau's $20 Dollar Bet":
    "2026-03-10/Michael_Simoneau_s_$20_Dollar_Bet.mp3",
  },
}) as Record<string, string>;

const zerothPodcasts = beforeAndAfter({
  when: MARCH_12_2026_12_00_PM,
  before: {
    // Track #7 - 2026-03-09
    "How the Zeroth Theory Fixes The Global Economy":
    "2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
    // Track #8 - 2026-03-11
    "Forensic mapping of the Zeroth stack":
    "2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
  },
  after: {
    // Track #7 - 2026-03-09
    "How the Zeroth Theory Fixes The Global Economy":
    "2026-03-09/How_Zeroth_Theory_Fixes_AI_Hallucinations.mp3",
    // Track #8 - 2026-03-11
    "Forensic mapping of the Zeroth stack":
    "2026-03-10/Forensic_mapping_of_the_Zeroth_stack.mp3",
    // Track #8 - 2026-03-09
    "Good Morning, Michael Simoneau...":
    "2026-03-09/Teaching_Mari_to_teach_the_Puppeteer.mp3",
    // Track #9 - 2026-03-09
    "The Architect and his Autonomous Digital Organism":
      "2026-03-09/The_Architect_and_his_autonomous_digital_organism.mp3",
    // Track #10 - 2026-03-06
    "Michael Simoneau and the Zeroth Theory":
      "2026-03-06/Michael_Simoneau_and_the_Zeroth_Theory.mp3",
    // Track #11 - 2026-03-04
    "The Zeroth Theory of Digital Organisms":
      "2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
    // Track #12 - 2026-03-06
    "Michael Simoneau's Zeroth Theory and Human Dollar":
      "2026-03-06/Michael_Simoneau_s_Zeroth_Theory_and_Human_Dollar.mp3",
  },
}) as Record<string, string>;

const cleanPodcasts: Record<string, string> = {
  // -------------------
  // --- COLLAPSED Playlist (for Psychologists) ---
  "COLLAPSED_0": COLLAPSED_0 as string,
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

const musicPlaylist: Track[] = [
  {
    title: `"I'm In Deep" - Mike Crane`,
    src: "/music/ImInDeep.mp3",
  },
  {
    title: `"This Is Why We Do It" - Mike Crane`,
    src: "/music/This is why we do it.mp3",
  },
];

export {
  cleanPlaylist,
  musicPlaylist,
};
