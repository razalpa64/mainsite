export interface SectionLabelProps {
  index?: string;
  label: string;
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * Mono eyebrow label with an index numeral and rule — the recurring way every
 * section announces itself.
 */
export function SectionLabel({ index, label, tone = 'dark', className = '' }: SectionLabelProps) {
  const color = tone === 'light' ? 'text-paper/60' : 'text-ink/55';
  const rule = tone === 'light' ? 'bg-paper/30' : 'bg-ink/25';
  const dot = 'bg-gold';

  return (
    <div className={`flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em] ${color} ${className}`}>
      {index && <span className="text-gold">{index}</span>}
      <span aria-hidden="true" className={`h-px w-8 ${rule}`} />
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className={`h-1 w-1 rounded-full ${dot}`} />
        {label}
      </span>
    </div>
  );
}
