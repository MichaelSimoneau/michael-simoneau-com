export interface Principle {
  id: string;
  number: number;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  principles: Principle[];
}

export interface ZeroContent {
  preface: string;
  chapters: Chapter[];
  conclusion: string;
}

const chapterHeaderPattern = /^Chapter\s+(\d+):\s+(.+)$/i;
const principleHeaderPattern = /^Principle\s+(\d+):\s+(.+)$/i;
const conclusionHeaderPattern = /^Conclusion:\s*(.*)$/i;
const bulletPrefixPattern = /^\s*[•\u2022\-–—]\s*/;

type OutlineChapter = {
  title: string;
  principles: Map<number, string>;
};

type ExpandedPrinciple = {
  title: string;
  content: string;
};

type ExpandedChapter = {
  title: string;
  principles: Map<number, ExpandedPrinciple>;
};

const normalizeForMatch = (rawLine: string): string => rawLine.replace(bulletPrefixPattern, '').trim();

const isBulletPrefixed = (rawLine: string): boolean => bulletPrefixPattern.test(rawLine);

const normalizeBody = (lines: string[]): string => {
  const normalized = lines
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return normalized;
};

const ensureOutlineChapter = (chapters: Map<number, OutlineChapter>, number: number, title: string): OutlineChapter => {
  const existing = chapters.get(number);
  if (existing) {
    if (!existing.title && title) {
      existing.title = title;
    }
    return existing;
  }
  const created: OutlineChapter = {
    title,
    principles: new Map<number, string>(),
  };
  chapters.set(number, created);
  return created;
};

const ensureExpandedChapter = (chapters: Map<number, ExpandedChapter>, number: number, title: string): ExpandedChapter => {
  const existing = chapters.get(number);
  if (existing) {
    if (!existing.title && title) {
      existing.title = title;
    }
    return existing;
  }
  const created: ExpandedChapter = {
    title,
    principles: new Map<number, ExpandedPrinciple>(),
  };
  chapters.set(number, created);
  return created;
};

const parseStructuredZeroContent = (text: string): ZeroContent => {
  const lines = text.split('\n');
  const prefaceLines: string[] = [];
  const conclusionSections: string[] = [];
  const outlineChapters = new Map<number, OutlineChapter>();
  const expandedChapters = new Map<number, ExpandedChapter>();

  let hasSeenChapter = false;
  let currentChapterNumber: number | null = null;
  let currentChapterTitle = '';
  let chapterLeadInLines: string[] = [];
  let currentChapterHasExpandedPrinciples = false;
  let currentPrincipleNumber: number | null = null;
  let currentPrincipleTitle = '';
  let currentPrincipleBodyLines: string[] = [];
  let currentPrincipleIsOutline = false;
  let activeConclusionLines: string[] | null = null;

  const flushConclusion = () => {
    if (!activeConclusionLines) return;
    const textValue = normalizeBody(activeConclusionLines);
    if (textValue) conclusionSections.push(textValue);
    activeConclusionLines = null;
  };

  const flushPrinciple = () => {
    if (currentChapterNumber === null || currentPrincipleNumber === null) return;

    if (currentPrincipleIsOutline) {
      const chapter = ensureOutlineChapter(outlineChapters, currentChapterNumber, currentChapterTitle);
      const outlineText = normalizeBody(currentPrincipleBodyLines) || currentPrincipleTitle.trim();
      chapter.principles.set(currentPrincipleNumber, outlineText);
    } else {
      const chapter = ensureExpandedChapter(expandedChapters, currentChapterNumber, currentChapterTitle);
      chapter.principles.set(currentPrincipleNumber, {
        title: currentPrincipleTitle.trim(),
        content: normalizeBody(currentPrincipleBodyLines),
      });
      currentChapterHasExpandedPrinciples = true;
    }

    currentPrincipleNumber = null;
    currentPrincipleTitle = '';
    currentPrincipleBodyLines = [];
    currentPrincipleIsOutline = false;
  };

  for (const rawLine of lines) {
    const normalized = normalizeForMatch(rawLine);
    const chapterMatch = normalized.match(chapterHeaderPattern);
    if (chapterMatch) {
      flushPrinciple();
      flushConclusion();
      hasSeenChapter = true;
      currentChapterNumber = parseInt(chapterMatch[1], 10);
      currentChapterTitle = chapterMatch[2].trim();
      chapterLeadInLines = [];
      currentChapterHasExpandedPrinciples = (expandedChapters.get(currentChapterNumber)?.principles.size ?? 0) > 0;
      continue;
    }

    const principleMatch = normalized.match(principleHeaderPattern);
    if (principleMatch && currentChapterNumber !== null) {
      flushPrinciple();
      flushConclusion();
      currentPrincipleNumber = parseInt(principleMatch[1], 10);
      currentPrincipleTitle = principleMatch[2].trim();
      currentPrincipleIsOutline = isBulletPrefixed(rawLine);

      if (!currentPrincipleIsOutline && !currentChapterHasExpandedPrinciples && chapterLeadInLines.length > 0) {
        currentPrincipleBodyLines = [...chapterLeadInLines];
      } else {
        currentPrincipleBodyLines = [];
      }
      chapterLeadInLines = [];
      continue;
    }

    const conclusionMatch = normalized.match(conclusionHeaderPattern);
    if (conclusionMatch) {
      flushPrinciple();
      flushConclusion();
      activeConclusionLines = [rawLine];
      continue;
    }

    if (activeConclusionLines) {
      activeConclusionLines.push(rawLine);
      continue;
    }

    if (!hasSeenChapter) {
      prefaceLines.push(rawLine);
      continue;
    }

    if (currentPrincipleNumber !== null) {
      currentPrincipleBodyLines.push(rawLine);
      continue;
    }

    if (currentChapterNumber !== null) {
      chapterLeadInLines.push(rawLine);
    }
  }

  flushPrinciple();
  flushConclusion();

  const chapterNumbers = Array.from(new Set([...outlineChapters.keys(), ...expandedChapters.keys()])).sort((a, b) => a - b);
  const chapters: Chapter[] = chapterNumbers.map((chapterNumber) => {
    const outlineChapter = outlineChapters.get(chapterNumber);
    const expandedChapter = expandedChapters.get(chapterNumber);
    const principleNumbers = Array.from(
      new Set([
        ...Array.from(outlineChapter?.principles.keys() ?? []),
        ...Array.from(expandedChapter?.principles.keys() ?? []),
      ]),
    ).sort((a, b) => a - b);

    const principles: Principle[] = principleNumbers.map((principleNumber) => {
      const expandedPrinciple = expandedChapter?.principles.get(principleNumber);
      const outlineText = outlineChapter?.principles.get(principleNumber)?.trim() ?? '';
      const title = expandedPrinciple?.title || outlineText || `Principle ${principleNumber}`;
      const content = expandedPrinciple?.content?.trim() || outlineText || title;

      return {
        id: `chap-${chapterNumber}-principle-${principleNumber}`,
        number: principleNumber,
        title,
        content,
      };
    });

    return {
      id: `chapter-${chapterNumber}`,
      number: chapterNumber,
      title: expandedChapter?.title || outlineChapter?.title || `Chapter ${chapterNumber}`,
      principles,
    };
  });

  return {
    preface: normalizeBody(prefaceLines),
    chapters,
    conclusion: conclusionSections.join('\n\n').trim(),
  };
};

export const parseZeroContent = (text: string): ZeroContent => {
  return parseStructuredZeroContent(text);
};
