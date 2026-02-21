import { useMemo } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

const LINKEDIN_URL = 'https://linkedin.com/in/michaelsimoneau';
const EMAIL = 'email@michaelsimoneau.com';
const GITHUB_URL = 'https://github.com/MichaelSimoneau';

const EXPERIENCE = [
  {
    title: 'CEO',
    org: 'Enigma Key Industries LLC',
    period: 'Feb 2019 - Present',
  },
  {
    title: 'Architect / Sr Lead',
    org: 'StoneX Group',
    period: 'Sep 2022 - Feb 2024',
  },
  {
    title: 'Sr Software Engineer',
    org: 'OneMain Financial',
    period: 'Feb 2022 - Jul 2022',
  },
  {
    title: 'Lead iOS Engineer',
    org: 'JPMorgan Chase',
    period: 'Oct 2019 - Jan 2022',
  },
] as const;

const SKILLS = [
  'TypeScript',
  'JavaScript',
  'Node.js',
  'React',
  'React Native',
  'Swift',
  'Xcode',
];

const EDUCATION = [
  { school: 'University of London', focus: 'CS', period: '2022-Present' },
  { school: 'Cleveland State University', focus: 'CS', period: '2009-2011' },
];

export const ProfileScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'profile',
      label: 'Profile',
      description: 'Full professional profile for Michael Simoneau.',
      href: '/profile',
    }),
    [],
  );
  useFoundationBoundary(boundary);
  useFoundationPageView('page:view:profile', {}, { deps: [] });

  const openLinkedIn = () => Linking.openURL(LINKEDIN_URL);
  const openEmail = () => Linking.openURL(`mailto:${EMAIL}`);
  const openGitHub = () => Linking.openURL(GITHUB_URL);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>Michael Simoneau</Text>
        <Text style={styles.subtitle}>Leader, Inventor & Investor</Text>
        <Text style={styles.subtitle}>Innovator & Expert Engineer</Text>
        <Text style={styles.tagline}>Founder @ Enigma Key Co.</Text>
      </View>

      {/* Quick stats */}
      <View style={styles.card}>
        <Text style={styles.stat}>20+ Years Experience</Text>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.card}>
          <Pressable
            onPress={openLinkedIn}
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
            accessibilityRole="link"
            accessibilityLabel="LinkedIn profile"
          >
            <Text style={styles.linkLabel}>LinkedIn</Text>
            <Text style={styles.linkUrl}>linkedin.com/in/michaelsimoneau</Text>
          </Pressable>
          <Pressable
            onPress={openEmail}
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
            accessibilityRole="link"
            accessibilityLabel="Email"
          >
            <Text style={styles.linkLabel}>Email</Text>
            <Text style={styles.linkUrl}>{EMAIL}</Text>
          </Pressable>
          <Pressable
            onPress={openGitHub}
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
            accessibilityRole="link"
            accessibilityLabel="GitHub profile"
          >
            <Text style={styles.linkLabel}>GitHub</Text>
            <Text style={styles.linkUrl}>github.com/MichaelSimoneau</Text>
          </Pressable>
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.card}>
          <Text style={styles.body}>Hollywood, Los Angeles, California</Text>
          <Text style={styles.muted}>Open to remote opportunities.</Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.body}>
            Expertise in mobile, web, and native app development; DevOps; hybrid
            and native mobile; full-stack; and Web3.
          </Text>
        </View>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.card}>
          {EXPERIENCE.map((entry, i) => (
            <View
              key={`${entry.org}-${entry.period}`}
              style={[styles.expRow, i < EXPERIENCE.length - 1 && styles.expBorder]}
            >
              <Text style={styles.expTitle}>{entry.title}</Text>
              <Text style={styles.expOrg}>{entry.org}</Text>
              <Text style={styles.muted}>{entry.period}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.card}>
          <View style={styles.skillWrap}>
            {SKILLS.map(skill => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.card}>
          {EDUCATION.map(ed => (
            <View key={ed.school} style={styles.edRow}>
              <Text style={styles.expTitle}>{ed.school}</Text>
              <Text style={styles.expOrg}>{ed.focus}</Text>
              <Text style={styles.muted}>{ed.period}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#22D3EE',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#111C3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stat: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38BDF8',
    textAlign: 'center',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  body: {
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 22,
  },
  muted: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  linkRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  linkUrl: {
    fontSize: 13,
    color: '#38BDF8',
    marginTop: 2,
  },
  expRow: {
    paddingVertical: 12,
  },
  expBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  expTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  expOrg: {
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 2,
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#22D3EE',
    fontWeight: '500',
  },
  edRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  footer: {
    height: 24,
  },
});
