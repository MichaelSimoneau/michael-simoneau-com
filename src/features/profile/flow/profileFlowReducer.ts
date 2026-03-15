import type { FlowOverrideState, ProfileFlowAction, ProfileFlowState } from './profileFlowTypes';

export const SOUNDON_DEFAULT_HEIGHT = 2400;

export const defaultFlowOverrideState: FlowOverrideState = {
  mode: 'normal',
  debug: false,
  nav: {},
  playlist: {},
  video: {},
  music: {},
};

export const initialProfileFlowState: ProfileFlowState = {
  navigation: {
    machine: 'idle',
    sectionOffsetPx: 80,
  },
  music: {
    machine: 'iframeInit',
    iframeHeight: SOUNDON_DEFAULT_HEIGHT,
    hasLoaded: false,
  },
  playlist: {
    machine: 'idle',
    currentTrackIndex: 0,
    isRestrictedActive: false,
    controlsNormalizedAfterRefresh: false,
  },
  video: {
    machine: 'hidden',
    isWatching: false,
    isApiReady: false,
    isPlayerReady: false,
    prependModeEnabled: false,
    playbackPhase: 'primary',
    isDelayOverlayVisible: false,
    countdownValue: null,
  },
  consent: {
    machine: 'unknown',
    hasAcceptedTerms: false,
  },
  media: {
    machine: 'none',
  },
  reloadTimer: {
    machine: 'idle',
    startedAtMs: null,
    durationMs: 0,
  },
  override: {
    machine: 'parse',
    value: defaultFlowOverrideState,
  },
  footerExpansionFactor: 0,
};

export function profileFlowReducer(
  state: ProfileFlowState,
  action: ProfileFlowAction,
): ProfileFlowState {
  switch (action.type) {
    case 'NAV_HASH_RESOLVE_REQUESTED':
      return {
        ...state,
        navigation: {
          machine: 'resolvingHash',
          targetSectionId: action.sectionId,
          sectionOffsetPx: action.sectionOffsetPx ?? state.navigation.sectionOffsetPx,
        },
      };
    case 'NAV_SCROLL_STARTED':
      return {
        ...state,
        navigation: { ...state.navigation, machine: 'scrolling' },
      };
    case 'NAV_SCROLL_SETTLED':
      return {
        ...state,
        navigation: { ...state.navigation, machine: 'settled' },
      };
    case 'MUSIC_IFRAME_LOADING':
      return {
        ...state,
        music: { ...state.music, machine: 'loading' },
      };
    case 'MUSIC_IFRAME_READY':
      return {
        ...state,
        music: { ...state.music, machine: 'ready', hasLoaded: true },
      };
    case 'MUSIC_IFRAME_FAILED':
      return {
        ...state,
        music: { ...state.music, machine: 'failed' },
      };
    case 'MUSIC_IFRAME_HEIGHT_UPDATED':
      return {
        ...state,
        music: { ...state.music, iframeHeight: action.height },
      };
    case 'PLAYLIST_TRACK_CHANGED':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          machine: 'loadingTrack',
          currentTrackIndex: action.trackIndex,
        },
      };
    case 'PLAYLIST_PLAYING':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          machine: 'playing',
        },
      };
    case 'PLAYLIST_PAUSED':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          machine: 'paused',
        },
      };
    case 'PLAYLIST_ENDED':
      return {
        ...state,
        playlist: { ...state.playlist, machine: 'ended' },
      };
    case 'VIDEO_WATCH_REQUESTED':
      return {
        ...state,
        video: {
          ...state.video,
          machine: state.video.isApiReady ? 'playerReady' : 'bootingApi',
          isWatching: true,
        },
      };
    case 'VIDEO_API_READY':
      return {
        ...state,
        video: {
          ...state.video,
          machine: state.video.isWatching ? 'playerReady' : state.video.machine,
          isApiReady: true,
        },
      };
    case 'VIDEO_PLAYER_READY':
      return {
        ...state,
        video: {
          ...state.video,
          machine: state.video.isWatching ? 'watching' : 'playerReady',
          isPlayerReady: true,
        },
      };
    case 'VIDEO_PREPEND_MODE_UPDATED':
      return {
        ...state,
        video: { ...state.video, prependModeEnabled: action.enabled },
      };
    case 'VIDEO_PHASE_CHANGED':
      return {
        ...state,
        video: { ...state.video, playbackPhase: action.phase, machine: 'watching' },
      };
    case 'VIDEO_HIDDEN':
      return {
        ...state,
        video: {
          ...state.video,
          machine: 'hidden',
          isWatching: false,
          isPlayerReady: false,
        },
      };
    case 'CONSENT_STATUS_LOADED':
      return {
        ...state,
        consent: {
          ...state.consent,
          hasAcceptedTerms: action.hasAcceptedTerms,
          machine: action.hasAcceptedTerms ? 'granted' : 'required',
          gateSource: action.hasAcceptedTerms ? undefined : state.consent.gateSource,
          pendingIntent: action.hasAcceptedTerms ? undefined : state.consent.pendingIntent,
        },
      };
    case 'CONSENT_PROMPT_REQUESTED':
      return {
        ...state,
        consent: {
          ...state.consent,
          machine: state.consent.hasAcceptedTerms ? 'granted' : 'required',
          gateSource: state.consent.hasAcceptedTerms ? undefined : action.source,
          pendingIntent: state.consent.hasAcceptedTerms
            ? undefined
            : { source: action.source, actionId: action.actionId },
        },
      };
    case 'CONSENT_ACCEPTED':
      return {
        ...state,
        consent: {
          ...state.consent,
          machine: 'granted',
          hasAcceptedTerms: true,
        },
      };
    case 'CONSENT_PENDING_INTENT_CLEARED':
      return {
        ...state,
        consent: {
          ...state.consent,
          gateSource: undefined,
          pendingIntent: undefined,
        },
      };
    case 'MEDIA_SOURCE_ACTIVATED':
      return {
        ...state,
        media: action.source
          ? { machine: 'sourceActive', activeSource: action.source }
          : { machine: 'none' },
      };
    case 'OVERRIDE_PARSE_STARTED':
      return {
        ...state,
        override: { ...state.override, machine: 'parse' },
      };
    case 'OVERRIDE_APPLIED':
      return {
        ...state,
        override: {
          machine: action.value.mode === 'force' ? 'forcing' : 'applied',
          value: action.value,
        },
      };
    case 'FOOTER_EXPANSION_UPDATED':
      return {
        ...state,
        footerExpansionFactor: action.factor,
      };
    default:
      return state;
  }
}

