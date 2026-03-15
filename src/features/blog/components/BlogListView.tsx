import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'expo-router';
import { Calendar, ChevronRight, Clock, Search } from 'lucide-react';
import { DEFAULT_HERO_GRADIENT, generateFallbackSvg } from '../../../utils/heroFallback';
import type { BlogData } from '../data/posts';

interface BlogListViewProps {
  posts: BlogData[];
}

/** Renders gradient + media layers used by list cards. */
const HeroImageStack = ({ post, className = '' }: { post: BlogData; className?: string }) => {
  const hasImage = Boolean(post.heroImage);
  const hasSvg = Boolean(post.heroSvg);
  const hasFallback = !hasImage && !hasSvg;

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ background: post.heroGradient ?? DEFAULT_HERO_GRADIENT }} />
      {hasImage ? (
        <img
          src={post.heroImage}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-${post.heroCover ?? 'contain'} opacity-80`}
        />
      ) : null}
      {hasSvg ? (
        <img
          src={post.heroSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      ) : null}
      {hasFallback ? (
        <img
          src={generateFallbackSvg(post.title, post.tags)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
    </div>
  );
};

const FeaturedPost = ({ post }: { post: BlogData }) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-800 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative h-80 overflow-hidden">
          <HeroImageStack post={post} className="absolute inset-0" />
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
            {post.subtitle ? (
              <p className="text-cyan-300/80 text-sm md:text-base font-medium mb-2 line-clamp-1">
                {post.subtitle}
              </p>
            ) : null}
            <div className="flex items-center text-white/80 text-sm">
              <Calendar size={14} className="mr-1" />
              <span className="mr-4">{post.date}</span>
              <Clock size={14} className="mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors duration-300"
        >
          Read Full Article
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};

const BlogCard = ({ post, delay = 0 }: { post: BlogData; delay?: number }) => {
  return (
    <motion.article
      className="group flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-800 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <HeroImageStack post={post} className="absolute inset-0" />
          <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end">
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
            {post.subtitle ? (
              <p className="text-cyan-300/80 text-xs font-medium mt-1 line-clamp-1">{post.subtitle}</p>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar size={12} className="mr-1" />
            <span className="mr-4">{post.date}</span>
            <Clock size={12} className="mr-1" />
            <span>{post.readTime}</span>
          </div>
          <Link
            href={`/blog/${post.id}`}
            className="text-cyan-400 text-sm font-medium inline-flex items-center group-hover:text-cyan-300 transition-colors duration-300"
          >
            Read
            <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export const BlogListView = ({ posts }: BlogListViewProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
      <section id="blog" ref={sectionRef} className="min-h-screen bg-black text-white py-20 px-4 pt-24">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-cyan-400">Strategic Insights</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Perspectives on technology transformation, enterprise architecture, and leadership from Michael Simoneau.
            </p>
          </motion.div>

          <motion.div
            className="mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white py-3 px-5 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {featuredPosts.map(post => (
                <FeaturedPost key={post.id} post={post} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} delay={0.1 * index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
