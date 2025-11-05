import type { ReactNode } from 'react';

export type ContentBlockType = 'paragraph' | 'heading' | 'code' | 'list' | 'callout';

export interface BaseContentBlock {
  type: ContentBlockType;
  content: string;
}

export interface ParagraphBlock extends BaseContentBlock {
  type: 'paragraph';
}

export interface HeadingBlock extends BaseContentBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CodeBlock extends BaseContentBlock {
  type: 'code';
  language: string;
}

export interface ListBlock extends BaseContentBlock {
  type: 'list';
  items: string[];
}

export interface CalloutBlock extends BaseContentBlock {
  type: 'callout';
}

export type ContentBlock = ParagraphBlock | HeadingBlock | CodeBlock | ListBlock | CalloutBlock;

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: ContentBlock[];
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  heroImage: string;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
  publishedAt?: number;
  generatedImageUrl?: string;
  generatedImagePrompt?: string;
}

export type BlogArticleSummary = Pick<
  BlogArticle,
  'id' | 'title' | 'excerpt' | 'date' | 'readTime' | 'author' | 'tags' | 'heroImage' | 'featured'
>;

export type RenderContentBlock = (block: ContentBlock, index: number) => ReactNode;

export interface BlogRepository {
  getArticles: () => BlogArticle[];
  getFeaturedArticles: () => BlogArticle[];
  getArticleById: (id: string) => BlogArticle | undefined;
}
