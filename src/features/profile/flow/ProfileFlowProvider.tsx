import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { APP_MEDIA_PLAY_INTENT_EVENT } from '../../../ui/players/mediaEvents';
import { FLOW_EVENT_REGISTRY } from './flowEventRegistry';
import { initialProfileFlowState, profileFlowReducer } from './profileFlowReducer';
import { parseFlowOverrides } from './profileFlowOverrides';
import type { ProfileFlowAction, ProfileFlowState } from './profileFlowTypes';

interface ProfileFlowContextValue {
  state: ProfileFlowState;
  dispatch: React.Dispatch<ProfileFlowAction>;
}

const ProfileFlowContext = createContext<ProfileFlowContextValue | undefined>(undefined);

interface ProfileFlowProviderProps {
  children: React.ReactNode;
}

export const ProfileFlowProvider: React.FC<ProfileFlowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(profileFlowReducer, initialProfileFlowState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyOverrides = () => {
      dispatch({ type: 'OVERRIDE_PARSE_STARTED' });
      dispatch({ type: 'OVERRIDE_APPLIED', value: parseFlowOverrides(window.location.search) });
    };
    applyOverrides();
    window.addEventListener('hashchange', applyOverrides);
    window.addEventListener('popstate', applyOverrides);
    return () => {
      window.removeEventListener('hashchange', applyOverrides);
      window.removeEventListener('popstate', applyOverrides);
    };
  }, []);

  useEffect(() => {
    const overrideValue = state.override.value;
    if (overrideValue.playlist.track !== undefined) {
      dispatch({ type: 'PLAYLIST_TRACK_CHANGED', trackIndex: Math.max(0, overrideValue.playlist.track - 1) });
    }
    if (overrideValue.playlist.autoplay) {
      dispatch({ type: 'PLAYLIST_PLAYING' });
    }
    if (overrideValue.video.watch) {
      dispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'standard' });
    }
    if (overrideValue.video.phase) {
      dispatch({ type: 'VIDEO_PHASE_CHANGED', phase: overrideValue.video.phase });
    }
    if (overrideValue.video.autoplayRequest) {
      dispatch({ type: 'PLAYLIST_HANDOFF_PENDING' });
      dispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'standard' });
    }
    if (overrideValue.music.iframe === 'ready') {
      dispatch({ type: 'MUSIC_IFRAME_READY' });
    } else if (overrideValue.music.iframe === 'failed') {
      dispatch({ type: 'MUSIC_IFRAME_FAILED' });
    }
    if (overrideValue.restricted === 'on') {
      dispatch({ type: 'PLAYLIST_RESTRICTED_TOGGLED', active: true });
    } else if (overrideValue.restricted === 'off') {
      dispatch({ type: 'PLAYLIST_RESTRICTED_TOGGLED', active: false });
    }
  }, [state.override.value]);

  useEffect(() => {
    const handleVideoAutoplayRequest = () => {
      dispatch({ type: 'PLAYLIST_HANDOFF_PENDING' });
      dispatch({ type: 'VIDEO_WATCH_REQUESTED', mode: 'standard' });
    };

    const handlePrependMode = (event: Event) => {
      const customEvent = event as CustomEvent<{ enabled?: boolean }>;
      dispatch({
        type: 'VIDEO_PREPEND_MODE_UPDATED',
        enabled: Boolean(customEvent.detail?.enabled),
      });
    };

    const handleMediaPlayIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: string }>;
      dispatch({
        type: 'MEDIA_SOURCE_ACTIVATED',
        source: customEvent.detail?.source,
      });
    };

    window.addEventListener(FLOW_EVENT_REGISTRY.videoAutoplayRequest.name, handleVideoAutoplayRequest);
    window.addEventListener(FLOW_EVENT_REGISTRY.videoPrependMode.name, handlePrependMode);
    window.addEventListener(APP_MEDIA_PLAY_INTENT_EVENT, handleMediaPlayIntent);
    return () => {
      window.removeEventListener(FLOW_EVENT_REGISTRY.videoAutoplayRequest.name, handleVideoAutoplayRequest);
      window.removeEventListener(FLOW_EVENT_REGISTRY.videoPrependMode.name, handlePrependMode);
      window.removeEventListener(APP_MEDIA_PLAY_INTENT_EVENT, handleMediaPlayIntent);
    };
  }, []);

  const value = useMemo<ProfileFlowContextValue>(() => ({ state, dispatch }), [state]);
  return <ProfileFlowContext.Provider value={value}>{children}</ProfileFlowContext.Provider>;
};

export const useProfileFlow = (): ProfileFlowContextValue => {
  const context = useContext(ProfileFlowContext);
  if (!context) {
    throw new Error('useProfileFlow must be used within a ProfileFlowProvider');
  }
  return context;
};

export const useProfileFlowState = () => useProfileFlow().state;
export const useProfileFlowDispatch = () => useProfileFlow().dispatch;

