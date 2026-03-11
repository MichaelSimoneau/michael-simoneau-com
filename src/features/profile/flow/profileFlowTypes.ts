export type NavigationMachineState = 'idle' | 'resolvingHash' | 'scrolling' | 'settled';
export type MusicMachineState = 'iframeInit' | 'loading' | 'ready' | 'failed';
export type PlaylistMachineState =
  | 'idle'
  | 'loadingTrack'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'handoffPending'
  | 'restrictedLockout';
export type VideoPlaybackPhase = 'prepended' | 'primary' | 'second' | 'playlist';
export type VideoMachineState = 'hidden' | 'bootingApi' | 'playerReady' | 'watching' | 'handoffCountdown';
export type MediaArbitrationState = 'none' | 'sourceActive';
export type OverrideMachineState = 'parse' | 'applied' | 'forcing';

export interface FlowOverrideState {
  mode: 'normal' | 'force';
  debug: boolean;
  nav: {
    section?: string;
  };
  playlist: {
    track?: number;
    time?: number;
    autoplay?: boolean;
  };
  video: {
    watch?: boolean;
    phase?: VideoPlaybackPhase;
    autoplayRequest?: boolean;
  };
  music: {
    iframe?: 'ready' | 'failed';
  };
  restricted?: 'on' | 'off';
}

export interface ProfileFlowState {
  navigation: {
    machine: NavigationMachineState;
    targetSectionId?: string;
    sectionOffsetPx: number;
  };
  music: {
    machine: MusicMachineState;
    iframeHeight: number;
    hasLoaded: boolean;
  };
  playlist: {
    machine: PlaylistMachineState;
    currentTrackIndex: number;
    isRestrictedActive: boolean;
  };
  video: {
    machine: VideoMachineState;
    isWatching: boolean;
    isApiReady: boolean;
    isPlayerReady: boolean;
    prependModeEnabled: boolean;
    playbackPhase: VideoPlaybackPhase;
    isDelayOverlayVisible: boolean;
    countdownValue: number | null;
  };
  media: {
    machine: MediaArbitrationState;
    activeSource?: string;
  };
  override: {
    machine: OverrideMachineState;
    value: FlowOverrideState;
  };
  footerExpansionFactor: number;
}

export type ProfileFlowAction =
  | { type: 'NAV_HASH_RESOLVE_REQUESTED'; sectionId?: string; sectionOffsetPx?: number }
  | { type: 'NAV_SCROLL_STARTED' }
  | { type: 'NAV_SCROLL_SETTLED' }
  | { type: 'MUSIC_IFRAME_LOADING' }
  | { type: 'MUSIC_IFRAME_READY' }
  | { type: 'MUSIC_IFRAME_FAILED' }
  | { type: 'MUSIC_IFRAME_HEIGHT_UPDATED'; height: number }
  | { type: 'PLAYLIST_TRACK_CHANGED'; trackIndex: number }
  | { type: 'PLAYLIST_PLAYING' }
  | { type: 'PLAYLIST_PAUSED' }
  | { type: 'PLAYLIST_ENDED' }
  | { type: 'PLAYLIST_HANDOFF_PENDING' }
  | { type: 'PLAYLIST_RESTRICTED_TOGGLED'; active: boolean }
  | { type: 'VIDEO_WATCH_REQUESTED'; mode?: 'standard' | 'playlist' }
  | { type: 'VIDEO_API_READY' }
  | { type: 'VIDEO_PLAYER_READY' }
  | { type: 'VIDEO_PREPEND_MODE_UPDATED'; enabled: boolean }
  | { type: 'VIDEO_PHASE_CHANGED'; phase: VideoPlaybackPhase }
  | { type: 'VIDEO_HANDOFF_COUNTDOWN_STARTED'; countdown: number }
  | { type: 'VIDEO_HANDOFF_COUNTDOWN_UPDATED'; countdown: number | null; visible: boolean }
  | { type: 'VIDEO_HIDDEN' }
  | { type: 'MEDIA_SOURCE_ACTIVATED'; source?: string }
  | { type: 'OVERRIDE_PARSE_STARTED' }
  | { type: 'OVERRIDE_APPLIED'; value: FlowOverrideState }
  | { type: 'FOOTER_EXPANSION_UPDATED'; factor: number };

