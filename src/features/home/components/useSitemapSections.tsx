import { useMemo } from 'react';
import type { ThoughtOrbitSection, ThoughtOrbitSubsection } from './ThoughtOrbitLayout';
import type { ScrapedContent } from '../data/sitemapContent';
import { SCRAPED_CONTENT } from '../data/sitemapContent';
import { parseSitemapContentBlocks } from './sitemapContentParsing';
import type { SitemapContentBlock } from './sitemapContentParsing';
import { SitemapSubsectionCard } from './SitemapSubsectionCard';

type SitemapGroup = {
  base: ScrapedContent;
  fragments: ScrapedContent[];
};

const alignments: ThoughtOrbitSection['alignment'][] = ['left', 'center', 'right'];

const fallbackBlocks = (
  blocks: SitemapContentBlock[],
  fallbackText: string,
): SitemapContentBlock[] => {
  if (blocks.length > 0) {
    return blocks;
  }

  return [{ type: 'paragraph', text: fallbackText }];
};

const formatSegmentLabel = (segment: string): string => {
  const sanitized = segment
    .replace(/^#/, '')
    .replace(/\?.*$/, '')
    .replace(/\/index$/i, '');
  const tokens = sanitized
    .split(/[-_]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    const compact = sanitized.replace(/^\//, '');
    return compact.length > 0 ? compact : 'Home';
  }

  return tokens.map((token) => token.charAt(0).toUpperCase() + token.slice(1)).join(' ');
};

const createEndpointTrails = (rawUrl: string): string[][] => {
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map(formatSegmentLabel);

    const baseSegments = segments.length > 0 ? segments : ['Home'];

    return baseSegments.map((_, index) => baseSegments.slice(0, index + 1));
  } catch {
    const cleaned = rawUrl.replace(/^https?:\/\//, '');
    return [[cleaned]];
  }
};

const createFragmentTrail = (record: ScrapedContent): string[] => {
  try {
    const parsed = new URL(record.url);
    const segments = parsed.pathname
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map(formatSegmentLabel);
    const hash = parsed.hash ? formatSegmentLabel(parsed.hash) : null;

    if (hash) {
      segments.push(hash);
    }

    return segments.length > 0 ? segments : ['Home'];
  } catch {
    return [record.url];
  }
};

const createBaseSubsections = (
  group: SitemapGroup,
  sectionTone: ThoughtOrbitSection['tone'],
): ThoughtOrbitSubsection[] => {
  const baseBlocks = parseSitemapContentBlocks(group.base.content);
  const trails = createEndpointTrails(group.base.url);
  const chunkCount = trails.length || 1;
  const chunkSize = chunkCount > 0 ? Math.ceil(baseBlocks.length / chunkCount) || 1 : 1;

  return trails.map((trail, index) => {
    const accent = index === 0 ? 'primary' : 'secondary';
    const tone = index === 0 ? sectionTone : 'surface';
    const subtitle = trail.join(' / ');
    const sliceStart = index * chunkSize;
    const sliceEnd = index === trails.length - 1 ? undefined : sliceStart + chunkSize;
    const slice = baseBlocks.slice(sliceStart, sliceEnd);
    const blocks = fallbackBlocks(slice, group.base.content.trim().slice(0, 240));

    return {
      id: `${group.base.url}::base-${index}`,
      tone,
      content: (
        <SitemapSubsectionCard
          title={group.base.title}
          subtitle={subtitle}
          accent={accent}
          blocks={blocks}
          endpointSegments={trail}
        />
      ),
    };
  });
};

const createFragmentSubsections = (group: SitemapGroup): ThoughtOrbitSubsection[] =>
  group.fragments.map((fragment, index) => {
    const fragmentBlocks = parseSitemapContentBlocks(fragment.content).slice(0, 4);
    const trail = createFragmentTrail(fragment);
    const subtitle = trail.join(' / ');
    const blocks = fallbackBlocks(fragmentBlocks, fragment.content.trim().slice(0, 200));

    return {
      id: `${fragment.url}::fragment-${index}`,
      tone: 'surface',
      content: (
        <SitemapSubsectionCard
          title={fragment.title}
          subtitle={subtitle}
          accent="fragment"
          blocks={blocks}
          endpointSegments={trail}
        />
      ),
    };
  });

export const useSitemapSections = (): ThoughtOrbitSection[] => {
  return useMemo(() => {
    const groups = new Map<string, SitemapGroup>();

    SCRAPED_CONTENT.forEach((record) => {
      const group = groups.get(record.baseUrl) ?? { base: record, fragments: [] };
      if (!groups.has(record.baseUrl)) {
        groups.set(record.baseUrl, group);
      }

      if (record.fragment) {
        group.fragments.push(record);
      } else {
        group.base = record;
      }
    });

    const orderedGroups = Array.from(groups.values()).sort((a, b) =>
      a.base.url.localeCompare(b.base.url),
    );

    return orderedGroups.map<ThoughtOrbitSection>((group, index) => {
      const sectionTone: ThoughtOrbitSection['tone'] = index % 5 === 0 ? 'hero' : 'surface';
      const baseSubsections = createBaseSubsections(group, sectionTone);
      const fragmentSubsections = createFragmentSubsections(group);

      return {
        id: group.base.url,
        title: group.base.title,
        subtitle: group.base.url,
        alignment: alignments[index % alignments.length],
        tone: sectionTone,
        subsections: [...baseSubsections, ...fragmentSubsections],
      };
    });
  }, []);
};
