import { useMemo } from 'react';
import type { ThoughtOrbitSection } from './ThoughtOrbitLayout';
import type { ScrapedContent } from '../data/sitemapContent';
import { SCRAPED_CONTENT } from '../data/sitemapContent';
import { SitemapContentCluster } from './SitemapContentCluster';

type SitemapGroup = {
  base: ScrapedContent;
  fragments: ScrapedContent[];
};

const alignments: ThoughtOrbitSection['alignment'][] = ['left', 'center', 'right'];

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

    return orderedGroups.map<ThoughtOrbitSection>((group, index) => ({
      id: group.base.url,
      content: <SitemapContentCluster group={group} />,
      alignment: alignments[index % alignments.length],
      tone: index % 5 === 0 ? 'hero' : 'surface',
    }));
  }, []);
};
