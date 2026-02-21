import { Link } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const Interview2Screen = () => {
  const boundary = useMemo(
    () => ({
      id: 'interview-2',
      label: 'Interview Session 2',
      description: 'Interview Session 2: Architecture — Crypto Fabric, Gemini Token, Hasheb.',
      href: '/interview/2',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:interview:2',
    { id: 'interview-2', label: 'Interview Session 2' },
    { deps: [] },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Interview Session 2: Architecture</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Crypto Fabric</Text>
        <Text style={styles.body}>
          Infrastructure built for profitability and compliance: modular cloud fabric, policy-driven pipelines, and telemetry that ties revenue and risk into a single control surface.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Gemini Token</Text>
        <Text style={styles.body}>
          The Gemini token structure fuses value to data in a 128-bit design — enabling deterministic settlement and clear separation between computation and finality.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hasheb distributed filesystem</Text>
        <Text style={styles.body}>
          Hasheb provides a distributed filesystem layer — resilient, verifiable storage that fits into the broader architecture of decentralized data and settlement.
        </Text>
      </View>

      <View style={styles.nav}>
        <Text style={styles.navLabel}>Other sessions</Text>
        <View style={styles.navLinks}>
          <Link href="/interview" asChild>
            <View style={styles.linkWrap}>
              <Text style={styles.link}>Session 1: Foundation</Text>
            </View>
          </Link>
          <Link href="/interview/3" asChild>
            <View style={styles.linkWrap}>
              <Text style={styles.link}>Session 3: Economic Design</Text>
            </View>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: '#0B1120',
  },
  hero: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  card: {
    backgroundColor: '#111C3D',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38BDF8',
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  nav: {
    gap: 12,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navLinks: {
    gap: 12,
  },
  linkWrap: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22D3EE',
  },
});
