import { useMemo, useState, type FormEvent } from 'react';

import { reviews, brand } from '@/lib/content';
import type { Review } from '@/types/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'invytra-reviews';

function loadStored(): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

/**
 * BELIEVE — testimonials plus a live "share your experience" form. Submitted
 * reviews persist in the visitor's browser and merge with the curated set.
 * (Swap `loadStored`/persist for a Supabase/CMS call to make them global.)
 */
export function Reviews() {
  const [stored, setStored] = useState<Review[]>(() => loadStored());
  const [name, setName] = useState('');
  const [business, setBusiness] = useState<string>(brand.pillars[0]);
  const [quote, setQuote] = useState('');
  const [thanks, setThanks] = useState(false);

  const all = useMemo(() => [...stored, ...reviews.items], [stored]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedQuote = quote.trim();
    if (!trimmedName || !trimmedQuote) return;

    const review: Review = {
      quote: trimmedQuote,
      name: trimmedName,
      role: `${business} · Customer`,
      business,
    };

    const next = [review, ...stored];
    setStored(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory */
    }
    setName('');
    setQuote('');
    setThanks(true);
    window.setTimeout(() => setThanks(false), 4000);
  };

  return (
    <section id={reviews.id} className="relative bg-paper-2 py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="04" label={reviews.label} />
            <h2 className="mt-7 whitespace-pre-line font-display text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
              {reviews.title}
            </h2>
          </div>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted">{reviews.lead}</Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Form */}
          <Reveal className="lg:col-span-4">
            <form
              onSubmit={onSubmit}
              className="sticky top-28 flex flex-col gap-5 rounded-3xl border border-ink/10 bg-paper p-8 shadow-card"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink">{reviews.form.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{reviews.form.lead}</p>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/50">
                  {reviews.form.name}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ananya S."
                  className="rounded-xl border border-ink/15 bg-paper-2 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/50">
                  {reviews.form.business}
                </span>
                <select
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="rounded-xl border border-ink/15 bg-paper-2 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                >
                  {brand.pillars.map((pillar) => (
                    <option key={pillar} value={pillar}>
                      {pillar}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/50">
                  {reviews.form.review}
                </span>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us how it went…"
                  className="resize-none rounded-xl border border-ink/15 bg-paper-2 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                />
              </label>

              <Button type="submit" variant="solid" size="md" withArrow>
                {reviews.form.submit}
              </Button>

              {thanks && (
                <p role="status" className="text-sm font-semibold text-gold-deep">
                  {reviews.form.thanks}
                </p>
              )}
            </form>
          </Reveal>

          {/* Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-2">
              {all.map((review, i) => (
                <Reveal
                  key={`${review.name}-${i}`}
                  delay={(i % 2) * 0.06}
                  className="flex flex-col justify-between gap-8 bg-paper p-8 transition-colors duration-500 hover:bg-paper-2"
                >
                  <div>
                    <span aria-hidden="true" className="font-display text-5xl leading-none text-gold">
                      &ldquo;
                    </span>
                    <p className="mt-2 font-display text-xl leading-snug text-ink">{review.quote}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold tracking-tight text-ink">{review.name}</p>
                      <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-muted">{review.role}</p>
                    </div>
                    <span className="rounded-full border border-gold/40 px-3 py-1 font-display text-xs uppercase tracking-[0.2em] text-gold-deep">
                      {review.business}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
