import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import type { BlogArticle } from '../../blog/types';
import { BlogListItem } from '../../blog/components/BlogListItem';
import { useThoughtOrbitFocus } from './ThoughtOrbitFocusContext';

export type FeaturedBriefsProps = {
  articles: BlogArticle[];
};

export const FeaturedBriefs = ({ articles }: FeaturedBriefsProps) => {
  const { focus } = useThoughtOrbitFocus();
  const subsectionFocus = Math.min(1, Math.max(0, (focus - 0.25) / 0.75));
  const distantFade = 1 - subsectionFocus;

  return (
    <View
      style={[
        styles.container,
        {
          transform: [{ scale: 0.92 + subsectionFocus * 0.12 }],
          opacity: 0.6 + subsectionFocus * 0.4,
        },
      ]}
    >
      <Text style={styles.eyebrow}>Latest strategy briefs</Text>
      <View
        style={[
          styles.grid,
          {
            gap: 12 + subsectionFocus * 12,
          },
        ]}
      >
        {articles.map((article, index) => {
          const orbitalDelay = index / Math.max(articles.length - 1, 1);
          const itemFocus = Math.max(
            0,
            Math.min(1, subsectionFocus - orbitalDelay * distantFade * 0.6),
          );
          return (
            <View
              key={`home-${article.id}`}
              style={{
                transform: [
                  { perspective: 600 },
                  { scale: 0.85 + itemFocus * 0.25 },
                  { translateX: (0.5 - orbitalDelay) * distantFade * 32 },
                  {
                    rotateZ: `${(0.5 - orbitalDelay) * distantFade * 0.25}rad`,
                  },
                ],
                opacity: 0.45 + itemFocus * 0.55,
              }}
            >
              <BlogListItem article={article} />
            </View>
          );
        })}
      </View>
      <Link href="/blog" asChild>
        <View style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Browse the briefing library</Text>
        </View>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#38BDF8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
