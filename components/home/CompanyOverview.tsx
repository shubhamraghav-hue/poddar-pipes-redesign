import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 13:448) — the homepage's 50-year legacy section.
 * The stat counters belong to Hero's stats bar, per the mock's structure.
 *
 * The drawing fills the whole right side of the section and is faded back
 * under the copy, rather than sitting in a card. It previously used the boxed
 * treatment a photograph needs — rounded corners, a scrim, a hover zoom —
 * which shrank an architectural section drawing into a 331px thumbnail.
 *
 * Anchored right and full height, the service run emerges from beneath the
 * copy and travels right into the building. Pipes carrying on past the frame
 * is the one idea the section is built around, so everything else stays quiet:
 * no card, no radius, no hover state, no scrim.
 */

// Graphite, not blueprint blue. The source ink is a single hue (#2061a1) whose
// line weight lives entirely in the alpha channel, so the RGB was flattened to
// the site's own body grey with alpha untouched — every bit of tonal variation
// survives. Desaturating instead would have mapped the hue to whatever its
// luminance happened to be, with no say in the tone.
const BLUEPRINT = "/home/legacy-blueprint-pencil.webp";

// The "shade", fading the drawing out at BOTH ends. `rgba(255,255,255,0)`
// rather than the `transparent` keyword: Safari resolves bare `transparent`
// to transparent BLACK, which would turn this fade into a grey smudge.
//
// The right-hand stop is not decoration. The drawing's ink runs edge to edge
// — measured bounding box x 0->1535 of 1536, no clear margin either side — so
// now that the box stops short of the viewport edge, its right edge would cut
// the buildings off with a hard vertical line. Figma solves it the same way,
// with a 120px fade over its 911px artwork (the last 13.2%), hence 87%.
//
// The left stop stays much wider than Figma's matching 120px: below ~1500px
// the drawing reaches further under the copy than it does on Figma's 1512
// frame, and a 120px fade would leave it legible behind the paragraph.
const FADE =
  "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.94) 18%, rgba(255,255,255,0) 52%, rgba(255,255,255,0) 87%, #ffffff 100%)";

const ALT =
  "Pencil sketch of a building with its underground water and drainage pipe runs";

export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    // Band height and top padding are the `section.legacy-band` rule in
    // globals.css. The height is not set directly — it is derived from
    // `--legacy-art`, the drawing's width, so the two can only ever move
    // together. Tune the drawing there; this section needs no edits for it.
    // Below `lg` the section is content-height, which suits a tablet better
    // than a tall band with nothing in it.
    <section className="legacy-band relative overflow-hidden py-24 md:py-32">
      {/* Inset from the right and sitting on the band's baseline —
          deliberately outside `container-edge`, which only wraps the copy.
          Removed outright below `lg`, rather than stacked under the copy.

          `lg` and not `md`: at 768 the box is only ~437 wide against a ~788
          tall section, which leaves the drawing far too small to read. It needs
          the width.

          The 4.56% right inset is Figma's 69px on its 1512 frame. The drawing
          does NOT bleed off the viewport edge there — it stops short and fades
          out, which is why the gradient above gained a right-hand stop.

          SIZING RUNS WIDTH-FIRST, and that direction matters. `.legacy-art`
          takes its width from `--legacy-art` in globals.css — the one knob for
          this drawing — and `aspectRatio` derives the height from it; the
          band's `min-height` is then that same height. Set the band height
          instead and the drawing's width becomes a consequence of it, which is
          the wrong way round to tune: you cannot ask for a smaller drawing
          without first working out what band height produces it.

          Because the box is now always exactly the drawing's own ratio, there
          is no crop and no dead space at any size. `object-contain` is kept as
          a guard rather than a fit. */}
      <div
        className="legacy-art pointer-events-none absolute bottom-0 right-[4.56%] hidden lg:block"
        style={{ aspectRatio: "1536 / 1024" }}
      >
        {/* `object-contain`, NOT cover. Cover only crops vertically once the
            box grows wider than the drawing's 1.5:1 — which happens above
            ~1500px — and with the crop anchored to the bottom it took the
            slice off the TOP, cutting the towers: 44px at 1600, ~185px at
            1920. Contain guarantees the whole drawing, towers included, at
            every width; `object-bottom` keeps the pipe run on the section's
            baseline and puts any spare space above, where the drawing is
            empty sky anyway. */}
        <Image src={BLUEPRINT} alt={ALT} fill sizes="72vw" className="object-contain object-bottom" />
        <div className="absolute inset-0" style={{ background: FADE }} />
      </div>

      <div className="container-edge relative">
        {/* Unconstrained below `lg`, where there is no drawing to clear;
            Figma's 599px from `lg` up, which comfortably stops short of where
            the fade still has the artwork at full strength. */}
        <div className="flex flex-col lg:max-w-[599px]">
          <RevealOnScroll>
            {/* Figma node 43:415 has this heading at `#4a4a4a`, which is now
                `SectionHeading`'s sitewide default — so the override is gone
                as redundant, not lost. */}
            <SectionHeading title={t("overviewH1")} titleAccent={t("overviewH2")} />
          </RevealOnScroll>

          {/* 41px under the heading, and `leading-[1.2]` from `lg` up: both
              are Figma's, and together they put the 5-line paragraph at 108px
              so the copy block totals its 403px. 1.2 is tight for a paragraph
              — it is kept to the mock at desktop only, with the comfortable
              1.625 left in place on the narrow widths Figma does not cover. */}
          <RevealOnScroll delay={0.08} className="mt-8 lg:mt-[41px]">
            <p className="text-balance text-base leading-relaxed text-[#606060] md:text-lg lg:leading-[1.2]">
              {t("overviewDesc")}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
