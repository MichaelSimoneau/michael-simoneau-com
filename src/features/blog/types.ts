// Re-export shared types
export type {
  BlogPost,
  ContentBlock,
  CalloutBlock,
  CodeBlock,
  HeadingBlock,
  ListBlock,
  ParagraphBlock,
} from '../../models/BlogPost';

export type BlogArticle = BlogPost;
export type BlogArticleSummary = BlogPost;

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

