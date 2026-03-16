import { Chapter, Principle, ZeroContent } from '../../../utils/zeroParser';

export type ZeroRouteTarget = {
  chapter: Chapter;
  principle: Principle;
  chapterIndex: number;
  principleIndex: number;
  globalIndex: number;
  chapterParam: number;
  principalParam: number;
};

const parsePositiveInt = (value?: string): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

export const flattenZeroRouteTargets = (content: ZeroContent): ZeroRouteTarget[] => {
  const flattened: ZeroRouteTarget[] = [];
  content.chapters.forEach((chapter, chapterIndex) => {
    chapter.principles.forEach((principle, principleIndex) => {
      flattened.push({
        chapter,
        principle,
        chapterIndex,
        principleIndex,
        globalIndex: flattened.length,
        chapterParam: chapter.number,
        principalParam: principle.number,
      });
    });
  });
  return flattened;
};

export const buildZeroTheoryPath = (chapter: number, principal: number): string =>
  `/zeroth/theory/chapter/${chapter}/principal/${principal}`;

export const getFirstRouteTarget = (content: ZeroContent): ZeroRouteTarget | null => {
  const flattened = flattenZeroRouteTargets(content);
  return flattened[0] ?? null;
};

export const resolveZeroRouteTarget = (
  content: ZeroContent,
  chapterParam?: string,
  principalParam?: string,
): { target: ZeroRouteTarget | null; shouldRedirect: boolean } => {
  const parsedChapter = parsePositiveInt(chapterParam);
  const parsedPrincipal = parsePositiveInt(principalParam);
  const flattened = flattenZeroRouteTargets(content);
  if (flattened.length === 0) {
    return { target: null, shouldRedirect: false };
  }

  const fallback = flattened[0];
  if (parsedChapter === null || parsedPrincipal === null) {
    return { target: fallback, shouldRedirect: true };
  }

  const exact = flattened.find(
    (entry) => entry.chapter.number === parsedChapter && entry.principle.number === parsedPrincipal,
  );
  if (exact) return { target: exact, shouldRedirect: false };

  const chapter = content.chapters.find((entry) => entry.number === parsedChapter);
  if (!chapter || chapter.principles.length === 0) {
    return { target: fallback, shouldRedirect: true };
  }

  const fallbackPrinciple = chapter.principles[0];
  const fallbackInChapter = flattened.find(
    (entry) => entry.chapter.id === chapter.id && entry.principle.id === fallbackPrinciple.id,
  );
  return { target: fallbackInChapter ?? fallback, shouldRedirect: true };
};

export const getAdjacentTarget = (
  content: ZeroContent,
  currentTarget: ZeroRouteTarget,
  direction: 'next' | 'prev',
): ZeroRouteTarget | null => {
  const flattened = flattenZeroRouteTargets(content);
  const delta = direction === 'next' ? 1 : -1;
  return flattened[currentTarget.globalIndex + delta] ?? null;
};
