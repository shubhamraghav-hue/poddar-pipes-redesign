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
 * LAYOUT AND SIZING both live in the `.cv-*` block in `styles/globals.css`,
 * which carries the full reasoning. In short: one centred flex row set whose
 * only variable is how many items fit per row (5 / 3 / 2 / 1), so the short
 * last row centres itself into a half-pitch stagger, and one length —
 * `--cv-disc` — from which every other dimension is a Figma ratio.
 *
 * Only the per-icon offsets are inline here, because they are per-value data
 * rather than layout.
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

        {/* The `@container` has to sit OUTSIDE `.cv-row`, because the row caps
            its own width and the fluid disc sizes measure the space available
            to it — reading `cqw` off the capped row would be circular. */}
        <RevealOnScroll delay={0.08} className="@container">
          <ul className="cv-row mx-auto flex flex-wrap justify-center">
            {VALUES.map((v, i) => (
              <li key={v.id} className="cv-item flex flex-col items-center">
                <div className="cv-disc relative aspect-square rounded-full bg-[#171796]">
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
                    a narrow item from choosing its own. Each locale splits its
                    own copy; the Indic wording is long enough that an English
                    break point would land mid-phrase. Stored in natural case
                    and uppercased here, which is a no-op for Indic scripts. */}
                <p className="cv-caption text-center font-semibold uppercase leading-[1.2] text-[#606060]">
                  <span className="block">{t(`coreValue${i}A` as never)}</span>
                  <span className="block">{t(`coreValue${i}B` as never)}</span>
                </p>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
