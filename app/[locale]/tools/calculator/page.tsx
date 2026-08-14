import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PipeCalculator } from "@/components/tools/PipeCalculator";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Pipe & Solvent-Cement Calculator — Agri Gold",
  description:
    "Look up IS 4985 wall thickness, pressure de-rating, and solvent-cement set/cure times for Poddar Agri Gold pressure pipes by size, class, and site temperature.",
  alternates: { canonical: "/tools/calculator" },
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tools");

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. The navbar is transparent with light text until
          the page scrolls ~20px, so it needs *some* dark backdrop behind it
          at rest; this is the smallest one that still does that job, with no
          content of its own. Everything the visitor actually reads sits on
          plain white immediately below. Same pattern as /tools/find-a-plumber
          (see PlumberFinder.tsx) — both are utility tools, not marketing
          pages, so neither needs the site's usual tall dark hero. */}
      <div className="h-20 bg-ink" aria-hidden="true" />

      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("pageEyebrow")}
          title={t("pageH1")}
          titleAccent={t("pageH2")}
          description={t("pageDesc")}
        />
      </section>

      <section className="container-edge pb-16 md:pb-20">
        <PipeCalculator />
      </section>

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
