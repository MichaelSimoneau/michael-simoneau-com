import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { FoundationMetadata, FoundationRuntime } from '../../../foundation/types';
import { AmebaSurface } from '../../../ui/surfaces/AmebaSurface';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';

type FluidHeroProps = {
  metadata: FoundationMetadata;
  runtime: FoundationRuntime;
};

export const FluidHero = ({ metadata, runtime }: FluidHeroProps) => {
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(reduceMotion ? 1 : 0.95)).current;

  useEffect(() => {
    if (reduceMotion) {
      scale.setValue(1);
      return;
    }

    Animated.spring(scale, {
      toValue: 1,
      damping: 18,
      stiffness: 140,
      mass: 1.1,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale]);

  const versionLabel = runtime.appVersion ? runtime.appVersion : 'Live orbit';

  return (
    <Animated.View style={[styles.motion, { transform: [{ scale }] }]}>
      <AmebaSurface tone="hero" contentStyle={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mission control</Text>
          </View>
          <Text style={styles.badgeHint}>
            Synthesizing multi-cloud, trading, and product ecosystems into an adaptive control
            surface.
          </Text>
        </View>
        <Text style={styles.title}>{metadata.defaultTitle}</Text>
        <Text style={styles.subtitle}>{metadata.description}</Text>
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
            <Text style={styles.metricLabel}>Version</Text>
            <Text style={styles.metricValue}>{versionLabel}</Text>
          </View>
        </View>
      </AmebaSurface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  motion: {
    width: '100%',
  },
  content: {
    gap: 18,
  },
  badgeRow: {
    flexDirection: 'column',
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  badgeHint: {
    color: '#C7D2FE',
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#E2E8F0',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  metric: {
    flexGrow: 1,
    minWidth: 128,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: 6,
  },
  metricPrimary: {
    backgroundColor: 'rgba(14, 116, 144, 0.24)',
  },
  metricSecondary: {
    backgroundColor: 'rgba(79, 70, 229, 0.18)',
  },
  metricTertiary: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
  },
  metricLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#CFFAFE',
    fontWeight: '600',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
});
