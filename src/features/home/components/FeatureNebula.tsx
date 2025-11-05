import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { FoundationFeatureConfig } from '../../../foundation/types';
import { AmebaSurface } from '../../../ui/surfaces/AmebaSurface';
import { useInteractiveScale } from '../../../ui/animation/useInteractiveScale';

type FeatureNebulaProps = {
  feature: FoundationFeatureConfig['cryptoFabricLaunch'];
};

export const FeatureNebula = ({ feature }: FeatureNebulaProps) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useInteractiveScale({
    pressedScale: 0.94,
  });

  return (
    <AmebaSurface tone="primary" contentStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.label}>
          <Text style={styles.labelText}>{feature.highlightLabel}</Text>
        </View>
        <Text style={styles.title}>{feature.name}</Text>
        <Text style={styles.body}>{feature.description}</Text>
      </View>
      <View style={styles.benefitCloud}>
        {feature.keyBenefits.map((benefit, index) => (
          <View
            key={benefit.title}
            style={[styles.benefit, index % 2 === 1 ? styles.benefitOffset : undefined]}
          >
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitCopy}>{benefit.description}</Text>
          </View>
        ))}
      </View>
      <Link href={feature.cta.href as Href<string>} asChild>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.cta, animatedStyle]}>
            <Text style={styles.ctaText}>{feature.cta.label}</Text>
          </Animated.View>
        </Pressable>
      </Link>
    </AmebaSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    gap: 14,
  },
  label: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  labelText: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#38BDF8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D6E7FF',
  },
  benefitCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  benefit: {
    flexBasis: '48%',
    minWidth: 140,
    borderRadius: 32,
    borderTopLeftRadius: 56,
    borderBottomRightRadius: 56,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.36)',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 8,
  },
  benefitOffset: {
    transform: [{ translateY: 12 }],
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#93C5FD',
  },
  benefitCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#38BDF8',
  },
  ctaText: {
    color: '#0B1120',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
