import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ScrapedContent } from '../data/sitemapContent';
import type { SitemapContentBlock } from './sitemapContentParsing';
import { parseSitemapContentBlocks } from './sitemapContentParsing';

type SitemapGroup = {
  base: ScrapedContent;
  fragments: ScrapedContent[];
};

type SitemapContentClusterProps = {
  group: SitemapGroup;
};

const createFragmentStyle = (index: number, count: number) => {
  if (count === 0) {
    return styles.fragmentCard;
  }

  const angle = (index / count) * Math.PI * 2;
  const radius = 36 + (index % 3) * 8;
  return [
    styles.fragmentCard,
    {
      transform: [
        { translateX: Math.cos(angle) * radius },
        { translateY: Math.sin(angle) * radius * 0.6 },
        { scale: 0.94 + (index % 2) * 0.03 },
      ],
    },
  ];
};

const renderBlock = (block: SitemapContentBlock, index: number) => {
  switch (block.type) {
    case 'heading': {
      const headingStyle = block.level <= 2 ? styles.headingPrimary : styles.headingSecondary;
      return (
        <Text key={`heading-${index}`} style={headingStyle}>
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

export const SitemapContentCluster = ({ group }: SitemapContentClusterProps) => {
  const baseBlocks = useMemo(
    () => parseSitemapContentBlocks(group.base.content),
    [group.base.content],
  );
  const fragmentBlocks = useMemo(
    () =>
      group.fragments.map((fragment) => ({
        fragment,
        blocks: parseSitemapContentBlocks(fragment.content),
      })),
    [group.fragments],
  );

  return (
    <View style={styles.cluster}>
      <View style={styles.headerRow}>
        <View style={styles.accentDot} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{group.base.title}</Text>
          <Text style={styles.url}>{group.base.url}</Text>
        </View>
      </View>
      <View style={styles.baseContent}>{baseBlocks.map(renderBlock)}</View>
      {fragmentBlocks.length > 0 ? (
        <View style={styles.fragmentField}>
          {fragmentBlocks.map((entry, fragmentIndex) => (
            <View
              key={entry.fragment.url}
              style={createFragmentStyle(fragmentIndex, fragmentBlocks.length)}
            >
              <Text style={styles.fragmentLabel}>{entry.fragment.url}</Text>
              {entry.blocks.map((block, blockIndex) => (
                <View key={`${entry.fragment.url}-${blockIndex}`} style={styles.fragmentBlock}>
                  {renderBlock(block, blockIndex)}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cluster: {
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  accentDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(56, 189, 248, 0.7)',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  url: {
    fontSize: 14,
    color: '#A5F3FC',
  },
  baseContent: {
    gap: 18,
  },
  headingPrimary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E0F2FE',
    letterSpacing: 0.5,
  },
  headingSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C4B5FD',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
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
    fontSize: 15,
    lineHeight: 22,
    color: '#67E8F9',
    width: 18,
    textAlign: 'center',
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#E2E8F0',
  },
  codeBlock: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: 'rgba(148, 163, 184, 0.28)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 14,
    color: '#FACC15',
  },
  fragmentField: {
    position: 'relative',
    marginTop: 12,
    paddingTop: 42,
    paddingBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  fragmentCard: {
    position: 'relative',
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 118, 110, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.4)',
    shadowColor: '#5EEAD4',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 14 },
    gap: 10,
  },
  fragmentLabel: {
    fontSize: 12,
    color: '#5EEAD4',
    letterSpacing: 0.4,
  },
  fragmentBlock: {
    gap: 6,
  },
});
