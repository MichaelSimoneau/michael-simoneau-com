import { StyleSheet, Text, View } from 'react-native';
import type { FoundationFeatureConfig } from '../../../foundation';
import { useThoughtOrbitFocus } from './ThoughtOrbitFocusContext';

export type VoiceInsightsBubbleProps = {
  feature: FoundationFeatureConfig['voiceAssistant'];
};

export const VoiceInsightsBubble = ({ feature }: VoiceInsightsBubbleProps) => {
  const { focus } = useThoughtOrbitFocus();
  const resonance = Math.min(1, Math.max(0, (focus - 0.35) / 0.65));
  const echo = 1 - resonance;

  return (
    <View
      style={[
        styles.container,
        {
          transform: [{ scale: 0.88 + resonance * 0.18 }],
          opacity: 0.55 + resonance * 0.45,
        },
      ]}
    >
      <Text style={styles.eyebrow}>Voice of the stack</Text>
      <View
        style={[
          styles.voiceCard,
          {
            borderWidth: 1,
            borderColor: `rgba(94, 234, 212, ${(0.2 + resonance * 0.6).toFixed(3)})`,
            shadowOpacity: 0.1 + resonance * 0.35,
            shadowRadius: 30 * resonance + 8,
            shadowOffset: { width: 0, height: 20 * resonance },
            transform: [
              { perspective: 600 },
              { rotateX: `${echo * 0.2}rad` },
              { rotateZ: `${-echo * 0.15}rad` },
            ],
          },
        ]}
      >
        <Text style={styles.body}>{feature.messages.join(' • ')}</Text>
        <Text
          style={styles.meta}
        >{`Pitch ${feature.voice.pitch} • Rate ${feature.voice.rate}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  voiceCard: {
    backgroundColor: '#111C3D',
    borderRadius: 28,
    padding: 24,
    gap: 12,
    shadowColor: '#38BDF8',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5F5',
  },
  meta: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 1,
  },
});
