import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "Assurances" (node 1032:8548) — the ten quality commitments, numbered
 * 01–10 across two columns.
 *
 * Figma draws the row rules as two exported vectors ("L" and "R", nodes
 * 1034:8592 / 1034:8593). Opened, each is nothing but five 0.5px `#606060`
 * hairlines at 100px intervals — layout, not artwork — so they are real CSS
 * borders here. That keeps them crisp at any width and lets the rows grow
 * when copy wraps, which a fixed-height image could not.
 *
 * Column-major on purpose: `grid-flow-col` + `grid-rows-5` puts 01–05 in the
 * left column and 06–10 in the right, matching Figma, while the single <ol>
 * still reads 01→10 in DOM order and collapses to one ordered column on
 * mobile.
 */

const ASSURANCE_COUNT = 10;

// Figma: rules start 20px left of the numbers, numbers right-align 42px in,
// body copy starts at 66px. Expressed as a 20px inset plus a 22px number
// column and a 24px gutter.
const ROW_INSET = "pl-5";

export async function Assurances() {
  const t = await getTranslations("about");

  const items = Array.from({ length: ASSURANCE_COUNT }, (_, i) =>
    t(`assurance${i}` as never)
  );

  return (
    <section className="bg-[#f5f5f5] py-24 md:pb-[120px] md:pt-[120px]">
      <div className="container-edge">
        <RevealOnScroll className={ROW_INSET}>
          {/* Figma colours these `#606060` / `#171796`. Rendered in the
              sitewide heading grey with a weight-only accent instead — the
              global heading spec was an explicit decision that outranks a
              per-node colour, same call as in LegacyStory. */}
          <SectionHeading title={t("assurancesH1")} titleAccent={t("assurancesH2")} />
        </RevealOnScroll>

        {/* `grid-cols-2` as well as `grid-rows-5`: with `grid-flow-col` alone
            the two tracks size to their content, and column 6–10 (which has
            the longest lines) came out 117px wider than column 1–5. */}
        <ol className="mt-12 md:mt-[60px] md:grid md:grid-flow-col md:grid-cols-2 md:grid-rows-5 md:gap-x-[45px]">
          {items.map((item, i) => (
            // Border and min-height on the SAME element. Split across a
            // wrapper and a child they stack instead of nesting, adding the
            // rule's height to every row and walking the last divider 5px
            // off Figma's 784.
            <li
              key={i}
              className={`grid min-h-[88px] grid-cols-[22px_minmax(0,1fr)] items-center gap-x-6 border-b-[0.5px] border-[#606060] py-4 md:min-h-[100px] ${ROW_INSET}`}
            >
              <span className="text-right text-[18px] font-bold leading-[1.1] text-[#4a4a4a]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[18px] font-normal leading-[1.1] text-[#4a4a4a]">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
