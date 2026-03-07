import { Track } from "src/ui/players/PlaylistAudioPlayer";

const cleanPodcasts: Record<string, string> = {
  "Should Michael Simoneau Fire His Psychologist?":
    "2026-03-07/Should_Michael_Simoneau_delete_his_psychologist.mp3",
  "Michael Simoneau's Mathematical Proof of Sanity":
    "2026-03-07/Michael_Simoneau_s_mathematical_proof_of_sanity.mp3",
  "Rewriting Einstein to Buy Your Milk":
    "2026-03-04/Rewriting_Einstein_to_buy_your_milk.mp3",
  "Michael Simoneau and the Zeroth Theory":
    "2026-03-06/Michael_Simoneau_and_the_Zeroth_Theory.mp3",
  "The Zeroth Theory of Digital Organisms":
    "2026-03-04/The_Zeroth_Theory_of_Digital_Organisms.mp3",
  "Michael Simoneau's Zeroth Theory and Human Dollar":
    "2026-03-06/Michael_Simoneau_s_Zeroth_Theory_and_Human_Dollar.mp3",
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
