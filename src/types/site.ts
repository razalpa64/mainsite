/**
 * Type contract for the Invytra parent-company content layer.
 *
 * Invytra is positioned as ONE parent brand over three distinct businesses —
 * Learning (LEARN), Projects (CREATE) and Events (CELEBRATE). A future backend
 * only needs to return this shape.
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

export type Pillar = 'Learn' | 'Create' | 'Celebrate';

export interface Business {
  id: string;
  pillar: Pillar;
  name: string;
  category: string;
  positioning: string;
  description: string;
  points: string[];
  image: string;
  ctaLabel: string;
}

export interface Review {
  quote: string;
  name: string;
  role: string;
  business: string;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export interface ContactDetail {
  label: string;
  value: string;
  href: string;
}

export interface SiteContent {
  meta: {
    siteName: string;
    siteUrl: string;
    canonical: string;
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    themeColor: string;
    locale: string;
    robots: string;
  };

  brand: {
    name: string;
    legalName: string;
    tagline: string;
    pillars: Pillar[];
    statement: string;
    shortStatement: string;
  };

  loading: { enabled: boolean; wordmark: string; label: string };

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
    image: string;
    imageAlt: string;
    scrollCue: string;
  };

  intro: {
    id: string;
    label: string;
    statementLines: string[];
    body: string[];
  };

  businesses: {
    id: string;
    label: string;
    title: string;
    lead: string;
    items: Business[];
  };

  reviews: {
    id: string;
    label: string;
    title: string;
    lead: string;
    items: Review[];
  };

  about: {
    id: string;
    label: string;
    headlineLines: string[];
    body: string[];
    visionStatement: string;
  };

  vision: {
    id: string;
    label: string;
    headline: string;
    body: string;
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
    exploreTitle: string;
    explore: LinkItem[];
    businessesTitle: string;
    connectTitle: string;
    legal: LinkItem[];
    copyright: string;
    colophon: string;
  };

  settings: {
    smoothScroll: boolean;
    magneticButtons: boolean;
    respectReducedMotion: boolean;
  };
}

export interface ResolvedContent extends SiteContent {
  derived: {
    businessCount: number;
    pillarMap: Record<Pillar, Business | undefined>;
  };
}
