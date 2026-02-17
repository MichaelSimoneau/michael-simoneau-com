import type { CalloutBlock, CodeBlock, HeadingBlock, ListBlock, ParagraphBlock } from './types';

export const createParagraph = (content: string): ParagraphBlock => ({
  type: 'paragraph',
  content,
});

export const createHeading = (content: string, level: HeadingBlock['level']): HeadingBlock => ({
  type: 'heading',
  level,
  content,
});

export const createCode = (content: string, language: string): CodeBlock => ({
  type: 'code',
  language,
  content,
});

export const createList = (items: string[]): ListBlock => ({
  type: 'list',
  items,
  content: items.join('\n'),
});

export const createCallout = (content: string): CalloutBlock => ({
  type: 'callout',
  content,
});
