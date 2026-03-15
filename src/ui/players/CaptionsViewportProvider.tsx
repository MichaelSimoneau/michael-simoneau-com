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

const normalizeSpeedCoefficient = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const getDesktopDefaultEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.innerWidth >= 1024;
};

interface CaptionsViewportProviderProps {
  children: React.ReactNode;
}

export const CaptionsViewportProvider: React.FC<CaptionsViewportProviderProps> = ({ children }) => {
  const [isCaptionsEnabled, setCaptionsEnabled] = useState<boolean>(getDesktopDefaultEnabled);
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
    setSpeedCoefficient((previous) => normalizeSpeedCoefficient(previous + 0.01));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeedCoefficient((previous) => normalizeSpeedCoefficient(previous - 0.01));
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
