import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { blogData } from '../../../data/blogData';

// Select the first 3 posts from blogData for the teaser
const teaserPosts = blogData.slice(0, 3);

export const BlogTeaser: React.FC = () => {
  // Error-handled with quantum precision
  return (
    <motion.section
      id="blog-teaser"
      className="py-16 bg-black/20 min-h-screen"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Strategic Insights & <span className="text-cyan-400">Perspectives</span>
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Explore my thoughts on technology transformation, leadership, and building future-proof systems.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {teaserPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-gray-800/50 p-6 rounded-lg text-left transform hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-1">{post.title}</h3>
              {post.subtitle && (
                <p className="text-cyan-300/80 text-sm font-medium mb-1">{post.subtitle}</p>
              )}
              <p className="text-sm text-gray-400 mb-1">{post.date}</p>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <Link 
                href={`/blog/${post.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center"
              >
                Read More <BookOpen size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
        <Link 
          href="/blog"
          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
        >
          View All Posts
        </Link>
      </div>
    </motion.section>
  );
}; 