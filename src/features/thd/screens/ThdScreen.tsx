import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const ThdScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'thd',
      label: 'The Human Dollar',
      description: 'The Anti-Currency: legally a digital bartering chip, not a currency.',
      href: '/thd',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView('page:view:thd', { id: 'thd', label: 'The Human Dollar' }, {});

  const concepts = [
    'Legally a digital bartering chip, not a currency',
    'Does not replace money: THD is a participation layer',
    'Costs $1 to enter',
    '$1 principal floor via redemption',
    'Cryptographic concert ticket economics',
    '$655 for every $1 at the $65,535 cap',
    'Stagnation is a firing offense',
    'Base-three half-life decay for idle capital',
    '1 THD is always redeemable for 1 USDC',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          The Human Dollar <Text style={styles.heroAccent}>#THD</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          The Anti-Currency: legally a digital bartering chip, not a currency.
        </Text>
        <Pressable
          style={styles.cta}
          onPress={() => Linking.openURL('https://thehumandollar.com/')}
        >
          <Text style={styles.ctaText}>thehumandollar.com</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key concepts</Text>
        {concepts.map((line) => (
          <View key={line} style={styles.card}>
            <Text style={styles.cardBody}>{line}</Text>
          </View>
        ))}
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
    gap: 12,
    padding: 28,
    backgroundColor: '#111C3D',
    borderRadius: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  heroAccent: {
    color: '#22D3EE',
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  cta: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A',
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  ctaText: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E2E8F0',
  },
});
