/**
 * Prerender route configuration for vite-plugin-prerender.
 *
 * Static routes are listed explicitly. Blog post routes are derived from
 * the blog post IDs exported by src/data/blogData.ts. When a new blog post
 * is added there, add its ID to the blogPostIds array here as well.
 */

const staticRoutes: string[] = [
  '/',
  '/blog',
  '/interview',
  '/interview/1',
  '/interview/2',
  '/interview/3',
  '/zero',
  '/profile',
  '/cryptofabric',
  '/thth',
  '/thd',
];

const blogPostIds: string[] = [
  'zero-sudoku',
  'darwinian-marxism',
  'law-of-the-ceiling',
  'architecture-of-relevance',
  'crypto-fabric-business-plan',
  'crypto-fabric-telemetry-guardrails',
  'crypto-fabric-kickoff',
  'zero',
  'future-proofing-security',
  'enterprise-system-transformation',
  'scaling-react-native-architectures',
  'practical-ai-security',
  'cto-compensation-strategy',
];

const blogRoutes = blogPostIds.map(id => `/blog/${id}`);

export const prerenderRoutes: string[] = [...staticRoutes, ...blogRoutes];
