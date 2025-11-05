import { Link } from 'expo-router';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import type { BlogArticleSummary } from '../../blog/types';
import { BlogListItem } from '../../blog/components/BlogListItem';
import { useInteractiveScale } from '../../../ui/animation/useInteractiveScale';

interface ArticleFlowProps {
  articles: BlogArticleSummary[];
}

export const ArticleFlow = ({ articles }: ArticleFlowProps) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useInteractiveScale({
    pressedScale: 0.95,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Latest strategy briefs</Text>
        <Text style={styles.description}>
          Curated signals on architecture, profitability, and platform orchestration.
        </Text>
      </View>
      <View style={styles.mosaic}>
        {articles.map((article) => (
          <BlogListItem key={`home-${article.id}`} article={article} />
        ))}
      </View>
      <Link href="/blog" asChild>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.cta, animatedStyle]}>
            <Text style={styles.ctaText}>Browse the briefing library</Text>
          </Animated.View>
        </Pressable>
      </Link>
    </View>
  );
};

const mosaicLayout: ViewStyle =
  Platform.OS === 'web'
    ? ({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      } as unknown as ViewStyle)
    : {
        flexDirection: 'column',
      };

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    gap: 10,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  description: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 22,
  },
  mosaic: {
    gap: 20,
    ...mosaicLayout,
  },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  ctaText: {
    color: '#38BDF8',
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
