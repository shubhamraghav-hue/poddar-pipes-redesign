import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Droplet, Recycle, Leaf, Zap, HeartHandshake, GraduationCap } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Counter } from "@/components/shared/Counter";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Sustainability & CSR",
  description:
    "Poddar Pipes' approach to water conservation, green manufacturing, recycling, carbon reduction, energy efficiency, and community programs.",
  alternates: { canonical: "/sustainability" },
};

const PILLAR_ICONS = [Droplet, Recycle, Leaf, Zap];
const CSR_ICONS = [HeartHandshake, GraduationCap];

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sustainability");

  const pillars = PILLAR_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`pillar${i}Title` as never),
    description: t(`pillar${i}Desc` as never),
  }));

  const csr = CSR_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`csr${i}Title` as never),
    description: t(`csr${i}Desc` as never),
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
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow={t("pillarsEyebrow")} title={t("pillarsH1")} titleAccent={t("pillarsH2")} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.07}>
              <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-7">
                <p.icon className="h-6 w-6 text-[#171796]" strokeWidth={1.7} />
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading
            eyebrow={t("waterEyebrow")}
            title={t("waterH1")}
            titleAccent={t("waterH2")}
            description={t("waterDesc")}
          />
          <RevealOnScroll className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: 40, suffix: "%", label: t("waterStat0Label") },
              { value: 5, suffix: "-7 yrs", label: t("waterStat1Label") },
              { value: 120, suffix: " mesh", label: t("waterStat2Label") },
              { value: 50, suffix: "+ yrs", label: t("waterStat3Label") },
            ].map((stat) => (
              <div key={stat.label}>
                <Counter value={stat.value} suffix={stat.suffix} className="font-display text-3xl font-medium text-slate-900" />
                <p className="mt-1.5 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow={t("csrEyebrow")} title={t("csrH1")} titleAccent={t("csrH2")} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {csr.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-[25px] border border-slate-200/70 bg-white p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F28000]/10 text-[#F28000]">
                  <c.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-slate-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
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
