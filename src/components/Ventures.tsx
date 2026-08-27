import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { ventures } from '@/lib/content';
import { gsap } from '@/lib/gsap';
import type { Venture } from '@/types/site';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

function statusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === 'active') return 'bg-cobalt';
  if (s.includes('development') || s.includes('building')) return 'bg-ember';
  return 'bg-ink/40';
}

function VentureCard({ venture }: { venture: Venture }) {
  const live = venture.url.length > 0;

  const media = (
    <div className="group relative overflow-hidden">
      <ResponsiveImage
        path={venture.image}
        alt={`${venture.name} — ${venture.category}`}
        sizesKind="card"
        className="aspect-[3/4] w-full"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
      />
      {/* status badge */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur-md">
        <span className={`h-1.5 w-1.5 rounded-full ${statusTone(venture.status)}`} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
          {venture.status}
        </span>
      </div>
      {/* hover veil + cta */}
      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="flex items-center gap-2 p-5 text-sm font-semibold text-paper">
          {venture.ctaLabel ?? ventures.ctaLabel}
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );

  const body = (
    <div className="mt-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/50">
          {venture.category}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/40">
          {venture.year}
        </span>
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight text-ink">{venture.name}</h3>
      <p className="text-sm leading-relaxed text-muted">{venture.description}</p>
    </div>
  );

  return live ? (
    <a
      href={venture.url}
      target="_blank"
      rel="noreferrer noopener"
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
    >
      {media}
      {body}
    </a>
  ) : (
    <article className="block">
      {media}
      {body}
    </article>
  );
}

/**
 * EXPLORE — the centerpiece. On desktop the section pins and a horizontal track
 * scrubs with the scroll (GSAP + ScrollTrigger); on touch / reduced-motion it
 * degrades to a native snap-scrolling row. Fully data-driven from `site.json`.
 */
export function Ventures() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (countRef.current) {
              const index = Math.min(
                ventures.items.length,
                Math.floor(self.progress * ventures.items.length) + 1,
              );
              countRef.current.textContent = String(index).padStart(2, '0');
            }
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id={ventures.id} ref={sectionRef as never} className="relative overflow-hidden bg-paper">
      <div className="flex h-screen flex-col justify-center py-16">
        {/* Header */}
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="03" label={ventures.label} />
              <h2 className="mt-6 whitespace-pre-line text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
                {ventures.title}
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <p className="max-w-xs text-sm leading-relaxed text-muted">{ventures.lead}</p>
              <div className="hidden items-center gap-3 md:flex">
                <span className="tnum font-mono text-sm text-cobalt" ref={countRef}>
                  01
                </span>
                <span className="font-mono text-sm text-ink/30">
                  / {String(ventures.items.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 will-change-transform md:snap-none md:gap-10 md:overflow-visible md:px-10 lg:px-[max(2.5rem,calc((100vw_-_1400px)/2_+_2.5rem))]"
        >
          {ventures.items.map((venture) => (
            <div
              key={venture.id}
              className="w-[80vw] max-w-[380px] shrink-0 snap-start sm:max-w-[420px] lg:w-[360px] xl:w-[400px]"
            >
              <VentureCard venture={venture} />
            </div>
          ))}

          {/* trailing spacer so the last card clears */}
          <div aria-hidden="true" className="w-1 shrink-0" />
        </div>

        {/* progress */}
        <div className="mx-auto mt-4 w-full max-w-[1400px] px-5 md:px-10">
          <div className="hairline relative w-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 origin-left bg-cobalt"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 md:text-left">
            {ventures.dragHint}
          </p>
        </div>
      </div>
    </section>
  );
}
