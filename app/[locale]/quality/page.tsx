import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, TestTube2, BookMarked, Lightbulb } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { certifications } from "@/lib/data/certifications";
import { CTASection } from "@/components/home/CTASection";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // English title/description are the page's own copy. There are no
  // per-page meta keys in messages/*.json yet, so other locales reuse the
  // page's translated nav label as the title; the description stays English.
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/quality",
    title: locale === "en" ? "Quality Assurance & Standards" : t("nav.navQualityAssurance"),
    description: "Poddar Pipes' quality policy, testing procedures, the Indian Standards our products are designed to, and our R&D approach.",
  });
}

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

  // Keyed by id, not array position: entries c4/c5 (ISO 9001/14001) were
  // removed from the data, so id "cN" maps to message keys cert{N-1}*.
  const certNames = certifications.map((c) => {
    const n = Number(c.id.slice(1)) - 1;
    return {
      name: t(`cert${n}Name` as never),
      desc: t(`cert${n}Desc` as never),
    };
  });

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero; the same strip opens every inner page that has no
          hero of its own. */}
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
            eyebrow={t("certEyebrow")}
            title={t("certH1")}
            titleAccent={t("certH2")}
            description={t("certDesc")}
          />

          {/* The ISI / ISO 9001 / ISO 14001 GoldStamp seals were removed: the
              company holds no certifications (client, Oct 2026), and a seal
              reads as a certification claim. */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <RevealOnScroll key={c.id} delay={i * 0.06}>
                <div className="flex items-center justify-between gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#171796]">{c.code}</p>
                    <h4 className="mt-1 font-display text-base font-medium text-slate-900">{certNames[i].name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{certNames[i].desc}</p>
                  </div>
                  {/* No certificate download: the company holds no
                      certifications, so <CertDownloadButton> must not be
                      used here unless that changes. */}
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
