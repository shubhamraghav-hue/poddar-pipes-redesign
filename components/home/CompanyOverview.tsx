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

// Crops off the LEFT, never the right. The drawing is 1.5:1 and the right side
// of the section is nearer 1:1, so `object-cover` always has width to discard;
// pinning to `100% 100%` keeps the building flush to the viewport edge and
// spends the crop on the far end of the pipe run, which the fade has already
// dissolved. Centred, it would shave the building's own edge instead.
const CROP_ANCHOR = "100% 100%";

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
    // `min-h` only where the drawing actually renders, so it has a generous
    // band to fill. Below `lg` the section is content-height, which suits a
    // tablet better than a tall band with nothing in it.
    <section className="relative overflow-hidden py-24 md:py-32 lg:min-h-[660px]">
      {/* Full height of the section and hard to the right viewport edge —
          deliberately outside `container-edge`, which only wraps the copy.
          Removed outright below `lg`, rather than stacked under the copy.

          `lg` and not `md`: at 768 the box is only ~437 wide against a ~788
          tall section, and `object-cover` then throws away three quarters of
          the drawing's width — leaving a hugely zoomed building and no pipe
          run at all. It needs the width to read as a drawing. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] lg:block xl:w-[66%]">
        <Image
          src={BLUEPRINT}
          alt={ALT}
          fill
          sizes="66vw"
          className="object-cover"
          style={{ objectPosition: CROP_ANCHOR }}
        />
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
