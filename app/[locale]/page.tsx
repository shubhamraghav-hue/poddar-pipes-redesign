import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CompanyOverview } from "@/components/home/CompanyOverview";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <CompanyOverview />
      <ProductCategories />
      <WhyChooseUs />
      <IndustriesServed />
      <ManufacturingExcellence />
      <QualityCertifications />
      <Sustainability />
      <LatestBlogs />
      <CTASection />
    </>
  );
}
