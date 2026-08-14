import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, Sun, PackageCheck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InstallationStepper } from "@/components/resources/InstallationStepper";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Solvent-Weld Installation Guide",
  description:
    "Step-by-step solvent-weld installation guide for Poddar uPVC/CPVC pipe and fittings — cutting, deburring, solvent cement application, assembly, handling, storage, and site warnings.",
  alternates: { canonical: "/resources/installation" },
};

const HANDLING_COUNT = 9;
const HOT_WEATHER_COUNT = 7;
const WARNING_COUNT = 8;

export default async function InstallationGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("installation");

  const handling = Array.from({ length: HANDLING_COUNT }, (_, i) => ({
    title: t(`handling${i}Title` as never),
    description: t(`handling${i}Desc` as never),
  }));

  const hotWeatherTips = Array.from({ length: HOT_WEATHER_COUNT }, (_, i) =>
    t(`hotWeatherTip${i}` as never)
  );

  const warnings = Array.from({ length: WARNING_COUNT }, (_, i) =>
    t(`warning${i}` as never)
  );

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
      </section>

      <section className="container-edge py-16 md:py-20">
        <SectionHeading
          eyebrow={t("stepsEyebrow")}
          title={t("stepsH1")}
          titleAccent={t("stepsH2")}
        />
        <div className="mt-10">
          <InstallationStepper />
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="container-edge">
          <SectionHeading
            eyebrow={t("handlingEyebrow")}
            title={t("handlingH1")}
            titleAccent={t("handlingH2")}
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {handling.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-2 rounded-[25px] border border-slate-200/70 bg-white p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                    <PackageCheck className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-1 font-display text-sm font-medium text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
        <SectionHeading
          eyebrow={t("hotWeatherEyebrow")}
          title={t("hotWeatherH1")}
          titleAccent={t("hotWeatherH2")}
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hotWeatherTips.map((tip, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <div className="flex items-start gap-3 rounded-[25px] border border-slate-200/70 bg-white p-5">
                <Sun className="mt-0.5 h-4 w-4 shrink-0 text-[#F28000]" strokeWidth={1.75} />
                <p className="text-sm leading-relaxed text-slate-600">{tip}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="container-edge">
          <SectionHeading
            eyebrow={t("warningsEyebrow")}
            title={t("warningsH1")}
            titleAccent={t("warningsH2")}
          />
          <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {warnings.map((warning, i) => (
              <RevealOnScroll key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3 rounded-[25px] border border-slate-200/70 bg-white p-5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#171796]" strokeWidth={1.75} />
                  <p className="text-sm leading-relaxed text-slate-600">{warning}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
        primaryLabel={t("ctaPrimary")}
        primaryHref="/tools/calculator"
        secondaryLabel={t("ctaSecondary")}
        secondaryHref="/contact"
      />
    </>
  );
}
