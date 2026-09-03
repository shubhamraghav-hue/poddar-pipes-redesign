import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 13:448) — the homepage's 50-year legacy section.
 * The stat counters belong to Hero's stats bar, per the mock's structure.
 *
 * The artwork is handled the way the About hero handles its backdrop: the
 * drawing BLEEDS to the viewport edge and is faded back under the copy with a
 * gradient, rather than sitting in a card. It previously used the boxed
 * treatment a photograph needs — rounded corners, a scrim, a hover zoom — and
 * that shrank an architectural section drawing into a 331px thumbnail, cropped
 * so the building filled it and the buried pipe run barely read.
 *
 * The full 1536x1024 drawing is used here, not the square crop the card
 * needed. Anchored bottom-right, the service run emerges from beneath the copy,
 * travels right into the building, and meets the section's bottom edge — where
 * the product categories band begins. Pipes carrying on past the frame is the
 * one idea this section is built around, so everything else stays quiet: no
 * card, no radius, no hover state, no scrim.
 */

// Alpha-transparent line drawing, so it composes straight onto the page.
const BLUEPRINT = "/home/legacy-blueprint-wide.webp";

// The "shade". `rgba(255,255,255,0)` rather than the `transparent` keyword:
// Safari resolves bare `transparent` to transparent BLACK, which would turn
// this fade into a grey smudge.
const FADE_UNDER_COPY =
  "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.92) 20%, rgba(255,255,255,0) 56%)";
const FADE_UNDER_COPY_MOBILE =
  "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 12%, rgba(255,255,255,0) 45%)";

const ALT =
  "Architectural section drawing of a building with its underground water and drainage pipe runs";

export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    // `min-h` from `md` up so the drawing has room to stand at full height.
    // Without it the section is only as tall as its copy, and anchoring the
    // drawing to the bottom pushed the tower up past the top edge, where
    // `overflow-hidden` cut it off.
    <section className="relative overflow-hidden py-24 md:min-h-[620px] md:py-32">
      {/* Bleeds to the right viewport edge — deliberately outside
          `container-edge`, which only wraps the copy below. Height-driven, not
          width-driven, so it always fits the section vertically and the
          aspect ratio decides how far left it reaches. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 hidden md:block"
        // `aspectRatio` is what gives this box a WIDTH at all — the image
        // inside is `fill`, so it contributes none, and the box would collapse
        // without it.
        //
        // `maxWidth` is a guard, not decoration. Height-driven alone the box is
        // 1.5x the section height — ~818px against a 620px section — which is
        // wider than the viewport itself between `md` and ~1100px, and it then
        // laid un-faded linework under the copy. When the cap binds the box
        // simply goes off-ratio (aspect-ratio only supplies a missing
        // dimension; it will not shrink a specified height), and
        // `object-contain object-bottom` letterboxes the drawing to the bottom
        // of it. That degrades gracefully: the extra space is transparent, and
        // the drawing still sits on the section's baseline.
        style={{ height: "88%", maxWidth: "58%", aspectRatio: "1536 / 1024" }}
      >
        <Image src={BLUEPRINT} alt={ALT} fill sizes="60vw" className="object-contain object-bottom" />
        <div className="absolute inset-0" style={{ background: FADE_UNDER_COPY }} />
      </div>

      <div className="container-edge relative">
        {/* Narrower between `md` and `lg` so the copy stops short of where the
            drawing is still at full strength — Figma's 599px only has room to
            clear the fade once the viewport is wide enough. */}
        <div className="flex flex-col md:max-w-[48%] lg:max-w-[599px]">
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

      {/* Below `md` the drawing runs full-bleed under the copy instead of
          beside it, faded from the top so it reads as ground the text sits on.
          Sized by width here, since there is no side-by-side to fit into. */}
      <div className="relative mt-10 md:hidden">
        <div className="relative aspect-[1536/1024] w-full">
          <Image src={BLUEPRINT} alt={ALT} fill sizes="100vw" className="object-contain object-bottom" />
          <div className="absolute inset-0" style={{ background: FADE_UNDER_COPY_MOBILE }} />
        </div>
      </div>
    </section>
  );
}
