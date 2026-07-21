import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
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
      <section className="relative overflow-hidden bg-ink pb-16 pt-40 text-white md:pb-20 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              {t("pageEyebrow")}
            </span>
            <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("pageDesc")}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
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
