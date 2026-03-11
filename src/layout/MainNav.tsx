import React, { useEffect, useRef } from 'react';
import { Link, usePathname } from 'expo-router';
import { BookOpen, Menu, X, Home, User, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '../ui/players/UniversalPlayer';
import { useScrollToSection } from '../hooks/useScrollToSection';

interface MainNavProps {
  scrollContainerId?: string;
}

export const MainNav: React.FC<MainNavProps> = ({ scrollContainerId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPathsExpanded, setIsPathsExpanded] = React.useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const scrollToSectionHandler = useScrollToSection({ scrollContainerId });
  const pathsRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    if (isHomePage) {
      e.preventDefault();
      const container = scrollContainerId ? document.getElementById(scrollContainerId) : null;
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSectionLinkClick = (sectionId: string) => {
    scrollToSectionHandler(sectionId, () => {
      setIsOpen(false);
      setIsPathsExpanded(false);
    });
  };

  const handlePathsClick = () => {
    setIsPathsExpanded(!isPathsExpanded);
  };

  const handlePathsItemClick = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPathsExpanded(false);
    setIsOpen(false);
    // Defer scroll so overlay/dropdown close first; avoids mobile scroll not working
    setTimeout(() => {
      scrollToSectionHandler(sectionId);
    }, 280);
  };

  const overlayNavItemClass = "text-xl text-gray-300 hover:text-cyan-400 transition-colors";
  const overlayNavItemWithIconClass = `${overlayNavItemClass} inline-flex items-center justify-center`;

  // Close Paths when clicking outside (desktop only; mobile overlay has its own close)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (mobileOverlayRef.current?.contains(target)) return;
      if (pathsRef.current && !pathsRef.current.contains(target)) {
        setIsPathsExpanded(false);
      }
    };

    if (isPathsExpanded) {
      // Use a small delay to avoid closing immediately when clicking inside
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isPathsExpanded]);
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center relative min-w-[80px] whitespace-nowrap">
          <Link 
            href="/" 
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              handleHomeClick(e);
              setIsPathsExpanded(false);
            }}
            className="text-white font-bold text-lg hover:text-cyan-400 transition-colors flex items-center whitespace-nowrap min-w-max"
          >
            <motion.span 
              layout
              className="mr-1"
            >{"MS"}</motion.span>
            <AnimatePresence>
              {isPathsExpanded && (
                <>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="ml-1 text-cyan-400 hidden lg:inline-block"
                  >{"::"}</motion.span>
                  <motion.span
                    layoutId="paths-logo-text"
                    className="ml-1 uppercase tracking-wider hidden lg:inline-block"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >{"PATHS:"}</motion.span>
                </>
              )}
            </AnimatePresence>
          </Link>
        </div>
        {!isPathsExpanded && <UniversalPlayer />}
        
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 relative" ref={pathsRef}>
          {!isPathsExpanded && (
            <>
              <button onClick={() => handleSectionLinkClick('about')} className="text-gray-300 hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => handleSectionLinkClick('videos')} className="text-gray-300 hover:text-cyan-400 transition-colors">Video</button>
              <button onClick={() => handleSectionLinkClick('music')} className="text-gray-300 hover:text-cyan-400 transition-colors">Music</button>
              <button onClick={() => handleSectionLinkClick('interview')} className="text-gray-300 hover:text-cyan-400 transition-colors">Interview</button>
              
              {isHomePage ? (
                <button onClick={() => handleSectionLinkClick('profile')} className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center">
                  <User size={16} className="mr-1 xl:mr-2" />
                  Profile
                </button>
              ) : (
                <Link href="/profile" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center">
                  <User size={16} className="mr-1 xl:mr-2" />
                  Profile
                </Link>
              )}
              <button onClick={() => handleSectionLinkClick('expertise')} className="text-gray-300 hover:text-cyan-400 transition-colors">Expertise</button>
              <button onClick={() => handleSectionLinkClick('testimonials')} className="text-gray-300 hover:text-cyan-400 transition-colors">Testimonials</button>
            </>
          )}
          
          {!isPathsExpanded && (
            <>
              <button onClick={() => handleSectionLinkClick('blog')} className="text-gray-300 hover:text-cyan-400 transition-colors">Insights</button>
              <button onClick={() => handleSectionLinkClick('contact')} className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</button>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center">
                <BookOpen size={16} className="mr-2" />
                Blog
              </Link>
            </>
          )}

          {/* Paths Navigation */}
          <motion.div className="grid items-center relative overflow-hidden" layout>
            <AnimatePresence>
              {!isPathsExpanded ? (
                <motion.button
                  key="paths-button"
                  layout
                  onClick={handlePathsClick}
                  className="col-start-1 row-start-1 text-gray-300 hover:text-cyan-400 transition-colors flex items-center whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Compass size={16} className="mr-1.5" />
                  <motion.span layoutId="paths-logo-text" transition={{ type: "spring", stiffness: 350, damping: 30 }}>Paths</motion.span>
                </motion.button>
              ) : (
                <motion.div
                  key="paths-items"
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="col-start-1 row-start-1 flex items-center space-x-2 whitespace-nowrap overflow-hidden"
                >
                  <button
                    onClick={(e) => handlePathsItemClick('ZerothTheory', e)}
                    className="text-gray-300 hover:text-cyan-400 transition-colors whitespace-nowrap"
                  >
                    Zeroth Theory
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    onClick={(e) => handlePathsItemClick('cryptofabric', e)}
                    className="text-gray-300 hover:text-cyan-400 transition-colors whitespace-nowrap"
                  >
                    Crypto Fabric
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    onClick={(e) => handlePathsItemClick('TheHumanDollar', e)}
                    className="text-gray-300 hover:text-cyan-400 transition-colors whitespace-nowrap"
                  >
                    The Human Dollar
                  </button>
                  <button
                    onClick={handlePathsClick}
                    className="ml-2 p-1 group"
                    aria-label="Close Paths"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-600 group-hover:border-cyan-400 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <X size={14} className="text-gray-300 group-hover:text-cyan-400" />
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
        
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <motion.div
          ref={mobileOverlayRef}
          className="fixed inset-0 w-screen h-screen bg-black z-[60]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <nav className="flex flex-col items-center justify-center h-full p-6 bg-black overflow-y-auto">
            {!isPathsExpanded ? (
              <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:grid md:grid-cols-2 md:justify-items-center md:gap-x-10 md:gap-y-6">
                {!isHomePage && (
                  <Link 
                    href="/" 
                    onClick={handleHomeClick} 
                    className={overlayNavItemWithIconClass}
                  >
                    <Home size={18} className="mr-2" />
                    Home
                  </Link>
                )}
                
                <button onClick={() => handleSectionLinkClick('about')} className={overlayNavItemClass}>About</button>
                <button onClick={() => handleSectionLinkClick('videos')} className={overlayNavItemClass}>Video</button>
                <button onClick={() => handleSectionLinkClick('music')} className={overlayNavItemClass}>Music</button>
                <button onClick={() => handleSectionLinkClick('interview')} className={overlayNavItemClass}>Interview</button>

                {isHomePage ? (
                  <button onClick={() => handleSectionLinkClick('profile')} className={overlayNavItemWithIconClass}>
                    <User size={18} className="mr-2" />
                    Profile
                  </button>
                ) : (
                  <Link href="/profile" className={overlayNavItemWithIconClass} onClick={() => setIsOpen(false)}>
                    <User size={18} className="mr-2" />
                    Profile
                  </Link>
                )}
                <button onClick={() => handleSectionLinkClick('expertise')} className={overlayNavItemClass}>Expertise</button>
                <button onClick={() => handleSectionLinkClick('testimonials')} className={overlayNavItemClass}>Testimonials</button>

                <button onClick={() => handleSectionLinkClick('blog')} className={overlayNavItemClass}>Insights</button>
                <button onClick={() => handleSectionLinkClick('contact')} className={overlayNavItemClass}>Contact</button>
                <Link href="/blog" className={overlayNavItemWithIconClass} onClick={() => setIsOpen(false)}>
                  <BookOpen size={18} className="mr-2" />
                  Blog
                </Link>

                <div className="w-full text-center md:col-span-2">
                  <button 
                    onClick={() => setIsPathsExpanded(true)}
                    className={`${overlayNavItemClass} inline-flex items-center`}
                  >
                    <Compass size={18} className="mr-2" />
                    Paths
                  </button>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xl text-gray-500 hover:text-cyan-400 transition-colors mt-8 md:col-span-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-6">
                <div className="text-2xl font-bold text-white mb-4">MS::PATHS:</div>
                <button 
                  onClick={(e) => handlePathsItemClick('ZerothTheory', e)}
                  className="text-xl text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Zeroth Theory
                </button>
                <button 
                  onClick={(e) => handlePathsItemClick('cryptofabric', e)}
                  className="text-xl text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Crypto Fabric
                </button>
                <button 
                  onClick={(e) => handlePathsItemClick('TheHumanDollar', e)}
                  className="text-xl text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  The Human Dollar
                </button>
                
                <button
                  onClick={() => setIsPathsExpanded(false)}
                  className="text-xl text-gray-500 hover:text-cyan-400 transition-colors mt-8"
                >
                  Close Paths
                </button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};
