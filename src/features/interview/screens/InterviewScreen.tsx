import { Link } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const InterviewScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'interview-1',
      label: 'Interview Session 1',
      description: 'Interview with Michael Simoneau — Session 1: Foundation.',
      href: '/interview',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:interview:1',
    { id: 'interview-1', label: 'Interview Session 1' },
    { deps: [] },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Interview with Michael Simoneau</Text>
        <Text style={styles.heroSubtitle}>Session 1: Foundation</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.intro}>
          A three-session interview series covering philosophy, architecture, and economic design — from first computer at 12 to JPMorgan, StoneX, and Zeroth Theory.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Background</Text>
        <Text style={styles.body}>
          Michael’s path started with his first computer at age 12, built from spare parts. That led to a first paid programming job at 16, then into enterprise technology at JPMorgan and StoneX, and on to Zeroth Theory — where philosophy, architecture, and economic design converge.
        </Text>
      </View>

      <View style={styles.nav}>
        <Text style={styles.navLabel}>Other sessions</Text>
        <View style={styles.navLinks}>
          <Link href="/interview/2" asChild>
            <View style={styles.linkWrap}>
              <Text style={styles.link}>Session 2: Architecture</Text>
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
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22D3EE',
  },
  card: {
    backgroundColor: '#111C3D',
    borderRadius: 16,
    padding: 20,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38BDF8',
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#94A3B8',
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
