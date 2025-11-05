import { StyleSheet, Text, View } from 'react-native';
import type { FoundationMetadata, FoundationRuntime } from '../../../foundation';

export type HomeHeroProps = {
  metadata: FoundationMetadata;
  runtime: FoundationRuntime;
};

export const HomeHero = ({ metadata, runtime }: HomeHeroProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Enterprise Architect</Text>
      <Text style={styles.title}>{metadata.defaultTitle}</Text>
      <Text style={styles.subtitle}>{metadata.description}</Text>
      <Text
        style={styles.meta}
      >{`Operating on ${runtime.platform.toUpperCase()} • ${runtime.locale}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#E2E8F0',
  },
  meta: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
