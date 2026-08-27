import { businesses } from '@/lib/content';
import type { Business } from '@/types/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Button } from '@/components/ui/Button';

function BusinessRow({ business, index, flip }: { business: Business; index: number; flip: boolean }) {
  return (
    <Reveal className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Image */}
      <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
        <div className="group relative">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <ResponsiveImage
              path={business.image}
              alt={`${business.name} — ${business.category}`}
              sizesKind="half"
              className="aspect-[4/3] w-full"
              imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
            />
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] border border-gold/35 ${
              flip ? 'translate-x-3 translate-y-3' : '-translate-x-3 translate-y-3'
            }`}
          />
          <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-paper backdrop-blur-md">
            {business.category}
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-gold">0{index + 1}</span>
          <span className="gold-rule h-px w-14" />
          <span className="font-display text-lg font-semibold uppercase tracking-[0.3em] text-gold">
            {business.pillar}
          </span>
        </div>

        <h3 className="mt-4 font-display text-4xl font-medium tracking-[-0.01em] text-ink md:text-5xl">
          {business.name}
        </h3>
        <p className="mt-2 font-display text-xl italic text-gold-deep">{business.positioning}</p>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{business.description}</p>

        <ul className="mt-7 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {business.points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-sm text-ink/75">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button href="#contact" variant="ghost" size="md" withArrow>
            {business.ctaLabel}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * EXPLORE — the three businesses, prominent and distinct, under one brand.
 * Alternating editorial rows keep it premium and uncluttered on desktop and mobile.
 */
export function Businesses() {
  return (
    <section id={businesses.id} className="relative bg-paper-2 py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02" label={businesses.label} />
            <h2 className="mt-7 whitespace-pre-line font-display text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
              {businesses.title}
            </h2>
          </div>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted">
            {businesses.lead}
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-24 md:gap-32">
          {businesses.items.map((business, i) => (
            <BusinessRow key={business.id} business={business} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
