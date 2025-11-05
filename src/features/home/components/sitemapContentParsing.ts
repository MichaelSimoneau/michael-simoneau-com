export type SitemapContentBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; text: string };

export const parseSitemapContentBlocks = (text: string): SitemapContentBlock[] => {
  const normalized = text.replace(/\r/g, '');
  const segments = normalized
    .split(/\n\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments.map<SitemapContentBlock>((segment) => {
    if (/^([^\n]+)\n[-=]{3,}$/.test(segment)) {
      const match = segment.match(/^([^\n]+)\n([-=]{3,})$/);
      const headingText = match ? match[1].trim() : segment.replace(/\n[-=]{3,}$/, '').trim();
      const level = match && match[2].startsWith('=') ? 1 : 2;
      return { type: 'heading', level, text: headingText };
    }

    if (/^#{1,6}\s/.test(segment)) {
      const headingMatch = segment.match(/^(#+)\s*(.*)$/);
      const level = headingMatch ? headingMatch[1].length : 1;
      const headingText = headingMatch
        ? headingMatch[2].trim()
        : segment.replace(/^#+\s*/, '').trim();
      return { type: 'heading', level, text: headingText };
    }

    if (/^```/.test(segment)) {
      const code = segment
        .replace(/^```.*\n?/, '')
        .replace(/```$/, '')
        .trim();
      return { type: 'code', text: code };
    }

    const lines = segment
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length > 0 && lines.every((line) => /^([*-]|\d+\.)\s+/.test(line))) {
      const ordered = /^\d+\./.test(lines[0]);
      const items = lines.map((line) => line.replace(/^([*-]|\d+\.)\s+/, '').trim());
      return { type: 'list', ordered, items };
    }

    return { type: 'paragraph', text: segment };
  });
};
