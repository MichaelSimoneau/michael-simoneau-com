export type NavigationMachineState = 'idle' | 'resolvingHash' | 'scrolling' | 'settled';
export type MusicMachineState = 'iframeInit' | 'loading' | 'ready' | 'failed';
export type PlaylistMachineState =
  | 'idle'
  | 'loadingTrack'
  | 'playing'
  | 'paused'
  | 'ended';
export type VideoPlaybackPhase = 'prepended' | 'primary' | 'second' | 'playlist';
export type VideoMachineState = 'hidden' | 'bootingApi' | 'playerReady' | 'watching';
export type MediaArbitrationState = 'none' | 'sourceActive';
export type OverrideMachineState = 'parse' | 'applied' | 'forcing';
export type ConsentMachineState = 'unknown' | 'required' | 'granted';

export type ConsentGateSource =
  | 'video-hero'
  | 'playlist-audio'
  | 'audio-player'
  | 'blog-speech'
  | 'speech-player'
  | 'universal-player';

export interface PendingMediaIntent {
  source: ConsentGateSource;
  actionId: string;
}

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
  };
  music: {
    iframe?: 'ready' | 'failed';
  };
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
    isRestrictedActive?: boolean;
    melindaArmedSectionId?: string;
    melindaActiveSectionId?: string;
    melindaHandoffSectionId?: string;
    controlsNormalizedAfterRefresh?: boolean;
  };
  video: {
    machine: VideoMachineState;
    isWatching: boolean;
    isApiReady: boolean;
    isPlayerReady: boolean;
    prependModeEnabled: boolean;
    playbackPhase: VideoPlaybackPhase;
    isDelayOverlayVisible?: boolean;
    countdownValue?: number | null;
  };
  consent: {
    machine: ConsentMachineState;
    hasAcceptedTerms: boolean;
    gateSource?: ConsentGateSource;
    pendingIntent?: PendingMediaIntent;
  };
  media: {
    machine: MediaArbitrationState;
    activeSource?: string;
  };
  reloadTimer?: {
    machine: 'idle' | 'running' | 'completed';
    startedAtMs: number | null;
    durationMs: number;
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
  | { type: 'MELINDA_COLLAPSE_TRIGGER_ARMED'; sectionId: string }
  | { type: 'MELINDA_COLLAPSE_TRIGGER_FIRED'; sectionId: string; trackIndex: number }
  | { type: 'PLAYLIST_HANDOFF_TO_VIDEOS_REQUESTED'; sectionId?: string }
  | { type: 'POST_REFRESH_CONTROL_NORMALIZED' }
  | { type: 'VIDEO_WATCH_REQUESTED'; mode?: 'standard' | 'playlist' }
  | { type: 'VIDEO_API_READY' }
  | { type: 'VIDEO_PLAYER_READY' }
  | { type: 'VIDEO_PREPEND_MODE_UPDATED'; enabled: boolean }
  | { type: 'VIDEO_PHASE_CHANGED'; phase: VideoPlaybackPhase }
  | { type: 'VIDEO_HANDOFF_COUNTDOWN_STARTED'; countdown: number }
  | { type: 'VIDEO_HANDOFF_COUNTDOWN_UPDATED'; countdown: number | null; visible: boolean }
  | { type: 'VIDEO_HIDDEN' }
  | { type: 'CONSENT_STATUS_LOADED'; hasAcceptedTerms: boolean }
  | { type: 'CONSENT_PROMPT_REQUESTED'; source: ConsentGateSource; actionId: string }
  | { type: 'CONSENT_ACCEPTED' }
  | { type: 'CONSENT_PENDING_INTENT_CLEARED' }
  | { type: 'MEDIA_SOURCE_ACTIVATED'; source?: string }
  | { type: 'RELOAD_TIMER_STARTED'; durationMs: number; startedAtMs: number }
  | { type: 'RELOAD_TIMER_COMPLETED' }
  | { type: 'RELOAD_TIMER_CLEARED' }
  | { type: 'OVERRIDE_PARSE_STARTED' }
  | { type: 'OVERRIDE_APPLIED'; value: FlowOverrideState }
  | { type: 'FOOTER_EXPANSION_UPDATED'; factor: number };

