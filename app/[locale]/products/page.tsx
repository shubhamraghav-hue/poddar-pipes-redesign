import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { CTASection } from "@/components/home/CTASection";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // English title/description are the page's own copy. There are no
  // per-page meta keys in messages/*.json yet, so other locales reuse the
  // page's translated nav label as the title; the description stays English.
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/products",
    title: locale === "en" ? "Products — uPVC, CPVC, SWR, TANKS, UGD & Agriculture" : t("nav.products"),
    description: "Browse Poddar Pipes' complete range of uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems and water storage solutions.",
  });
}

/**
 * Figma "product pages" (node 1530:7102): the category showcase, then the
 * flush "start a conversation" band — the same CTA as the homepage (its
 * title and copy defaults ARE this mock's copy, already translated; the two
 * button labels are the homepage's "Start a Conversation" / "Download
 * Catalogue", as the mock has them).
 *
 * `?category=` picks the card (default CPVC, the mock's first frame) and `?q=`
 * pre-fills the search, which keeps the WebSite SearchAction URL
 * (`/products?q=…`, see the locale layout) working.
 *
 * The old product grid, Industries section and brochure block are not in the
 * mock and are gone from this page. The category detail pages are switched
 * off for now (redirected here — see next.config.ts); product detail pages
 * (/products/<slug>) remain.
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
  const tHome = await getTranslations("home");

  return (
    <>
      <ProductShowcase initialCategory={category} initialQuery={q ?? ""} />
      <CTASection
        variant="flush"
        primaryLabel={tHome("ctaPrimaryHome")}
        secondaryLabel={tHome("ctaSecondaryHome")}
      />
    </>
  );
}
