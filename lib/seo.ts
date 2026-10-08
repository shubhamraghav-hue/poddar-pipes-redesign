import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Explicit opt-in flag rather than inferring from VERCEL_ENV: a staging
// project's own "Production" deployment (e.g. poddar-pipes-test.vercel.app)
// would otherwise report VERCEL_ENV === "production" too. Set
// NEXT_PUBLIC_SITE_ENV=production in the real www.poddarpipes.com Vercel
// project's environment variables when it goes live — every other
// deployment (previews, staging, local) stays noindexed by default.
export function isProductionSite() {
  return process.env.NEXT_PUBLIC_SITE_ENV === "production";
}

// Bracketed content (e.g. "[Street Address]") that hasn't been replaced with
// verified business info yet — see lib/data/offices.ts, team.ts, dealers.ts.
const PLACEHOLDER_PATTERN = /\[[A-Z][A-Za-z ,&/-]*\]|XXXXX/;

export function hasPlaceholder(...values: string[]) {
  return values.some((v) => PLACEHOLDER_PATTERN.test(v));
}

// ---------------------------------------------------------------------------
// Per-locale canonical + hreflang
// ---------------------------------------------------------------------------
// Next merges `alternates` / `openGraph` / `twitter` SHALLOWLY per segment: a
// page that sets `alternates: { canonical }` throws away the layout's
// `languages`, and a page-level `openGraph` drops the layout's (and the
// file-convention opengraph-image's) images. So every page builds the full
// set through `buildPageMetadata` below instead of hand-writing them.
// Locales are derived from i18n/routing.ts — adding a locale there adds its
// hreflang everywhere automatically.

export const SITE_URL = "https://www.poddarpipes.com";
export const SITE_NAME = "Poddar Pipes";

// Open Graph wants language_TERRITORY; the site is India-only.
export const OG_LOCALES: Record<string, string> = { en: "en_IN", hi: "hi_IN" };

/** "/about" → "/about" (en) or "/hi/about"; "/" → "/" or "/hi". */
export function localizedPath(locale: string, path: string) {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

/** Canonical for THIS locale + hreflang for every routed locale + x-default. */
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedPath(l, path)])),
      "x-default": path,
    },
  };
}

// The share card lives at app/[locale]/opengraph-image.tsx. It's referenced
// explicitly (rather than relying on the file convention alone) because a
// page-level `openGraph` would otherwise drop it — see note above. The bare
// "/opengraph-image" path is rewritten by the next-intl proxy to the default
// locale's route, so it resolves without a redirect.
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Poddar Pipes — Engineered for every drop of India's growth",
};

/**
 * Full per-page metadata: title, description, canonical/hreflang, Open Graph
 * and Twitter card, all consistent with each other. `title` goes through the
 * layout's "%s | Poddar Pipes" template; pass `absoluteTitle` for titles that
 * already carry the brand (the homepage).
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const url = localizedPath(locale, path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l] ?? l),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/twitter-image"],
    },
  };
}
