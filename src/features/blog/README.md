# Blog Feature Module

## Purpose

Blog content management and display system. This feature module handles blog post listing, individual post views, and blog teasers for the main page.

## Components

### Blog
Main blog listing page component that displays all blog posts with filtering and search capabilities.

**Location:** `components/Blog.tsx`

**Usage:**
```typescript
import { Blog } from './features/blog';

// In route configuration
{
  path: "blog",
  element: <Blog />
}
```

### BlogPost
Individual blog post view component that displays a single blog post with full content, metadata, and sharing options.

**Location:** `components/BlogPost.tsx`

**Usage:**
```typescript
import { BlogPost } from './features/blog';

// In route configuration
{
  path: "blog/:postId",
  element: <BlogPost />
}
```

### BlogTeaser
Blog teaser component displayed on the main page, showing a preview of recent blog posts.

**Location:** `components/BlogTeaser.tsx`

**Usage:**
```typescript
import { BlogTeaser } from './features/blog';

// In main page
<BlogTeaser />
```

## Types

Types are defined in `types.ts`:
- `BlogFilters` - Filtering options for blog posts
- `BlogNavigationState` - Pagination and navigation state
- Re-exports `BlogPost` and `ContentBlock` from shared models

## Dependencies

- **Data:** Uses `src/features/blog/data/posts.ts` as canonical blog content source
- **Models:** Uses `src/models/BlogPost.ts` for type definitions
- **Utils:** Uses `src/utils/markdown.ts` for markdown parsing
- **Layout:** Uses `MainNav` from `../layout/`
- **Foundation:** Uses `Seo` from `../foundation/seo/`
- **UI:** Uses `XIcon` from `../ui/icons/`
- **Hooks:** Uses `useScrollToTop` from `../../hooks/`

## Related Modules

- **Profile Feature:** BlogTeaser is used in the main page (profile feature)
- **Layout:** Uses MainNav for navigation
- **Foundation:** Uses Seo component for metadata

