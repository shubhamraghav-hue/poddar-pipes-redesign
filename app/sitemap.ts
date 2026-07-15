import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { products } from "@/lib/data/products";

const base = "https://www.poddarpipes.com";

const staticRoutes = [
  "",
  "/about",
  "/products",
  "/industries",
  "/manufacturing",
  "/quality",
  "/sustainability",
  "/resources",
  "/resources/installation",
  "/tools/calculator",
  "/careers",
  "/contact",
];

function localePath(locale: string, path: string) {
  return locale === routing.defaultLocale ? `${base}${path}` : `${base}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = products.map((p) => `/products/${p.slug}`);
  const allRoutes = [...staticRoutes, ...productRoutes];

  return routing.locales.flatMap((locale) =>
    allRoutes.map((route) => ({
      url: localePath(locale, route),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : route.startsWith("/products/") ? 0.7 : 0.8,
    }))
  );
}
