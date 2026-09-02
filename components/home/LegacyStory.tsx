import Image from "next/image";

/**
 * Figma "legacy section" (node 51:488) — milestone timeline along a stepped
 * CPVC pipe.
 *
 * Absolutely positioned on purpose, unlike `CompanyOverview`: the copy is
 * pinned to specific elbows of one background illustration, so text and
 * artwork must not reflow independently.
 *
 * The frame is 1512×1350 and the wrapper is an `@container` locked to that
 * ratio, so every value below is Figma's own pixel measurement expressed
 * against it (x/1512 → left %, y/1350 → top %, px/1512 → `cqw`). Same
 * technique as the Hero stat cards, different box.
 *
 * TODO before shipping: no mobile frame exists for this node, so type scales
 * down with the container on phones; and the copy is inlined rather than
 * translated — wire it to `home.*` keys across all eleven locales.
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

interface LegacyStoryProps {
  /**
   * First heading line, above the bold "Story". The landing-page node
   * (51:488) reads "Legacy"; the About page draws the same section with "Our"
   * (node 1001:6008). Everything else about the two frames is identical —
   * same 1512x1350 box, same artwork, same six milestones at the same
   * coordinates — so this is a prop rather than a second component.
   */
  titleLead?: string;
  /** Milestone year colour: amber on the landing node, navy on About. */
  yearColor?: string;
}

export function LegacyStory({
  titleLead = "Legacy",
  yearColor = AMBER,
}: LegacyStoryProps = {}) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Below `md` the aspect-locked frame shrinks the whole composition with
          the viewport, which put the milestone copy at ~4px on a phone. That
          was invisible while this component was unused; the About page ships
          it. Figma has no mobile frame for this node, so the fallback below is
          a conventional stacked timeline built from the SAME data and colours
          rather than an invented redesign — replace it when a mobile frame
          exists. */}
      <div className="container-edge py-20 md:hidden">
        <h2
          className="font-display text-3xl uppercase leading-[1.08] tracking-[0.32px]"
          style={{ color: HEADING }}
        >
          <span className="block font-light">{titleLead}</span>
          <span className="block font-bold">Story</span>
        </h2>

        <ol className="mt-10 flex flex-col">
          {MILESTONES.map((m) => (
            <li
              key={m.year}
              className="border-l-2 border-black/10 pb-8 pl-5 last:pb-0"
            >
              <p
                className="text-3xl font-semibold leading-[1.08] tracking-[0.32px]"
                style={{ color: yearColor }}
              >
                {m.year}
              </p>
              {m.label && (
                <p
                  className="mt-2 text-base font-semibold leading-[1.1]"
                  style={{ color: BODY_GREY }}
                >
                  {m.label}
                </p>
              )}
              <p className="mt-1 text-base leading-[1.3]" style={{ color: BODY_GREY }}>
                {m.desc.join(" ")}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="@container relative hidden aspect-[1512/1350] w-full md:block">
        {/* Gold line-work backdrop (node 51:489). Figma's PNG export of this
            layer is BLANK — all four channels 0 on every pixel, verified
            twice. This asset is a Figma-side RENDER of the node instead,
            which arrives already composed at the frame's 1512×1350 and so
            sits at `inset-0`. Do not hand-draw a replacement.

            `unoptimized` because Next's optimiser caches by source path and
            kept serving its cached copy of the earlier blank file. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
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

        {/* The pipe (node 51:493), wider than the frame and masked to Figma's
            own vector silhouette. Both `-webkit-` and standard mask
            properties are set: React inline styles bypass PostCSS/Lightning
            CSS and get no automatic prefix.

            Figma's shadow is a `drop-shadow` on the OUTER wrapper, not a
            `box-shadow` on the masked element — a mask clips the element's
            whole rendering including its shadow, and drop-shadow follows the
            pipe's real alpha rather than its box. */}
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
          <span className="block font-light">{titleLead}</span>
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
                  color: yearColor,
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
