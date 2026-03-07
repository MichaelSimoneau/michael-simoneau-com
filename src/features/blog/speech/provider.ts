export type BlogVoicePresetId = 'natural' | 'clear' | 'fast';
export type BlogSpeechProviderId = 'browser' | 'gemini';

export interface BlogVoicePreset {
  id: BlogVoicePresetId;
  label: string;
  description: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const BLOG_VOICE_PRESETS: Record<BlogVoicePresetId, BlogVoicePreset> = {
  natural: {
    id: 'natural',
    label: 'Commanding',
    description: 'Confident male cadence with conviction.',
    rate: 0.93,
    pitch: 0.9,
    volume: 1,
  },
  clear: {
    id: 'clear',
    label: 'Broadcast',
    description: 'Deep, deliberate delivery for authority.',
    rate: 0.9,
    pitch: 0.86,
    volume: 1,
  },
  fast: {
    id: 'fast',
    label: 'Driven',
    description: 'Assertive pace with a lower tonal floor.',
    rate: 1,
    pitch: 0.88,
    volume: 0.98,
  },
};

export const DEFAULT_BLOG_VOICE_PRESET: BlogVoicePresetId = 'clear';

export interface BlogSpeechCacheKeyInput {
  postId: string;
  contentHash: string;
  voicePreset: BlogVoicePresetId;
  provider?: BlogSpeechProviderId;
}

export const buildBlogSpeechCacheKey = ({
  postId,
  contentHash,
  voicePreset,
  provider = 'browser',
}: BlogSpeechCacheKeyInput): string => {
  return [provider, postId, contentHash, voicePreset].join(':');
};

export interface BlogSpeechProvider {
  id: BlogSpeechProviderId;
  isAvailable: () => boolean;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speak: (utterance: SpeechSynthesisUtterance) => void;
  getVoices: () => SpeechSynthesisVoice[];
}

export const createBrowserSpeechProvider = (synth: SpeechSynthesis): BlogSpeechProvider => {
  return {
    id: 'browser',
    isAvailable: () => true,
    cancel: () => synth.cancel(),
    pause: () => synth.pause(),
    resume: () => synth.resume(),
    speak: (utterance) => synth.speak(utterance),
    getVoices: () => synth.getVoices(),
  };
};
