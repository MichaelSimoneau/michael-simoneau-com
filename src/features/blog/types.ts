import type {
  BlogPost,
  ContentBlock,
  CalloutBlock,
  CodeBlock,
  HeadingBlock,
  ListBlock,
  MathBlock,
  ParagraphBlock,
} from '../../models/BlogPost';

// Re-export shared types
export type {
  BlogPost,
  ContentBlock,
  CalloutBlock,
  CodeBlock,
  HeadingBlock,
  ListBlock,
  MathBlock,
  ParagraphBlock,
};

export type BlogArticle = Omit<BlogPost, 'createdAt' | 'updatedAt'> & {
  createdAt?: number;
  updatedAt?: number;
};
export type BlogArticleSummary = BlogArticle;

export interface BlogRepository {
  getArticles: () => BlogArticle[];
  getFeaturedArticles: () => BlogArticle[];
  getArticleById: (id: string) => BlogArticle | undefined;
}

// Blog-specific types
export interface BlogFilters {
  category?: string;
  tag?: string;
  searchQuery?: string;
}

export interface BlogNavigationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

