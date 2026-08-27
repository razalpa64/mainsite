import rawSite from '@/data/site.json';
import type { Business, Pillar, ResolvedContent, SiteContent } from '@/types/site';

/**
 * ── Content layer ────────────────────────────────────────────────────────────
 * Single source of truth for everything the site renders. Swap `loadContent`
 * for a Supabase/CMS/API query returning the same `SiteContent` shape to make
 * the site fully content-managed.
 */

const site = rawSite as unknown as SiteContent;

export function resolveContent(source: SiteContent): ResolvedContent {
  const pillarMap = {} as Record<Pillar, Business | undefined>;
  for (const item of source.businesses.items) pillarMap[item.pillar] = item;

  return {
    ...source,
    derived: {
      businessCount: source.businesses.items.length,
      pillarMap,
    },
  };
}

export const staticContent: ResolvedContent = resolveContent(site);

export async function loadContent(): Promise<ResolvedContent> {
  return staticContent;
}

export const content = staticContent;
export const {
  brand,
  hero,
  intro,
  businesses,
  work,
  reviews,
  about,
  vision,
  contact,
  socials,
  footer,
  navigation,
  meta,
  settings,
  derived,
} = staticContent;
