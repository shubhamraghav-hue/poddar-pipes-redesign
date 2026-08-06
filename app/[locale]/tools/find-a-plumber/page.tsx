import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlumberFinder } from "@/components/tools/PlumberFinder";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Find My Plumber — Poddar Pipes",
  description:
    "Search by pincode to find plumbers near you who work with Poddar Pipes products.",
  alternates: { canonical: "/tools/find-a-plumber" },
};
// 
export default async function FindPlumberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("findPlumber");

  return (
    <>
      <PlumberFinder />

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
        primaryLabel={t("ctaPrimary")}
        primaryHref="/contact"
        secondaryLabel={t("ctaSecondary")}
        secondaryHref="/products"
      />
    </>
  );
}
