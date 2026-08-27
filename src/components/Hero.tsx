import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

import { content, hero, businesses } from '@/lib/content';
import { gsap, EASE, ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion, useIsFinePointer } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

export interface HeroProps {
  booted: boolean;
}

/**
 * ARRIVE — the ecosystem hero. A dominant tri-word statement (Learn. Create.
 * Celebrate.) with the three divisions woven into the composition as layered,
 * depth-aware panels. Load, cursor and scroll motion are restrained and cinematic.
 */
export function Hero({ booted }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const panelsWrapRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !booted) return;

    const lines = root.querySelectorAll<HTMLElement>('[data-hline]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');
    const panels = root.querySelectorAll<HTMLElement>('[data-panel]');

    if (prefersReducedMotion) {
      gsap.set([...lines, ...fades, ...panels], { clearProps: 'all' });
      return;
    }

    // ── Entrance ──
    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
    tl.fromTo(root.querySelector('[data-hero-eyebrow]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.2)
      .fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 }, 0.55)
      .fromTo(panels, { y: 60, opacity: 0, rotate: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: EASE.out }, 0.7);

    // ── Cursor parallax (depth layers) ──
    let ctxParallax: gsap.Context | undefined;
    if (isFinePointer) {
      ctxParallax = gsap.context(() => {
        const layers = root.querySelectorAll<HTMLElement>('[data-depth]');
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          layers.forEach((layer) => {
            const depth = Number(layer.dataset.depth ?? 0);
            gsap.to(layer, { x: nx * depth, y: ny * depth * 0.6, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
          });
        };
        root.addEventListener('pointermove', onMove);
        return () => root.removeEventListener('pointermove', onMove);
      }, root);
    }

    // ── Scroll transform: hero hands off to the ecosystem ──
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { scale: 1 - p * 0.08, y: -p * 40 });
        }
        panels.forEach((panel, i) => {
          const spread = (i - 1) * 90; // move apart
          gsap.set(panel, { y: -p * 60 + p * spread * 0.4, opacity: 1 - p * 0.5 });
        });
      },
    });

    return () => {
      tl.kill();
      ctxParallax?.revert();
      st.kill();
    };
  }, [booted, prefersReducedMotion, isFinePointer]);

  const words = hero.headlineLines.map((line) => line.replace(/\.$/, ''));

  return (
    <section
      id={hero.id}
      ref={rootRef as never}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Invytra — the ecosystem"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 40% at 84% 16%, rgba(179,135,62,0.12), transparent 62%), radial-gradient(60% 50% at 4% 92%, rgba(230,221,203,0.75), transparent 60%), linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)',
        }}
      />
      <span
        aria-hidden="true"
        data-depth="10"
        className="pointer-events-none absolute -right-8 top-24 select-none font-display text-[clamp(8rem,24vw,22rem)] leading-none text-ink/[0.04]"
      >
        IV
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] flex-1 grid-cols-1 items-center gap-12 px-5 pb-8 pt-28 md:px-10 lg:grid-cols-12 lg:gap-6">
        {/* Copy */}
        <div className="lg:col-span-7">
          <p data-hero-eyebrow className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-gold opacity-0">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {hero.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="mt-6 font-display text-[clamp(3.4rem,10vw,8.5rem)] font-medium leading-[0.98] tracking-[-0.015em] text-ink will-change-transform"
          >
            {words.map((word) => (
              <span key={word} className="block overflow-hidden">
                <span data-hline className="block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                  {word}
                  <span className="text-gold">.</span>
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-6 max-w-xl text-base leading-relaxed text-muted opacity-0 md:text-lg">
            {hero.statement}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-4 opacity-0">
            <Button href={hero.primaryCta.href} variant="solid" size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost" size="lg">
              {hero.secondaryCta.label}
              <ArrowDown aria-hidden="true" className="h-[1.1em] w-[1.1em]" />
            </Button>
          </div>

          <p data-hero-fade className="mt-8 font-display text-sm italic tracking-wide text-ink/50 opacity-0">
            {hero.endStatement}
          </p>
        </div>

        {/* Three-division panels */}
        <div className="lg:col-span-5">
          <div
            ref={panelsWrapRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:block lg:overflow-visible lg:pb-0"
          >
            {businesses.items.map((business, i) => (
              <a
                key={business.id}
                href="#businesses"
                data-panel
                data-depth={String(14 - i * 5)}
                className={`group relative w-[80%] min-w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-card transition-colors duration-500 hover:border-gold/50 sm:min-w-[300px] lg:w-[340px] lg:min-w-0 ${
                  i === 0
                    ? 'lg:relative lg:z-30 lg:-rotate-2'
                    : i === 1
                      ? 'lg:relative lg:z-20 lg:-mt-8 lg:ml-10 lg:rotate-[1.5deg]'
                      : 'lg:relative lg:z-10 lg:-mt-8 lg:ml-3 lg:-rotate-1'
                }`}
              >
                <div className="relative overflow-hidden">
                  <ResponsiveImage
                    path={business.image}
                    alt={`${business.name} — ${business.category}`}
                    sizesKind="half"
                    aspect="16 / 10"
                    eager={i === 0}
                    className="w-full"
                    imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-soft backdrop-blur-md">
                    {business.pillar}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="font-mono text-[10px] text-gold">0{i + 1}</p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-ink">{business.name}</h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{business.positioning}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div data-hero-fade className="relative z-10 opacity-0">
        <div className="hairline mx-auto w-full max-w-[1360px]" />
        <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-5 py-5 md:px-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
            {content.brand.tagline}
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 animate-bounce text-gold" />
            {hero.scrollCue}
          </span>
        </div>
      </div>
    </section>
  );
}
