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

        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-slate-200 pt-10 md:grid-cols-4">
          {[
            { value: 50000, suffix: "+", label: t("stat0Label") },
            { value: 4, suffix: "+", label: t("stat1Label") },
            { value: 11, suffix: "", label: t("stat2Label") },
            { value: 300, suffix: "+", label: t("stat3Label") },
          ].map((stat) => (
            <div key={stat.label}>
              <Counter value={stat.value} suffix={stat.suffix} className="font-display text-3xl font-medium text-slate-900 md:text-4xl" />
              <p className="mt-1.5 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
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
