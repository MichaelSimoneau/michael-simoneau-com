import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle } from 'react-native';
import type { ContentBlock } from '../types';

interface BlogContentRendererProps {
  blocks: ContentBlock[];
}

export const BlogContentRenderer = ({ blocks }: BlogContentRendererProps) => {
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => (
        <Fragment key={`${block.type}-${index}`}>{renderBlock(block)}</Fragment>
      ))}
    </View>
  );
};

const renderBlock = (block: ContentBlock) => {
  switch (block.type) {
    case 'heading':
      return (
        <Text style={[styles.heading, headingStyles[block.level] ?? headingStyles[2]]}>
          {block.content}
        </Text>
      );
    case 'paragraph':
      return <Text style={styles.paragraph}>{block.content}</Text>;
    case 'list':
      return (
        <View style={styles.listContainer}>
          {block.items.map((item, itemIndex) => (
            <View style={styles.listItem} key={`${itemIndex}-${item}`}>
              <Text style={styles.bullet}>{'\u2022'} </Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'code':
      return (
        <View style={styles.codeBlock}>
          <Text style={styles.codeLanguage}>{block.language}</Text>
          <Text style={styles.codeText}>{block.content}</Text>
        </View>
      );
    case 'callout':
      return (
        <View style={styles.callout}>
          <Text style={styles.calloutText}>{block.content}</Text>
        </View>
      );
    default:
      return null;
  }
};

const headingStyles: Record<number, TextStyle> = {
  1: { fontSize: 36, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16, marginTop: 24 },
  2: { fontSize: 32, fontWeight: '800', letterSpacing: -0.3, marginBottom: 14, marginTop: 20 },
  3: { fontSize: 28, fontWeight: '700', letterSpacing: -0.2, marginBottom: 12, marginTop: 18 },
  4: { fontSize: 24, fontWeight: '700', letterSpacing: -0.1, marginBottom: 10, marginTop: 16 },
  5: { fontSize: 20, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  6: { fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 12 },
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
    padding: 24,
  },
  heading: {
    fontWeight: '700',
    color: '#F8FAFC',
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#CBD5F5',
    fontWeight: '500',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    lineHeight: 28,
    fontSize: 18,
    color: '#38BDF8',
    fontWeight: '700',
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    color: '#CBD5F5',
    fontWeight: '500',
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#12213B',
    marginBottom: 16,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  codeLanguage: {
    color: '#38BDF8',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },
  codeText: {
    fontFamily: 'Courier New',
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 24,
  },
  callout: {
    borderLeftWidth: 6,
    borderLeftColor: '#0EA5E9',
    backgroundColor: 'rgba(56,189,248,0.12)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#12213B',
    marginBottom: 16,
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  calloutText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#E2E8F0',
    fontWeight: '600',
  },
});
