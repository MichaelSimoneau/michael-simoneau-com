import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface InterviewButtonProps {
  href?: string;
}

export const InterviewButton = memo(
  ({ href = '/blogs/zero' }: InterviewButtonProps) => {
    return (
      <Link href={href} asChild>
        <Pressable
          style={({ pressed }) => [
            styles.wrapper,
            pressed ? styles.wrapperPressed : undefined,
          ]}
        >
          <LinearGradient
            colors={['#22D3EE', '#818CF8', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.eyebrow}>Quantum Briefing</Text>
              <Text style={styles.label}>Zero-Why Interview</Text>
              <Text style={styles.caption}>
                Decode the numerical trinity shaping Zero.
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Listen now</Text>
            </View>
            <View style={styles.particles}>
              <View style={[styles.particle, styles.particleNorth]} />
              <View style={[styles.particle, styles.particleSouth]} />
              <View style={[styles.particle, styles.particleWest]} />
            </View>
          </LinearGradient>
        </Pressable>
      </Link>
    );
  },
);

InterviewButton.displayName = 'InterviewButton';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  wrapperPressed: {
    opacity: 0.92,
  },
  gradient: {
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    gap: 6,
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
    color: '#DBEAFE',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1120',
  },
  caption: {
    fontSize: 14,
    color: '#E0F2FE',
    lineHeight: 20,
  },
  badge: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  badgeText: {
    color: '#22D3EE',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(248, 250, 252, 0.18)',
    opacity: 0.7,
  },
  particleNorth: {
    top: -18,
    right: 32,
  },
  particleSouth: {
    bottom: -24,
    left: 24,
  },
  particleWest: {
    top: 24,
    left: -28,
  },
});
