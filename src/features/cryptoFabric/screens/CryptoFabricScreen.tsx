import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  useFoundationBoundary,
  useFoundationFeature,
  useFoundationPageView,
} from "../../../foundation";

const serviceCatalog = [
  {
    title: "Guardrail Orchestrator",
    description:
      "Policy-driven deployment pipelines that gate workloads on profitability and compliance outcomes.",
  },
  {
    title: "Profit Telemetry Mesh",
    description:
      "Unified data plane that streams revenue, spend, and risk scores into a single control surface.",
  },
  {
    title: "Zero-Cost Sandbox",
    description:
      "Local-first adapters that mirror Cloud Run behavior with deterministic billing simulations.",
  },
];

export const CryptoFabricScreen = (): React.ReactElement => {
  const cryptoFabric = useFoundationFeature("cryptoFabricLaunch");
  const boundary = React.useMemo(
    () => ({
      id: "crypto-fabric",
      label: "Crypto Fabric",
      description:
        "Profitability-first modular cloud fabric curated by Michael Simoneau.",
      href: "/crypto-fabric",
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    "page:view:crypto-fabric",
    {
      serviceCatalogSize: serviceCatalog.length,
      featureEnabled: cryptoFabric.enabled,
    },
    {
      deps: [cryptoFabric.enabled],
    },
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>{cryptoFabric.highlightLabel}</Text>
        <Text style={styles.heroTitle}>{cryptoFabric.name}</Text>
        <Text style={styles.heroCopy}>{cryptoFabric.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service catalog</Text>
        <View style={styles.grid}>
          {serviceCatalog.map((item) => (
            <View key={item.title} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCopy}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profit-first guardrails</Text>
        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Every module inherits profitability envelopes, telemetry contracts,
            and policy-as-code enforcement so you can scale digital-asset
            revenue without sacrificing discipline.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: "#020617",
  },
  hero: {
    gap: 12,
    backgroundColor: "#0F172A",
    borderRadius: 32,
    padding: 28,
  },
  heroEyebrow: {
    color: "#38BDF8",
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  heroCopy: {
    fontSize: 16,
    lineHeight: 24,
    color: "#CBD5F5",
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: "#0B1120",
    borderRadius: 24,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  cardTitle: {
    color: "#38BDF8",
    fontSize: 18,
    fontWeight: "600",
  },
  cardCopy: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 22,
  },
  callout: {
    backgroundColor: "#38BDF8",
    borderRadius: 24,
    padding: 24,
  },
  calloutText: {
    color: "#0B1120",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
});
