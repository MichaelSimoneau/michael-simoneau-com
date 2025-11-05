import { type ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SitemapContentBlock } from './sitemapContentParsing';
import { useThoughtOrbitFocus } from './ThoughtOrbitFocusContext';

type SitemapSubsectionCardProps = {
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'secondary' | 'fragment';
  blocks: SitemapContentBlock[];
  footer?: ReactNode;
  endpointSegments?: string[];
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

export const SitemapSubsectionCard = ({
  title,
  subtitle,
  accent = 'primary',
  blocks,
  footer,
  endpointSegments,
}: SitemapSubsectionCardProps) => {
  const accentStyle = useMemo(() => {
    switch (accent) {
      case 'fragment':
        return styles.fragmentAccent;
      case 'secondary':
        return styles.secondaryAccent;
      case 'primary':
      default:
        return styles.primaryAccent;
    }
  }, [accent]);

  const { focus, distance } = useThoughtOrbitFocus();
  const surfacePresence = useMemo(() => Math.min(1, Math.max(0, focus)), [focus]);
  const orbitLean = distance === 0 ? 0 : distance > 0 ? 1 : -1;
  const surfaceStyle = useMemo(
    () => ({
      transform: [
        { perspective: 1200 },
        { rotateX: `${(0.18 - surfacePresence * 0.12) * orbitLean}rad` },
        { rotateY: `${(accent === 'fragment' ? 1 : -1) * surfacePresence * 0.08}rad` },
        { translateY: (1 - surfacePresence) * 18 * orbitLean },
      ],
      shadowOpacity: 0.22 + surfacePresence * 0.38,
      shadowRadius: 14 + surfacePresence * 12,
    }),
    [accent, orbitLean, surfacePresence],
  );

  const contentShift = useMemo(() => distance * 18, [distance]);
  const contentOpacity = useMemo(() => 0.68 + surfacePresence * 0.32, [surfacePresence]);
  const segmentTrail = useMemo(
    () => (endpointSegments ? endpointSegments.filter(Boolean) : []),
    [endpointSegments],
  );

  return (
    <View style={[styles.card, surfaceStyle]}>
      <View style={styles.headerRow}>
        <View style={[styles.accentDot, accentStyle]} />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
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
      <View style={styles.bodyTrack}>
        <View
          style={[
            styles.body,
            { transform: [{ translateY: contentShift }], opacity: contentOpacity },
          ]}
        >
          {blocks.map(renderBlock)}
        </View>
      </View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 26,
    backgroundColor: 'rgba(4, 18, 36, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.28)',
    gap: 16,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  accentDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryAccent: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    shadowColor: '#3B82F6',
  },
  secondaryAccent: {
    backgroundColor: 'rgba(129, 140, 248, 0.8)',
    shadowColor: '#818CF8',
  },
  fragmentAccent: {
    backgroundColor: 'rgba(45, 212, 191, 0.8)',
    shadowColor: '#2DD4BF',
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#A5F3FC',
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
    borderColor: 'rgba(125, 211, 252, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
  },
  segmentText: {
    fontSize: 12,
    letterSpacing: 0.6,
    color: '#BAE6FD',
    textTransform: 'uppercase',
  },
  bodyTrack: {
    overflow: 'hidden',
    maxHeight: 260,
  },
  body: {
    gap: 14,
  },
  headingPrimary: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E0F2FE',
    letterSpacing: 0.4,
  },
  headingSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C4B5FD',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  listGlyph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#67E8F9',
    width: 16,
    textAlign: 'center',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
  },
  codeBlock: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(148, 163, 184, 0.32)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: '#FACC15',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.24)',
    paddingTop: 12,
  },
});
