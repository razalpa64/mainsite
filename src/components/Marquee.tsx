import { brand } from '@/lib/content';

/**
 * A quiet gold marquee that carries the three pillars between the hero and the
 * story. Pure CSS animation; pauses under reduced-motion (handled globally).
 */
export function Marquee() {
  const phrase = [...brand.pillars, brand.name];
  const row = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="flex items-center">
          {phrase.map((word) => (
            <span key={`${word}-${i}`} className="flex items-center">
              <span className="px-6 font-display text-lg font-medium uppercase tracking-[0.3em] text-paper/85 md:text-xl">
                {word}
              </span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
          ))}
        </span>
      ))}
    </span>
  );

  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-ink py-4">
      <div className="flex w-max" style={{ animation: 'marquee 26s linear infinite' }}>
        {row}
        {row}
      </div>
    </div>
  );
}
