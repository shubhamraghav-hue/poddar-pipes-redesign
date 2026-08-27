import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CompanyOverview } from "@/components/home/CompanyOverview";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { ProductCategories } from "@/components/home/ProductCategories";
import { LegacyStory } from "@/components/home/LegacyStory";
import { CTASection } from "@/components/home/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    alternates: { canonical: "/" },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* Order matches the Figma landing page (node 13:309) exactly:
          Hero (+ stats) -> Categories -> Legacy -> CTA. Everything below
          that isn't in that mock is commented out, not deleted — see the
          block at the bottom of this file. */}
      <Hero />
      <SectionReveal>
        <CompanyOverview />
      </SectionReveal>
      <ProductCategories />
      {/* PREVIEW PLACEMENT — Figma node 51:488. Dropped in below the six
          categories so it can be reviewed in context; its final position in
          the page order has not been decided. */}
      <LegacyStory />
      <CTASection
        variant="flush"
        primaryLabel={t("ctaPrimaryHome")}
        secondaryLabel={t("ctaSecondaryHome")}
      />

      {/* Old — not part of the current Figma-matched homepage (node 13:309),
          not rendered, and their imports were removed (lint flags unused
          imports as errors, and a commented-out JSX reference doesn't count
          as real usage) — re-add these imports if reviving:
          WhyChooseUs (@/components/home/WhyChooseUs),
          IndustriesServed (@/components/home/IndustriesServed),
          ManufacturingExcellence (@/components/home/ManufacturingExcellence),
          QualityCertifications (@/components/home/QualityCertifications),
          Sustainability (@/components/home/Sustainability),
          LatestBlogs (@/components/home/LatestBlogs).
          No longer wrapped in `SectionCurve` either — that scroll-driven
          curved-edge effect was removed sitewide (Aug 2026, explicit
          request); if revived, these render as plain sections like
          everything else on the page now does. */}
      {/* <WhyChooseUs />
      <IndustriesServed />
      <ManufacturingExcellence />
      <QualityCertifications />
      <Sustainability />
      <LatestBlogs /> */}
    </>
  );
}
