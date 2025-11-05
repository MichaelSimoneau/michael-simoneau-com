import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { ThoughtOrbitField } from './ThoughtOrbitField';
import { ThoughtOrbitFocusProvider } from './ThoughtOrbitFocusContext';
import type {
  OrbitAlignment,
  ThoughtOrbitDynamicState,
  ThoughtOrbitTone,
} from './ThoughtOrbitTypes';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';

export type ThoughtOrbitSection = {
  id: string;
  content: ReactNode;
  alignment?: OrbitAlignment;
  tone?: ThoughtOrbitTone;
};

export type ThoughtOrbitLayoutProps = {
  sections: ThoughtOrbitSection[];
};

type SectionVisualState = {
  alignment: OrbitAlignment;
  focus: number;
  gaussianWeight: number;
  normalized: number;
  tone: ThoughtOrbitTone;
  dynamics: ThoughtOrbitDynamicState;
};

export const ThoughtOrbitLayout = ({ sections }: ThoughtOrbitLayoutProps) => {
  const { height } = useWindowDimensions();
  const [centers, setCenters] = useState<number[]>(() => sections.map(() => Number.NaN));
  const [scrollOffset, setScrollOffset] = useState(0);
  const reduceMotion = useReducedMotion();
  const scrollRaf = useRef<number | null>(null);

  useEffect(() => {
    setCenters(sections.map(() => Number.NaN));
  }, [sections]);

  const registerSection = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { y, height: sectionHeight } = event.nativeEvent.layout;
      setCenters((previous) => {
        const next = [...previous];
        next[index] = y + sectionHeight / 2;
        return next;
      });
    },
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextOffset = event.nativeEvent.contentOffset.y;

      if (reduceMotion) {
        setScrollOffset(nextOffset);
        return;
      }

      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }

      scrollRaf.current = requestAnimationFrame(() => {
        setScrollOffset(nextOffset);
      });
    },
    [reduceMotion],
  );

  useEffect(() => {
    return () => {
      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, []);

  const viewportCenter = scrollOffset + height / 2;

  const sectionVisualStates = useMemo<SectionVisualState[]>(
    () =>
      sections.map((section, index) => {
        const center = centers[index];
        const hasLayout = Number.isFinite(center);
        const baseDistance = hasLayout ? center - viewportCenter : Number.POSITIVE_INFINITY;
        const normalized = hasLayout ? baseDistance / Math.max(height * 0.75, 1) : 0;
        const gaussianWeight = hasLayout ? Math.exp(-normalized * normalized) : 0;
        const alignment: OrbitAlignment = section.alignment ?? 'center';
        const tone: ThoughtOrbitTone = section.tone ?? 'surface';
        const focus = reduceMotion
          ? Math.min(1, gaussianWeight + 0.24)
          : Math.min(1, gaussianWeight * 1.12);

        const dynamics: ThoughtOrbitDynamicState = {
          id: section.id,
          focus,
          distance: Math.abs(normalized),
          alignment,
          tone,
        };

        return {
          alignment,
          focus,
          gaussianWeight,
          normalized,
          tone,
          dynamics,
        };
      }),
    [centers, height, reduceMotion, sections, viewportCenter],
  );

  const sectionDynamics = useMemo(
    () => sectionVisualStates.map((state) => state.dynamics),
    [sectionVisualStates],
  );

  const renderedSections = useMemo(
    () =>
      sections.map((section, index) => {
        const visual = sectionVisualStates[index];

        if (!visual) {
          return null;
        }

        const directionOffset =
          visual.alignment === 'left' ? -128 : visual.alignment === 'right' ? 128 : 0;
        const orbitalCurve = reduceMotion ? 0 : (1 - visual.gaussianWeight) ** 2.1;
        const translateX = reduceMotion ? 0 : directionOffset * orbitalCurve;
        const scale = reduceMotion ? 1 : 0.62 + visual.gaussianWeight * 0.6;
        const contentScale = reduceMotion ? 1 : 0.8 + visual.gaussianWeight * 0.32;
        const opacity = reduceMotion ? 0.98 : 0.3 + visual.gaussianWeight * 0.68;
        const elevation = reduceMotion ? 6 : 4 + visual.focus * 12;
        const bubbleRadius = 72 + visual.focus * 42;
        const verticalPadding = 24 + visual.focus * 22;
        const horizontalPadding = 24 + visual.focus * 28;
        const haloSize = reduceMotion ? 24 : 54 * visual.focus;
        const blurShadow = reduceMotion ? 24 : 20 + visual.focus * 28;
        const rotationDirection =
          visual.alignment === 'left' ? -1 : visual.alignment === 'right' ? 1 : 0;
        const tilt = reduceMotion ? 0 : (1 - visual.gaussianWeight) * 0.28;
        const backgroundColor =
          visual.tone === 'hero'
            ? visual.focus > 0.7
              ? 'rgba(15, 40, 76, 0.92)'
              : 'rgba(8, 27, 54, 0.86)'
            : visual.focus > 0.68
              ? 'rgba(1, 16, 36, 0.88)'
              : 'rgba(1, 10, 24, 0.82)';
        const borderColor = `rgba(59, 130, 246, ${(0.16 + visual.focus * 0.3).toFixed(3)})`;

        const wrapperAlignmentStyle =
          visual.alignment === 'left'
            ? styles.alignStart
            : visual.alignment === 'right'
              ? styles.alignEnd
              : styles.alignCenter;

        const bubbleTone = visual.tone === 'hero' ? styles.heroTone : styles.surfaceTone;

        return (
          <View
            key={section.id}
            style={[
              styles.sectionWrapper,
              wrapperAlignmentStyle,
              {
                minHeight: 220 * contentScale,
                paddingVertical: 14 + (1 - visual.focus) * 14,
              },
            ]}
            onLayout={registerSection(index)}
          >
            <View
              style={[
                styles.sectionHalo,
                {
                  opacity: visual.focus,
                  shadowRadius: haloSize,
                  shadowOpacity: 0.52 * visual.focus,
                  transform: [{ scale: reduceMotion ? 1 : 0.72 + visual.focus * 0.6 }],
                },
              ]}
            />
            <View
              style={[
                styles.sectionBubble,
                bubbleTone,
                {
                  transform: [
                    { perspective: 1400 },
                    { translateX },
                    { scale },
                    { rotateY: `${rotationDirection * orbitalCurve * 0.42}rad` },
                    { rotateX: `${tilt}rad` },
                  ],
                  opacity,
                  paddingVertical: verticalPadding,
                  paddingHorizontal: horizontalPadding,
                  borderRadius: bubbleRadius,
                  backgroundColor,
                  borderColor,
                  shadowOpacity: 0.18 + visual.focus * 0.34,
                  shadowRadius: blurShadow,
                  shadowOffset: { width: 0, height: 16 + visual.focus * 18 },
                  elevation,
                  maxWidth: visual.focus > 0.76 ? 780 : 720,
                },
              ]}
            >
              <ThoughtOrbitFocusProvider
                value={{
                  focus: visual.focus,
                  distance: Math.abs(visual.normalized),
                }}
              >
                {section.content}
              </ThoughtOrbitFocusProvider>
            </View>
          </View>
        );
      }),
    [reduceMotion, registerSection, sectionVisualStates, sections],
  );

  return (
    <View style={styles.scene}>
      {!reduceMotion ? <ThoughtOrbitField dynamics={sectionDynamics} /> : null}
      <ScrollView
        style={styles.scrollOverlay}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        {renderedSections}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#00040F',
  },
  scrollOverlay: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 180,
    gap: 60,
    rowGap: 60,
  },
  sectionWrapper: {
    width: '100%',
    position: 'relative',
  },
  sectionHalo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 260,
    height: 260,
    marginLeft: -130,
    marginTop: -130,
    borderRadius: 130,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    shadowColor: '#38BDF8',
    pointerEvents: 'none',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  sectionBubble: {
    maxWidth: 720,
    width: '100%',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.26)',
    shadowColor: '#2563EB',
    overflow: 'hidden',
  },
  heroTone: {
    backgroundColor: 'rgba(15, 27, 58, 0.86)',
  },
  surfaceTone: {
    backgroundColor: 'rgba(2, 8, 20, 0.82)',
  },
});
