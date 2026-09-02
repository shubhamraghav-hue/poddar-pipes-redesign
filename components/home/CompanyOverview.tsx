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

        {/* Square at EVERY width now, where the old photo was letterboxed to
            21:10 while stacked. The artwork is a line drawing pre-cropped to
            its own 1:1, so a square box shows all of it and any other ratio
            would crop the building or the pipe run. Figma's literal square
            from `md` up is unchanged.

            `self-start`, never `self-end`: while the wrapper is still a
            column, `self-end` right-aligns the image and leaves a dead gap —
            that is what broke around 734px. */}
        <RevealOnScroll delay={0.14} className="mx-auto w-full shrink-0 md:w-[331px] md:max-w-none md:self-start">
          {/* `bg-white` is load-bearing, not decoration: the drawing keeps its
              alpha, so without it the card shows whatever the page background
              happens to be. */}
          <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-white">
            <Image
              src="/home/legacy-blueprint.webp"
              alt="Architectural line drawing of a building with its underground water and drainage pipe runs"
              fill
              sizes="(min-width: 768px) 331px, 100vw"
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            {/* Caption sits TOP-left, where the photograph had it bottom-left.
                The drawing's only empty region is its sky; the pipe run is
                along the bottom, so a bottom scrim veiled exactly the part of
                the artwork worth showing on a piping site.

                The scrim is also LIGHT, inverted from the near-black one the
                photograph needed. The linework is `#2061a1`: 6.39:1 on white
                but only 3.00:1 on the old `rgba(9,12,40,…)` navy, so the
                drawing has to sit on paper — which flips the caption from
                white-on-dark to dark-on-light.

                `rgba(255,255,255,0)`, never the `transparent` keyword: Safari
                resolves bare `transparent` to transparent BLACK, which turns
                this fade into a grey smudge. */}
            <div
              className="absolute inset-x-0 top-0 h-1/2"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0))",
              }}
            />
            <div className="absolute left-0 top-0 max-w-[78%] p-5 sm:p-6">
              {/* Ocean, not amber. The Playbook is explicit that orange text
                  on a light surface fails AA (~2.7:1) — the amber here was
                  only legible against the photo's dark scrim. */}
              {/* <span className="tech-label text-[#171796]">{t("overviewFacilityLabel")}</span>
              <p className="mt-2 font-display text-sm font-semibold leading-snug text-[#0b0b52]">
                {t("overviewFacilityCaption")}
              </p> */}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
