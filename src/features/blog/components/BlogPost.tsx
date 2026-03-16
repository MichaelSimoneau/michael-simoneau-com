import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Seo } from '../../../foundation/seo/Seo';
import { MainNav } from '../../../layout/MainNav';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { blogData } from '../data/posts';
import { BlogArticleView } from './BlogArticleView';

const parseDate = (dateString: string): string | undefined => {
  try {
    const parsed = new Date(dateString);
    if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
      return parsed.toISOString();
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export const BlogPost: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useScrollToTop([postId]);

  const post = useMemo(() => blogData.find(item => item.id === postId), [postId]);

  useEffect(() => {
    if (!post && postId) {
      navigate('/404');
    }
  }, [navigate, post, postId]);

  if (!post) {
    return (
      <>
        <MainNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-700 rounded mb-4" />
            <div className="h-4 w-40 bg-gray-700 rounded" />
          </div>
        </div>
      </>
    );
  }

  const seoImagePath = post.heroImage ?? post.heroSvg ?? '/og-image.svg';
  const heroImageUrl = seoImagePath.startsWith('http')
    ? seoImagePath
    : `https://www.michaelsimoneau.com${seoImagePath.startsWith('/') ? seoImagePath : `/${seoImagePath}`}`;
  const publishedTime = parseDate(post.date);

  return (
    <>
      <Seo
        title={`${post.title}${post.subtitle ? `: ${post.subtitle}` : ''} | Michael Simoneau`}
        description={post.excerpt}
        canonicalUrl={`https://www.michaelsimoneau.com/blog/${post.id}`}
        keywords={post.tags}
        image={heroImageUrl}
        type="article"
        publishedTime={publishedTime}
        author={post.author}
        section="Blog"
        tags={post.tags}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: `${post.title}${post.subtitle ? `: ${post.subtitle}` : ''}`,
            description: post.excerpt,
            image: heroImageUrl,
            datePublished: publishedTime,
            dateModified: publishedTime,
            author: {
              '@type': 'Person',
              name: post.author,
              url: 'https://www.michaelsimoneau.com',
            },
            publisher: {
              '@type': 'Person',
              name: 'Michael Simoneau',
              url: 'https://www.michaelsimoneau.com',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.michaelsimoneau.com/blog/${post.id}`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.michaelsimoneau.com/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://www.michaelsimoneau.com/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://www.michaelsimoneau.com/blog/${post.id}`,
              },
            ],
          },
        ]}
      />
      <MainNav />
      <BlogArticleView post={post} />
    </>
  );
};

export default BlogPost;
