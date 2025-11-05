import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { FoundationMetadata, FoundationRuntime } from '../../../foundation';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';
import { AmebaSurface } from '../../../ui/surfaces/AmebaSurface';

export type NeuralHeroProps = {
  metadata: FoundationMetadata;
  runtime: FoundationRuntime;
};

export const NeuralHero = ({ metadata, runtime }: NeuralHeroProps) => {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse, reduceMotion]);

  const rippleScale = reduceMotion
    ? 1
    : pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.96, 1.04],
      });
  const rippleOpacity = reduceMotion
    ? 0.18
    : pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.22, 0.42],
      });
  const haloOpacity = reduceMotion
    ? 0.24
    : pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.18, 0.36],
      });

  const appVersion = runtime.appVersion ?? 'Live orbit';

  return (
    <AmebaSurface tone="hero" contentStyle={styles.surface}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <Animated.View
          style={[
            styles.ambientRipple,
            {
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ambientHalo,
            {
              opacity: haloOpacity,
            },
          ]}
        />
        <View style={styles.ambientGrid} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Neural command deck</Text>
          </View>
          <Text style={styles.title}>{metadata.defaultTitle}</Text>
          <Text style={styles.subtitle}>
            Operating system of the future. An exploration through a digitized human mind built for
            clarity, calm, and cinematic flow.
          </Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={[styles.metric, styles.metricPrimary]}>
            <Text style={styles.metricLabel}>Surface</Text>
            <Text style={styles.metricValue}>{runtime.platform.toUpperCase()}</Text>
          </View>
          <View style={[styles.metric, styles.metricSecondary]}>
            <Text style={styles.metricLabel}>Locale</Text>
            <Text style={styles.metricValue}>{runtime.locale}</Text>
          </View>
          <View style={[styles.metric, styles.metricTertiary]}>
            <Text style={styles.metricLabel}>Orbit</Text>
            <Text style={styles.metricValue}>{appVersion}</Text>
          </View>
        </View>
      </View>
    </AmebaSurface>
  );
};

const styles = StyleSheet.create({
  surface: {
    position: 'relative',
    overflow: 'hidden',
    gap: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  ambientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  ambientRipple: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
  },
  ambientHalo: {
    position: 'absolute',
    bottom: -120,
    right: -140,
    width: 360,
    height: 360,
    borderRadius: 240,
    backgroundColor: 'rgba(79, 70, 229, 0.16)',
  },
  ambientGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 32,
  },
  content: {
    gap: 24,
  },
  header: {
    gap: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#C7D2FE',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metric: {
    flexGrow: 1,
    minWidth: 140,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    gap: 6,
  },
  metricPrimary: {
    backgroundColor: 'rgba(14, 165, 233, 0.18)',
  },
  metricSecondary: {
    backgroundColor: 'rgba(129, 140, 248, 0.16)',
  },
  metricTertiary: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
  },
  metricLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#E0F2FE',
    fontWeight: '600',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
});
