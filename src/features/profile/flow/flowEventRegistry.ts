import { APP_MEDIA_PLAY_INTENT_EVENT } from '../../../ui/players/mediaEvents';

export const FLOW_EVENT_REGISTRY = {
  videoAutoplayRequest: {
    name: 'videohero:autoplay-request',
    source: 'PlaylistAudioPlayer',
    target: 'VideoHeroSection/ProfileFlowProvider',
  },
  videoPrependMode: {
    name: 'videohero:prepend-mode',
    source: 'PlaylistAudioPlayer',
    target: 'VideoHeroSection/ProfileFlowProvider',
  },
  mediaPlayIntent: {
    name: APP_MEDIA_PLAY_INTENT_EVENT,
    source: 'Any player',
    target: 'VideoHeroSection/ProfileFlowProvider',
  },
} as const;

export type FlowEventRegistryName = (typeof FLOW_EVENT_REGISTRY)[keyof typeof FLOW_EVENT_REGISTRY]['name'];

