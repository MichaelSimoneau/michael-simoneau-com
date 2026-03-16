import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAudioTranscript } from './audioCaptions';

type ActiveAudioBinding = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc: string;
};

interface CaptionsViewportContextValue {
  isCaptionsEnabled: boolean;
  setCaptionsEnabled: (enabled: boolean) => void;
  toggleCaptions: () => void;
  activeAudio: ActiveAudioBinding | null;
  setActiveAudio: (binding: ActiveAudioBinding | null) => void;
  clearActiveAudio: (audioRef: React.RefObject<HTMLAudioElement | null>) => void;
  speedCoefficient: number;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
  transcriptStatus: 'idle' | 'loading' | 'ready' | 'missing' | 'error';
  transcriptText: string;
}

const CaptionsViewportContext = createContext<CaptionsViewportContextValue | undefined>(undefined);

const SPEED_STEP = 0.01;
const SPEED_MIN = -0.3;
const SPEED_MAX = 0.3;

const normalizeSpeedCoefficient = (value: number): number => {
  const clamped = Math.min(SPEED_MAX, Math.max(SPEED_MIN, value));
  return Math.round(clamped * 100) / 100;
};

interface CaptionsViewportProviderProps {
  children: React.ReactNode;
}

export const CaptionsViewportProvider: React.FC<CaptionsViewportProviderProps> = ({ children }) => {
  const [isCaptionsEnabled, setCaptionsEnabled] = useState<boolean>(false);
  const [activeAudio, setActiveAudio] = useState<ActiveAudioBinding | null>(null);
  const [speedCoefficient, setSpeedCoefficient] = useState(0);
  const { status: transcriptStatus, transcript: transcriptText } = useAudioTranscript(activeAudio?.audioSrc);

  const toggleCaptions = useCallback(() => {
    setCaptionsEnabled((previous) => !previous);
  }, []);

  const clearActiveAudio = useCallback((audioRef: React.RefObject<HTMLAudioElement | null>) => {
    setActiveAudio((previous) => {
      if (!previous || previous.audioRef !== audioRef) {
        return previous;
      }
      return null;
    });
  }, []);

  const increaseSpeed = useCallback(() => {
    setSpeedCoefficient((previous) => normalizeSpeedCoefficient(previous + SPEED_STEP));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeedCoefficient((previous) => normalizeSpeedCoefficient(previous - SPEED_STEP));
  }, []);

  const contextValue = useMemo<CaptionsViewportContextValue>(() => {
    return {
      isCaptionsEnabled,
      setCaptionsEnabled,
      toggleCaptions,
      activeAudio,
      setActiveAudio,
      clearActiveAudio,
      speedCoefficient,
      increaseSpeed,
      decreaseSpeed,
      transcriptStatus,
      transcriptText,
    };
  }, [
    activeAudio,
    clearActiveAudio,
    decreaseSpeed,
    increaseSpeed,
    isCaptionsEnabled,
    speedCoefficient,
    toggleCaptions,
    transcriptStatus,
    transcriptText,
  ]);

  return (
    <CaptionsViewportContext.Provider value={contextValue}>
      {children}
    </CaptionsViewportContext.Provider>
  );
};

export const useCaptionsViewport = (): CaptionsViewportContextValue => {
  const context = useContext(CaptionsViewportContext);
  if (!context) {
    throw new Error('useCaptionsViewport must be used within a CaptionsViewportProvider');
  }
  return context;
};
