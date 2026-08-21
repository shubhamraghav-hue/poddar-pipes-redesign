import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CompanyOverview } from "@/components/home/CompanyOverview";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionCurve } from "@/components/shared/SectionCurve";
import { ProductCategories } from "@/components/home/ProductCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { IndustriesServed } from "@/components/home/IndustriesServed";
import { ManufacturingExcellence } from "@/components/home/ManufacturingExcellence";
import { QualityCertifications } from "@/components/home/QualityCertifications";
import { Sustainability } from "@/components/home/Sustainability";
import { LatestBlogs } from "@/components/home/LatestBlogs";
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
      <SectionCurve>
        <ProductCategories />
      </SectionCurve>
      <SectionReveal>
        <SectionCurve>
          <CompanyOverview />
        </SectionCurve>
      </SectionReveal>
      <CTASection
        variant="flush"
        primaryLabel={t("ctaPrimaryHome")}
        secondaryLabel={t("ctaSecondaryHome")}
      />

      {/* Old — not part of the current Figma-matched homepage (node 13:309),
          kept rather than deleted in case these sections come back. */}
      {/* <SectionCurve>
        <WhyChooseUs />
      </SectionCurve>
      <SectionCurve>
        <IndustriesServed />
      </SectionCurve>
      <SectionCurve>
        <ManufacturingExcellence />
      </SectionCurve>
      <SectionCurve>
        <QualityCertifications />
      </SectionCurve>
      <SectionCurve>
        <Sustainability />
      </SectionCurve>
      <SectionCurve>
        <LatestBlogs />
      </SectionCurve> */}
    </>
  );
}
