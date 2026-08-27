import Image from "next/image";

/**
 * Figma "legacy section" (node 51:488) — the milestone timeline that runs
 * along a stepped CPVC pipe.
 *
 * LAYOUT APPROACH: this one is a literal, absolutely-positioned
 * reproduction, which is a deliberate departure from `CompanyOverview`
 * (the other Legacy block), where a responsive grid was chosen over Figma's
 * absolute coordinates on purpose. Here the copy is pinned to specific
 * elbows of a single background illustration, so the text and the artwork
 * cannot be allowed to reflow independently — the relationship IS the
 * design. Exact placement was also explicitly requested.
 *
 * HOW THE NUMBERS WORK: the Figma frame is 1512×1350. The wrapper is an
 * `@container` locked to that aspect ratio, and every value below is that
 * frame's own pixel measurement expressed against it —
 *   x / 1512 * 100  → left %          y / 1350 * 100 → top %
 *   px / 1512 * 100 → `cqw` font size
 * so the entire composition scales as one unit and stays pixel-faithful to
 * the mock at any width. This is the same technique the Hero stat cards
 * already use (`% = value / 281.5`), just against a different box.
 *
 * NO MOBILE FRAME EXISTS for this node. Because everything scales with the
 * container, the type shrinks with it — around 18px body copy at the design
 * width, but proportionally smaller on a phone. A dedicated small-screen
 * treatment needs a design, not a guess, so none is invented here.
 *
 * Copy is inlined rather than pulled from `next-intl`. This is a preview
 * build and the project carries ELEVEN locale files; adding keys means
 * either real translations for all of them or ten placeholder rows. Wire
 * these strings up to `home.*` keys before this ships.
 */

// Figma exports the artwork as three separate layers, kept as three files so
// the mask stays independent of the pipe render.
const GOLD_BG = "/legacy/legacy-gold-bg.png";
const PIPES = "/legacy/legacy-pipes.png";
const PIPES_MASK = "/legacy/legacy-pipes-mask.svg";

// Figma's literal hexes, not the nearest token.
const AMBER = "#f28000";
const BODY_GREY = "#4a4a4a";
// The heading is the ONE deliberate departure from this node's Figma spec,
// which draws it in `#0b0b52` navy. `#4a4a4a` grey is the sitewide section
// heading colour (see `SectionHeading`, where it is the default), and matching
// it was an explicit request that outranks the per-node value. Revert to
// `#0b0b52` here if this section is ever meant to stand apart again.
const HEADING = BODY_GREY;

type Milestone = {
  year: string;
  /**
   * Which way the block reads from its anchor. Figma alternates them down
   * the pipe: `end` blocks are right-aligned and finish at the anchor
   * (`-translate-x-full`), `start` blocks run rightward from it.
   */
  align: "start" | "end";
  /** % of frame width — shared by the year, the label and the description. */
  left: number;
  yearTop: number;
  descTop: number;
  /** % of frame width. Figma sets these individually; they drive the wrap. */
  descWidth: number;
  /** One entry per paragraph Figma draws, so hard breaks are preserved. */
  desc: string[];
  /** 2026 alone carries a bold lead-in above its description. */
  label?: string;
  labelTop?: number;
};

const MILESTONES: Milestone[] = [
  {
    year: "1975",
    align: "start",
    left: 32.0106,
    yearTop: 76.2963,
    descTop: 80.4444,
    descWidth: 14.2196,
    // "Banglore" is Figma's own spelling (node 51:504). Reproduced verbatim
    // per "to the letter" — flag to the designer rather than silently fixing.
    desc: ["Poddar Family is founded in Patna, beginning its journey in pipe manufacturing"],
  },
  {
    year: "1998",
    align: "end",
    left: 35.1852,
    yearTop: 54.6667,
    descTop: 58.8148,
    descWidth: 7.0767,
    desc: ["Established operations in Banglore"],
  },
  {
    year: "2014",
    align: "start",
    left: 48.2143,
    yearTop: 58.5185,
    descTop: 61.9259,
    descWidth: 9.9868,
    desc: ["Achieved global leadership in CPVC pipe manufacturing"],
  },
  {
    year: "2018",
    align: "end",
    left: 51.5212,
    yearTop: 36.8148,
    descTop: 40.963,
    descWidth: 11.1772,
    desc: ["The company exits the business, marking the end of an era"],
  },
  {
    year: "2020",
    align: "start",
    left: 64.3519,
    yearTop: 42.1481,
    descTop: 46.2963,
    descWidth: 10.3175,
    // Two paragraphs in Figma (node 51:499), not one wrapped line.
    desc: ["Launched VOX,", "a joint venture with a Polish partner."],
  },
  {
    year: "2026",
    align: "end",
    left: 68.1217,
    yearTop: 17.1852,
    descTop: 24.7407,
    descWidth: 11.6402,
    desc: ["Reimagined, revitalised, and ready to build the future"],
    label: "PODDAR FAMILY RETURNS",
    labelTop: 20.5926,
  },
];

const YEAR_SIZE = "3.1746cqw"; // 48px at the 1512 design width
const YEAR_TRACKING = "0.0212cqw"; // 0.32px
const BODY_SIZE = "1.1905cqw"; // 18px

