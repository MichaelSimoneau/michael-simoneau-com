import { useEffect, useMemo } from 'react';
import { useFoundationBoundary, useFoundationMetadata, useFoundationPageView } from '../../../foundation';
import { Seo } from '../../../foundation/seo/Seo';
import { MainNav } from '../../../layout/MainNav';
import { BlogListView } from '../components/BlogListView';
import { blogData } from '../data/posts';
import { useScrollToTop } from '../../../hooks/useScrollToTop';

export const BlogListScreen = () => {
  useScrollToTop();
  const metadata = useFoundationMetadata();
  const featuredArticles = useMemo(() => blogData.filter(article => article.featured), []);
  const articles = useMemo(() => blogData, []);
  const boundary = useMemo(
    () => ({
      id: 'blog-list',
      label: 'Briefing Library',
      description: 'Curated analysis and architecture briefs authored by Michael Simoneau.',
      href: '/blog',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:blog:list',
    {
      featuredCount: featuredArticles.length,
      totalCount: articles.length,
    },
    {
      deps: [featuredArticles.length, articles.length],
    },
  );

  useEffect(() => {
    document.title = 'Blog | Michael Simoneau';
  }, []);

  return (
    <>
      <Seo
        title="Strategic Insights & Perspectives | Blog | Michael Simoneau"
        description="Perspectives on technology transformation, enterprise architecture, and leadership from Michael Simoneau. Explore insights on AI integration, quantum cryptography, legacy system modernization, and more."
        canonicalUrl="https://www.michaelsimoneau.com/blog"
        keywords={[
          'Technology Leadership',
          'Enterprise Architecture',
          'AI Strategy',
          'Digital Transformation',
          'CTO Advisory',
          'Software Engineering',
          'System Modernization',
          'Quantum Computing',
          'Blockchain',
          'Crypto Fabric',
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: metadata.siteName ? `${metadata.siteName} Blog` : 'Michael Simoneau Blog',
          description: 'Strategic insights and perspectives on technology transformation, enterprise architecture, and leadership.',
          url: 'https://www.michaelsimoneau.com/blog',
          author: {
            '@type': 'Person',
            name: 'Michael Simoneau',
            url: 'https://www.michaelsimoneau.com',
          },
        }}
      />
      <MainNav />
      <BlogListView posts={articles} />
    </>
  );
};
