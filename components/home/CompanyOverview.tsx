import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 13:448) — heading, copy and facility photo. The
 * stat counters belong to Hero's stats bar, per the mock's structure.
 * Figma's proportions are matched with a responsive layout rather than its
 * absolute coordinates, so it holds at every viewport width.
 */
export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    <section className="container-edge py-24 md:py-32">
      {/* Flex, not grid: grid stretched both children to their full column
          width before aligning, which opened a much larger gap than Figma's
          actual text-then-photo relationship. Text flexes up to Figma's
          599px cap; the image stays a fixed 331px from `md:` up. */}
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col">
          <RevealOnScroll>
            {/* Figma node 43:415 has this heading at `#4a4a4a`. That grey
                started as a per-section override here and on Categories, and
                is now `SectionHeading`'s sitewide default — so the override
                is gone as redundant, not lost. */}
            <SectionHeading title={t("overviewH1")} titleAccent={t("overviewH2")} />
          </RevealOnScroll>

          <RevealOnScroll delay={0.08} className="mt-8 md:max-w-[599px]">
            <p className="text-balance text-base leading-relaxed text-[#606060] md:text-lg">
              {t("overviewDesc")}
            </p>
          </RevealOnScroll>
        </div>

        {/* Letterboxed while stacked (a 331px square reads too tall and
            cramped below `md`), becoming Figma's literal square only once it
            sits beside the text. `self-start`, never `self-end`: while the
            wrapper is still a column, `self-end` right-aligns the image and
            leaves a dead gap — that is what broke around 734px. */}
        <RevealOnScroll delay={0.14} className="mx-auto w-full shrink-0 md:w-[331px] md:max-w-none md:self-start">
          <div className="group relative aspect-[21/10] w-full overflow-hidden rounded-3xl md:aspect-square">
            <Image
              src="/home/manufacturing-floor.jpg"
              alt="An engineer inspecting large-diameter pipe on the manufacturing floor"
              fill
              sizes="(min-width: 768px) 331px, 100vw"
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            {/* Figma: near-black rgba(9,12,40, 0→0.92), not ink/95 (#14134f-
                based — visibly more purple/lighter than the source). */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,12,40,0.92)] via-[rgba(9,12,40,0.3)] to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-6">
              {/* Figma: #f28000 (= amber-600 token), not flow-300. */}
              <span className="tech-label text-amber-600">{t("overviewFacilityLabel")}</span>
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
