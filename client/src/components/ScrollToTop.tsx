import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Solves the navigation scroll flash bug:
 * When navigating between routes (e.g. SHOP -> COLLECTIONS), React Router
 * updates the route while the previous scroll offset remains in window.scrollY.
 * 
 * By using `useLayoutEffect`, scroll reset executes SYNCHRONOUSLY after DOM mutations
 * but BEFORE the browser paints the destination route to the screen.
 * This completely eliminates the visible "scroll flash" of the previous page.
 * 
 * In-page scroll experiences (e.g. Homepage Headphone & ARC TWS scroll animations,
 * modals, cart drawer, query parameter changes) are strictly preserved because
 * the effect only fires when `pathname` actually changes.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef<string>(pathname);
  const scrollPositionsRef = useRef<Record<string, number>>({});

  // Ensure browser native scroll restoration does not asynchronously flash old offsets
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const prevPath = prevPathRef.current;

    // Only handle route (pathname) changes, ignore in-page state or query-only changes
    if (prevPath === pathname) {
      return;
    }

    // Save previous page scroll position for browser back/forward (POP) navigation
    scrollPositionsRef.current[prevPath] = window.scrollY;
    prevPathRef.current = pathname;

    if (navType === 'POP') {
      // Browser back/forward navigation: restore previous position for this route if available
      const savedY = scrollPositionsRef.current[pathname] ?? 0;
      window.scrollTo({
        top: savedY,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      if (document.documentElement) document.documentElement.scrollTop = savedY;
      if (document.body) document.body.scrollTop = savedY;
    } else {
      // Normal navigation (PUSH / REPLACE, e.g. clicking navbar links):
      // IMMEDIATELY reset to top BEFORE browser paints the new page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [pathname, navType]);

  return null;
};
