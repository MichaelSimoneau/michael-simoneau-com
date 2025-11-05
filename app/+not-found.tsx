import { Link, usePathname } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../src/foundation';

export default function NotFound() {
  const pathname = usePathname();
  const boundary = useMemo(
    () => ({
      id: 'not-found',
      label: 'Signal Lost',
      description: 'Fallback route presented when no Expo Router path resolves.',
      href: '/',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:not-found',
    {
      pathname,
    },
    {
      deps: [pathname],
    },
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signal lost</Text>
      <Text style={styles.copy}>
        The control center could not locate that module. Return to the briefing deck.
      </Text>
      <Link href="/" asChild>
        <Pressable style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
          <Text style={styles.linkText}>Navigate home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  copy: {
    fontSize: 16,
    lineHeight: 22,
    color: '#94A3B8',
    textAlign: 'center',
  },
  link: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#38BDF8',
  },
  linkPressed: {
    opacity: 0.85,
  },
  linkText: {
    color: '#0F172A',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
