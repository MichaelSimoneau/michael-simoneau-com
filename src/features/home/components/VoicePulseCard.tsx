import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { FoundationFeatureConfig } from '../../../foundation/types';
import { AmebaSurface } from '../../../ui/surfaces/AmebaSurface';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';

type VoicePulseCardProps = {
  feature: FoundationFeatureConfig['voiceAssistant'];
};

export const VoicePulseCard = ({ feature }: VoicePulseCardProps) => {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(0.4);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse, reduceMotion]);

  const pulseStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.12, 0.4],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  return (
    <AmebaSurface tone="secondary" contentStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.pulseStack}>
          <Animated.View style={[styles.pulseHalo, pulseStyle]} />
          <View style={styles.pulseCore} />
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaLabel}>Voice of the stack</Text>
          <Text style={styles.metaDetail}>
            Pitch {feature.voice.pitch} • Rate {feature.voice.rate}
          </Text>
        </View>
      </View>
      <Text style={styles.body}>{feature.messages.join(' • ')}</Text>
    </AmebaSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pulseStack: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseHalo: {
    position: 'absolute',
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(129, 140, 248, 0.35)',
  },
  pulseCore: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: '#C084FC',
    borderWidth: 2,
    borderColor: '#F5F3FF',
  },
  meta: {
    flex: 1,
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#A5B4FC',
    fontWeight: '600',
  },
  metaDetail: {
    color: '#E9D5FF',
    fontSize: 14,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#F8FAFC',
  },
});
