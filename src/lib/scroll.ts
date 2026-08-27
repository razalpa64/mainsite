import type Lenis from 'lenis';

/**
 * Smooth-scroll store.
 *
 * Lenis is instantiated once (in `useSmoothScroll`) and parked here so any part
 * of the app — navbar, CTAs, footer links — can scroll programmatically without
 * prop-drilling a controller. When Lenis is disabled (reduced motion / coarse
 * pointer settings) we fall back to native smooth/`auto` scrolling.
 */
let lenis: Lenis | null = null;
let reducedMotion = false;

export function setScrollEngine(instance: Lenis | null): void {
  lenis = instance;
}

export function setReducedMotion(value: boolean): void {
  reducedMotion = value;
}

export function getScrollEngine(): Lenis | null {
  return lenis;
}

export interface ScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

/** Scroll to a CSS selector / element / number of pixels. */
export function scrollTo(target: string | number | Element, options: ScrollOptions = {}): void {
  const { offset = 0, duration = 1.4 } = options;

  if (lenis && !reducedMotion) {
    lenis.scrollTo(target as string | number | HTMLElement, {
      offset,
      duration,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }

  // Native fallback.
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
    return;
  }

  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

/**
 * Resolve an in-page anchor from an href like `#ventures` and scroll to it,
 * updating the hash without a jump. Returns true when handled.
 */
export function scrollToAnchor(href: string, offset = 0): boolean {
  if (!href.startsWith('#')) return false;

  const id = href.slice(1);
  if (id.length === 0) {
    scrollTo(0, { offset });
    if (history.pushState) history.pushState(null, '', href || '#');
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  scrollTo(el, { offset });
  if (history.pushState) history.pushState(null, '', `#${id}`);
  return true;
}

/** Global delegation: make every `#hash` link scroll smoothly. */
export function bindAnchorScrolling(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
      'a[href^="#"]',
    );
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    const handled = scrollToAnchor(href, -1);
    if (handled) event.preventDefault();
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
