import { useRef, useState, type PointerEvent } from 'react';
import { Plus } from 'lucide-react';

import { services } from '@/lib/content';
import { useIsFinePointer } from '@/hooks/useMediaQuery';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

/**
 * BELIEVE (part two) — what Invytra can build. Rendered as an editorial index
 * of expandable rows (never a card grid); on fine pointers a floating preview
 * image trails the cursor for a tactile, expensive feel.
 */
export function Services() {
  const [openId, setOpenId] = useState<string | null>(services.items[0]?.id ?? null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isFinePointer = useIsFinePointer();

  const hovered = services.items.find((item) => item.id === hoverId);

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const preview = previewRef.current;
    const section = sectionRef.current;
    if (!preview || !section || !isFinePointer) return;

    const rect = section.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    preview.style.transform = `translate(${x + 28}px, ${y - 140}px)`;
  };

  return (
    <section
      id={services.id}
      ref={sectionRef as never}
      onPointerMove={onMove}
      className="relative overflow-hidden bg-paper py-28 md:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="05" label={services.label} />
            <h2 className="mt-8 whitespace-pre-line text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {services.title}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted">{services.lead}</p>
        </div>

        {/* Rows */}
        <div className="mt-16 border-t border-ink/10">
          {services.items.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className="border-b border-ink/10">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId((prev) => (prev === item.id ? null : prev))}
                  aria-expanded={open}
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left md:py-10"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-cobalt">{item.index}</span>
                    <span className="text-3xl font-extrabold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      {item.name}
                    </span>
                  </div>
                  <Plus
                    aria-hidden="true"
                    className={`h-6 w-6 text-ink/50 transition-transform duration-500 ${
                      open ? 'rotate-45 text-cobalt' : 'group-hover:rotate-90'
                    }`}
                  />
                </button>

                {/* Expandable detail */}
                <div
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-lux)] ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-12 md:pb-14">
                      <div className="md:col-span-6 md:col-start-2">
                        <p className="text-xl font-semibold text-ink">{item.headline}</p>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                          {item.description}
                        </p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                          Includes
                        </p>
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {item.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-center gap-3 text-sm text-ink/70">
                              <span aria-hidden="true" className="h-px w-5 bg-cobalt" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm italic text-muted">{services.closingNote}</p>
      </div>

      {/* Floating cursor preview (fine pointers only) */}
      {isFinePointer && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 z-20 hidden w-[260px] overflow-hidden rounded-xl shadow-lift transition-opacity duration-300 md:block ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'translate(-400px, -400px)' }}
        >
          {hovered && (
            <ResponsiveImage
              path={hovered.image}
              alt=""
              sizesKind="third"
              className="aspect-square w-full"
            />
          )}
        </div>
      )}
    </section>
  );
}
