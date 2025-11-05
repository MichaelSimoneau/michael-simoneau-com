import { useMemo } from 'react';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';
import { ThoughtOrbitLayout } from '../components/ThoughtOrbitLayout';
import { useSitemapSections } from '../components/useSitemapSections';
import { SCRAPED_CONTENT } from '../data/sitemapContent';

export const HomeScreen = () => {
  const sections = useSitemapSections();

  const boundary = useMemo(
    () => ({
      id: 'home',
      label: 'Michael Simoneau Cosmic Archive',
      description: 'A three-dimensional reading of every published surface on michaelsimoneau.com.',
      href: '/',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:home',
    {
      sectionCount: sections.length,
      recordCount: SCRAPED_CONTENT.length,
    },
    { deps: [sections.length] },
  );

  return <ThoughtOrbitLayout sections={sections} />;
};
