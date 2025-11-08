import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  useFoundationBoundary,
  useFoundationPageView,
} from "../../../foundation";
import { BlogContentRenderer } from "../components/BlogContentRenderer";
import { useBlogArticle } from "../hooks/useBlogArticles";

export const BlogArticleScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const articleId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
  const article = useBlogArticle(articleId);
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
  useFoundationPageView("blog:view", articleViewPayload, {
    enabled: Boolean(article),
    deps: [article?.id],
  });
  useFoundationPageView(
    "blog:not-found",
    articleId
      ? {
          id: articleId,
        }
      : undefined,
    {
      enabled: !article && Boolean(articleId),
      deps: [articleId, article ? "found" : "missing"],
    },
  );

  useEffect(() => {
    if (!articleId) {
      return;
    }

    if (!article) {
      router.replace("/blog");
    }
  }, [article, articleId, router]);

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
    backgroundColor: "#FFFFFF",
  },
  hero: {
    gap: 12,
    backgroundColor: "#0F172A",
    padding: 24,
    borderRadius: 28,
  },
  date: {
    color: "#38BDF8",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F8FAFC",
    lineHeight: 40,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 26,
    color: "#E2E8F0",
  },
  meta: {
    fontSize: 14,
    color: "#94A3B8",
  },
});
