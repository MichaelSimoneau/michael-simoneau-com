import React from "react";
import { Link } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  useFoundationBoundary,
  useFoundationFeature,
  useFoundationMetadata,
  useFoundationPageView,
  useFoundationRuntime,
} from "../../../foundation";
import { useFeaturedBlogArticles } from "../../blog/hooks/useBlogArticles";
import { BlogListItem } from "../../blog/components/BlogListItem";

export const HomeScreen = () => {
  const metadata = useFoundationMetadata();
  const runtime = useFoundationRuntime();
  const cryptoFabricFeature = useFoundationFeature("cryptoFabricLaunch");
  const voiceAssistantFeature = useFoundationFeature("voiceAssistant");
  const featuredArticles = useFeaturedBlogArticles();
  const boundary = useMemo(
    () => ({
      id: "home",
      label: "Mission Control",
      description:
        "Entry deck for Michael Simoneau with live runtime signals and featured strategies.",
      href: "/",
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    "page:view:home",
    {
      featuredArticleCount: featuredArticles.length,
      cryptoFabricEnabled: cryptoFabricFeature.enabled,
      voiceAssistantEnabled: voiceAssistantFeature.enabled,
    },
    {
      deps: [
        featuredArticles.length,
        cryptoFabricFeature.enabled,
        voiceAssistantFeature.enabled,
      ],
    },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Enterprise Architect</Text>
        <Text style={styles.heroTitle}>{metadata.defaultTitle}</Text>
        <Text style={styles.heroSubtitle}>{metadata.description}</Text>
        <Text
          style={styles.heroMeta}
        >{`Operating on ${runtime.platform.toUpperCase()} • ${runtime.locale}`}</Text>
      </View>

      {cryptoFabricFeature.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {cryptoFabricFeature.highlightLabel}
          </Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{cryptoFabricFeature.name}</Text>
            <Text style={styles.sectionBody}>
              {cryptoFabricFeature.description}
            </Text>
            <View style={styles.benefitList}>
              {cryptoFabricFeature.keyBenefits.map((benefit) => (
                <View key={benefit.title} style={styles.benefitItem}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitCopy}>{benefit.description}</Text>
                </View>
              ))}
            </View>
            <Link href={cryptoFabricFeature.cta.href} asChild>
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  {cryptoFabricFeature.cta.label}
                </Text>
              </View>
            </Link>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>Voice of the stack</Text>
        <View style={styles.voiceCard}>
          <Text style={styles.sectionBody}>
            {voiceAssistantFeature.messages.join(" • ")}
          </Text>
          <Text
            style={styles.voiceMeta}
          >{`Pitch ${voiceAssistantFeature.voice.pitch} • Rate ${voiceAssistantFeature.voice.rate}`}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>Latest strategy briefs</Text>
        <View style={styles.grid}>
          {featuredArticles.map((article) => (
            <BlogListItem key={`home-${article.id}`} article={article} />
          ))}
        </View>
        <Link href="/blog" asChild>
          <View style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Browse the briefing library
            </Text>
          </View>
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: "#0B1120",
  },
  hero: {
    gap: 12,
    padding: 32,
    backgroundColor: "#111C3D",
    borderRadius: 32,
  },
  eyebrow: {
    color: "#38BDF8",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: "#E2E8F0",
  },
  heroMeta: {
    fontSize: 14,
    color: "#94A3B8",
  },
  section: {
    gap: 16,
  },
  sectionEyebrow: {
    color: "#38BDF8",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  card: {
    gap: 16,
    backgroundColor: "#020617",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 24,
    color: "#CBD5F5",
  },
  benefitList: {
    gap: 12,
  },
  benefitItem: {
    backgroundColor: "#111C3D",
    borderRadius: 24,
    padding: 16,
    gap: 8,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38BDF8",
  },
  benefitCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E2E8F0",
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#38BDF8",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontWeight: "700",
    color: "#0B1120",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  voiceCard: {
    backgroundColor: "#111C3D",
    borderRadius: 28,
    padding: 24,
    gap: 12,
  },
  voiceMeta: {
    fontSize: 12,
    color: "#94A3B8",
    letterSpacing: 1,
  },
  grid: {
    gap: 16,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#38BDF8",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#38BDF8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
