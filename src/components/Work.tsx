import { useMemo, useState } from 'react';

import { work, brand } from '@/lib/content';
import type { Pillar } from '@/types/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

type Filter = 'All' | Pillar;

/**
 * EXPLORE (proof) — a filterable gallery of real work across the three
 * businesses. Clean editorial grid, gold filter pills, hover lift.
 */
export function Work() {
  const [filter, setFilter] = useState<Filter>('All');

  const filters: Filter[] = useMemo(() => [work.allLabel as Filter, ...brand.pillars], []);

  const items = useMemo(
    () => (filter === 'All' ? work.items : work.items.filter((item) => item.business === filter)),
    [filter],
  );

  return (
    <section id={work.id} className="relative bg-paper py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03" label={work.label} />
            <h2 className="mt-7 font-display text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
              {work.title}
            </h2>
          </div>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted">{work.lead}</Reveal>
        </div>

        {/* Filter pills */}
        <div className="mt-10 flex flex-wrap gap-3" role="tablist" aria-label="Filter work by business">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-all duration-300 ${
                  active
                    ? 'bg-ink text-paper shadow-card'
                    : 'border border-ink/15 text-ink/60 hover:border-gold hover:text-gold-deep'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div key={filter} className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card transition-transform duration-500 hover:-translate-y-1.5"
              style={{ animation: `panel-in 0.5s var(--ease-lux) ${i * 0.05}s backwards` }}
            >
              <div className="relative overflow-hidden">
                <ResponsiveImage
                  path={item.image}
                  alt={`${item.title} — ${item.business}`}
                  sizesKind="third"
                  aspect="4 / 3"
                  className="w-full"
                  imgClassName="transition-transform duration-[1.3s] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-display text-[10px] uppercase tracking-[0.24em] text-gold-soft backdrop-blur-md">
                  {item.business}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
