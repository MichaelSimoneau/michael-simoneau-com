const isEnglishVoice = (voice: SpeechSynthesisVoice): boolean => voice.lang.toLowerCase().startsWith('en');
const isLikelyLocal = (voice: SpeechSynthesisVoice): boolean => !voice.name.toLowerCase().includes('google translate');
const authoritativeVoiceNames = [
  'microsoft david',
  'microsoft guy',
  'microsoft christopher',
  'google us english',
  'daniel',
  'alex',
  'fred',
  'ryan',
  'thomas',
  'matthew',
];
const preferredVoiceKeywords = [
  'natural',
  'neural',
  'male',
  'david',
  'guy',
  'daniel',
  'matthew',
  'ryan',
  'thomas',
  'mark',
  'george',
  'brian',
  'alex',
  'en-us',
];
const avoidVoiceKeywords = ['espeak', 'compact', 'old', 'robot', 'google translate', 'female', 'zira', 'samantha', 'jenny', 'aria'];

const scoreVoice = (voice: SpeechSynthesisVoice): number => {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

  let score = 0;

  if (isEnglishVoice(voice)) {
    score += 40;
  }

  if (lang.startsWith('en-us')) {
    score += 20;
  } else if (lang.startsWith('en-gb')) {
    score += 12;
  }

  if (voice.default) {
    score += 8;
  }

  if (isLikelyLocal(voice)) {
    score += 6;
  }

  authoritativeVoiceNames.forEach((candidate) => {
    if (name.includes(candidate)) {
      score += 22;
    }
  });

  preferredVoiceKeywords.forEach((keyword) => {
    if (name.includes(keyword)) {
      score += 12;
    }
  });

  avoidVoiceKeywords.forEach((keyword) => {
    if (name.includes(keyword)) {
      score -= 20;
    }
  });

  return score;
};

export const selectStrongMaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  if (voices.length === 0) {
    return null;
  }

  const englishVoices = voices.filter(isEnglishVoice);
  const maleSkewed = englishVoices.filter((voice) => {
    const name = voice.name.toLowerCase();
    return (
      name.includes('male') ||
      name.includes('david') ||
      name.includes('guy') ||
      name.includes('daniel') ||
      name.includes('thomas') ||
      name.includes('matthew') ||
      name.includes('george') ||
      name.includes('brian') ||
      name.includes('alex')
    );
  });

  if (maleSkewed.length > 0) {
    const rankedMale = [...maleSkewed].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return rankedMale[0] ?? null;
  }

  const ranked = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  const best = ranked[0];
  if (best && scoreVoice(best) > 0) {
    return best;
  }

  return voices.find(isEnglishVoice) ?? voices[0] ?? null;
};

// Backward compatibility while we migrate older imports.
export const selectSoftFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => selectStrongMaleVoice(voices);
