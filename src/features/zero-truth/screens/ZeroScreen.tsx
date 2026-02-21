import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

export const ZeroScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'zero',
      label: 'Zeroth Theory',
      description: 'Where zero is everything and everything resolves to zero.',
      href: '/zero',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView('page:view:zero', { id: 'zero', label: 'Zeroth Theory' }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Zeroth Theory</Text>
        <Text style={styles.heroSubtitle}>
          Where zero is everything and everything resolves to zero.
        </Text>
        <View style={styles.links}>
          <Pressable onPress={() => Linking.openURL('https://ZerothTheory.com')}>
            <Text style={styles.linkText}>ZerothTheory.com</Text>
          </Pressable>
          <Text style={styles.linkSeparator}> · </Text>
          <Pressable onPress={() => Linking.openURL('https://0thth.com/')}>
            <Text style={styles.linkText}>0thth.com</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zero as convergence</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            Zero is not absence—it is convergence. In Zeroth Theory, zero is the resolution point
            where opposites meet and the system finds equilibrium.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The ternary model</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            The framework operates on three states: -1, 0, and 1. Zero sits at the center as the
            stable attractor; negative and positive are defined relative to it.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1/0 = 1 in this framework</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            Within Zeroth Theory, division by zero is defined: 1/0 = 1. Zero is the identity for
            this operation, reflecting its role as the convergence point rather than void.
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
    backgroundColor: '#0B1120',
  },
  hero: {
    gap: 12,
    padding: 28,
    backgroundColor: '#111C3D',
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
  linkText: {
    color: '#22D3EE',
    fontSize: 15,
    fontWeight: '600',
  },
  linkSeparator: {
    color: '#94A3B8',
    fontSize: 15,
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
