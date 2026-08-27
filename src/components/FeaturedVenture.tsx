import { useEffect, useRef } from 'react';

import { featuredVenture, derived } from '@/lib/content';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

/**
 * BELIEVE (part one) — the flagship venture gets a product-launch presentation:
 * dark stage, oversized type, slow parallax image, and its operating principles.
 */
export function FeaturedVenture() {
  const rootRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const venture = derived.featuredVenture;

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: 10, scale: 1.08 },
        {
          yPercent: -8,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (!venture) return null;

  return (
    <section
      id={featuredVenture.id}
      ref={rootRef as never}
      className="grain relative overflow-hidden bg-ink py-28 text-paper md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 40% at 80% 20%, rgba(38,71,224,0.16), transparent 60%), radial-gradient(40% 35% at 10% 85%, rgba(38,71,224,0.08), transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
        {/* Copy */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <SectionLabel index="04" label={featuredVenture.label} tone="light" />

          <h2 className="mt-8 text-[clamp(2.4rem,5.5vw,5rem)] font-extrabold leading-[1.0] tracking-[-0.02em]">
            <SplitLines as="span" lines={[featuredVenture.title]} />
          </h2>
          <p className="mt-4 text-xl font-medium text-cobalt-soft md:text-2xl">
            {featuredVenture.statement}
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {featuredVenture.body.map((paragraph, i) => (
              <p key={i} className="max-w-xl text-base leading-relaxed text-paper/60">
                {paragraph}
              </p>
            ))}
          </div>

          {/* principles */}
          <div className="mt-10 flex flex-col divide-y divide-paper/10 border-y border-paper/10">
            {featuredVenture.principles.map((principle, i) => (
              <div key={principle.name} className="group flex items-baseline gap-5 py-5">
                <span className="font-mono text-xs text-cobalt-soft">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{principle.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-paper/50">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={featuredVenture.cta.href} variant="solid" tone="light" size="lg" external withArrow>
              {featuredVenture.cta.label}
            </Button>
            <Button href={featuredVenture.secondaryCta.href} variant="ghost" tone="light" size="lg">
              {featuredVenture.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-6">
          <div ref={imageRef} className="relative overflow-hidden rounded-3xl">
            <ResponsiveImage
              path={venture.image}
              alt={`${venture.name} — ${venture.category}`}
              sizesKind="half"
              className="aspect-[3/4] w-full"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <span className="rounded-full bg-paper/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper backdrop-blur-md">
                {featuredVenture.kicker}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/60">
                {venture.status}
              </span>
            </div>
          </div>
          {/* offset frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] border border-paper/10"
          />
        </div>
      </div>
    </section>
  );
}
