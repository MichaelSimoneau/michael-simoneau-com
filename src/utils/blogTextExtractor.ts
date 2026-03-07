import { ContentBlock } from '../models/BlogPost';

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();
const SENTENCE_CHUNK_MAX = 220;
const SENTENCE_CHUNK_MIN = 80;

const stripInlineMarkdown = (value: string): string => {
  return normalizeWhitespace(
    value
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
  );
};

const withTerminalPause = (value: string): string => {
  if (!value) {
    return value;
  }

  if (/[.!?]$/.test(value)) {
    return value;
  }

  return `${value}.`;
};

const splitIntoSentenceChunks = (value: string): string[] => {
  const text = normalizeWhitespace(value);
  if (!text) {
    return [];
  }

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 1) {
    return [withTerminalPause(text)];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const next = currentChunk ? `${currentChunk} ${sentence}` : sentence;

    if (next.length <= SENTENCE_CHUNK_MAX || currentChunk.length < SENTENCE_CHUNK_MIN) {
      currentChunk = next;
      continue;
    }

    chunks.push(withTerminalPause(currentChunk));
    currentChunk = sentence;
  }

  if (currentChunk) {
    chunks.push(withTerminalPause(currentChunk));
  }

  return chunks;
};

const normalizeMathForSpeech = (value: string): string => {
  return normalizeWhitespace(
    value
      .replace(/\\mathbb\{Z\}_3/g, 'Z three')
      .replace(/\\equiv/g, ' equivalent to ')
      .replace(/\\pmod\s*([0-9]+)/g, ' mod $1')
      .replace(/\\times/g, ' times ')
      .replace(/\\tau/g, ' tau ')
      .replace(/\\Delta/g, ' delta ')
      .replace(/\\lfloor/g, ' floor of ')
      .replace(/\\rfloor/g, ' end floor ')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/[_^]\{([^}]+)\}/g, ' $1 ')
      .replace(/[_^]([a-zA-Z0-9+-]+)/g, ' $1 ')
      .replace(/[{}\\]/g, ' ')
  );
};

const normalizeTableCellForSpeech = (value: string): string =>
  stripInlineMarkdown(value)
    .replace(/\s*\|\s*/g, ', ')
    .replace(/\s*:\s*/g, ': ');

export const extractBlogText = (content: ContentBlock[]): string[] => {
  const segments: string[] = [];

  content.forEach((block) => {
    switch (block.type) {
      case 'heading': {
        const heading = stripInlineMarkdown(block.content);
        if (heading) {
          segments.push(...splitIntoSentenceChunks(heading));
        }
        break;
      }
      case 'paragraph':
      case 'callout': {
        const paragraph = stripInlineMarkdown(block.content);
        if (paragraph) {
          segments.push(...splitIntoSentenceChunks(paragraph));
        }
        break;
      }
      case 'list': {
        const listItems = block.items
          .map((item) => stripInlineMarkdown(item))
          .filter((item) => item.length > 0);

        if (listItems.length > 0) {
          listItems.forEach((item, index) => {
            const cleaned = withTerminalPause(item);
            segments.push(...splitIntoSentenceChunks(`Item ${index + 1}. ${cleaned}`));
          });
        }
        break;
      }
      case 'code':
        segments.push('Code example omitted from narration.');
        break;
      case 'math': {
        const mathText = normalizeMathForSpeech(block.content);
        if (mathText) {
          segments.push(...splitIntoSentenceChunks(withTerminalPause(mathText)));
        }
        break;
      }
      case 'table': {
        if (block.caption) {
          const caption = stripInlineMarkdown(block.caption);
          if (caption) {
            segments.push(...splitIntoSentenceChunks(`Table: ${withTerminalPause(caption)}`));
          }
        }

        const headerText = block.headers
          .map((header) => normalizeTableCellForSpeech(header))
          .filter((header) => header.length > 0);
        if (headerText.length > 0) {
          segments.push(withTerminalPause(`Columns: ${headerText.join(', ')}`));
        }

        block.rows.forEach((row, rowIndex) => {
          const rowText = row
            .map((cell) => normalizeTableCellForSpeech(cell))
            .filter((cell) => cell.length > 0);
          if (rowText.length > 0) {
            segments.push(withTerminalPause(`Row ${rowIndex + 1}: ${rowText.join(', ')}`));
          }
        });
        break;
      }
      default: {
        const _exhaustive: never = block;
        return _exhaustive;
      }
    }
  });

  return segments;
};
