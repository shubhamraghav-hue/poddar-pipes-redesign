import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/lib/data/products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Breadcrumbs, getBreadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { CTASection } from "@/components/home/CTASection";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { showcaseCategories } from "@/lib/data/productShowcase";
import { ProductsRangePage } from "@/components/products/ProductsRangePage";

/**
 * Two kinds of URL share this segment:
 *   /products/<range-id>  a product RANGE (cpvc-pipes, upvc-pipes, swr-pipes,
 *                         agricultural-pipes, ugd-pipes, tanks) — the
 *                         products page with that range selected, on its own
 *                         self-canonical URL (SEO-003, 2026-10-19). Replaces
 *                         /products?category=<id>, which now 308s here.
 *   /products/<slug>      a single product's detail page (lib/data/products.ts).
 * Range ids and product slugs never overlap (products are "poddar-…" etc.).
 */
const rangeFor = (slug: string) => showcaseCategories.find((c) => c.id === slug);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    ...showcaseCategories.map((c) => ({ locale, slug: c.id })),
    ...products.map((p) => ({ locale, slug: p.slug })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const range = rangeFor(slug);
  if (range) {
    return buildPageMetadata({
      locale,
      path: `/products/${range.id}`,
      title: range.metaTitle,
      description: range.metaDescription,
    });
  }
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  // Product names/descriptions live in lib/data/products.ts (English only),
  // so every locale uses them; canonical/hreflang are per-locale.
  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: product.name,
    description: product.shortDescription,
    // SEO-004 (2026-10-19): the older product-detail pages predate the range
    // pages and partly conflict with them, and nothing links here — out of
    // search and the sitemap until reconciled. The range URLs are the
    // indexable product pages.
    noindex: true,
  });
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const range = rangeFor(slug);
  if (range) {
    const { q } = await searchParams;
    return <ProductsRangePage category={range.id} query={q ?? ""} />;
  }
  const t = await getTranslations("products");
  const nav = await getTranslations("nav");

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.categoryLabel,
    brand: { "@type": "Brand", name: "Poddar Pipes" },
    additionalProperty: product.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
  };

  const breadcrumbItems = [
    { label: nav("products"), href: "/products" },
    { label: product.categoryLabel, href: `/products/${product.category}` },
    { label: product.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema(breadcrumbItems)) }}
      />
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero; the same strip opens every inner page that has no
          hero of its own. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <div className="container-figma pb-4 pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <ProductDetail product={product} />
      <RelatedProducts current={product} />
      <CTASection
        eyebrow={t("ctaBulkEyebrow")}
        title={t("ctaBulkTitle")}
        description={t("ctaBulkDesc")}
      />
    </>
  );
}
