import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  FoundationFeatureConfig,
  FoundationMetadata,
  FoundationRuntime,
} from '../../../foundation';
import type { BlogArticle } from '../../blog/types';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';
import { useInteractiveScale } from '../../../ui/animation/useInteractiveScale';
import { AmebaSurface } from '../../../ui/surfaces/AmebaSurface';

export type NeuralOperatingCanvasProps = {
  metadata: FoundationMetadata;
  runtime: FoundationRuntime;
  cryptoFeature: FoundationFeatureConfig['cryptoFabricLaunch'];
  voiceFeature: FoundationFeatureConfig['voiceAssistant'];
  featuredArticles: BlogArticle[];
};

type CommandModule = {
  id: string;
  label: string;
  status: string;
  narrative: string;
  accent: {
    stroke: string;
    glow: string;
    surface: string;
  };
  cta?: {
    label: string;
    href: string;
  };
};

type SystemSignal = {
  label: string;
  value: string;
};

export const NeuralOperatingCanvas = ({
  metadata,
  runtime,
  cryptoFeature,
  voiceFeature,
  featuredArticles,
}: NeuralOperatingCanvasProps) => {
  const reduceMotion = useReducedMotion();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      drift.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(drift, {
        toValue: 1,
        duration: 7200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [drift, reduceMotion]);

  const translateRibbon = reduceMotion
    ? 0
    : drift.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -48],
      });
  const translateOrbital = reduceMotion
    ? 0
    : drift.interpolate({
        inputRange: [0, 1],
        outputRange: [18, -18],
      });
  const ribbonOpacity = reduceMotion
    ? 0.18
    : drift.interpolate({
        inputRange: [0, 1],
        outputRange: [0.22, 0.34],
      });
  const orbOpacity = reduceMotion
    ? 0.14
    : drift.interpolate({
        inputRange: [0, 1],
        outputRange: [0.18, 0.3],
      });

  const signals = useMemo<SystemSignal[]>(() => {
    const systemSignals: SystemSignal[] = [
      { label: 'Locale', value: runtime.locale },
      { label: 'Time zone', value: runtime.timezone },
      {
        label: 'Color system',
        value: runtime.colorScheme ? runtime.colorScheme.toUpperCase() : 'SYSTEM',
      },
      { label: 'Platform', value: runtime.platform.toUpperCase() },
    ];

    if (runtime.appVersion) {
      systemSignals.push({ label: 'Version', value: runtime.appVersion });
    }

    return systemSignals;
  }, [runtime.appVersion, runtime.colorScheme, runtime.locale, runtime.platform, runtime.timezone]);

  const modules = useMemo<CommandModule[]>(() => {
    const voiceModule: CommandModule = {
      id: 'voice-assistant',
      label: 'Voice assistant',
      status: voiceFeature.enabled ? 'Online' : 'Muted',
      narrative: voiceFeature.enabled
        ? 'Ambient voice channels are ready for conversational navigation.'
        : 'Voice module idle — activate when you need spoken synthesis.',
      accent: {
        stroke: 'rgba(129, 140, 248, 0.7)',
        glow: 'rgba(129, 140, 248, 0.45)',
        surface: 'rgba(79, 70, 229, 0.18)',
      },
    };

    const cryptoModule: CommandModule = {
      id: 'crypto-fabric',
      label: cryptoFeature.name,
      status: cryptoFeature.enabled ? 'Live' : 'Docked',
      narrative: cryptoFeature.description,
      accent: {
        stroke: 'rgba(56, 189, 248, 0.8)',
        glow: 'rgba(14, 165, 233, 0.5)',
        surface: 'rgba(14, 165, 233, 0.16)',
      },
      cta: cryptoFeature.enabled ? cryptoFeature.cta : undefined,
    };

    return [voiceModule, cryptoModule];
  }, [cryptoFeature, voiceFeature]);

  const missionLog = useMemo(() => featuredArticles.slice(0, 3), [featuredArticles]);

  return (
    <AmebaSurface tone="primary" contentStyle={styles.surface}>
      <View style={styles.ambientContainer} pointerEvents="none">
        <Animated.View
          style={[
            styles.ambientRibbon,
            {
              opacity: ribbonOpacity,
              transform: [{ translateY: translateRibbon }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ambientOrb,
            {
              opacity: orbOpacity,
              transform: [{ translateY: translateOrbital }],
            },
          ]}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Operating canvas</Text>
        <Text style={styles.headerTitle}>{metadata.siteName}</Text>
        <Text style={styles.headerBody}>{metadata.description}</Text>
      </View>
      <View style={styles.deck}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>System signals</Text>
          {signals.map((signal) => (
            <View key={signal.label} style={styles.signalItem}>
              <Text style={styles.signalLabel}>{signal.label}</Text>
              <Text style={styles.signalValue}>{signal.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Command modules</Text>
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Mission log</Text>
          {missionLog.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No featured briefs are online yet. Check back after the next deploy.
              </Text>
            </View>
          ) : (
            missionLog.map((article, index) => (
              <ArticleTeaser key={article.id} article={article} index={index} />
            ))
          )}
        </View>
      </View>
    </AmebaSurface>
  );
};

type ModuleCardProps = {
  module: CommandModule;
};

const ModuleCard = ({ module }: ModuleCardProps) => {
  const interactive = useInteractiveScale({ pressedScale: 0.96 });

  const card = (
    <Animated.View
      style={[
        styles.moduleCard,
        {
          borderColor: module.accent.stroke,
          backgroundColor: module.accent.surface,
          shadowColor: module.accent.glow,
        },
        module.cta ? interactive.animatedStyle : undefined,
      ]}
    >
      <View
        style={[
          styles.moduleStatusBadge,
          {
            borderColor: module.accent.stroke,
            backgroundColor: module.accent.surface,
          },
        ]}
      >
        <Text style={[styles.moduleStatus, { color: module.accent.stroke }]}>{module.status}</Text>
      </View>
      <Text style={styles.moduleTitle}>{module.label}</Text>
      <Text style={styles.moduleBody}>{module.narrative}</Text>
      {module.cta ? (
        <View style={styles.moduleCtaRow}>
          <Text style={[styles.moduleCtaText, { color: module.accent.stroke }]}>
            {module.cta.label}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );

  if (module.cta) {
    return (
      <Link href={module.cta.href as Href<string>} asChild>
        <Pressable
          onPressIn={interactive.handlePressIn}
          onPressOut={interactive.handlePressOut}
          accessibilityRole="link"
        >
          {card}
        </Pressable>
      </Link>
    );
  }

  return card;
};

type ArticleTeaserProps = {
  article: BlogArticle;
  index: number;
};

const ArticleTeaser = ({ article, index }: ArticleTeaserProps) => {
  const interactive = useInteractiveScale({ pressedScale: 0.97 });

  const card = (
    <Animated.View style={[styles.articleCard, interactive.animatedStyle]}>
      <View style={styles.articleMetaRow}>
        <Text style={styles.articleIndex}>{String(index + 1).padStart(2, '0')}</Text>
        <Text style={styles.articleMeta}>{`${article.readTime} • ${article.date}`}</Text>
      </View>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleExcerpt} numberOfLines={2}>
        {article.excerpt}
      </Text>
    </Animated.View>
  );

  return (
    <Link href={`/blog/${article.id}`} asChild>
      <Pressable
        onPressIn={interactive.handlePressIn}
        onPressOut={interactive.handlePressOut}
        accessibilityRole="link"
      >
        {card}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  surface: {
    position: 'relative',
    overflow: 'hidden',
    gap: 28,
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  ambientContainer: {
    position: 'absolute',
    top: -140,
    left: -160,
    right: -160,
    bottom: -140,
  },
  ambientRibbon: {
    position: 'absolute',
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    transform: [{ rotate: '8deg' }],
  },
  ambientOrb: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 220,
    right: 60,
    top: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    shadowOpacity: 0.24,
    shadowRadius: 64,
    shadowOffset: { width: 0, height: 28 },
  },
  header: {
    gap: 14,
  },
  headerLabel: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '700',
  },
  headerBody: {
    color: '#D6E7FF',
    fontSize: 16,
    lineHeight: 24,
  },
  deck: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  column: {
    flexGrow: 1,
    flexBasis: 280,
    minWidth: 240,
    gap: 16,
  },
  columnLabel: {
    color: '#94A3B8',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  signalItem: {
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.22)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 6,
  },
  signalLabel: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  signalValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  moduleCard: {
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
    shadowOpacity: 0.28,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 20 },
  },
  moduleStatusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  moduleStatus: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  moduleTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  moduleBody: {
    color: '#CBD5F5',
    fontSize: 15,
    lineHeight: 22,
  },
  moduleCtaRow: {
    paddingTop: 6,
  },
  moduleCtaText: {
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  articleCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 10,
  },
  articleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  articleIndex: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '700',
  },
  articleMeta: {
    color: '#A5B4FC',
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  articleTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  articleExcerpt: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 20,
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
  },
});
