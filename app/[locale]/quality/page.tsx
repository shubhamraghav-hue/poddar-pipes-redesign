import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, TestTube2, BookMarked, Lightbulb } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GoldStamp } from "@/components/shared/GoldStamp";
import { certifications } from "@/lib/data/certifications";
import { CTASection } from "@/components/home/CTASection";
import { CertDownloadButton } from "@/components/shared/CertDownloadButton";

export const metadata: Metadata = {
  title: "Quality Assurance & Certifications",
  description:
    "Poddar Pipes' quality policy, testing procedures, Indian Standards compliance, R&D approach, and product certifications.",
  alternates: { canonical: "/quality" },
};

const PILLAR_ICONS = [ShieldCheck, TestTube2, BookMarked, Lightbulb];

export default async function QualityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quality");

  const pillars = PILLAR_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`pillar${i}Title` as never),
    description: t(`pillar${i}Desc` as never),
  }));

  const certNames = certifications.map((_, i) => ({
    name: t(`cert${i}Name` as never),
    desc: t(`cert${i}Desc` as never),
  }));

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
              <span className="block text-[#E0AF40]">{t("heroLine2")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
        </div>
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
            eyebrow={t("certEyebrow")}
            title={t("certH1")}
            titleAccent={t("certH2")}
            description={t("certDesc")}
          />

          <RevealOnScroll className="mt-14 flex flex-wrap gap-8">
            <GoldStamp label="ISI Marked" sublabel="IS 15778 / 13592 / 16098" />
            <GoldStamp label="ISO 9001" sublabel="Quality Management" />
            <GoldStamp label="ISO 14001" sublabel="Environmental Mgmt." />
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <RevealOnScroll key={c.id} delay={i * 0.06}>
                <div className="flex items-center justify-between gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#171796]">{c.code}</p>
                    <h4 className="mt-1 font-display text-base font-medium text-slate-900">{certNames[i].name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{certNames[i].desc}</p>
                  </div>
                  <CertDownloadButton code={c.code} name={certNames[i].name} />
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
      />
    </>
  );
}
