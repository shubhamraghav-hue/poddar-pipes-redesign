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

// The "shade". `rgba(255,255,255,0)` rather than the `transparent` keyword:
// Safari resolves bare `transparent` to transparent BLACK, which would turn
// this fade into a grey smudge.
const FADE_UNDER_COPY =
  "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.94) 18%, rgba(255,255,255,0) 52%)";

const ALT =
  "Pencil sketch of a building with its underground water and drainage pipe runs";

export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    // `min-h` only where the drawing actually renders. It steps up at `xl` so
    // the band's proportions stay close to the drawing's own 1.5:1 — the
    // closer those match, the less dead space `object-contain` leaves. Below
    // `lg` the section is content-height, which suits a tablet better than a
    // tall band with nothing in it.
    // The `2xl` step matters: the box width is derived from the band's height,
    // so without it the drawing stops growing at 990px and shrinks to a
    // half-width detail on a large monitor.
    <section className="relative overflow-hidden py-24 md:py-32 lg:min-h-[560px] xl:min-h-[660px] 2xl:min-h-[760px]">
      {/* Hard to the right viewport edge and as tall as the section allows —
          deliberately outside `container-edge`, which only wraps the copy.
          Removed outright below `lg`, rather than stacked under the copy.

          `lg` and not `md`: at 768 the box is only ~437 wide against a ~788
          tall section, which leaves the drawing far too small to read. It needs
          the width.

          Sizing: height comes from the section, `aspectRatio` derives the
          width from it, and `max-w` caps how far left it may reach. Where the
          cap does not bind, the box matches the drawing's ratio exactly and it
          fills the band edge to edge with no crop and no dead space — that
          happens from about 1375px up. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 hidden max-w-[66%] lg:block xl:max-w-[72%]"
        style={{ height: "100%", aspectRatio: "1536 / 1024" }}
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
        <div className="absolute inset-0" style={{ background: FADE_UNDER_COPY }} />
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

          <RevealOnScroll delay={0.08} className="mt-8">
            <p className="text-balance text-base leading-relaxed text-[#606060] md:text-lg">
              {t("overviewDesc")}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
