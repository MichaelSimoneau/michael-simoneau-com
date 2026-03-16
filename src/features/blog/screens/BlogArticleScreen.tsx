import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';
import { Seo } from '../../../foundation/seo/Seo';
import { MainNav } from '../../../layout/MainNav';
import { useScrollToTop } from '../../../hooks/useScrollToTop';
import { BlogArticleView } from '../components/BlogArticleView';
import { blogData } from '../data/posts';

export const BlogArticleScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const articleId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
  const article = useMemo(() => blogData.find(post => post.id === articleId), [articleId]);
  useScrollToTop([articleId]);
  const boundary = useMemo(() => {
    if (!article) {
      return undefined;
    }

    return {
      id: `blog-article-${article.id}`,
      label: article.title,
      description: article.excerpt,
      href: `/blog/${article.id}`,
    };
  }, [article]);
  const articleViewPayload = useMemo(() => {
    if (!article) {
      return undefined;
    }

    return {
      id: article.id,
      title: article.title,
      author: article.author,
      readTime: article.readTime,
    };
  }, [article]);

  useFoundationBoundary(boundary);
  useFoundationPageView('blog:view', articleViewPayload, {
    enabled: Boolean(article),
    deps: [article?.id],
  });
  useFoundationPageView(
    'blog:not-found',
    articleId
      ? {
          id: articleId,
        }
      : undefined,
    {
      enabled: !article && Boolean(articleId),
      deps: [articleId, article ? 'found' : 'missing'],
    },
  );

  useEffect(() => {
    if (!articleId) {
      return;
    }

    if (!article) {
      router.replace('/blog');
    }
  }, [article, articleId, router]);

  if (!article) {
    return null;
  }

  const seoImagePath = article.heroImage ?? article.heroSvg ?? '/og-image.svg';
  const heroImageUrl = seoImagePath.startsWith('http')
    ? seoImagePath
    : `https://www.michaelsimoneau.com${seoImagePath.startsWith('/') ? seoImagePath : `/${seoImagePath}`}`;

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

  const publishedTime = parseDate(article.date);

  return (
    <>
      <Seo
        title={`${article.title}${article.subtitle ? `: ${article.subtitle}` : ''} | Michael Simoneau`}
        description={article.excerpt}
        canonicalUrl={`https://www.michaelsimoneau.com/blog/${article.id}`}
        keywords={article.tags}
        image={heroImageUrl}
        type="article"
        publishedTime={publishedTime}
        author={article.author}
        section="Blog"
        tags={article.tags}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: `${article.title}${article.subtitle ? `: ${article.subtitle}` : ''}`,
            description: article.excerpt,
            image: heroImageUrl,
            datePublished: publishedTime,
            dateModified: publishedTime,
            author: {
              '@type': 'Person',
              name: article.author,
              url: 'https://www.michaelsimoneau.com',
            },
            publisher: {
              '@type': 'Person',
              name: 'Michael Simoneau',
              url: 'https://www.michaelsimoneau.com',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.michaelsimoneau.com/blog/${article.id}`,
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
                name: article.title,
                item: `https://www.michaelsimoneau.com/blog/${article.id}`,
              },
            ],
          },
        ]}
      />
      <MainNav />
      <BlogArticleView post={article} />
    </>
  );
};
