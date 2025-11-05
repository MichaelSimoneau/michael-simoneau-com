import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type AmebaSurfaceTone = 'hero' | 'primary' | 'secondary';

type AmebaSurfaceProps = {
  tone?: AmebaSurfaceTone;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const tonePalette: Record<AmebaSurfaceTone, { base: string; edge: string; accent: string }> = {
  hero: {
    base: '#0D152A',
    edge: '#162341',
    accent: '#38BDF8',
  },
  primary: {
    base: '#0B1120',
    edge: '#12203B',
    accent: '#38BDF8',
  },
  secondary: {
    base: '#111C3D',
    edge: '#1C2D53',
    accent: '#818CF8',
  },
};

export const AmebaSurface = ({
  tone = 'primary',
  style,
  contentStyle,
  children,
}: AmebaSurfaceProps) => {
  const palette = tonePalette[tone];

  return (
    <View style={[styles.shell, style]}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: palette.base,
            borderColor: palette.edge,
          },
        ]}
      >
        <View
          style={[
            styles.overlayRing,
            {
              borderColor: palette.accent,
              shadowColor: palette.accent,
            },
          ]}
        />
        <View
          style={[
            styles.overlayGlow,
            {
              backgroundColor: palette.accent,
            },
          ]}
        />
        <View
          style={[
            styles.overlayGradient,
            {
              backgroundColor: palette.edge,
            },
          ]}
        />
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 44,
    position: 'relative',
  },
  background: {
    borderRadius: 44,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 28,
    pointerEvents: 'box-none',
  },
  overlayRing: {
    position: 'absolute',
    top: -14,
    right: -14,
    bottom: -14,
    left: -14,
    borderRadius: 64,
    opacity: 0.28,
    borderWidth: 2,
    pointerEvents: 'none',
    ...Platform.select({
      web: {
        boxShadow: '0 0 96px rgba(56, 189, 248, 0.18)',
      },
      ios: {
        shadowOpacity: 0.32,
        shadowRadius: 56,
        shadowOffset: { width: 0, height: 18 },
      },
      android: {
        elevation: 24,
      },
    }),
  },
  overlayGlow: {
    position: 'absolute',
    height: 320,
    width: 320,
    borderRadius: 180,
    opacity: 0.08,
    top: -120,
    right: -140,
    transform: [{ rotate: '-12deg' }],
    pointerEvents: 'none',
  },
  overlayGradient: {
    position: 'absolute',
    height: 220,
    width: 360,
    opacity: 0.18,
    borderRadius: 200,
    bottom: -120,
    left: -100,
    transform: [{ rotate: '28deg' }],
    pointerEvents: 'none',
  },
  content: {
    borderRadius: 28,
    gap: 16,
  },
});
