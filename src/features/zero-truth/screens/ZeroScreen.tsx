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
        <Text style={styles.sectionTitle}>Duality is a broken model</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            Binary duality (0/1) is an incomplete lens that induces entropy. The correction
            defines existence as deterministic convergence, not a sequence of switches.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The three tensor zeros</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            The Null foundation is Negative Zero (-0), Positive Zero (+0), and Unsigned Zero (0),
            each with explicit operational behavior in Modulo 3.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The 5-state field and Protocol0</Text>
        <View style={styles.card}>
          <Text style={styles.cardBody}>
            The Cubic Topology is governed by five states: -1, -0, 0, +0, +1. Protocol0 enforces
            a 10% convergence delta so only state transitions that move toward equilibrium survive.
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
