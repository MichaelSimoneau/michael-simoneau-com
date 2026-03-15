import { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Facebook, Share2 } from 'lucide-react';
import { XIcon } from '../../../ui/icons/XIcon';
import { BlogSpeechPlayer } from '../../../ui/players';
import { DEFAULT_HERO_GRADIENT, generateFallbackSvg } from '../../../utils/heroFallback';
import type { BlogData } from '../data/posts';
import { BlogContentRenderer } from './BlogContentRenderer';

interface BlogArticleViewProps {
  post: BlogData;
}

const ShareButton = ({ platform, url, title }: { platform: 'x' | 'facebook'; url: string; title: string }) => {
  const getShareUrl = () => {
    if (platform === 'x') {
      return `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    }
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  };

  return (
    <a
      href={getShareUrl()}
      target="_blank"
      rel="noopener"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      title={`Share on ${platform.toUpperCase()}`}
    >
      {platform === 'x' ? <XIcon size={18} /> : <Facebook size={18} />}
    </a>
  );
};

export const BlogArticleView = ({ post }: BlogArticleViewProps) => {
  const shareOptionsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const currentUrl = typeof window === 'undefined' ? `https://www.michaelsimoneau.com/blog/${post.id}` : window.location.href;

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [post.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10"
    >
      <section className="min-h-screen bg-black text-white py-12 md:py-20 px-6 sm:px-8 md:px-12 lg:px-16 pt-20 md:pt-24">
        <div className="container mx-auto max-w-4xl">
          <div>
            <div className="flex items-center justify-between mb-8">
              <Link href="/blog" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to all articles
              </Link>

              <div className="relative" ref={shareOptionsRef}>
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  type="button"
                >
                  <Share2 size={18} />
                </button>

                {showShareOptions ? (
                  <div className="absolute right-0 mt-2 flex items-center gap-2 bg-gray-800 p-2 rounded-lg shadow-xl z-50">
                    <ShareButton platform="x" url={currentUrl} title={post.title} />
                    <ShareButton platform="facebook" url={currentUrl} title={post.title} />
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="w-full h-[240px] md:h-[420px] mb-8 rounded-xl relative overflow-hidden"
              style={{ background: post.heroGradient ?? DEFAULT_HERO_GRADIENT }}
            >
              {post.heroImage ? (
                <img
                  src={post.heroImage}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-${post.heroCover ?? 'contain'} opacity-80`}
                />
              ) : null}
              {post.heroSvg ? (
                <img
                  src={post.heroSvg}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
              ) : null}
              {!post.heroImage && !post.heroSvg ? (
                <img
                  src={generateFallbackSvg(post.title, post.tags)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">{post.title}</h1>
                {post.subtitle ? (
                  <p className="text-lg md:text-xl lg:text-2xl text-cyan-300/90 mt-2 font-medium">{post.subtitle}</p>
                ) : null}
                <div className="flex items-center mt-3 md:mt-4 text-white/80 text-sm md:text-base">
                  <Calendar size={16} className="mr-1" />
                  <span className="mr-4">{post.date}</span>
                  <Clock size={16} className="mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            <BlogSpeechPlayer content={post.content} title={post.title} />
            <BlogContentRenderer blocks={post.content} title={post.title} />

            <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gray-800">
              <h3 className="text-xl md:text-2xl font-bold mb-4">About the Author</h3>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:space-x-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg flex-shrink-0">
                  <img src="/profile-image.png" alt="Michael Simoneau" className="object-cover w-full h-full" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-center md:text-left">{post.author}</h4>
                  <p className="text-gray-300 text-center md:text-left mt-2">
                    Michael Simoneau is a CTO Advisor specializing in AI integration, quantum cryptography, and legacy system
                    modernization. He has transformed multiple enterprise systems, including a $200M rebuild at StoneX.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gray-800">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Ready to quantum-proof your systems?</h3>
              <div className="text-center">
                <a
                  href="mailto:michael.simoneau@brainycouch.com"
                  target="_blank"
                  rel="noopener"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-sm md:text-base"
                >
                  SCHEDULE A CONSULTATION
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
