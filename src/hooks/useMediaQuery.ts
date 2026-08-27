import { useEffect, useState } from 'react';

function getMatches(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

/** Reactive `window.matchMedia` hook with SSR-safe default. */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window === 'undefined' ? defaultMatches : getMatches(query),
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(defaultMatches = false): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', defaultMatches);
}

export function useIsFinePointer(defaultMatches = true): boolean {
  return useMediaQuery('(pointer: fine)', defaultMatches);
}

export function useIsMobile(defaultMatches = false): boolean {
  return useMediaQuery('(max-width: 768px)', defaultMatches);
}
