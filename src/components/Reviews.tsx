import { reviews } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * BELIEVE — quiet, editorial testimonials across the three businesses. Hairline
 * grid, serif quotes, gold marks. No fake metrics, just voices.
 */
export function Reviews() {
  return (
    <section id={reviews.id} className="relative bg-paper py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03" label={reviews.label} />
            <h2 className="mt-7 whitespace-pre-line font-display text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
              {reviews.title}
            </h2>
          </div>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted">
            {reviews.lead}
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-2">
          {reviews.items.map((review, i) => (
            <Reveal
              key={review.name}
              delay={(i % 2) * 0.08}
              className="group flex flex-col justify-between gap-8 bg-paper p-8 transition-colors duration-500 hover:bg-paper-2 md:p-10"
            >
              <div>
                <span aria-hidden="true" className="font-display text-5xl leading-none text-gold">
                  &ldquo;
                </span>
                <p className="mt-2 font-display text-xl leading-snug text-ink md:text-2xl">
                  {review.quote}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold tracking-tight text-ink">{review.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">{review.role}</p>
                </div>
                <span className="rounded-full border border-gold/40 px-3 py-1 font-display text-xs uppercase tracking-[0.24em] text-gold-deep">
                  {review.business}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
