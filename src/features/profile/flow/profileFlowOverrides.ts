import type { DeepLinkIntent, FlowOverrideState, VideoPlaybackPhase } from './profileFlowTypes';
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
  if (value === 'primary' || value === 'playlist') {
    return value;
  }
  return undefined;
};

const parseHashFragment = (
  hash: string,
): { sectionId?: string; params: URLSearchParams; sectionPathParts: string[] } => {
  const hashWithoutPrefix = hash.replace(/^#/, '').trim();
  if (!hashWithoutPrefix) {
    return { params: new URLSearchParams(), sectionPathParts: [] };
  }

  const [sectionRaw = '', hashQuery = ''] = hashWithoutPrefix.split('?', 2);
  const sectionId = sectionRaw || undefined;
  return {
    sectionId,
    params: new URLSearchParams(hashQuery),
    sectionPathParts: sectionRaw.split('/').filter(Boolean),
  };
};

export const parseDeepLinkIntent = (
  search: string,
  hash: string,
  overrideValue?: FlowOverrideState,
): DeepLinkIntent | undefined => {
  const params = new URLSearchParams(search);
  const { sectionId, params: hashParams, sectionPathParts } = parseHashFragment(hash);

  const hasFlowPlaylistTrack = parseInteger(params.get('flow.playlist.track')) !== undefined;
  const hasFlowVideoWatch = parseBooleanish(params.get('flow.video.watch')) === true;

  const audioPathTrack =
    sectionPathParts[0]?.toLowerCase() === 'audio' && sectionPathParts[1]
      ? parseInteger(sectionPathParts[1])
      : undefined;
  const hashTrack = parseInteger(hashParams.get('track')) ?? audioPathTrack;
  const hashPlay = parseBooleanish(hashParams.get('play')) ?? parseBooleanish(hashParams.get('autoplay'));
  const shouldAutoplayAudio = hashPlay ?? true;

  const section = sectionId?.toLowerCase();
  const isAudioTarget = section === 'audio' || (sectionPathParts[0]?.toLowerCase() === 'audio' && audioPathTrack !== undefined);
  if (!hasFlowPlaylistTrack && isAudioTarget && hashTrack !== undefined) {
    return {
      key: `${sectionId ?? 'audio'}?${hashParams.toString()}`,
      target: 'audio',
      playlistTrack: hashTrack,
      autoplayRequested: shouldAutoplayAudio,
    };
  }

  const consume = parseBooleanish(hashParams.get('consume')) ?? false;
  if (!hasFlowVideoWatch && section === 'videos' && consume) {
    return {
      key: `${sectionId ?? 'videos'}?${hashParams.toString()}`,
      target: 'videos',
      consume: true,
      autoplayRequested: true,
    };
  }

  if (!overrideValue) {
    return undefined;
  }

  // Backward compatibility: legacy flow.* URLs can still drive the same intent machine.
  if (overrideValue.playlist.track !== undefined) {
    return {
      key: `flow.playlist.track:${overrideValue.playlist.track}`,
      target: 'audio',
      playlistTrack: overrideValue.playlist.track,
      autoplayRequested: overrideValue.playlist.autoplay === true,
    };
  }

  if (overrideValue.video.watch) {
    return {
      key: `flow.video.watch:${overrideValue.video.watch ? '1' : '0'}`,
      target: 'videos',
      consume: true,
      autoplayRequested: true,
    };
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
  const videoWatch = parseBooleanish(params.get('flow.video.watch'));
  const videoPhase = parseVideoPhase(params.get('flow.video.phase'));
  const musicIframe = params.get('flow.music.iframe');

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
      autoplay: parseBooleanish(params.get('flow.playlist.autoplay')),
    },
    video: {
      watch: videoWatch,
      phase: videoPhase,
    },
    music: {
      iframe: musicIframe === 'ready' || musicIframe === 'failed' ? musicIframe : undefined,
    },
  };
};

