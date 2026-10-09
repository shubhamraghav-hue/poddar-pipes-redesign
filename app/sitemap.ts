import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { products } from "@/lib/data/products";
import { SITE_URL, localizedPath } from "@/lib/seo";

// Every real, public route. /products/category/* is deliberately absent (it
// redirects to /products, see next.config.ts).
const staticRoutes = [
  "/",
  "/about",
  "/products",
  "/industries",
  "/manufacturing",
  "/quality",
  "/sustainability",
  "/resources/installation",
  "/tools/calculator",
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
  if (route.startsWith("/products/")) return 0.7;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = products.map((p) => `/products/${p.slug}`);
  const allRoutes = [...staticRoutes, ...productRoutes];

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