export function LegacyStory() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="@container relative aspect-[1512/1350] w-full">
        {/* Gold line-work backdrop (node 51:489).
            Figma's own PNG export of this layer is BLANK — 2,883 bytes in
            which all four channels are 0 across every pixel, confirmed twice
            and not a truncated download. The asset used here is instead a
            Figma-side render of that same node, which comes back already
            composed at the frame's 1512×1350, so it drops straight in at
            `inset-0` rather than needing the layer's own oversized
            2254px-tall, 210px-offset geometry. If the export is ever fixed
            upstream, switch back to the layer asset and restore that
            geometry — do not hand-draw a replacement. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* `unoptimized` deliberately: Next's image optimiser caches by
              source path, so replacing this file's bytes while keeping its
              name kept serving the previously-cached (blank) version — the
              backdrop measured pure white, sd=0, against a reference that
              clearly had content. Bypassing the optimiser sidesteps a whole
              class of stale-cache confusion for what is already a
              frame-sized, ready-to-serve PNG. */}
          <Image src={GOLD_BG} alt="" fill sizes="100vw" unoptimized className="object-cover" />
        </div>

        {/* White fade at the foot of the section (node 51:490), softening the
            gold line-work into the page. `rgba(255,255,255,0)` rather than the
            keyword `transparent`: Safari resolves bare `transparent` as
            transparent BLACK, which turns a fade-to-white into a grey smudge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full"
          style={{
            height: "29.6296%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)",
          }}
        />

        {/* The pipe (node 51:493). Wider than the frame so it runs off both
            edges, and masked by Figma's own vector so the render is cut to the
            drawn silhouette. Both `-webkit-` and standard mask properties are
            set: React inline styles never pass through PostCSS/Lightning CSS,
            so unlike a Tailwind class they get no automatic prefix.

            Figma's `-40px 40px 40px rgba(0,0,0,0.15)` shadow lives on the
            OUTER wrapper as a `drop-shadow` filter, not as a `box-shadow` on
            the masked element. Two reasons: a CSS mask clips the element's
            entire rendering, box-shadow included, so it would simply be
            masked away; and `drop-shadow` follows the pipe's real alpha
            silhouette rather than its rectangular box. Applying it to the
            parent means it operates on the already-masked result.
            Offsets are `cqw` so the shadow scales with the composition
            instead of staying a fixed 40px at every size. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "122.3545%",
            height: "102.2963%",
            filter: "drop-shadow(-2.6455cqw 2.6455cqw 2.6455cqw rgba(0,0,0,0.15))",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `url("${PIPES_MASK}")`,
              maskImage: `url("${PIPES_MASK}")`,
              WebkitMaskSize: "82% 86.966%",
              maskSize: "82% 86.966%",
              WebkitMaskPosition: "49.85% 81.667%",
              maskPosition: "49.85% 81.667%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <Image src={PIPES} alt="" fill sizes="123vw" className="object-cover" />
          </div>
        </div>

        {/* Heading (node 51:500) — "LEGACY" light over "STORY" bold. */}
        <h2
          className="absolute -translate-y-1/2 uppercase"
          style={{
            left: "9.9206%",
            top: "12.7407%",
            width: "36.3095%",
            fontSize: YEAR_SIZE,
            letterSpacing: YEAR_TRACKING,
            lineHeight: 1.08,
            color: HEADING,
          }}
        >
          <span className="block font-light">Legacy</span>
          <span className="block font-bold">Story</span>
        </h2>

        {MILESTONES.map((m) => {
          const alignEnd = m.align === "end";
          // Figma vertically centres each text box on its y coordinate, so
          // every block is pulled up by half its own height.
          const shift = alignEnd ? "-translate-x-full -translate-y-1/2" : "-translate-y-1/2";
          const textAlign = alignEnd ? "text-right" : "text-left";

          return (
            <div key={m.year}>
              <div
                className={`absolute whitespace-nowrap font-semibold uppercase ${shift} ${textAlign}`}
                style={{
                  left: `${m.left}%`,
                  top: `${m.yearTop}%`,
                  fontSize: YEAR_SIZE,
                  letterSpacing: YEAR_TRACKING,
                  lineHeight: 1.08,
                  color: AMBER,
                }}
              >
                {m.year}
              </div>

              {m.label && m.labelTop !== undefined && (
                <div
                  className={`absolute font-semibold ${shift} ${textAlign}`}
                  style={{
                    left: `${m.left}%`,
                    top: `${m.labelTop}%`,
                    width: `${m.descWidth}%`,
                    fontSize: BODY_SIZE,
                    lineHeight: 1.1,
                    color: BODY_GREY,
                  }}
                >
                  {m.label}
                </div>
              )}

              <div
                className={`absolute ${shift} ${textAlign}`}
                style={{
                  left: `${m.left}%`,
                  top: `${m.descTop}%`,
                  width: `${m.descWidth}%`,
                  fontSize: BODY_SIZE,
                  lineHeight: 1.1,
                  color: BODY_GREY,
                }}
              >
                {m.desc.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
