import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import { industries } from "@/lib/data/industries";
import { products } from "@/lib/data/products";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Poddar Pipes serves residential, commercial, industrial, agricultural, infrastructure, irrigation, water supply, construction, and government projects.",
  alternates: { canonical: "/industries" },
};

function toTranslationKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <div className="mb-5 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002" stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">{t("heroEyebrow")}</span>
            </div>
            <h1 className="max-w-3xl font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              <span className="block">{t("heroLine1")}</span>
              <span className="block text-amber-500">{t("heroLine2")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const key = toTranslationKey(industry.id);
            return (
              <RevealOnScroll key={industry.id} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-[25px] border border-slate-200/70 bg-white p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                    <industry.icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium text-slate-900">
                    {t(`${key}_name` as never)}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                    {t(`${key}_desc` as never)}
                  </p>
                  <Link
                    href="/products"
                    className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
                  >
                    <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      {t("relevantProducts")}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading
            eyebrow={t("coverageEyebrow")}
            title={t("coverageH1")}
            titleAccent={t("coverageH2")}
          />
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-[25px] border border-slate-200/70 bg-white px-5 py-4">
                <span className="text-sm font-medium text-slate-800">{p.name}</span>
                <span className="text-xs text-slate-500">{p.applications[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
      />
    </>
  );
}
