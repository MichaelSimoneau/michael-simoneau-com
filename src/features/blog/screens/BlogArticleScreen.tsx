import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  useFoundationBoundary,
  useFoundationPageView,
} from '../../../foundation';
import { BlogContentRenderer } from '../components/BlogContentRenderer';
import { useBlogArticle } from '../hooks/useBlogArticles';

interface BlogArticleScreenProps {
  articleId?: string;
  articleHref?: string;
}
export const BlogArticleScreen = ({
  articleId: overrideArticleId,
  articleHref,
}: BlogArticleScreenProps = {}) => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const routeArticleId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
  const resolvedArticleId = overrideArticleId ?? routeArticleId;
  const article = useBlogArticle(resolvedArticleId);
  const resolvedHref = useMemo(() => {
    if (!article) {
      return undefined;
    }

    if (articleHref) {
      return articleHref;
    }

    return `/blog/${article.id}`;
  }, [article, articleHref]);
  const boundary = useMemo(() => {
    if (!article || !resolvedHref) {
      return undefined;
    }

    return {
      id: `blog-article-${article.id}`,
      label: article.title,
      description: article.excerpt,
      href: resolvedHref,
    };
  }, [article, resolvedHref]);
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
    resolvedArticleId
      ? {
          id: resolvedArticleId,
        }
      : undefined,
    {
      enabled: !article && Boolean(resolvedArticleId),
      deps: [resolvedArticleId, article ? 'found' : 'missing'],
    },
  );

  useEffect(() => {
    if (!resolvedArticleId || overrideArticleId) {
      return;
    }

    if (!article) {
      router.replace('/blog');
    }
  }, [article, overrideArticleId, resolvedArticleId, router]);

  if (!article) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.date}>{article.date}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.excerpt}>{article.excerpt}</Text>
        <Text
          style={styles.meta}
        >{`${article.author} • ${article.readTime}`}</Text>
      </View>

      <BlogContentRenderer blocks={article.content} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    gap: 12,
    backgroundColor: '#0F172A',
    padding: 24,
    borderRadius: 28,
  },
  date: {
    color: '#38BDF8',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 40,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 26,
    color: '#E2E8F0',
  },
  meta: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
