import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductsRangePage } from "@/components/products/ProductsRangePage";
import { showcaseCategories } from "@/lib/data/productShowcase";
import { buildPageMetadata, localizedPath } from "@/lib/seo";
import { hasOverlays } from "@/lib/i18n/localize";
import { productShowcaseHi } from "@/lib/data/hi/productShowcase";

// The default range — what /products shows. Its own URL is the canonical.
const DEFAULT_RANGE = showcaseCategories[0];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = { ...DEFAULT_RANGE, ...(hasOverlays(locale) ? productShowcaseHi[DEFAULT_RANGE.id] : undefined) };
  // SEO-003 (approved 2026-10-19, option 1A): /products stays as it is for
  // visitors (the navbar's "Products" link) but shows exactly the default
  // range, so it declares that range's URL canonical instead of competing
  // with it. Not in the sitemap.
  return buildPageMetadata({
    locale,
    path: `/products/${DEFAULT_RANGE.id}`,
    title: DEFAULT_RANGE.metaTitle,
    description: seo.metaDescription,
  });
}

/**
 * Figma "CPVC Products Page" (1979:32767): the dark hero, the range showcase
 * and the flush "start a conversation" band, via ProductsRangePage — the same
 * body the range URLs (/products/<range-id>, see ./[slug]/page.tsx) render.
 *
 * `?category=<id>` is the old way of addressing a range. It now answers a 308
 * to that range's own URL (keeping `?q=`), so old links, bookmarks and shared
 * URLs land on the indexable page. `?q=` alone (the search box) still renders
 * here.
 */
export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  setRequestLocale(locale);

  if (category && showcaseCategories.some((c) => c.id === category)) {
    const target = localizedPath(locale, `/products/${category}`);
    permanentRedirect(q ? `${target}?q=${encodeURIComponent(q)}` : target);
  }

  return <ProductsRangePage category={category} query={q ?? ""} />;
}
