import rawSite from '@/data/site.json';
import type { ResolvedContent, SiteContent, Venture } from '@/types/site';

/**
 * ── Content layer ────────────────────────────────────────────────────────────
 *
 * Single source of truth for everything the site renders. The UI never reads
 * `site.json` directly — it reads the resolved object exported below.
 *
 * Swapping the static JSON for a backend is a change confined to `loadContent`:
 * replace the returned promise with a fetch/Supabase query that resolves to the
 * same `SiteContent` shape and every section updates untouched.
 */

const site = rawSite as unknown as SiteContent;

/** Values a stat may resolve to instead of a literal number. */
type AutoToken = 'pillars' | 'ventures' | 'active-ventures' | 'services' | 'branches';

const AUTO_PREFIX = 'auto:';

function resolveAutoToken(token: string, source: SiteContent): string | null {
  const key = token.slice(AUTO_PREFIX.length) as AutoToken;

  switch (key) {
    case 'pillars':
    case 'branches':
      return String(source.ecosystem.branches.length);
    case 'ventures':
      return String(source.ventures.items.length);
    case 'active-ventures':
      return String(source.ventures.items.filter(isActive).length);
    case 'services':
      return String(source.services.items.length);
    default:
      return null;
  }
}

function isActive(venture: Venture): boolean {
  return venture.status.trim().toLowerCase() === 'active' && venture.url.length > 0;
}

/** Fill in derived values so components never compute counts themselves. */
export function resolveContent(source: SiteContent): ResolvedContent {
  const featuredVenture =
    source.ventures.items.find((item) => item.id === source.featuredVenture.ventureId) ??
    source.ventures.items[0];

  const stats = source.hero.stats.map((stat) => {
    if (!stat.value.startsWith(AUTO_PREFIX)) return { ...stat };

    const resolved = resolveAutoToken(stat.value, source);
    if (resolved === null) {
      // Unknown token: drop the figure rather than render a broken placeholder.
      console.warn(`[invytra] unknown stat token "${stat.value}" — omitting "${stat.label}".`);
      return null;
    }
    return { label: stat.label, value: resolved };
  });

  return {
    ...source,
    hero: {
      ...source.hero,
      stats: stats.filter((stat): stat is { label: string; value: string } => stat !== null),
    },
    derived: {
      pillarCount: source.ecosystem.branches.length,
      ventureCount: source.ventures.items.length,
      activeVentures: source.ventures.items.filter(isActive),
      featuredVenture,
    },
  };
}

/** Content used for the very first paint (no network round-trip). */
export const staticContent: ResolvedContent = resolveContent(site);

/**
 * Async entry point. Today it resolves the bundled JSON; point it at an API,
 * Supabase table or CMS endpoint to make the site fully content-managed.
 */
export async function loadContent(): Promise<ResolvedContent> {
  return staticContent;
}

export const content = staticContent;
export const { brand, hero, intro, ecosystem, ventures, featuredVenture, services, philosophy, about, vision, contact, socials, footer, navigation, meta, settings, derived } = staticContent;

/** Convenience: the venture a `#id` deep-link or CTA refers to. */
export function getVentureById(id: string): Venture | undefined {
  return ventures.items.find((item) => item.id === id);
}

/** Ventures grouped by category, preserving the configured order. */
export function getVenturesByCategory(): { category: string; items: Venture[] }[] {
  const order: string[] = [];
  const grouped = new Map<string, Venture[]>();

  for (const item of ventures.items) {
    if (!grouped.has(item.category)) {
      order.push(item.category);
      grouped.set(item.category, []);
    }
    grouped.get(item.category)?.push(item);
  }

  return order.map((category) => ({ category, items: grouped.get(category) ?? [] }));
}
