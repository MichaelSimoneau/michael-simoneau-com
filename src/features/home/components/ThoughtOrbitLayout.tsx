import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ScrollViewHandle,
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
  orbitAngle: number;
  orbitX: number;
  orbitY: number;
  orbitDepth: number;
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
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const scrollRaf = useRef<number | null>(null);
  const sectionScrollRefs = useRef<Array<ScrollViewHandle | null>>([]);

  const flattened = useMemo(() => createFlattened(sections), [sections]);
  const [centers, setCenters] = useState<number[]>(() => flattened.map(() => Number.NaN));
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeBySection, setActiveBySection] = useState<number[]>(() => sections.map(() => 0));

  useEffect(() => {
    setCenters(flattened.map(() => Number.NaN));
  }, [flattened]);

  useEffect(() => {
    setActiveBySection(sections.map(() => 0));
    sectionScrollRefs.current = [];
  }, [sections]);

  useEffect(() => {
    return () => {
      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, []);

  const registerSection = useCallback(
    (indices: number[]) => (event: LayoutChangeEvent) => {
      const { y, height: layoutHeight } = event.nativeEvent.layout;
      const center = y + layoutHeight / 2;

      setCenters((previous) => {
        const next = [...previous];
        indices.forEach((flatIndex) => {
          next[flatIndex] = center;
        });
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
  const orbitPhase = reduceMotion ? 0 : scrollOffset / Math.max(height, 1);

  const subsectionVisualStates = useMemo<SubsectionVisualState[]>(
    () =>
      flattened.map((item, index) => {
        const center = centers[index];
        const section = sections[item.sectionIndex];
        const subsection = section?.subsections[item.subsectionIndex];
        const hasLayout = Number.isFinite(center);
        const verticalScale = Math.max(height * 0.8, 1);
        const baseDistance = hasLayout ? center - viewportCenter : Number.POSITIVE_INFINITY;
        const normalized = hasLayout ? baseDistance / verticalScale : 0;
        const gaussianWeight = hasLayout ? Math.exp(-normalized * normalized) : 0;
        const alignment: OrbitAlignment = subsection?.alignment ?? section?.alignment ?? 'center';
        const tone: ThoughtOrbitTone = subsection?.tone ?? section?.tone ?? 'surface';
        const count = section?.subsections.length ?? 1;
        const step = count > 0 ? (Math.PI * 2) / count : Math.PI * 2;
        const rawAngle = orbitPhase * 1.2 + item.subsectionIndex * step;
        const orbitX = reduceMotion ? 0 : Math.sin(rawAngle);
        const orbitY = reduceMotion ? 1 : Math.cos(rawAngle);
        const orbitDepth = (orbitY + 1) / 2;
        const adjustedNormalized = normalized + (reduceMotion ? 0 : orbitY * 0.18);
        const isActive = activeBySection[item.sectionIndex] === item.subsectionIndex;
        const focusBase = reduceMotion
          ? hasLayout
            ? Math.max(0.45, Math.min(1, gaussianWeight + 0.2))
            : 0
          : Math.min(1, gaussianWeight * (0.55 + orbitDepth * 0.9));
        const focus = isActive ? Math.max(focusBase, 0.75) : focusBase * 0.25;

        return {
          focus,
          gaussianWeight,
          normalized: adjustedNormalized,
          tone,
          alignment,
          orbitAngle: rawAngle,
          orbitX,
          orbitY,
          orbitDepth,
        };
      }),
    [
      activeBySection,
      centers,
      flattened,
      height,
      orbitPhase,
      reduceMotion,
      sections,
      viewportCenter,
    ],
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
      const activeLocalIndex = activeBySection[sectionIndex] ?? 0;
      const activeFlatIndex = indices[activeLocalIndex];

      indices.forEach((flatIndex) => {
        const state = subsectionVisualStates[flatIndex];
        if (!state) {
          return;
        }

        if (flatIndex === activeFlatIndex) {
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
          const orbitAzimuth = state ? Math.atan2(state.orbitX, state.orbitY) : 0;
          const isActive = activeBySection[sectionIndex] === localIndex;

          return {
            id: subsection?.id ?? `sub-${localIndex}`,
            focus: isActive ? (state?.focus ?? 0) : (state?.focus ?? 0) * 0.3,
            offset: orbitAzimuth,
            spread: state?.orbitDepth ?? 0,
            tone: state?.tone ?? primaryTone,
            index: localIndex,
            count: indices.length || 1,
            active: isActive,
          };
        }),
      };
    });
  }, [activeBySection, sectionIndexMap, sections, subsectionVisualStates]);

  const baseSurfaceWidth = Math.max(280, Math.min(680, width - 40));
  const maxStageHeight = Math.min(height, Math.max(240, height - 48));
  const desiredStageHeight = Math.max(260, Math.min(640, height * 0.78));
  const stageHeight = Math.min(maxStageHeight, desiredStageHeight);
  const surfaceHeight = Math.min(stageHeight, Math.max(220, stageHeight - 64));

  const renderedSections = useMemo(() => {
    return sections.map((section, sectionIndex) => {
      const indices = sectionIndexMap[sectionIndex] ?? [];
      const dynamics = fieldDynamics[sectionIndex];
      const sectionFocus = dynamics?.focus ?? 0;
      const sectionAlignment: OrbitAlignment = dynamics?.alignment ?? section.alignment ?? 'center';
      const wrapperAlignmentStyle =
        sectionAlignment === 'left'
          ? styles.alignStart
          : sectionAlignment === 'right'
            ? styles.alignEnd
            : styles.alignCenter;
      const activeIndex = activeBySection[sectionIndex] ?? 0;

      const surfaces = indices.map((flatIndex, localIndex) => {
        const subsection = section.subsections[localIndex];
        const visual = subsectionVisualStates[flatIndex];
        const isActive = activeIndex === localIndex;

        if (!subsection || !visual) {
          return null;
        }

        return (
          <View
            key={`${section.id}::surface-${subsection.id}`}
            style={[styles.surfacePage, { width: baseSurfaceWidth, height: surfaceHeight }]}
          >
            <ThoughtOrbitFocusProvider
              value={{
                focus: isActive ? visual.focus : Math.min(0.4, visual.focus),
                distance: isActive ? 0 : Math.abs(visual.normalized) + 0.5,
              }}
            >
              <View style={styles.surfaceContent}>{subsection.content}</View>
            </ThoughtOrbitFocusProvider>
          </View>
        );
      });

      return (
        <View
          key={section.id}
          style={[
            styles.sectionWrapper,
            wrapperAlignmentStyle,
            {
              paddingVertical: 48 + (1 - sectionFocus) * 36,
            },
          ]}
          onLayout={registerSection(indices)}
        >
          {Boolean(section.title) || Boolean(section.subtitle) ? (
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
          {!reduceMotion ? (
            <View
              style={[
                styles.sectionSpeck,
                {
                  opacity: Math.max(0, 0.68 - sectionFocus * 0.68),
                  transform: [
                    { translateX: orbitPhase * 0.18 },
                    { scale: 0.38 + (1 - sectionFocus) * 0.8 },
                  ],
                  shadowRadius: 18 + (1 - sectionFocus) * 28,
                },
              ]}
            />
          ) : null}
          <View
            style={[
              styles.sectionHalo,
              {
                opacity: reduceMotion ? 0.35 : sectionFocus * 0.85,
                transform: [{ scale: reduceMotion ? 0.9 : 0.7 + sectionFocus * 0.4 }],
              },
            ]}
          />
          <View style={[styles.orbitStage, { height: stageHeight }]}>
            <View
              style={[styles.surfaceViewport, { width: baseSurfaceWidth, height: surfaceHeight }]}
            >
              <ScrollView
                horizontal
                pagingEnabled
                ref={(node) => {
                  sectionScrollRefs.current[sectionIndex] = node;
                }}
                style={styles.surfaceCarousel}
                contentContainerStyle={[styles.surfaceCarouselContent, { height: surfaceHeight }]}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const nextIndex = Math.max(
                    0,
                    Math.min(
                      section.subsections.length - 1,
                      Math.round(offsetX / Math.max(baseSurfaceWidth, 1)),
                    ),
                  );

                  setActiveBySection((previous) => {
                    const next = [...previous];
                    next[sectionIndex] = nextIndex;
                    return next;
                  });
                }}
              >
                {surfaces}
              </ScrollView>
            </View>
            {section.subsections.length > 1 ? (
              <View style={styles.carouselControls}>
                <Pressable
                  accessibilityLabel={`View previous ${section.title ?? 'subsection'}`}
                  accessibilityRole="button"
                  disabled={activeIndex === 0}
                  onPress={() => {
                    const current = activeBySection[sectionIndex] ?? 0;
                    if (current <= 0) {
                      return;
                    }

                    const target = current - 1;
                    setActiveBySection((previous) => {
                      const next = [...previous];
                      next[sectionIndex] = target;
                      return next;
                    });

                    const ref = sectionScrollRefs.current[sectionIndex];
                    ref?.scrollTo({ x: target * baseSurfaceWidth, animated: true });
                  }}
                  style={[
                    styles.carouselButton,
                    activeIndex === 0 ? styles.carouselButtonDisabled : null,
                  ]}
                >
                  <Text style={styles.carouselButtonLabel}>‹</Text>
                </Pressable>
                <View style={styles.carouselDots}>
                  {section.subsections.map((_, dotIndex) => {
                    const active = dotIndex === activeIndex;
                    return (
                      <View
                        key={`${section.id}-dot-${dotIndex}`}
                        style={[
                          styles.carouselDot,
                          active ? styles.carouselDotActive : styles.carouselDotInactive,
                        ]}
                      />
                    );
                  })}
                </View>
                <Pressable
                  accessibilityLabel={`View next ${section.title ?? 'subsection'}`}
                  accessibilityRole="button"
                  disabled={activeIndex === section.subsections.length - 1}
                  onPress={() => {
                    const current = activeBySection[sectionIndex] ?? 0;
                    const lastIndex = section.subsections.length - 1;
                    if (current >= lastIndex) {
                      return;
                    }

                    const target = current + 1;
                    setActiveBySection((previous) => {
                      const next = [...previous];
                      next[sectionIndex] = target;
                      return next;
                    });

                    const ref = sectionScrollRefs.current[sectionIndex];
                    ref?.scrollTo({ x: target * baseSurfaceWidth, animated: true });
                  }}
                  style={[
                    styles.carouselButton,
                    activeIndex === section.subsections.length - 1
                      ? styles.carouselButtonDisabled
                      : null,
                  ]}
                >
                  <Text style={styles.carouselButtonLabel}>›</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      );
    });
  }, [
    baseSurfaceWidth,
    fieldDynamics,
    activeBySection,
    reduceMotion,
    registerSection,
    sectionIndexMap,
    sections,
    subsectionVisualStates,
    stageHeight,
    surfaceHeight,
    orbitPhase,
  ]);

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
    paddingBottom: 200,
    gap: 80,
  },
  sectionWrapper: {
    width: '100%',
    position: 'relative',
  },
  sectionHeading: {
    marginBottom: 24,
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
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
    borderRadius: 150,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.4,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 24 },
    pointerEvents: 'none',
  },
  sectionSpeck: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.65)',
    shadowColor: '#38BDF8',
    pointerEvents: 'none',
  },
  orbitStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surfaceViewport: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  surfaceCarousel: {
    flex: 1,
  },
  surfaceCarouselContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  surfacePage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  surfaceContent: {
    flex: 1,
    width: '100%',
  },
  carouselControls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 12,
  },
  carouselButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  carouselButtonDisabled: {
    opacity: 0.35,
  },
  carouselButtonLabel: {
    fontSize: 24,
    color: '#E0F2FE',
    lineHeight: 26,
  },
  carouselDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  carouselDotActive: {
    backgroundColor: '#38BDF8',
  },
  carouselDotInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
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
});
