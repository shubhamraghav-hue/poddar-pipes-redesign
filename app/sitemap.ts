import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { showcaseCategories } from "@/lib/data/productShowcase";
import { SITE_URL, localizedPath } from "@/lib/seo";

// Every INDEXABLE public route. /products itself is absent: it canonicalises
// to the default range's URL (SEO-003); the six range URLs are added below.
// /products/category/* redirects (next.config.ts).
//
// HIDDEN FROM SEARCH (SEO-004, 2026-10-19) — the pages still work for
// visitors but carry `noindex` (buildPageMetadata's `noindex`) and are left
// out of this list until their content is confirmed and they are linked from
// the site: /industries, /manufacturing, /quality, /sustainability,
// /tools/calculator, and the product-detail pages /products/<product-slug>
// (lib/data/products.ts). To bring one back: drop its `noindex` and add it
// here.
const staticRoutes = [
  "/",
  "/about",
  "/articles",
  "/careers",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms-of-service",
];

// Evaluated once when the module loads (i.e. at build time for the static
// sitemap) rather than `new Date()` per entry per request, so lastModified
// doesn't claim every page changed on every crawl.
const LAST_MODIFIED = new Date();

function absolute(locale: string, path: string) {
  // "/" maps to the bare origin for English and "/hi" for Hindi.
  const p = localizedPath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

function priority(route: string) {
  if (route === "/") return 1;
  if (route === "/privacy-policy" || route === "/terms-of-service") return 0.3;
  if (showcaseCategories.some((c) => route === `/products/${c.id}`)) return 0.9;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rangeRoutes = showcaseCategories.map((c) => `/products/${c.id}`);
  const allRoutes = [...staticRoutes, ...rangeRoutes];

  return routing.locales.flatMap((locale) =>
    allRoutes.map((route) => ({
      url: absolute(locale, route),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: priority(route),
      // hreflang cluster for this URL — every locale plus x-default.
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, absolute(l, route)])),
          "x-default": absolute(routing.defaultLocale, route),
        },
      },
    }))
  );
}
