import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { MediaPlayIntentSource } from '../ui/players/mediaEvents';

type PauseHandler = () => void;

interface RegisteredPlayer {
  instanceId: string;
  source: MediaPlayIntentSource;
  playbackKey: string;
}

interface ActivePlayback {
  instanceId: string;
  source: MediaPlayIntentSource;
  playbackKey: string;
}

interface MediaPlaybackCoordinatorState {
  activePlayback: ActivePlayback | null;
  players: Record<string, RegisteredPlayer>;
}

type MediaPlaybackCoordinatorAction =
  | {
      type: 'REGISTER_PLAYER';
      player: RegisteredPlayer;
    }
  | {
      type: 'UNREGISTER_PLAYER';
      instanceId: string;
    }
  | {
      type: 'PLAYBACK_REQUESTED';
      playback: ActivePlayback;
    };

const initialState: MediaPlaybackCoordinatorState = {
  activePlayback: null,
  players: {},
};

const mediaPlaybackCoordinatorReducer = (
  state: MediaPlaybackCoordinatorState,
  action: MediaPlaybackCoordinatorAction,
): MediaPlaybackCoordinatorState => {
  switch (action.type) {
    case 'REGISTER_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          [action.player.instanceId]: action.player,
        },
      };
    case 'UNREGISTER_PLAYER': {
      if (!state.players[action.instanceId]) {
        return state;
      }
      const nextPlayers = { ...state.players };
      delete nextPlayers[action.instanceId];
      const nextActivePlayback =
        state.activePlayback?.instanceId === action.instanceId ? null : state.activePlayback;
      return {
        activePlayback: nextActivePlayback,
        players: nextPlayers,
      };
    }
    case 'PLAYBACK_REQUESTED':
      return {
        ...state,
        activePlayback: action.playback,
      };
    default:
      return state;
  }
};

interface RegisterPlayerInput {
  instanceId: string;
  source: MediaPlayIntentSource;
  playbackKey?: string;
  pause: PauseHandler;
}

interface RequestPlayInput {
  instanceId: string;
  source: MediaPlayIntentSource;
  playbackKey?: string;
}

interface MediaPlaybackCoordinatorContextValue {
  registerPlayer: (input: RegisterPlayerInput) => void;
  unregisterPlayer: (instanceId: string) => void;
  requestPlay: (input: RequestPlayInput) => void;
}

const MediaPlaybackCoordinatorContext = createContext<MediaPlaybackCoordinatorContextValue | undefined>(undefined);

interface MediaPlaybackCoordinatorProviderProps {
  children: React.ReactNode;
}

export const MediaPlaybackCoordinatorProvider: React.FC<MediaPlaybackCoordinatorProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mediaPlaybackCoordinatorReducer, initialState);
  const pauseHandlersRef = useRef(new Map<string, PauseHandler>());

  const registerPlayer = useCallback((input: RegisterPlayerInput) => {
    const playbackKey = input.playbackKey ?? input.instanceId;
    pauseHandlersRef.current.set(input.instanceId, input.pause);
    dispatch({
      type: 'REGISTER_PLAYER',
      player: {
        instanceId: input.instanceId,
        source: input.source,
        playbackKey,
      },
    });
  }, []);

  const unregisterPlayer = useCallback((instanceId: string) => {
    pauseHandlersRef.current.delete(instanceId);
    dispatch({ type: 'UNREGISTER_PLAYER', instanceId });
  }, []);

  const requestPlay = useCallback((input: RequestPlayInput) => {
    const requesterPlaybackKey = input.playbackKey ?? input.instanceId;
    for (const [instanceId, pause] of pauseHandlersRef.current.entries()) {
      if (instanceId === input.instanceId) {
        continue;
      }
      const registeredPlayer = state.players[instanceId];
      if (!registeredPlayer) {
        continue;
      }
      if (registeredPlayer.playbackKey === requesterPlaybackKey) {
        continue;
      }
      pause();
    }
    dispatch({
      type: 'PLAYBACK_REQUESTED',
      playback: {
        instanceId: input.instanceId,
        source: input.source,
        playbackKey: requesterPlaybackKey,
      },
    });
  }, [state.players]);

  const value = useMemo<MediaPlaybackCoordinatorContextValue>(
    () => ({
      registerPlayer,
      unregisterPlayer,
      requestPlay,
    }),
    [registerPlayer, requestPlay, unregisterPlayer],
  );

  return (
    <MediaPlaybackCoordinatorContext.Provider value={value}>
      {children}
    </MediaPlaybackCoordinatorContext.Provider>
  );
};

const useMediaPlaybackCoordinatorContext = () => {
  const context = useContext(MediaPlaybackCoordinatorContext);
  if (!context) {
    throw new Error('useMediaPlaybackCoordinator must be used within a MediaPlaybackCoordinatorProvider');
  }
  return context;
};

interface UseMediaPlaybackCoordinatorOptions {
  playbackKey?: string;
}

export const useMediaPlaybackCoordinator = (
  source: MediaPlayIntentSource,
  options?: UseMediaPlaybackCoordinatorOptions,
) => {
  const { registerPlayer, unregisterPlayer, requestPlay } = useMediaPlaybackCoordinatorContext();
  const instanceIdRef = useRef(`media-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`);
  const pauseHandlerRef = useRef<PauseHandler>(() => {});
  const playbackKey = options?.playbackKey;

  const bindPauseHandler = useCallback((handler: PauseHandler) => {
    pauseHandlerRef.current = handler;
  }, []);

  useEffect(() => {
    const pause = () => pauseHandlerRef.current();
    registerPlayer({
      instanceId: instanceIdRef.current,
      source,
      playbackKey,
      pause,
    });
    return () => {
      unregisterPlayer(instanceIdRef.current);
    };
  }, [playbackKey, registerPlayer, source, unregisterPlayer]);

  const announcePlayStart = useCallback(() => {
    requestPlay({
      instanceId: instanceIdRef.current,
      source,
      playbackKey,
    });
  }, [playbackKey, requestPlay, source]);

  return {
    instanceId: instanceIdRef.current,
    announcePlayStart,
    bindPauseHandler,
  };
};
