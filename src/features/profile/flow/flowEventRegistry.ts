import { APP_MEDIA_PLAY_INTENT_EVENT } from '../../../ui/players/mediaEvents';

export const FLOW_EVENT_REGISTRY = {
  mediaPlayIntent: {
    name: APP_MEDIA_PLAY_INTENT_EVENT,
    source: 'Any player',
    target: 'VideoHeroSection/ProfileFlowProvider',
  },
} as const;

export type FlowEventRegistryName = (typeof FLOW_EVENT_REGISTRY)[keyof typeof FLOW_EVENT_REGISTRY]['name'];

