const preferredVoiceNames = [
  'Microsoft Aria Online (Natural)',
  'Google UK English Female',
  'Samantha',
];

const fallbackVoiceKeywords = ['female', 'zira', 'aria', 'jenny', 'samantha', 'karen'];

const isEnglishVoice = (voice: SpeechSynthesisVoice): boolean => voice.lang.toLowerCase().startsWith('en');

export const selectSoftFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  if (voices.length === 0) {
    return null;
  }

  for (const preferredName of preferredVoiceNames) {
    const match = voices.find((voice) => voice.name === preferredName);
    if (match) {
      return match;
    }
  }

  const keywordMatch = voices.find((voice) => {
    const lowerName = voice.name.toLowerCase();
    return isEnglishVoice(voice) && fallbackVoiceKeywords.some((keyword) => lowerName.includes(keyword));
  });

  if (keywordMatch) {
    return keywordMatch;
  }

  const englishVoice = voices.find(isEnglishVoice);
  if (englishVoice) {
    return englishVoice;
  }

  return voices[0] ?? null;
};
