import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { ContentBlock } from '../../models/BlogPost';
import { useBlogSpeech } from '../../features/blog/hooks/useBlogSpeech';
import { useMediaAnalytics } from '../../analytics/useMediaAnalytics';
import { InlineMediaConsentPrompt } from './InlineMediaConsentPrompt';
import { useMediaConsentGate } from './useMediaConsentGate';
import {
  BLOG_VOICE_PRESETS,
  BlogVoicePresetId,
  DEFAULT_BLOG_VOICE_PRESET,
} from '../../features/blog/speech/provider';

interface BlogSpeechPlayerProps {
  content: ContentBlock[];
  title?: string;
}

const BLOG_VOICE_PRESET_STORAGE_KEY = 'blog-voice-preset-v2';

export const BlogSpeechPlayer: React.FC<BlogSpeechPlayerProps> = ({
  content,
  title = 'Listen to Article',
}) => {
  const { trackMediaEvent } = useMediaAnalytics();
  const { isGateVisible, requestConsentAwarePlay, acceptAndResume } = useMediaConsentGate({
    source: 'blog-speech',
  });
  const previousIsPlayingRef = useRef(false);
  const hasStartedCycleRef = useRef(false);
  const hasCompletedCycleRef = useRef(false);
  const [voicePreset, setVoicePreset] = useState<BlogVoicePresetId>(DEFAULT_BLOG_VOICE_PRESET);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedPreset = window.localStorage.getItem(BLOG_VOICE_PRESET_STORAGE_KEY) as BlogVoicePresetId | null;
    if (storedPreset && BLOG_VOICE_PRESETS[storedPreset]) {
      setVoicePreset(storedPreset);
    }
  }, []);

  const normalizedPostId = useMemo(() => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), [title]);
  const selectedPreset = BLOG_VOICE_PRESETS[voicePreset] ?? BLOG_VOICE_PRESETS[DEFAULT_BLOG_VOICE_PRESET];

  const {
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
  } = useBlogSpeech(content, {
    voicePreset,
    postId: normalizedPostId || 'blog-post',
    provider: 'browser',
  });

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      return;
    }

    if (isPaused) {
      requestConsentAwarePlay(() => resume());
      return;
    }

    requestConsentAwarePlay(() => play());
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextPreset = event.target.value as BlogVoicePresetId;
    if (!BLOG_VOICE_PRESETS[nextPreset]) {
      return;
    }

    setVoicePreset(nextPreset);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BLOG_VOICE_PRESET_STORAGE_KEY, nextPreset);
    }
  };

  const segmentLabel =
    currentSegmentIndex >= totalSegments
      ? `${totalSegments}/${totalSegments}`
      : `${Math.min(currentSegmentIndex + 1, totalSegments)}/${totalSegments}`;

  const statusLabel = error ? 'Playback unavailable' : isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Ready';

  useEffect(() => {
    const wasPlaying = previousIsPlayingRef.current;

    if (!wasPlaying && isPlaying) {
      trackMediaEvent('play', {
        media_type: 'speech',
        component: 'BlogSpeechPlayer',
        track_title: title,
        track_src: normalizedPostId || 'blog-post',
        position_seconds: currentSegmentIndex,
        duration_seconds: totalSegments,
      });

      if (!hasStartedCycleRef.current && currentSegmentIndex === 0) {
        hasStartedCycleRef.current = true;
        hasCompletedCycleRef.current = false;
        trackMediaEvent('start', {
          media_type: 'speech',
          component: 'BlogSpeechPlayer',
          track_title: title,
          track_src: normalizedPostId || 'blog-post',
          position_seconds: currentSegmentIndex,
          duration_seconds: totalSegments,
        });
      }
    }

    if (wasPlaying && !isPlaying && isPaused) {
      trackMediaEvent('pause', {
        media_type: 'speech',
        component: 'BlogSpeechPlayer',
        track_title: title,
        track_src: normalizedPostId || 'blog-post',
        position_seconds: currentSegmentIndex,
        duration_seconds: totalSegments,
      });
    }

    previousIsPlayingRef.current = isPlaying;
  }, [
    currentSegmentIndex,
    isPaused,
    isPlaying,
    normalizedPostId,
    title,
    totalSegments,
    trackMediaEvent,
  ]);

  useEffect(() => {
    if (totalSegments === 0) {
      return;
    }
    if (currentSegmentIndex >= totalSegments && !hasCompletedCycleRef.current) {
      hasCompletedCycleRef.current = true;
      hasStartedCycleRef.current = false;
      trackMediaEvent('complete', {
        media_type: 'speech',
        component: 'BlogSpeechPlayer',
        track_title: title,
        track_src: normalizedPostId || 'blog-post',
        position_seconds: totalSegments,
        duration_seconds: totalSegments,
      });
    }
  }, [currentSegmentIndex, normalizedPostId, title, totalSegments, trackMediaEvent]);

  if (!isSupported || totalSegments === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handlePlayPause}
              className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
              type="button"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black/80" />
              ) : (
                <Play className="w-6 h-6 text-black/80 ml-0.5" />
              )}
            </motion.button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm truncate">{title}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <label htmlFor="blog-voice-preset" className="text-xs text-gray-400">
                  Voice
                </label>
                <select
                  id="blog-voice-preset"
                  className="bg-gray-900/80 border border-gray-700 text-gray-100 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  value={voicePreset}
                  onChange={handlePresetChange}
                  disabled={isPlaying}
                >
                  {Object.values(BLOG_VOICE_PRESETS).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-500 truncate">{selectedPreset.description}</span>
              </div>

              <div className="relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="flex justify-between items-center mt-1.5">
                <span className="text-gray-400 text-xs">{statusLabel}</span>
                <span className="text-gray-400 text-xs">Section {segmentLabel}</span>
              </div>
              {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
      <InlineMediaConsentPrompt visible={isGateVisible} onAgree={acceptAndResume} className="mt-2" />
    </div>
  );
};
