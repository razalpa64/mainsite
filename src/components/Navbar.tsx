import { useEffect, useMemo, useState } from 'react';

import { content } from '@/lib/content';
import { getScrollEngine, scrollToAnchor } from '@/lib/scroll';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="30" cy="34" r="13" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="46" cy="18" r="6" fill="var(--color-cobalt)" />
    </svg>
  );
}

export interface NavbarProps {
  booted: boolean;
}

/**
 * Sticky navigation: transparent over the hero, condensing to a glass surface
 * on scroll. Mobile gets a designed fullscreen menu rather than a drawer.
 */
export function Navbar({ booted }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(content.navigation.links[0]?.id ?? 'home');
  const prefersReducedMotion = usePrefersReducedMotion();

  const links = content.navigation.links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track the active section for the underline indicator.
  useEffect(() => {
    const ids = links.map((link) => link.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [links]);

  // Lock scrolling while the mobile menu is open.
  useEffect(() => {
    const lenis = getScrollEngine();
    if (open) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [open]);

  // Close the menu once the hero has booted on first load (no-op otherwise).
  useEffect(() => {
    if (!booted) setOpen(false);
  }, [booted]);

  const close = () => setOpen(false);

  const onNavigate = (href: string) => {
    close();
    // Allow the menu to begin closing before we scroll.
    window.setTimeout(() => scrollToAnchor(href, -1), prefersReducedMotion ? 0 : 80);
  };

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled && !open ? 'glass py-3' : 'bg-transparent py-5'
        } ${booted ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 md:px-10">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#home');
            }}
            className="group flex items-center gap-3 text-ink"
            aria-label="Invytra home"
          >
            <LogoMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-semibold tracking-[0.3em] text-sm md:text-base">
              {content.brand.name}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.href);
                }}
                className={`relative text-sm font-medium tracking-tight transition-colors duration-300 ${
                  active === link.id ? 'text-ink' : 'text-ink/55 hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-cobalt transition-transform duration-500 ${
                    active === link.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={content.navigation.cta.href} variant="solid" size="md">
              {content.navigation.cta.label}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? content.navigation.closeLabel : content.navigation.menuLabel}
            className="relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`h-[2px] w-6 rounded-full transition-all duration-300 ${
                open ? 'translate-y-[4px] rotate-45 bg-paper' : 'bg-ink'
              }`}
            />
            <span
              className={`h-[2px] w-6 rounded-full transition-all duration-300 ${
                open ? '-translate-y-[4px] -rotate-45 bg-paper' : 'bg-ink'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-paper transition-[clip-path,opacity] duration-700 lg:hidden ${
          open ? 'pointer-events-auto opacity-100 [clip-path:inset(0_0_0%_0)]' : 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        {/* Subtle ambient motion */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(60% 40% at 80% 10%, rgba(38,71,224,0.25), transparent 60%), radial-gradient(50% 40% at 10% 90%, rgba(246,244,239,0.06), transparent 60%)',
          }}
        />

        <nav className="relative flex flex-col gap-2" aria-label="Mobile">
          {links.map((link, i) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
              className={`group flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="font-mono text-xs text-cobalt-soft">0{i + 1}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-2">
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        <div
          className={`relative flex flex-col gap-6 transition-all duration-500 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: open ? '480ms' : '0ms' }}
        >
          <Button href={content.navigation.cta.href} variant="solid" tone="light" size="lg" onClick={close}>
            {content.navigation.cta.label}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              {content.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-paper"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              © {year}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
