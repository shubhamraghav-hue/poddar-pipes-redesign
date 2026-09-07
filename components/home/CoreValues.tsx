import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "core values" (node 1150:6484) — five navy discs with white line
 * icons and a two-line caption under each.
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
 * SIZING. Every dimension is a ratio of the disc diameter, which is the one
 * number that changes per breakpoint: `--cv-disc`, set by the `.cv-scale`
 * ladder in `styles/globals.css`. Figma draws a 150px disc with a 24px
 * caption 32px below it, so those are the 0.16 and 0.2133 factors here, and
 * a 150px disc reproduces Figma exactly.
 *
 * The five-across band is FLUID rather than stepped, because Figma's own
 * proportions cannot survive a narrow window: the widest caption line
 * ("DEFINING INDUSTRY") is 8.644em, so at Figma's 24px five of them plus
 * gutters need ~1200px of content — more than a 1024px screen has. Rather
 * than let that caption spill to a third line, the disc tracks the grid cell
 * (via `cqw`) and tops out at Figma's 150px, reached at about 1392px.
 *
 * Five-across starts at `lg` so the row matches Figma as early as possible,
 * which costs a step DOWN in size at 1024 — five columns in 944px of content
 * are narrower than three, so the type shrinks to hold two lines. Chosen
 * deliberately over keeping three columns at a larger size.
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
            80px, scaled down with everything else. One column at and below
            425px, then 2 / 3 / 5 — five 150px discs and their captions need
            ~1200px of content and would otherwise shrink to thumbnails.
            The single column is a `max-` variant rather than the base with
            `min-[426px]:` above it, because an arbitrary `min-` variant would
            sort ahead of `sm:` and never win. */}
        <RevealOnScroll
          delay={0.08}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 max-[425px]:grid-cols-1 sm:mt-16 sm:grid-cols-3 sm:gap-y-10 md:gap-x-10 lg:mt-20 lg:grid-cols-5 lg:gap-y-12"
        >
          {VALUES.map((v, i) => (
            // The container is the grid cell; `.cv-scale` sits on the child so
            // its `cqw` resolves against the cell rather than against the
            // cell's own parent.
            <div key={v.id} className="@container">
              <div className="cv-scale flex w-full flex-col items-center">
                <div
                  className="relative aspect-square rounded-full bg-[#171796]"
                  style={{ width: "var(--cv-disc)" }}
                >
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

                {/* Figma sets every caption on exactly two lines, so the two
                    lines are stored as separate keys and emitted as separate
                    blocks — that pins the break where Figma puts it and stops
                    a narrow cell from choosing its own. Each locale splits its
                    own copy; the Indic wording is long enough that an English
                    break point would land mid-phrase. Stored in natural case
                    and uppercased here, which is a no-op for Indic scripts.
                    24px semibold `#606060`, 32px under the disc. */}
                <p
                  className="text-center font-semibold uppercase leading-[1.2] text-[#606060]"
                  style={{
                    marginTop: "calc(var(--cv-disc) * 0.2133)",
                    fontSize: "calc(var(--cv-disc) * 0.16)",
                  }}
                >
                  <span className="block">{t(`coreValue${i}A` as never)}</span>
                  <span className="block">{t(`coreValue${i}B` as never)}</span>
                </p>
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
