import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const ThthScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'thth',
      label: '0thth',
      description: 'The computational expression of Zeroth Theory.',
      href: '/thth',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView('page:view:thth', { id: 'thth', label: '0thth' }, {});

  const externalLinks = [
    { label: 'Dashboard', url: 'https://0thth.com/dashboard' },
    { label: 'Mint', url: 'https://0thth.com/mint' },
    { label: 'Whitepapers', url: 'https://0thth.com/whitepapers' },
    { label: 'ZerothTheory.com', url: 'https://ZerothTheory.com' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>0thth</Text>
        <Text style={styles.heroSubtitle}>
          The computational expression of Zeroth Theory
        </Text>
        <View style={styles.links}>
          {externalLinks.map(({ label, url }, i) => (
            <View key={url} style={styles.linkWrap}>
              {i > 0 && <Text style={styles.linkSeparator}> · </Text>}
              <Pressable onPress={() => Linking.openURL(url)}>
                <Text style={styles.linkText}>{label}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key sections</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Dashboard</Text>
          <Text style={styles.cardBody}>
            Your control surface for Zeroth Theory in practice—metrics, state, and convergence
            at a glance.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Mint</Text>
          <Text style={styles.cardBody}>
            Create and mint assets within the 0thth framework, anchored to the ternary model
            and zero-resolution semantics.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Whitepapers</Text>
          <Text style={styles.cardBody}>
            Formal specifications and proofs for the 0thth platform and Zeroth Theory
            mathematics.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: '#020617',
  },
  hero: {
    gap: 12,
    padding: 28,
    backgroundColor: '#0F172A',
    borderRadius: 32,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
  },
  linkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '600',
  },
  linkSeparator: {
    color: '#94A3B8',
    fontSize: 15,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  card: {
    backgroundColor: '#111C3D',
    borderRadius: 24,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22D3EE',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E2E8F0',
  },
});
