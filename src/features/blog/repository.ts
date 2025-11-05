import { blogArticles } from './data/posts';
import type { BlogArticle, BlogRepository } from './types';

const sortByDateDescending = (articles: BlogArticle[]): BlogArticle[] => {
  return [...articles].sort((first, second) => {
    const firstDate = new Date(first.publishedAt ?? first.date).getTime();
    const secondDate = new Date(second.publishedAt ?? second.date).getTime();
    return secondDate - firstDate;
  });
};

export const blogRepository: BlogRepository = {
  getArticles: () => sortByDateDescending(blogArticles),
  getFeaturedArticles: () =>
    sortByDateDescending(blogArticles.filter((article) => article.featured)),
  getArticleById: (id: string) => blogArticles.find((article) => article.id === id),
};
