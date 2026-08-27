import { useState } from 'react';

import { ecosystem } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * EXPLORE — the brand architecture made legible. A root node fans out to the
 * five directions of the ecosystem; selecting a branch reveals its detail.
 */
export function Ecosystem() {
  const [activeId, setActiveId] = useState(ecosystem.branches[0]?.id);
  const active = ecosystem.branches.find((branch) => branch.id === activeId) ?? ecosystem.branches[0];

  return (
    <section id={ecosystem.id} className="relative overflow-hidden bg-paper-2 py-28 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 0%, rgba(38,71,224,0.05), transparent 60%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02" label={ecosystem.label} />
            <h2 className="mt-8 whitespace-pre-line text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {ecosystem.title}
            </h2>
          </div>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted">
            {ecosystem.lead}
          </Reveal>
        </div>

        {/* Tree: root → branches */}
        <Reveal className="mt-20">
          {/* root */}
          <div className="flex flex-col items-center">
            <span className="rounded-full border border-ink/15 bg-paper px-6 py-2.5 text-sm font-bold tracking-[0.3em] text-ink shadow-card">
              {ecosystem.rootLabel}
            </span>
            <span className="mt-0 text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mt-2">
              {ecosystem.rootCaption}
            </span>
            <span aria-hidden="true" className="mt-3 h-10 w-px bg-ink/20" />
          </div>

          {/* horizontal rail + nodes */}
          <div className="relative">
            <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-0 hidden h-px bg-ink/15 md:block" />
            <div
              role="tablist"
              aria-label="Ecosystem branches"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5 md:gap-0"
            >
              {ecosystem.branches.map((branch) => {
                const isActive = branch.id === activeId;
                return (
                  <div key={branch.id} className="relative flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={`hidden h-8 w-px md:block ${isActive ? 'bg-cobalt' : 'bg-ink/15'}`}
                    />
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(branch.id)}
                      className={`group flex w-full flex-col items-center gap-2 rounded-2xl px-3 py-5 transition-all duration-500 md:rounded-none ${
                        isActive ? 'bg-paper shadow-card' : 'hover:bg-paper/60'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs transition-all duration-500 ${
                          isActive
                            ? 'bg-cobalt text-paper scale-110'
                            : 'border border-ink/20 text-ink/60 group-hover:border-ink/50'
                        }`}
                      >
                        {branch.index}
                      </span>
                      <span
                        className={`text-sm font-semibold tracking-tight transition-colors ${
                          isActive ? 'text-ink' : 'text-ink/60'
                        }`}
                      >
                        {branch.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Detail panel */}
        <Reveal className="mt-14">
          <div
            key={active.id}
            className="grid grid-cols-1 gap-10 rounded-3xl border border-ink/10 bg-paper p-8 shadow-card md:grid-cols-12 md:p-12 animate-[panel-in_0.5s_var(--ease-lux)]"
          >
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cobalt">{active.index}</span>
                <span className="hairline h-px w-10" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                  {active.status}
                </span>
              </div>
              <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
                {active.name}
              </h3>
              <p className="mt-3 text-lg font-medium text-cobalt">{active.tagline}</p>
            </div>

            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-muted">{active.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {active.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-ink/12 bg-paper-2 px-4 py-1.5 text-xs font-medium text-ink/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            {ecosystem.hint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
