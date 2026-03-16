import { Link } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const Interview3Screen = () => {
  const boundary = useMemo(
    () => ({
      id: 'interview-3',
      label: 'Interview Session 3',
      description: 'Interview Session 3: Economic Design — Zeroth VM, digital bartering chip model, ternary identity.',
      href: '/interview/3',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:interview:3',
    { id: 'interview-3', label: 'Interview Session 3' },
    { deps: [] },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Interview Session 3: Economic Design</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Zeroth VM</Text>
        <Text style={styles.body}>
          The Zeroth VM is the execution layer for economic and identity logic — where contracts and rules run in a deterministic, observable environment.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>The Human Dollar</Text>
        <Text style={styles.body}>
          The Human Dollar (THD) is The Anti-Currency. THD is legally a digital bartering chip, not a currency: it does not replace money, it costs $1, and your $1 principal remains protected by redemption.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ternary identity</Text>
        <Text style={styles.body}>
          Identity is split into three chains: the identity chain (who you are), the user chain (what you do), and the public chain (what is attested). Presence and potential combine; you don’t own the key — you are the key.
        </Text>
      </View>

      <View style={styles.quotes}>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>Zero as convergence</Text>
          <Text style={styles.quoteText}>
            Zero isn’t nothing — it’s convergence. The state where presence and potential balance. Totality. Everything resolved.
          </Text>
        </View>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>Stagnation</Text>
          <Text style={styles.quoteText}>
            Participation is Darwinian: if it doesn’t perform, relevance enters early retirement via base-three half-life. Stagnation is a firing offense.
          </Text>
        </View>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>Base-three half-life</Text>
          <Text style={styles.quoteText}>
            Metabolic decay follows a base-three half-life: observation is oxygen, usage is mining. The system rewards activity and resolves inertia.
          </Text>
        </View>
      </View>

      <View style={styles.nav}>
        <Text style={styles.navLabel}>Other sessions</Text>
        <View style={styles.navLinks}>
          <Link href="/interview" asChild>
            <View style={styles.linkWrap}>
              <Text style={styles.link}>Session 1: Foundation</Text>
            </View>
          </Link>
          <Link href="/interview/2" asChild>
            <View style={styles.linkWrap}>
              <Text style={styles.link}>Session 2: Architecture</Text>
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
  quotes: {
    gap: 16,
  },
  quoteCard: {
    backgroundColor: '#111C3D',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22D3EE',
  },
  quoteLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22D3EE',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#94A3B8',
    fontStyle: 'italic',
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
