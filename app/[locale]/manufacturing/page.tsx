import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Factory, Cog, ScanLine, FlaskConical, Warehouse, Truck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Counter } from "@/components/shared/Counter";
import { Facilities } from "@/components/about/Facilities";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Manufacturing Excellence",
  description:
    "Explore Poddar Pipes' manufacturing facilities, automation, testing labs, warehousing, and logistics network across India.",
  alternates: { canonical: "/manufacturing" },
};

const CAPABILITY_ICONS = [Cog, ScanLine, FlaskConical, Warehouse, Truck, Factory];

export default async function ManufacturingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("manufacturing");

  const capabilities = CAPABILITY_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`cap${i}Title` as never),
    description: t(`cap${i}Desc` as never),
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
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

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            {[
              { value: 50000, suffix: "+", label: t("stat0Label") },
              { value: 4, suffix: "+", label: t("stat1Label") },
              { value: 11, suffix: "", label: t("stat2Label") },
              { value: 300, suffix: "+", label: t("stat3Label") },
            ].map((stat) => (
              <div key={stat.label}>
                <Counter value={stat.value} suffix={stat.suffix} className="font-display text-3xl font-medium text-white md:text-4xl" />
                <p className="mt-1.5 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading
          eyebrow={t("capabilitiesEyebrow")}
          title={t("capabilitiesH1")}
          titleAccent={t("capabilitiesH2")}
          description={t("capabilitiesDesc")}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.07}>
              <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                  <c.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <Facilities />

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
      />
    </>
  );
}
