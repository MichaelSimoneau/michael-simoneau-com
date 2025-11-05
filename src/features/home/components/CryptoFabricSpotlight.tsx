import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import type { FoundationFeatureConfig } from '../../../foundation';
import { useThoughtOrbitFocus } from './ThoughtOrbitFocusContext';

export type CryptoFabricSpotlightProps = {
  feature: FoundationFeatureConfig['cryptoFabricLaunch'];
};

export const CryptoFabricSpotlight = ({ feature }: CryptoFabricSpotlightProps) => {
  const { focus } = useThoughtOrbitFocus();
  const spotlight = Math.min(1, Math.max(0, (focus - 0.2) / 0.8));
  const orbitalTaper = 1 - spotlight;

  return (
    <View
      style={[
        styles.container,
        {
          transform: [{ scale: 0.9 + spotlight * 0.15 }],
          opacity: 0.5 + spotlight * 0.5,
        },
      ]}
    >
      <Text style={styles.eyebrow}>{feature.highlightLabel}</Text>
      <Text style={styles.title}>{feature.name}</Text>
      <Text style={styles.body}>{feature.description}</Text>
      <View style={[styles.benefitList, { gap: 10 + spotlight * 10 }]}>
        {feature.keyBenefits.map((benefit, index) => {
          const orbit = index / Math.max(feature.keyBenefits.length - 1, 1);
          const benefitFocus = Math.max(0, Math.min(1, spotlight - orbit * orbitalTaper * 0.7));

          return (
            <View
              key={benefit.title}
              style={[
                styles.benefitItem,
                {
                  transform: [
                    { perspective: 600 },
                    { scale: 0.82 + benefitFocus * 0.28 },
                    { translateX: (0.5 - orbit) * orbitalTaper * 40 },
                    { rotateZ: `${(0.5 - orbit) * orbitalTaper * 0.3}rad` },
                  ],
                  opacity: 0.4 + benefitFocus * 0.6,
                  borderColor: `rgba(94, 234, 212, ${(0.1 + benefitFocus * 0.35).toFixed(3)})`,
                  borderWidth: 1,
                  backgroundColor: benefitFocus > 0.6 ? '#12335C' : '#0F1A39',
                  shadowOpacity: 0.1 + benefitFocus * 0.3,
                  shadowRadius: 24 * benefitFocus + 6,
                  shadowOffset: { width: 0, height: 18 * benefitFocus },
                },
              ]}
            >
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitCopy}>{benefit.description}</Text>
            </View>
          );
        })}
      </View>
      <Link href={feature.cta.href as Href<string>} asChild>
        <View style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{feature.cta.label}</Text>
        </View>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5F5',
  },
  benefitList: {
    gap: 12,
  },
  benefitItem: {
    backgroundColor: '#111C3D',
    borderRadius: 24,
    padding: 16,
    gap: 8,
    shadowColor: '#38BDF8',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38BDF8',
  },
  benefitCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#38BDF8',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontWeight: '700',
    color: '#0B1120',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
