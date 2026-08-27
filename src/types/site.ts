/**
 * Type contract for the Invytra content layer.
 *
 * Everything the site renders is described here. The static build reads it from
 * `src/data/site.json`; a future backend (Supabase, a headless CMS or an API)
 * only has to return the same shape and nothing in the UI needs to change.
 *
 * Content types (data) are intentionally kept separate from component props
 * (presentation) so neither can drift into the other.
 */

export type CtaVariant = 'solid' | 'ghost' | 'quiet';

export interface Cta {
  label: string;
  href: string;
  variant?: CtaVariant;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface NavItem extends LinkItem {
  id: string;
}

export type VentureStatus = 'Active' | 'In Development' | 'Concept' | 'Paused';

export interface Venture {
  id: string;
  name: string;
  category: string;
  status: VentureStatus | string;
  year?: string;
  description: string;
  philosophy?: string;
  highlights?: string[];
  image: string;
  url: string;
  ctaLabel?: string;
}

export interface EcosystemBranch {
  id: string;
  name: string;
  index: string;
  tagline: string;
  description: string;
  focus: string[];
  status: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  name: string;
  headline: string;
  description: string;
  deliverables: string[];
  image: string;
}

export interface Principle {
  index?: string;
  name: string;
  statement?: string;
  description: string;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
  icon: string;
}

export interface ContactDetail {
  label: string;
  value: string;
  href: string;
}

/**
 * A single `value` may be a literal string or an `auto:*` token that is
 * resolved against the real content at runtime — this is what keeps the hero
 * figures honest instead of hardcoded.
 */
export interface HeroStat {
  label: string;
  value: string;
}

export interface SiteContent {
  meta: {
    siteName: string;
    siteUrl: string;
    canonical: string;
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogType: string;
    themeColor: string;
    locale: string;
    twitterCard: string;
    robots: string;
  };

  brand: {
    name: string;
    legalName: string;
    category: string;
    tagline: string;
    statement: string;
    shortStatement: string;
    accentWord: string;
  };

  loading: {
    enabled: boolean;
    wordmark: string;
    label: string;
  };

  navigation: {
    links: NavItem[];
    cta: LinkItem;
    menuLabel: string;
    closeLabel: string;
  };

  hero: {
    id: string;
    eyebrow: string;
    headlineLines: string[];
    statement: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    stats: HeroStat[];
    statsNote: string;
    scrollCue: string;
    image: string;
    imageAlt: string;
    visual: {
      label: string;
      reducedMotionFallback: boolean;
    };
  };

  intro: {
    id: string;
    label: string;
    statementLines: string[];
    body: string[];
    principles: Principle[];
  };

  ecosystem: {
    id: string;
    label: string;
    title: string;
    lead: string;
    rootLabel: string;
    rootCaption: string;
    branches: EcosystemBranch[];
    hint: string;
  };

  ventures: {
    id: string;
    label: string;
    title: string;
    lead: string;
    ctaLabel: string;
    unavailableLabel: string;
    dragHint: string;
    items: Venture[];
  };

  featuredVenture: {
    id: string;
    ventureId: string;
    label: string;
    title: string;
    kicker: string;
    statement: string;
    body: string[];
    principles: { name: string; description: string }[];
    cta: LinkItem;
    secondaryCta: LinkItem;
  };

  services: {
    id: string;
    label: string;
    title: string;
    lead: string;
    items: ServiceItem[];
    closingNote: string;
  };

  philosophy: {
    id: string;
    label: string;
    title: string;
    lead: string;
    principles: Principle[];
  };

  about: {
    id: string;
    label: string;
    headlineLines: string[];
    body: string[];
    visionStatement: string;
    pillars: Principle[];
    images: { src: string; alt: string }[];
  };

  vision: {
    id: string;
    label: string;
    headline: string;
    body: string;
    horizons: { name: string; description: string }[];
    note: string;
  };

  contact: {
    id: string;
    label: string;
    headline: string;
    body: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    email: ContactDetail;
    secondary: ContactDetail[];
    responseNote: string;
  };

  socials: SocialLink[];

  footer: {
    statement: string;
    columns: { title: string; links: LinkItem[] }[];
    venturesColumnTitle: string;
    connectColumnTitle: string;
    legal: LinkItem[];
    copyright: string;
    colophon: string;
  };

  settings: {
    smoothScroll: boolean;
    enableHero3D: boolean;
    enableAmbient3D: boolean;
    magneticButtons: boolean;
    respectReducedMotion: boolean;
    imageFadeIn: boolean;
  };
}

/**
 * Resolved shape handed to components: identical to `SiteContent` except that
 * derived values (`auto:*` tokens, resolved venture references) are filled in.
 */
export interface ResolvedContent extends SiteContent {
  hero: SiteContent['hero'] & { stats: { label: string; value: string }[] };
  derived: {
    pillarCount: number;
    ventureCount: number;
    activeVentures: Venture[];
    featuredVenture: Venture | undefined;
  };
}
