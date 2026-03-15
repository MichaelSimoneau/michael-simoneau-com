export const APP_MEDIA_PLAY_INTENT_EVENT = 'app:media-play-intent';

export type MediaPlayIntentSource =
  | 'video-hero'
  | 'playlist-audio'
  | 'audio-player'
  | 'audio-cc'
  | 'blog-speech'
  | 'speech-player'
  | 'universal-player';

export interface AppMediaPlayIntentDetail {
  source: MediaPlayIntentSource;
}

export const dispatchMediaPlayIntent = (source: MediaPlayIntentSource) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<AppMediaPlayIntentDetail>(APP_MEDIA_PLAY_INTENT_EVENT, {
      detail: { source },
    }),
  );
};
