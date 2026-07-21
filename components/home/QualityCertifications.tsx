import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { GoldStamp } from "@/components/shared/GoldStamp";
import { Marquee } from "@/components/shared/Marquee";
import { certifications } from "@/lib/data/certifications";

export async function QualityCertifications() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="bg-blue absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-flow-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("qualityEyebrow")}
            title={t("qualityH1")}
            titleAccent={t("qualityH2")}
            description={t("qualityDesc")}
            dark
          />
          <Link
            href="/quality"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-200 transition-colors hover:text-flow-300"
          >
            {t("qualityCta")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <RevealOnScroll className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:justify-start">
          <GoldStamp label="ISI Marked" sublabel="IS 15778 / 13592 / 16098" />
          <GoldStamp label="ISO 9001" sublabel="Quality Management" />
          <GoldStamp label="ISO 14001" sublabel="Environmental Mgmt." />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            <span className="tech-label text-flow-300">{t("qualityBatchLabel")}</span>
            <span className="mt-1.5 block">{t("qualityBatchDesc")}</span>
          </p>
        </RevealOnScroll>

        <div className="mt-12">
          <Marquee speed={40} direction="right" className="py-2">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm"
              >
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-flow-300 sm:h-5 sm:w-5" strokeWidth={1.7} />
                <div>
                  <p className="tech-label whitespace-nowrap text-[0.6rem] text-flow-300 sm:text-[0.72rem]">{c.code}</p>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-slate-300 sm:mt-1 sm:text-sm">{c.name}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
