import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { ContentBlock } from '../../models/BlogPost';
import { useBlogSpeech } from '../../features/blog/hooks/useBlogSpeech';

interface BlogSpeechPlayerProps {
  content: ContentBlock[];
  title?: string;
}

export const BlogSpeechPlayer: React.FC<BlogSpeechPlayerProps> = ({
  content,
  title = 'Listen to Article',
}) => {
  const { isSupported, isPlaying, isPaused, error, currentSegmentIndex, totalSegments, progress, play, pause, resume } =
    useBlogSpeech(content);

  if (!isSupported || totalSegments === 0) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      return;
    }

    if (isPaused) {
      resume();
      return;
    }

    play();
  };

  const segmentLabel =
    currentSegmentIndex >= totalSegments
      ? `${totalSegments}/${totalSegments}`
      : `${Math.min(currentSegmentIndex + 1, totalSegments)}/${totalSegments}`;

  const statusLabel = error ? 'Playback unavailable' : isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Ready';

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
              disabled={!!error}
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
    </div>
  );
};
