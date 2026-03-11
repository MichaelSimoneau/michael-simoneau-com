import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileFlowDispatch } from '../features/profile/flow';
// import { useScrollContext } from '../contexts/ScrollContext'; // Not using context directly in this version of the hook

interface UseScrollToSectionOptions {
  scrollContainerId?: string; // Optional: ID of the scroll container for on-page section scrolling
}

const getSectionOffset = (sectionId: string): number => {
  // Music has its own hero top spacing; using nav offset here lands too high.
  return sectionId === 'music' ? 0 : 80;
};

export const useScrollToSection = (options?: UseScrollToSectionOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const flowDispatch = useProfileFlowDispatch();
  // const { mainScrollContainerRef } = useScrollContext(); // Get ref from context if preferred

  const scrollToSection = useCallback((sectionId: string, onComplete?: () => void) => {
    const isHomePage = location.pathname === '/';
    const newHash = `#${sectionId}`;

    const attemptScroll = (container: HTMLElement | null, targetId: string, updateHashOnSuccess: boolean) => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        console.error(`[useScrollToSection] Target element '${targetId}' not found.`);
        onComplete?.();
        return;
      }

      if (container) {
        console.log('[useScrollToSection] Scrolling within container:', container, 'to target:', targetElement);
        const originalSnapType = container.style.scrollSnapType;
        container.style.scrollSnapType = 'none';

        const offset = getSectionOffset(targetId);
        flowDispatch({
          type: 'NAV_HASH_RESOLVE_REQUESTED',
          sectionId: targetId,
          sectionOffsetPx: offset,
        });
        flowDispatch({ type: 'NAV_SCROLL_STARTED' });
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const scrollTop = elementRect.top - containerRect.top + container.scrollTop - offset;
        
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });

        if (updateHashOnSuccess && window.location.hash !== newHash) {
           // Update hash after starting scroll to avoid interfering with it, 
           // and to ensure it reflects the target section.
           // Using pushState to prevent immediate jump if browser tries to handle hash change too quickly.
           history.pushState(null, '', newHash);
        }

        setTimeout(() => {
          container.style.scrollSnapType = originalSnapType;
          flowDispatch({ type: 'NAV_SCROLL_SETTLED' });
          onComplete?.();
        }, 700); // Adjust timeout based on smooth scroll duration
      } else {
        // This case should ideally be handled by navigate(`/#${sectionId}`) before calling attemptScroll
        // if it's a cross-page navigation to a hash.
        // For same-page, window scroll (if container is null), the hash should already be set by navigate.
        console.warn('[useScrollToSection] AttemptScroll called without a container for same-page scroll. This might indicate an issue.');
        // If we ended up here for same-page scroll without container, try scrolling window (less ideal)
        // window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        // if (updateHashOnSuccess && window.location.hash !== newHash) {
        //   history.pushState(null, '', newHash);
        // }
        onComplete?.();
      }
    };

    if (isHomePage) {
      const scrollContainerElement = options?.scrollContainerId 
        ? document.getElementById(options.scrollContainerId) 
        : null;

      if (scrollContainerElement) {
        // If already at the hash, force a re-scroll. Otherwise, browser might not act.
        // A simple way is to ensure `attemptScroll` is always called.
        // The check `window.location.hash !== newHash` for `history.pushState` handles not pushing same state.
        attemptScroll(scrollContainerElement, sectionId, true);
      } else {
        console.warn(`[useScrollToSection] Scroll container '${options?.scrollContainerId}' not found on home page. Navigating with hash.`);
        navigate({ pathname: '/', hash: sectionId });
        onComplete?.();
      }
    } else {
      // Not on home page, navigate to main page with hash so MainPage hash-on-load can scroll.
      navigate({ pathname: '/', hash: sectionId });
      onComplete?.();
    }
  }, [location.pathname, navigate, options?.scrollContainerId, flowDispatch]);

  return scrollToSection;
}; 