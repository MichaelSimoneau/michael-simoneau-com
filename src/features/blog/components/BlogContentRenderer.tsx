import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { TextStyle } from "react-native";
import type { ContentBlock } from "../types";

interface BlogContentRendererProps {
  blocks: ContentBlock[];
}

export const BlogContentRenderer = ({ blocks }: BlogContentRendererProps) => {
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => (
        <React.Fragment key={`${block.type}-${index}`}>
          {renderBlock(block)}
        </React.Fragment>
      ))}
    </View>
  );
};

const renderBlock = (block: ContentBlock) => {
  switch (block.type) {
    case "heading":
      return (
        <Text
          style={[
            styles.heading,
            headingStyles[block.level] ?? headingStyles[2],
          ]}
        >
          {block.content}
        </Text>
      );
    case "paragraph":
      return <Text style={styles.paragraph}>{block.content}</Text>;
    case "list":
      return (
        <View style={styles.listContainer}>
          {block.items.map((item, itemIndex) => (
            <View style={styles.listItem} key={`${itemIndex}-${item}`}>
              <Text style={styles.bullet}>{"\u2022"} </Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case "code":
      return (
        <View style={styles.codeBlock}>
          <Text style={styles.codeLanguage}>{block.language}</Text>
          <Text style={styles.codeText}>{block.content}</Text>
        </View>
      );
    case "callout":
      return (
        <View style={styles.callout}>
          <Text style={styles.calloutText}>{block.content}</Text>
        </View>
      );
    default:
      return null;
  }
};

const headingStyles: Record<number, TextStyle> = {
  1: { fontSize: 32 },
  2: { fontSize: 28 },
  3: { fontSize: 24 },
  4: { fontSize: 20 },
  5: { fontSize: 18 },
  6: { fontSize: 16 },
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontWeight: "700",
    color: "#0F172A",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1F2937",
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    lineHeight: 24,
    fontSize: 16,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  codeLanguage: {
    color: "#38BDF8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  codeText: {
    fontFamily: "Courier New",
    color: "#E2E8F0",
  },
  callout: {
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
    backgroundColor: "#E0F2FE",
    padding: 16,
    borderRadius: 12,
  },
  calloutText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#0F172A",
  },
});
