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
      {/* Figma places the photo tight against the paragraph's own right
          edge (599px text, then a ~282px gap, then a fixed 331px square —
          not spread across a half-width grid column). A CSS Grid here
          stretched both children to their own full column width first,
          THEN aligned within it, leaving a much larger gap than Figma's
          actual relationship (text/image both narrower than their grid
          tracks). Flex packs them directly against each other instead:
          text is `flex-1` up to Figma's own 599px cap (so it's what
          flexes on medium widths, not the image), image stays a fixed
          331px — Figma's literal size — from `md:` up rather than
          resizing with the viewport. Stacks below `md` (no Figma mobile
          frame to match; full-width image capped at the same 331px). */}
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

        {/* Wide letterboxed crop for the entire stacked range (no Figma
            mobile frame to match — a full 331×331 square reads too tall/
            dominant/cramped below `md`, whether on a narrow phone or a
            734px tablet), switching to Figma's literal 331px square only
            once it actually sits beside the text at `md`. Previously
            switched to a small `max-w-sm` square starting at `sm` —
            per request, that stretched/full-width mobile treatment now
            runs the whole way to `md` instead, centered (`mx-auto` is a
            no-op at `w-full` but keeps this safe if a cap is ever
            reintroduced below `md`).
            No `self-end` before `md`: the outer wrapper is still a
            column (stacked) between `sm` and `md`, and `self-end` there
            means "align to the right edge" — with the image capped
            narrower than the stacked column, that right-aligned it with
            a large dead gap on its left, which is what broke at ~734px.
            `self-start` only starts meaning anything once `md:flex-row`
            actually applies below, where its axis flips to vertical
            (top-align next to the text). */}
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
