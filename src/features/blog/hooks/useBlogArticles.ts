import { useMemo } from 'react';
import { blogRepository } from '../repository';
import type { BlogArticle } from '../types';

export const useBlogArticles = (): BlogArticle[] => {
  return useMemo(() => blogRepository.getArticles(), []);
};

export const useFeaturedBlogArticles = (): BlogArticle[] => {
  return useMemo(() => blogRepository.getFeaturedArticles(), []);
};

export const useBlogArticle = (id: string | undefined): BlogArticle | undefined => {
  return useMemo(() => {
    if (!id) {
      return undefined;
    }
    return blogRepository.getArticleById(id);
  }, [id]);
};
