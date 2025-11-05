import { type ReactNode, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SitemapContentBlock } from './sitemapContentParsing';
import { useThoughtOrbitFocus } from './ThoughtOrbitFocusContext';

type SitemapSubsectionSurfaceProps = {
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'secondary' | 'fragment';
  blocks: SitemapContentBlock[];
  footer?: ReactNode;
  endpointSegments?: string[];
};

const accentPalettes: Record<NonNullable<SitemapSubsectionSurfaceProps['accent']>, string> = {
  primary: '#38bdf8',
  secondary: '#818cf8',
  fragment: '#2dd4bf',
};

const renderBlock = (block: SitemapContentBlock, index: number) => {
  switch (block.type) {
    case 'heading': {
      const headingStyle = block.level <= 2 ? styles.headingPrimary : styles.headingSecondary;
      return (
        <Text
          key={`heading-${index}`}
          style={headingStyle}
          numberOfLines={block.level <= 2 ? 2 : 3}
        >
          {block.text}
        </Text>
      );
    }
    case 'code':
      return (
        <View key={`code-${index}`} style={styles.codeBlock}>
          <Text style={styles.codeText}>{block.text}</Text>
        </View>
      );
    case 'list':
      return (
        <View key={`list-${index}`} style={styles.list}>
          {block.items.map((item, itemIndex) => (
            <View key={`list-${index}-${itemIndex}`} style={styles.listItem}>
              <Text style={styles.listGlyph}>{block.ordered ? `${itemIndex + 1}.` : '•'}</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'paragraph':
    default:
      return (
        <Text key={`paragraph-${index}`} style={styles.paragraph}>
          {block.text.replace(/\n+/g, '\n')}
        </Text>
      );
  }
};

export const SitemapSubsectionSurface = ({
  title,
  subtitle,
  accent = 'primary',
  blocks,
  footer,
  endpointSegments,
}: SitemapSubsectionSurfaceProps) => {
  const palette = accentPalettes[accent] ?? accentPalettes.primary;
  const { focus, distance } = useThoughtOrbitFocus();

  const intensity = useMemo(() => Math.min(1, Math.max(0.2, focus * 1.15)), [focus]);
  const lean = useMemo(() => (distance === 0 ? 0 : distance > 0 ? 1 : -1), [distance]);

  const frameStyle = useMemo(
    () => ({
      borderColor: `rgba(59, 130, 246, ${(0.1 + intensity * 0.35).toFixed(3)})`,
      backgroundColor: `rgba(2, 12, 28, ${(0.62 + intensity * 0.28).toFixed(3)})`,
      shadowColor: palette,
      shadowOpacity: 0.15 + intensity * 0.3,
      shadowRadius: 16 + intensity * 22,
      transform: [
        { perspective: 1400 },
        { rotateY: `${-lean * (0.16 + intensity * 0.12)}rad` },
        { rotateX: `${0.14 - intensity * 0.1}rad` },
        { scale: 0.86 + intensity * 0.18 },
      ],
    }),
    [intensity, lean, palette],
  );

  const auraStyle = useMemo(
    () => ({
      opacity: 0.2 + intensity * 0.45,
      shadowColor: palette,
      shadowRadius: 48 + intensity * 60,
    }),
    [intensity, palette],
  );

  const segmentTrail = useMemo(
    () => (endpointSegments ? endpointSegments.filter(Boolean) : []),
    [endpointSegments],
  );

  return (
    <View style={styles.surfaceContainer}>
      <View style={[styles.surfaceAura, auraStyle]} />
      <View style={[styles.surfaceFrame, frameStyle]}>
        <View style={[styles.surfaceAccent, { backgroundColor: palette }]} />
        <View style={styles.surfaceHeader}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {segmentTrail.length > 0 ? (
          <View style={styles.segmentTrail}>
            {segmentTrail.map((segment, index) => (
              <View key={`${segment}-${index}`} style={styles.segmentChip}>
                <Text style={styles.segmentText}>{segment}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <ScrollView
          style={styles.surfaceScroll}
          contentContainerStyle={styles.surfaceScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.surfaceBody}>{blocks.map(renderBlock)}</View>
          {footer ? <View style={styles.surfaceFooter}>{footer}</View> : null}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surfaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surfaceAura: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 320,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 16 },
  },
  surfaceFrame: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 24,
    gap: 18,
    overflow: 'hidden',
  },
  surfaceAccent: {
    position: 'absolute',
    top: -140,
    right: -110,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.22,
  },
  surfaceHeader: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#BAE6FD',
    letterSpacing: 0.3,
  },
  segmentTrail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.44)',
  },
  segmentText: {
    fontSize: 12,
    color: '#E0F2FE',
    letterSpacing: 0.4,
  },
  surfaceScroll: {
    flex: 1,
  },
  surfaceScrollContent: {
    paddingBottom: 16,
    gap: 18,
  },
  surfaceBody: {
    gap: 12,
  },
  surfaceFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.35)',
    paddingTop: 12,
  },
  headingPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  headingSecondary: {
    fontSize: 15,
    fontWeight: '500',
    color: '#CBD5F5',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
  codeBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.66)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#FDE68A',
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 10,
  },
  listGlyph: {
    fontSize: 14,
    color: '#38BDF8',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
});
