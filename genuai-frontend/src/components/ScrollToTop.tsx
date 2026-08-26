import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that whenever the route changes (e.g. clicking Get Started,
 * navigating from Terms to Privacy, etc.), the browser instantly resets
 * scroll to the very top (0, 0) so pages never start in the middle.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // Instant, immediate scroll reset before paint
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  return null;
}
