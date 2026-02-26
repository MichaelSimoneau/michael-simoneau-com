import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContentBlock } from '../../../models/BlogPost';
import { extractBlogText } from '../../../utils/blogTextExtractor';
import { selectSoftFemaleVoice } from '../../../utils/voiceSelector';

const VOICE_RATE = 0.92;
const VOICE_PITCH = 1.15;
const VOICE_VOLUME = 0.86;

interface UseBlogSpeechReturn {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  error: string | null;
  currentSegmentIndex: number;
  totalSegments: number;
  progress: number;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export const useBlogSpeech = (content: ContentBlock[]): UseBlogSpeechReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isStoppingRef = useRef(false);

  const segments = useMemo(() => extractBlogText(content), [content]);
  const totalSegments = segments.length;
  const progress = totalSegments > 0 ? (currentSegmentIndex / totalSegments) * 100 : 0;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;
    setIsSupported(true);

    const refreshVoice = () => {
      selectedVoiceRef.current = selectSoftFemaleVoice(synth.getVoices());
    };

    refreshVoice();
    synth.addEventListener?.('voiceschanged', refreshVoice);

    return () => {
      synth.removeEventListener?.('voiceschanged', refreshVoice);
      synth.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) {
      return;
    }

    isStoppingRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const speakFromSegment = useCallback(
    (startIndex: number) => {
      if (!window.speechSynthesis || startIndex >= segments.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(segments[startIndex]);
      utterance.voice = selectedVoiceRef.current;
      utterance.rate = VOICE_RATE;
      utterance.pitch = VOICE_PITCH;
      utterance.volume = VOICE_VOLUME;

      utterance.onstart = () => {
        setCurrentSegmentIndex(startIndex);
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        if (isStoppingRef.current) {
          isStoppingRef.current = false;
          return;
        }

        const nextIndex = startIndex + 1;
        if (nextIndex < segments.length) {
          speakFromSegment(nextIndex);
          return;
        }

        setCurrentSegmentIndex(segments.length);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setError('Speech playback failed in this browser.');
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [segments]
  );

  const play = useCallback(() => {
    if (!isSupported || segments.length === 0 || !window.speechSynthesis) {
      return;
    }

    setError(null);
    setCurrentSegmentIndex(0);
    isStoppingRef.current = false;
    window.speechSynthesis.cancel();
    speakFromSegment(0);
  }, [isSupported, segments.length, speakFromSegment]);

  const pause = useCallback(() => {
    if (!window.speechSynthesis || !isPlaying) {
      return;
    }

    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (!window.speechSynthesis || !isPaused) {
      return;
    }

    window.speechSynthesis.resume();
    setIsPlaying(true);
    setIsPaused(false);
  }, [isPaused]);

  useEffect(() => {
    stop();
    setCurrentSegmentIndex(0);
  }, [segments, stop]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    error,
    currentSegmentIndex,
    totalSegments,
    progress,
    play,
    pause,
    resume,
    stop,
  };
};
