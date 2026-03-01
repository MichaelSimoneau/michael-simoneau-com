import { ContentBlock } from '../models/BlogPost';

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const stripInlineMarkdown = (value: string): string => {
  return normalizeWhitespace(
    value
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
  );
};

export const extractBlogText = (content: ContentBlock[]): string[] => {
  const segments: string[] = [];

  content.forEach((block) => {
    switch (block.type) {
      case 'heading': {
        const heading = stripInlineMarkdown(block.content);
        if (heading) {
          segments.push(heading);
        }
        break;
      }
      case 'paragraph':
      case 'callout': {
        const paragraph = stripInlineMarkdown(block.content);
        if (paragraph) {
          segments.push(paragraph);
        }
        break;
      }
      case 'list': {
        const listItems = block.items
          .map((item) => stripInlineMarkdown(item))
          .filter((item) => item.length > 0);

        if (listItems.length > 0) {
          segments.push(listItems.join('. '));
        }
        break;
      }
      case 'code':
        break;
      case 'math': {
        const mathText = normalizeWhitespace(block.content);
        if (mathText) {
          segments.push(mathText);
        }
        break;
      }
      case 'table': {
        const headerText = block.headers
          .map((header) => stripInlineMarkdown(header))
          .filter((header) => header.length > 0);
        if (headerText.length > 0) {
          segments.push(headerText.join(' | '));
        }

        block.rows.forEach((row) => {
          const rowText = row
            .map((cell) => stripInlineMarkdown(cell))
            .filter((cell) => cell.length > 0);
          if (rowText.length > 0) {
            segments.push(rowText.join(' | '));
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
