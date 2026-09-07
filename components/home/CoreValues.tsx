import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "core values" (node 1150:6484) — five navy discs with white line
 * icons and a caption under each.
 *
 * The heading needs no special handling: Figma draws it at 48px `#4a4a4a`,
 * light "CORE" over bold "VALUES", which is exactly what `SectionHeading`
 * already renders by default for a `title` + `titleAccent` pair.
 *
 * The disc is CSS, not the exported asset. Figma's `Ellipse 7` export is a
 * bare `<circle r="75" fill="#171796">` — a shape, not artwork — and `#171796`
 * is the `ocean-600` token. Only the five ICONS are real artwork and ship as
 * SVGs.
 *
 * Laid out as a responsive grid rather than Figma's absolute coordinates. At
 * the widest container `lg:gap-x-10` plus the 150px cap leaves ~112px between
 * discs, against Figma's 115 — so the desktop rhythm lands without pinning
 * anything to a 1512px frame.
 */

// Each icon is a different shape at a different size, and Figma centres them
// individually rather than to a common box. These are its own numbers, as a
// share of the 150px disc: `w`/`h` from the icon frame, `left`/`top` from its
// offset inside the disc. Note `trust` sits 7px BELOW the disc's centre — the
// handshake is wide and shallow, and that looks to be a deliberate optical
// nudge, so it is reproduced rather than corrected to dead centre.
const VALUES = [
  { id: "quality", icon: "quality.svg", w: 52.292, h: 52.267, left: 24, top: 24 },
  { id: "trust", icon: "trust.svg", w: 67.426, h: 37.908, left: 16, top: 36 },
  { id: "purpose", icon: "purpose.svg", w: 60.172, h: 47.468, left: 20.667, top: 26 },
  { id: "innovation", icon: "innovation.svg", w: 48.788, h: 52.267, left: 25.333, top: 24 },
  { id: "customer", icon: "customer.svg", w: 57.546, h: 57.494, left: 21.333, top: 21.333 },
] as const;

const ICON_DIR = "/home/core-values";

export async function CoreValues() {
  const t = await getTranslations("home");

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-edge">
        <RevealOnScroll>
          <SectionHeading title={t("coreValuesH1")} titleAccent={t("coreValuesH2")} />
        </RevealOnScroll>

        {/* Figma's gap from the heading's baseline to the top of the discs is
            80px. Two columns on the smallest screens rather than five — five
            150px discs need ~1210px and would otherwise shrink to thumbnails
            with unreadable captions. */}
        <RevealOnScroll
          delay={0.08}
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10"
        >
          {VALUES.map((v, i) => (
            <div key={v.id} className="flex flex-col items-center">
              {/* `max-w` is Figma's literal 150px; below that the disc simply
                  tracks the column width, and because the icon is sized in
                  percentages it scales with it. */}
              <div className="relative aspect-square w-full max-w-[150px] rounded-full bg-[#171796]">
                <img
                  src={`${ICON_DIR}/${v.icon}`}
                  alt=""
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    width: `${v.w}%`,
                    height: `${v.h}%`,
                    left: `${v.left}%`,
                    top: `${v.top}%`,
                  }}
                />
              </div>

              {/* 24px semibold `#606060` at Figma's width; the captions are
                  already set in caps there, so the copy is stored in natural
                  case and uppercased here — which also keeps it correct for
                  the Indic locales, where casing is a no-op. */}
              <p className="mt-8 text-center text-base font-semibold uppercase leading-[1.2] text-[#606060] sm:text-lg lg:text-2xl">
                {t(`coreValue${i}` as never)}
              </p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
