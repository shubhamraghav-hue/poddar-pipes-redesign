import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 13:448) — the stat counters that used to live in
 * this section moved into Hero's stats bar, matching the mock's structure:
 * stats belong to the hero, this section is heading + copy + facility photo
 * only. Desktop layout mirrors Figma's proportions (wide heading up top,
 * then description alongside the photo) via a responsive grid rather than
 * literal absolute positioning, which stays intact at every viewport width.
 */
export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    <section className="container-edge py-24 md:py-32">
      <RevealOnScroll>
        <SectionHeading
          eyebrow={t("overviewEyebrow")}
          title={t("overviewH1")}
          titleAccent={t("overviewH2")}
        />
      </RevealOnScroll>

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
        <RevealOnScroll delay={0.08}>
          <p className="max-w-lg text-balance text-base leading-relaxed text-slate-600 md:text-lg">
            {t("overviewDesc")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.14}>
          <div className="group relative aspect-[21/10] w-full overflow-hidden rounded-3xl sm:aspect-square sm:max-w-sm sm:justify-self-end">
            <Image
              src="/home/manufacturing-floor.jpg"
              alt="An engineer inspecting large-diameter pipe on the manufacturing floor"
              fill
              sizes="(min-width: 768px) 384px, 100vw"
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-6">
              <span className="tech-label text-flow-300">{t("overviewFacilityLabel")}</span>
              <p className="mt-2 font-display text-base font-semibold leading-snug text-white">
                {t("overviewFacilityCaption")}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
