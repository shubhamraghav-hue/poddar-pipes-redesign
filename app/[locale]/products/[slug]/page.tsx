import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/lib/data/products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Breadcrumbs, getBreadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { CTASection } from "@/components/home/CTASection";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Poddar Pipes`,
      description: product.shortDescription,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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
    { label: product.categoryLabel, href: `/products?category=${product.category}` },
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
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <div className="container-edge pb-4 pt-6">
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
