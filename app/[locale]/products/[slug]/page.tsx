import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
    { label: "Products", href: "/products" },
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
      <div className="bg-ink pt-24">
        <div className="container-edge pb-4 pt-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <ProductDetail product={product} />
      <RelatedProducts current={product} />
      <CTASection
        eyebrow="Need bulk pricing?"
        title="Get a project quote for large-volume orders."
        description="Share your quantity, delivery location, and timeline — our sales team will respond within one business day."
      />
    </>
  );
}
