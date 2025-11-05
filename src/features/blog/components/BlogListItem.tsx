import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BlogArticleSummary } from '../types';

interface BlogListItemProps {
  article: BlogArticleSummary;
}

export const BlogListItem = ({ article }: BlogListItemProps) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  const lift = useRef(new Animated.Value(0)).current;
  const shadow = lift.interpolate({ inputRange: [0, 1], outputRange: [12, 28] });
  const translateY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  const setLift = (active: boolean) => {
    if (reduceMotion) return;
    Animated.timing(lift, {
      toValue: active ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link href={`/blog/${article.id}`} asChild>
      <Pressable
        onHoverIn={() => setLift(true)}
        onHoverOut={() => setLift(false)}
        onPressIn={() => setLift(true)}
        onPressOut={() => setLift(false)}
      >
        <Animated.View
          style={[
            styles.card,
            article.featured ? styles.featuredCard : undefined,
            { transform: [{ translateY }], shadowRadius: shadow as unknown as number },
          ]}
        >
          <View style={styles.metaRow}>
            <Text style={styles.date}>{article.date}</Text>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.excerpt}>{article.excerpt}</Text>
          <View style={styles.tagRow}>
            {article.tags.map((tag) => (
              <View style={styles.tagPill} key={tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(2,6,23,0.8)',
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#12213B',
    gap: 16,
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCard: {
    borderColor: '#0EA5E9',
    shadowOpacity: 0.25,
    shadowRadius: 32,
    backgroundColor: 'rgba(2,6,23,0.9)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#38BDF8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 32,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 28,
    color: '#CBD5F5',
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  tagPill: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  tagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
});
