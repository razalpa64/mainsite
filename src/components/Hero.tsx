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
 * ARRIVE — a clean, editorial ecosystem hero.
 *
 * Left: the brand statement in one confident serif line. Right: a refined layered
 * collage. Below: a tidy three-division index (Learn / Create / Celebrate) so the
 * ecosystem — and every division's imagery, Events included — reads instantly.
 */
export function Hero({ booted }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const collageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();

  const events = businesses.items[2];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !booted) return;

    const words = root.querySelectorAll<HTMLElement>('[data-hword]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');
    const cells = root.querySelectorAll<HTMLElement>('[data-cell]');
    const cover = root.querySelector<HTMLElement>('[data-cover]');
    const imgWrap = root.querySelector<HTMLElement>('[data-imgwrap]');

    if (prefersReducedMotion) {
      gsap.set([...words, ...fades, ...cells, cover, imgWrap], { clearProps: 'all' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
    tl.fromTo(root.querySelector('[data-hero-eyebrow]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
      .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1.0, stagger: 0.09 }, 0.2)
      .fromTo(cover, { yPercent: 0 }, { yPercent: -101, duration: 1.1, ease: EASE.inout }, 0.35)
      .fromTo(imgWrap, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: EASE.out }, 0.35)
      .fromTo(fades, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.6)
      .fromTo(cells, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: EASE.out }, 0.8);

    // Cursor parallax on the collage.
    let parallax: gsap.Context | undefined;
    if (isFinePointer && collageRef.current) {
      parallax = gsap.context(() => {
        const layers = collageRef.current?.querySelectorAll<HTMLElement>('[data-depth]') ?? [];
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

    // Scroll: headline eases back, collage drifts.
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (headlineRef.current) gsap.set(headlineRef.current, { scale: 1 - p * 0.06, y: -p * 30 });
        if (collageRef.current) gsap.set(collageRef.current, { y: -p * 50 });
      },
    });

    return () => {
      tl.kill();
      parallax?.revert();
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
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 40% at 86% 14%, rgba(179,135,62,0.10), transparent 62%), radial-gradient(60% 50% at 4% 94%, rgba(230,221,203,0.7), transparent 60%), linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] flex-1 grid-cols-1 items-center gap-12 px-5 pb-10 pt-28 md:px-10 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="lg:col-span-7">
          <p data-hero-eyebrow className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-gold opacity-0">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {hero.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-medium leading-[1.05] tracking-[-0.01em] text-ink will-change-transform"
          >
            <span className="flex flex-wrap items-baseline gap-x-[0.45em] gap-y-1">
              {words.map((word) => (
                <span key={word} className="inline-block overflow-hidden">
                  <span data-hword className="inline-block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                    {word}
                    <span className="text-gold">.</span>
                  </span>
                </span>
              ))}
            </span>
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

        {/* Collage */}
        <div className="lg:col-span-5">
          <div ref={collageRef} className="relative mx-auto max-w-[420px] will-change-transform">
            <div data-depth="10" className="relative overflow-hidden rounded-t-[9rem] rounded-b-2xl shadow-lift">
              <div data-imgwrap className="will-change-transform">
                <ResponsiveImage path={hero.image} alt={hero.imageAlt} sizesKind="half" eager className="aspect-[4/5] w-full" />
              </div>
              <div data-cover aria-hidden="true" className="absolute inset-0 bg-paper-2" />
            </div>
            <div data-depth="20" className="absolute -bottom-8 -left-6 w-[46%] overflow-hidden rounded-xl border-4 border-paper shadow-card">
              <ResponsiveImage path={events.image} alt={`${events.name} — ${events.category}`} sizesKind="third" aspect="4 / 3" className="w-full" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-t-[9.5rem] rounded-b-[1.6rem] border border-gold/40" />
          </div>
        </div>
      </div>

      {/* Three-division index */}
      <div data-hero-fade className="relative z-10 opacity-0">
        <div className="hairline mx-auto w-full max-w-[1360px]" />
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 divide-y divide-ink/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10">
          {businesses.items.map((business, i) => (
            <a
              key={business.id}
              href="#businesses"
              data-cell
              className="group flex items-center gap-5 py-6 sm:px-8 sm:first:pl-0"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <ResponsiveImage path={business.image} alt={business.name} sizesKind="third" aspect="1 / 1" className="h-full w-full" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-gold">0{i + 1} — {business.pillar}</p>
                <h2 className="mt-0.5 truncate font-display text-lg font-semibold text-ink">{business.name}</h2>
                <p className="truncate text-xs text-muted">{business.category}</p>
              </div>
              <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
            </a>
          ))}
        </div>
      </div>

      <p className="sr-only">{content.brand.statement}</p>
    </section>
  );
}
