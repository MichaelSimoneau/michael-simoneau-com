import type { FlowOverrideState, VideoPlaybackPhase } from './profileFlowTypes';
import { defaultFlowOverrideState } from './profileFlowReducer';

const parseBooleanish = (value: string | null): boolean | undefined => {
  if (value === null) return undefined;
  if (value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'on') return true;
  if (value === '0' || value.toLowerCase() === 'false' || value.toLowerCase() === 'off') return false;
  return undefined;
};

const parseInteger = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.trunc(parsed);
};

const parseVideoPhase = (value: string | null): VideoPlaybackPhase | undefined => {
  if (!value) return undefined;
  if (value === 'prepended' || value === 'primary' || value === 'second' || value === 'playlist') {
    return value;
  }
  return undefined;
};

export const parseFlowOverrides = (search: string): FlowOverrideState => {
  const params = new URLSearchParams(search);

  const mode = params.get('flow.mode') === 'force' ? 'force' : 'normal';
  const debug = params.get('flow.debug') === '1';
  const navSection = params.get('flow.nav.section') ?? undefined;
  const playlistTrack = parseInteger(params.get('flow.playlist.track'));
  const playlistTime = parseInteger(params.get('flow.playlist.time'));
  const playlistAutoplay = parseBooleanish(params.get('flow.playlist.autoplay'));
  const videoWatch = parseBooleanish(params.get('flow.video.watch'));
  const videoPhase = parseVideoPhase(params.get('flow.video.phase'));
  const videoAutoplayRequest = parseBooleanish(params.get('flow.video.autoplayRequest'));
  const musicIframe = params.get('flow.music.iframe');
  const restrictedRaw = params.get('flow.restricted');
  const restricted = restrictedRaw === 'on' || restrictedRaw === 'off' ? restrictedRaw : undefined;

  return {
    ...defaultFlowOverrideState,
    mode,
    debug,
    nav: {
      section: navSection,
    },
    playlist: {
      track: playlistTrack,
      time: playlistTime,
      autoplay: playlistAutoplay,
    },
    video: {
      watch: videoWatch,
      phase: videoPhase,
      autoplayRequest: videoAutoplayRequest,
    },
    music: {
      iframe: musicIframe === 'ready' || musicIframe === 'failed' ? musicIframe : undefined,
    },
    restricted,
  };
};

