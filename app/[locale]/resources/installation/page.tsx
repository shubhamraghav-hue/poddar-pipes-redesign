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
      <section className="relative overflow-hidden bg-ink pb-16 pt-40 text-white md:pb-20 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <div className="mb-5 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002" stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">{t("heroEyebrow")}</span>
            </div>
            <h1 className="max-w-2xl font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              <span className="block">{t("heroLine1")}</span>
              <span className="block text-[#E0AF40]">{t("heroLine2")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
        </div>
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
