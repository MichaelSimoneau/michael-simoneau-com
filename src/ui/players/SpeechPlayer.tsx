import React from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeech } from "../../contexts/SpeechContext";
import { useMediaAnalytics } from "../../analytics/useMediaAnalytics";
import { InlineMediaConsentPrompt } from "./InlineMediaConsentPrompt";
import { useMediaConsentGate } from "./useMediaConsentGate";
import { CaptionsViewportProvider } from "src/ui/players/CaptionsViewportProvider";

export const SpeechPlayer: React.FC = () => {
  const { trackMediaEvent } = useMediaAnalytics();
  const { isGateVisible, requestConsentAwarePlay, acceptAndResume } =
    useMediaConsentGate({
      source: "speech-player",
    });
  const {
    isPlaying,
    currentPhrase,
    play,
    pause,
    skipForward,
    skipBack,
    totalPhrases,
  } = useSpeech();

  const currentIndex = Math.max(currentPhrase ? 1 : 0, 0);
  const handlePlayPause = () => {
    if (isPlaying) {
      trackMediaEvent("pause", {
        media_type: "speech",
        component: "SpeechPlayer",
        track_title: currentPhrase ?? "speech-sequence",
        position_seconds: currentIndex,
        duration_seconds: totalPhrases,
      });
      pause();
    } else {
      requestConsentAwarePlay(() => {
        trackMediaEvent("play", {
          media_type: "speech",
          component: "SpeechPlayer",
          track_title: currentPhrase ?? "speech-sequence",
          position_seconds: currentIndex,
          duration_seconds: totalPhrases,
        });
        play();
      });
    }
  };

  return (
    <CaptionsViewportProvider>
      <div>
        <motion.div
          className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-cyan-500/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={skipBack}
            className="relative p-2.5 rounded-full transition-all group disabled:opacity-50"
            disabled={!currentPhrase}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600/30 to-gray-800/30 rounded-full shadow-inner" />
            <SkipBack className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors relative z-10" />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            className="relative p-5 rounded-full transition-all bg-cyan-500 hover:bg-cyan-400 shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black/80" />
            ) : (
              <Play className="w-8 h-8 text-black/80 ml-1" />
            )}
          </motion.button>

          <motion.button
            onClick={skipForward}
            className="relative p-2.5 rounded-full transition-all group disabled:opacity-50"
            disabled={!currentPhrase || totalPhrases <= 1}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600/30 to-gray-800/30 rounded-full shadow-inner" />
            <SkipForward className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors relative z-10" />
          </motion.button>

          <div className="text-xs text-gray-400/70 min-w-[2.5rem]">
            {currentIndex}/{totalPhrases}
          </div>
        </motion.div>
        <InlineMediaConsentPrompt
          visible={isGateVisible}
          onAgree={acceptAndResume}
          className="mt-2"
        />
      </div>
    </CaptionsViewportProvider>
  );
};
