import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductsHero } from "@/components/products/ProductsHero";
import { ProductFilterGrid } from "@/components/products/ProductFilterGrid";
import { IndustriesGrid } from "@/components/products/IndustriesGrid";
import { BrochureDownload } from "@/components/products/BrochureDownload";
import { CTASection } from "@/components/home/CTASection";
import { productCategories } from "@/lib/data/products";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Products — uPVC, CPVC, SWR, TANKS, UGD & Agriculture",
  description:
    "Browse Poddar Pipes' complete range of uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems and water storage solutions.",
  alternates: { canonical: "/products" },
};

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
  const t = await getTranslations("products");

  const initialCategory =
    (productCategories.find((c) => c.id === category)?.id as Product["category"] | "all" | undefined) ??
    "all";

  return (
    <>
      <ProductsHero />
      <ProductFilterGrid initialCategory={initialCategory} initialQuery={q ?? ""} />
      <IndustriesGrid />
      <BrochureDownload />
      <CTASection
        eyebrow={t("ctaCustomEyebrow")}
        title={t("ctaCustomTitle")}
        description={t("ctaCustomDesc")}
      />
    </>
  );
}
