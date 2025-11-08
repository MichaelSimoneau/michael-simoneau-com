import React from "react";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  useFoundationBoundary,
  useFoundationMetadata,
  useFoundationPageView,
} from "../../../foundation";
import { BlogListItem } from "../components/BlogListItem";
import {
  useBlogArticles,
  useFeaturedBlogArticles,
} from "../hooks/useBlogArticles";

export const BlogListScreen = () => {
  const metadata = useFoundationMetadata();
  const featuredArticles = useFeaturedBlogArticles();
  const articles = useBlogArticles();
  const boundary = useMemo(
    () => ({
      id: "blog-list",
      label: "Briefing Library",
      description:
        "Curated analysis and architecture briefs authored by Michael Simoneau.",
      href: "/blog",
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    "page:view:blog:list",
    {
      featuredCount: featuredArticles.length,
      totalCount: articles.length,
    },
    {
      deps: [featuredArticles.length, articles.length],
    },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Insights</Text>
        <Text style={styles.heroTitle}>{metadata.siteName} Briefings</Text>
        <Text style={styles.heroSubtitle}>
          Pattern libraries, zero-trust telemetry, and profitability playbooks
          engineered for regulated enterprises.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <View style={styles.grid}>
          {featuredArticles.map((article) => (
            <BlogListItem key={article.id} article={article} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest briefs</Text>
        <View style={styles.grid}>
          {articles.map((article) => (
            <BlogListItem key={`latest-${article.id}`} article={article} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: "#F8FAFC",
  },
  hero: {
    gap: 12,
  },
  heroEyebrow: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: "#334155",
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  grid: {
    gap: 16,
  },
});
