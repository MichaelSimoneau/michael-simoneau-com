import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ThoughtOrbitField } from './ThoughtOrbitField';
import { ThoughtOrbitFocusProvider } from './ThoughtOrbitFocusContext';
import type {
  OrbitAlignment,
  ThoughtOrbitSectionDynamic,
  ThoughtOrbitSubsectionDynamic,
  ThoughtOrbitTone,
} from './ThoughtOrbitTypes';
import { useReducedMotion } from '../../../ui/animation/useReducedMotion';

export type ThoughtOrbitSubsection = {
  id: string;
  content: ReactNode;
  alignment?: OrbitAlignment;
  tone?: ThoughtOrbitTone;
};

export type ThoughtOrbitSection = {
  id: string;
  title?: string;
  subtitle?: string;
  subsections: ThoughtOrbitSubsection[];
  alignment?: OrbitAlignment;
  tone?: ThoughtOrbitTone;
};

type FlattenedSubsection = {
  id: string;
  sectionIndex: number;
  subsectionIndex: number;
};

type SubsectionVisualState = {
  focus: number;
  gaussianWeight: number;
  normalized: number;
  tone: ThoughtOrbitTone;
  alignment: OrbitAlignment;
};

const createFlattened = (sections: ThoughtOrbitSection[]): FlattenedSubsection[] => {
  return sections.flatMap((section, sectionIndex) =>
    section.subsections.map((subsection, subsectionIndex) => ({
      id: `${section.id}::${subsection.id}`,
      sectionIndex,
      subsectionIndex,
    })),
  );
};

export const ThoughtOrbitLayout = ({ sections }: { sections: ThoughtOrbitSection[] }) => {
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const scrollRaf = useRef<number | null>(null);

  const flattened = useMemo(() => createFlattened(sections), [sections]);
  const [centers, setCenters] = useState<number[]>(() => flattened.map(() => Number.NaN));
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    setCenters(flattened.map(() => Number.NaN));
  }, [flattened]);

  useEffect(() => {
    return () => {
      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, []);

  const registerSubsection = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { y, height: itemHeight } = event.nativeEvent.layout;
      setCenters((previous) => {
        const next = [...previous];
        next[index] = y + itemHeight / 2;
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

  const viewportCenter = scrollOffset + height / 2;

  const subsectionVisualStates = useMemo<SubsectionVisualState[]>(
    () =>
      flattened.map((item, index) => {
        const center = centers[index];
        const section = sections[item.sectionIndex];
        const subsection = section?.subsections[item.subsectionIndex];
        const hasLayout = Number.isFinite(center);
        const baseDistance = hasLayout ? center - viewportCenter : Number.POSITIVE_INFINITY;
        const normalized = hasLayout ? baseDistance / Math.max(height * 0.75, 1) : 0;
        const gaussianWeight = hasLayout ? Math.exp(-normalized * normalized) : 0;
        const alignment: OrbitAlignment = subsection?.alignment ?? section?.alignment ?? 'center';
        const tone: ThoughtOrbitTone = subsection?.tone ?? section?.tone ?? 'surface';
        const focus = reduceMotion
          ? hasLayout
            ? Math.max(0.45, Math.min(1, gaussianWeight + 0.2))
            : 0
          : Math.min(1, gaussianWeight * 1.12);

        return {
          focus,
          gaussianWeight,
          normalized,
          tone,
          alignment,
        };
      }),
    [centers, flattened, height, reduceMotion, sections, viewportCenter],
  );

  const sectionIndexMap = useMemo(() => {
    const map = sections.map(() => [] as number[]);
    flattened.forEach((item, index) => {
      const bucket = map[item.sectionIndex];
      if (bucket) {
        bucket.push(index);
      }
    });

    return map;
  }, [flattened, sections]);

  const fieldDynamics = useMemo<ThoughtOrbitSectionDynamic[]>(() => {
    return sections.map<ThoughtOrbitSectionDynamic>((section, sectionIndex) => {
      const indices = sectionIndexMap[sectionIndex] ?? [];
      const sectionTone: ThoughtOrbitTone = section.tone ?? 'surface';
      const sectionAlignment: OrbitAlignment = section.alignment ?? 'center';

      let focus = 0;
      let primaryIndex = indices[0] ?? -1;
      let primaryFocus = -1;

      indices.forEach((flatIndex) => {
        const state = subsectionVisualStates[flatIndex];
        if (!state) {
          return;
        }

        if (state.focus > primaryFocus) {
          primaryFocus = state.focus;
          primaryIndex = flatIndex;
        }

        focus = Math.max(focus, state.focus);
      });

      const primaryState = primaryIndex >= 0 ? subsectionVisualStates[primaryIndex] : undefined;
      const primaryAlignment = primaryState?.alignment ?? sectionAlignment;
      const primaryTone = primaryState?.tone ?? sectionTone;
      const distance = primaryState?.normalized ?? 0;

      return {
        id: section.id,
        focus,
        distance,
        alignment: primaryAlignment,
        tone: primaryTone,
        subsections: indices.map<ThoughtOrbitSubsectionDynamic>((flatIndex, localIndex) => {
          const subsection = section.subsections[localIndex];
          const state = subsectionVisualStates[flatIndex];

          return {
            id: subsection?.id ?? `sub-${localIndex}`,
            focus: state?.focus ?? 0,
            offset: state?.normalized ?? 0,
            spread: state?.gaussianWeight ?? 0,
            tone: state?.tone ?? primaryTone,
            index: localIndex,
            count: indices.length || 1,
            active: primaryIndex === flatIndex,
          };
        }),
      };
    });
  }, [sectionIndexMap, sections, subsectionVisualStates]);

  const renderedSubsections = useMemo(() => {
    return flattened.map((item, index) => {
      const section = sections[item.sectionIndex];
      const subsection = section?.subsections[item.subsectionIndex];
      const visual = subsectionVisualStates[index];

      if (!section || !subsection || !visual) {
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
      const showHeading =
        item.subsectionIndex === 0 && (Boolean(section.title) || Boolean(section.subtitle));

      return (
        <View
          key={item.id}
          style={[
            styles.sectionWrapper,
            wrapperAlignmentStyle,
            {
              minHeight: 220 * contentScale,
              paddingVertical: 14 + (1 - visual.focus) * 14,
            },
          ]}
          onLayout={registerSubsection(index)}
        >
          {showHeading ? (
            <View style={styles.sectionHeading}>
              {section.title ? (
                <Text style={styles.sectionTitle} numberOfLines={2}>
                  {section.title}
                </Text>
              ) : null}
              {section.subtitle ? (
                <Text style={styles.sectionSubtitle} numberOfLines={1}>
                  {section.subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}
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
              {subsection.content}
            </ThoughtOrbitFocusProvider>
          </View>
        </View>
      );
    });
  }, [flattened, reduceMotion, registerSubsection, sections, subsectionVisualStates]);

  return (
    <View style={styles.scene}>
      {!reduceMotion ? <ThoughtOrbitField dynamics={fieldDynamics} /> : null}
      <ScrollView
        style={styles.scrollOverlay}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        {renderedSubsections}
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
  },
  sectionWrapper: {
    width: '100%',
    position: 'relative',
  },
  sectionHeading: {
    marginBottom: 18,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A5F3FC',
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
