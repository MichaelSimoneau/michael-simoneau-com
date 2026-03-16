import React, { useEffect } from 'react';
import { MainNav } from '../../../layout/MainNav';
import { Seo } from '../../../foundation/seo/Seo';
import { blogData } from '../data/posts';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { BlogListView } from './BlogListView';

export const Blog: React.FC = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = 'Blog | Michael Simoneau';
    // Removed window.scrollTo from here
  }, []);

  return (
    <>
      <Seo
        title="Strategic Insights & Perspectives | Blog | Michael Simoneau"
        description="Perspectives on technology transformation, enterprise architecture, and leadership from Michael Simoneau. Explore insights on AI integration, quantum cryptography, legacy system modernization, and more."
        canonicalUrl="https://www.michaelsimoneau.com/blog"
        keywords={[
          "Technology Leadership",
          "Enterprise Architecture",
          "AI Strategy",
          "Digital Transformation",
          "CTO Advisory",
          "Software Engineering",
          "System Modernization",
          "Quantum Computing",
          "Blockchain",
          "Crypto Fabric",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Michael Simoneau Blog',
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
      <BlogListView posts={blogData} />
    </>
  );
};

export default Blog; 