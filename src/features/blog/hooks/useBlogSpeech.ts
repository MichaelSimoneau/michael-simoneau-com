import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContentBlock } from '../../../models/BlogPost';
import { extractBlogText } from '../../../utils/blogTextExtractor';
import { selectStrongMaleVoice } from '../../../utils/voiceSelector';
import {
  BlogSpeechProviderId,
  BlogVoicePresetId,
  BLOG_VOICE_PRESETS,
  DEFAULT_BLOG_VOICE_PRESET,
  buildBlogSpeechCacheKey,
  createBrowserSpeechProvider,
} from '../speech/provider';

const hashText = (value: string): string => {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return Math.abs(hash).toString(36);
};

interface UseBlogSpeechOptions {
  voicePreset?: BlogVoicePresetId;
  postId?: string;
  provider?: BlogSpeechProviderId;
}

interface UseBlogSpeechReturn {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  error: string | null;
  currentSegmentIndex: number;
  totalSegments: number;
  progress: number;
  cacheKey: string;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export const useBlogSpeech = (content: ContentBlock[], options: UseBlogSpeechOptions = {}): UseBlogSpeechReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isStoppingRef = useRef(false);
  const sessionIdRef = useRef(0);
  const providerRef = useRef<ReturnType<typeof createBrowserSpeechProvider> | null>(null);
  const activeSessionRef = useRef<number | null>(null);
  const resumeWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const presetId = options.voicePreset ?? DEFAULT_BLOG_VOICE_PRESET;
  const preset = BLOG_VOICE_PRESETS[presetId] ?? BLOG_VOICE_PRESETS[DEFAULT_BLOG_VOICE_PRESET];
  const segments = useMemo(() => extractBlogText(content), [content]);
  const totalSegments = segments.length;
  const playedSegments =
    currentSegmentIndex >= totalSegments ? totalSegments : isPlaying ? Math.min(currentSegmentIndex + 1, totalSegments) : currentSegmentIndex;
  const progress = totalSegments > 0 ? (playedSegments / totalSegments) * 100 : 0;
  const contentHash = useMemo(() => hashText(segments.join('|')), [segments]);
  const cacheKey = useMemo(
    () =>
      buildBlogSpeechCacheKey({
        postId: options.postId ?? 'blog-post',
        contentHash,
        voicePreset: preset.id,
        provider: options.provider ?? 'browser',
      }),
    [contentHash, options.postId, options.provider, preset.id]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setIsSupported(false);
      return;
    }

    const provider = createBrowserSpeechProvider(window.speechSynthesis);
    providerRef.current = provider;
    setIsSupported(true);

    const refreshVoice = () => {
      selectedVoiceRef.current = selectStrongMaleVoice(provider.getVoices());
    };

    refreshVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoice);

    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoice);
      provider.cancel();
      providerRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    const provider = providerRef.current;
    if (!provider) {
      return;
    }

    sessionIdRef.current += 1;
    isStoppingRef.current = true;
    activeSessionRef.current = null;
    if (resumeWatchdogRef.current) {
      clearTimeout(resumeWatchdogRef.current);
      resumeWatchdogRef.current = null;
    }
    provider.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const speakFromSegment = useCallback(
    (startIndex: number, sessionId: number) => {
      const provider = providerRef.current;
      if (!provider || startIndex >= segments.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(segments[startIndex]);
      utterance.voice = selectedVoiceRef.current;
      utterance.rate = preset.rate;
      utterance.pitch = preset.pitch;
      utterance.volume = preset.volume;

      utterance.onstart = () => {
        if (sessionId !== sessionIdRef.current) {
          return;
        }

        setCurrentSegmentIndex(startIndex);
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        if (sessionId !== sessionIdRef.current) {
          return;
        }

        if (isStoppingRef.current && sessionId === sessionIdRef.current) {
          isStoppingRef.current = false;
          return;
        }

        const nextIndex = startIndex + 1;
        if (nextIndex < segments.length) {
          speakFromSegment(nextIndex, sessionId);
          return;
        }

        setCurrentSegmentIndex(segments.length);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        if (sessionId !== sessionIdRef.current) {
          return;
        }

        setError('Speech playback failed in this browser.');
        setIsPlaying(false);
        setIsPaused(false);
      };

      provider.speak(utterance);
    },
    [preset.pitch, preset.rate, preset.volume, segments]
  );

  const play = useCallback(() => {
    const provider = providerRef.current;
    if (!isSupported || segments.length === 0 || !provider || !provider.isAvailable()) {
      return;
    }

    setError(null);
    setCurrentSegmentIndex(0);
    sessionIdRef.current += 1;
    const activeSession = sessionIdRef.current;
    activeSessionRef.current = activeSession;
    isStoppingRef.current = false;
    if (resumeWatchdogRef.current) {
      clearTimeout(resumeWatchdogRef.current);
      resumeWatchdogRef.current = null;
    }
    provider.cancel();
    speakFromSegment(0, activeSession);
  }, [isSupported, segments.length, speakFromSegment]);

  const pause = useCallback(() => {
    const provider = providerRef.current;
    if (!provider || !isPlaying) {
      return;
    }

    provider.pause();
    if (resumeWatchdogRef.current) {
      clearTimeout(resumeWatchdogRef.current);
      resumeWatchdogRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(true);
  }, [isPlaying]);

  const resume = useCallback(() => {
    const provider = providerRef.current;
    if (!provider || !isPaused) {
      return;
    }

    provider.resume();
    setIsPlaying(true);
    setIsPaused(false);

    if (typeof window !== 'undefined') {
      if (resumeWatchdogRef.current) {
        clearTimeout(resumeWatchdogRef.current);
      }

      resumeWatchdogRef.current = setTimeout(() => {
        const synth = window.speechSynthesis;
        if (!synth || synth.speaking || synth.pending) {
          return;
        }

        const activeSession = activeSessionRef.current;
        if (activeSession !== null && currentSegmentIndex < segments.length) {
          speakFromSegment(currentSegmentIndex, activeSession);
        }
      }, 350);
    }
  }, [currentSegmentIndex, isPaused, segments.length, speakFromSegment]);

  useEffect(() => {
    stop();
    setCurrentSegmentIndex(0);
  }, [segments, stop]);

  useEffect(() => {
    return () => {
      if (resumeWatchdogRef.current) {
        clearTimeout(resumeWatchdogRef.current);
      }
    };
  }, []);

  return {
    isSupported,
    isPlaying,
    isPaused,
    error,
    currentSegmentIndex,
    totalSegments,
    progress,
    cacheKey,
    play,
    pause,
    resume,
    stop,
  };
};
