import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (dependencies: unknown[] = []) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- dependencies passed dynamically
  }, [pathname, ...dependencies]);
}; 