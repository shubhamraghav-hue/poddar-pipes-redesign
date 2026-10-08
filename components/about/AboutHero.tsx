import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";

/**
 * Figma "company overview" (node 1001:5975) — the About page's opening navy
 * band: a water-ripple video backdrop, the page title, and the Vision /
 * Mission pair.
 *
 * The band is one continuous `#0b0b52` surface in Figma, so the cards live
 * here rather than in their own section — splitting them out would put a
 * seam through a background that has none.
 *
 * Laid out in normal flow, not aspect-locked like `LegacyStory`: nothing here
 * is pinned to a background illustration, and there is no mobile frame for
 * this node, so the copy needs to reflow. Figma's vertical rhythm is kept as
 * literal pixel values from `md` up and compressed below it.
 */

// The backdrop artwork. Figma places it at 1688x946, offset (0, -51) in the
// 1512-wide frame — flush to the LEFT edge with the overflow cropped off the
// right, which is what `object-left` reproduces under `object-cover`.
//
// This is a STILL, and it is rendered as one. It was briefly a <video> with an
// empty source list, on the assumption that node 1027:8205 was a video fill
// waiting on footage; it is an image. An empty <video> was the wrong element
// for it — it announces a media player to assistive tech, and `poster` is a
// plain attribute that Next's optimiser never touches, so it shipped one fixed
// file to every device. As an <Image> it gets responsive widths and AVIF/WebP.
//
// 1512x895 is the node's full natural size and the CEILING available from
// Figma: `get_screenshot` defaults to 1024 on the longer edge (which the first
// version of this file inherited, and which went soft on wide or 2x screens),
// and asking for 4096 still returns 1512. Figma exports no asset for this node
// at all, so the source bytes cannot be pulled either. Genuine sharpness beyond
// this needs the original image file from the design team — see
// CONTENT_TODOS.md.
const RIPPLE_STILL = "/about/water-ripple-poster-1512.webp";

// Figma's literal hexes. `rgba(11,11,82,0)` is spelled out rather than the
// `transparent` keyword throughout: Safari resolves bare `transparent` to
// transparent BLACK, which turns these navy fades into grey smudges.
const NAVY = "#0b0b52";
const NAVY_0 = "rgba(11,11,82,0)";

// The backdrop's own proportions, 1512x895 — the asset's natural size and the
// box Figma draws it in, which are the same thing.
//
// This used to be `height: 71.8876%` (Figma's 895 of the band's 1245px). That
// read as correct and was not: the percentage resolves against the SECTION,
// whose height is content-driven and barely moves across breakpoints, while
// the width collapses with the viewport. Measured, the box went from 1497x917
// (ratio 1.63, near the artwork's own 1.69) to 360x774 — ratio 0.47, a tall
// PORTRAIT box. `object-cover` then fills it by matching the height and
// discarding the width, so a 360px phone showed a 28% slice of the ripple
// blown up, anchored to the left edge rather than anywhere interesting:
//
//   1512 -> 97% of the artwork visible      51px cropped
//   1024 -> 71%                            440px cropped
//    768 -> 57%                            655px cropped
//    390 -> 30%                           1059px cropped
//    360 -> 28%                           1096px cropped
//
// Locking the box to the artwork's ratio makes the crop zero by construction
// — the ripple simply scales down with the viewport instead of being magnified
// into it. At Figma's frame it also lands on Figma's own number:
// 1497 / 1.6894 = 886, which is 895 scaled by 1497/1512.
//
// Zero crop is right on any real screen, but on a phone the ratio alone makes
// the band very short — 238px on a 402px screen — which reads as a thin strip
// rather than a backdrop. Hence the `min-h` floor, which buys presence back by
// letting the box grow TALLER than the artwork and cropping the sides.
//
// The floor is 481px, which is Figma's own mobile number: node 1447:13396
// draws the ripple 481.06px tall on its 402px frame. It was 322px, tuned by
// eye before that frame existed, and the band read as too short against the
// taller hero the same node specifies.
//
//   width   band     artwork visible
//   320px   481px        39%
//   402px   481px        50%   <- Figma's frame
//   640px   481px        79%
//   812px   481px       100%   <- the ratio takes over here
//  1024px   606px       100%
//
// ONE floor at every width rather than a mobile-only value, for the same
// reason the aspect-ratio experiment below was abandoned: a breakpointed
// floor puts a visible step in the band's height at the breakpoint (481px at
// 639 dropping to 379px at 640). A single floor simply stops binding once the
// natural ratio passes it, so the band only ever grows as the screen widens.
// Desktop is untouched either way — at 1512 the ratio has long since won.
//
// A min-height rather than a second `aspect-ratio` on purpose. A mobile ratio
// (`aspect-[5/4]`) was tried first and measured 511px at 639 against 379px at
// 640 — the band got SHORTER as the window got WIDER, because below the
// breakpoint a 1.25 box out-grows a 1.689 one. A floor has no such seam: it
// simply stops binding once the natural ratio passes it, at 481 * 1.689 =
// 812px, so the band is continuous and never shrinks as the screen widens.
// `481px` is the one number to change if the balance wants moving.
//
// The crop anchor had to move with it. `object-left` is Figma's intent and was
// INERT while nothing cropped, but it is the worst possible anchor once
// something does: measured on the artwork, the contrast centroid sits at
// x=57% and the left 20% carries only 8% of the detail, so anchoring left
// would frame empty water and cut the droplet off. `object-[57%_50%]` frames
// the droplet column and its rings instead. It is applied at every width —
// above 544px there is no horizontal crop for it to affect, and in the
// >2160px clamped case the crop is vertical, where its 50% matches what
// `object-left` resolved to anyway.

// Two shapes, not one scaled. The quote punch is NOT proportional between the
// breakpoints — Figma draws it 66x128 inside 582x518 on desktop (node
// 1447:13217) and 31x60 inside 342x162 on mobile (1447:13411), so a single
// asset stretched to the mobile box would squash the quotation mark along with
// the panel. Both files carry the same `white @ 5%` fill; the mobile one has
// square corners in the path because its card gets its radius from the
// container's `overflow-hidden` instead.
const CARD_SHAPE = "/about/vision-mission-card.svg";
const CARD_SHAPE_MOBILE = "/about/vision-mission-card-mobile.svg";

/**
 * One of the two translucent panels (nodes 1447:13214 / 1447:13226 desktop,
 * 1447:13408 / 1447:13415 mobile). The panel artwork is a single vector whose
 * top-right quotation mark is SUBTRACTED from the fill — a hole, not an
 * overlay — so it has to be the exported asset; a plain `bg-white/5` div
 * cannot punch it.
 *
 * TWO GEOMETRIES, not one reflowed. Figma does not narrow this card for a
 * phone, it redraws it: 592x450 on desktop against 342x162 on mobile, i.e.
 * 1.316 against 2.111 — a landscape strip rather than a near-square panel.
 * The type is re-cut with it (64 -> 28px title, 28 -> 13px body, and the body
 * goes white -> `#c0c0c0`). The switch is at `md` rather than `lg` so it lands
 * on the same breakpoint as the one-to-two column change on the grid below; at
 * the 330px card that produces, the desktop ramp reads at 36/16px.
 *
 * `@container` plus each frame's own ratio, so the type stays in Figma's
 * proportion at every width (the same technique as the product category
 * cards) — which is why every value below is a `cqw` percentage of the card
 * rather than a pixel size.
 *
 * DESKTOP WAS 592x360 with a 48px title and 18px body, taken from node
 * 1187:5893 in Sep 2026. Node 1447:13214 puts it back to the 450px box and the
 * 64/28px type, and that node is the current reference. The ratio had to move
 * with the sizes — leaving it at 592/360 would scale them against the wrong
 * box.
 */
function VisionMissionCard({
  title,
  body,
  /** % of card width — Figma sets the two DESKTOP copy blocks to 370 and 388
      of 592. Mobile sets both to 233 of 342, so it ignores this. */
  bodyWidth,
}: {
  title: string;
  body: string;
  bodyWidth: string;
}) {
  return (
    <div className="@container relative aspect-[342/162] w-full overflow-hidden rounded-[14.666px] md:aspect-[592/450] md:rounded-[25px]">
      {/* Mobile: the shape fills its box exactly (342x162 in 342x162).
          Desktop: 582x518 pinned top-left inside 592x450, exactly as Figma has
          it — so it overhangs the bottom by 68px and is clipped, and the 10px
          strip down the right stays empty navy. */}
      <img
        src={CARD_SHAPE_MOBILE}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-full max-w-none md:hidden"
      />
      <img
        src={CARD_SHAPE}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[115.1111%] w-[98.3108%] max-w-none md:block"
      />

      {/* Both blocks are vertically centred on their Figma y, hence the
          -translate-y-1/2 against a `top` of that coordinate. Two independently
          positioned frames rather than a stack: Figma anchors each from the TOP
          and leaves real empty space at the card's bottom. */}
      <h3 className="absolute left-[5.848%] top-[44.4444%] -translate-y-1/2 text-[8.1871cqw] font-semibold uppercase leading-none tracking-[-0.0819cqw] text-white md:left-[8.4459%] md:top-[47.1111%] md:text-[10.8108cqw] md:tracking-[-0.1081cqw]">
        {title}
      </h3>
      {/* Width is the one value that still needs `style`: it is per-card on
          desktop (`bodyWidth`) and a flat 233/342 on mobile, and Tailwind
          cannot generate a class from a prop. `--body-w` is read back by the
          `md:` width below via arbitrary-property syntax. */}
      <p
        className="absolute left-[5.848%] top-[69.7531%] w-[68.1287%] -translate-y-1/2 text-[max(12px,3.8012cqw)] leading-[1.1] text-[#c0c0c0] md:left-[8.4459%] md:top-[71.5556%] md:w-[var(--body-w)] md:text-[4.7297cqw] md:leading-[1.2] md:text-white"
        style={{ "--body-w": bodyWidth } as CSSProperties}
      >
        {body}
      </p>
    </div>
  );
}

export async function AboutHero() {
  const t = await getTranslations("about");

  return (
    // `mt-[80px]` clears the fixed h-20 navbar, matching Hero.tsx — Figma
    // starts this band at y=80, immediately below the header.
    <section className="relative mt-[80px] overflow-hidden bg-[#0b0b52]">
      {/* TWO elements, and they have to be two.

          The outer one is the visible band: full width from `inset-x-0`, height
          taken from its child, and it owns the fades. `maxHeight: 100%` is the
          backstop — the section's height is content-driven and roughly fixed on
          desktop (~1276px), so past about 2160px wide the artwork's ratio wants
          a backdrop TALLER than the section, and without the cap the fades
          would be severed by the section's `overflow-hidden`, leaving a hard
          ripple-to-white edge against whatever follows. Above that width the
          ratio box overflows and is clipped here instead, which costs the
          bottom of the ripple — already inside the fade, so invisible.

          The inner one exists only to turn the width into a height via
          `aspect-ratio`. Putting the ratio and the cap on the SAME element
          over-constrains it: `inset-x-0` fixes the width, `aspect-ratio` fixes
          the shape and `maxHeight` fixes the height, and the browser resolves
          that by keeping the ratio and shrinking the WIDTH — measured 2156px
          inside a 2545px section at 2560, i.e. 389px of bare navy down the
          right-hand side. Separating them lets the width stay authoritative.

          `aspect-ratio` rather than a `vw`-derived height on purpose: `vw`
          counts the scrollbar and the section does not, which reintroduces a
          ~15px crop at every width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ maxHeight: "100%" }}
      >
        <div className="relative min-h-[481px] w-full aspect-[1512/895]">
          {/* `priority` because this is the LCP element — it sits at the very
              top of the page, so Next must not lazy-load it.

              Between 544px and ~2160px `object-cover` has nothing to crop —
              the box matches the source ratio, so cover and contain resolve to
              the same thing. It does real work at the two ends: below 544px,
              where the `min-h` floor makes the box taller than the artwork and
              the sides crop, and above ~2160px, where the height cap crops
              vertically. */}
          <Image
            src={RIPPLE_STILL}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[57%_50%]"
          />
        </div>

        {/* Bottom fade (node 1027:8206) — y 499 to 895 of the backdrop. */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "44.25%",
            background: `linear-gradient(to bottom, ${NAVY_0}, ${NAVY})`,
          }}
        />
        {/* Left fade (node 1027:8207). Figma builds it as a rotated and
            y-flipped "to bottom" gradient; composed, that resolves to navy at
            the left edge running out to nothing — which is what keeps the
            white title legible over the ripple. */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: "67.4603%",
            background: `linear-gradient(to left, ${NAVY_0}, ${NAVY})`,
          }}
        />
      </div>

      {/* Figma's mobile band is a genuinely TALLER composition, not the
          desktop one squeezed: node 1447:13394 is 1114px at 402 wide and puts
          the title 190px down it, with 82px of air under the second card. The
          190 is what makes the ripple read as a backdrop the copy sits inside
          rather than a strip above it. `md` keeps the existing 150/150. */}
      <div className="container-edge relative pb-[82px] pt-[190px] md:pb-[150px] md:pt-[150px]">
        <RevealOnScroll>
          {/* 36px and 307px wide at base are node 1447:13401's own values —
              it was 40px in a 511px measure, inherited from the desktop ramp.
              Its tracking is +0.2088px there against the desktop node's
              +0.32px, so the base needs its own value and `sm` restores it. */}
          <h1 className="max-w-[307px] font-display text-[36px] uppercase leading-[1.02] tracking-[0.2088px] text-white sm:max-w-[511px] sm:text-5xl sm:tracking-[0.32px] md:text-[60px]">
            <span className="font-light">{t("heroTitle")} </span>
            <span className="font-bold">{t("heroTitleBold")}</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          {/* 13.05px under the title and 13px/307px wide on mobile (node
              1447:13402), against the 28px gap and 16px/486px the wider
              widths keep. */}
          <p className="mt-[13px] max-w-[307px] text-[13px] leading-[1.2] text-white sm:mt-7 sm:max-w-[486px] sm:text-base">
            {t("heroDesc")}
          </p>
        </RevealOnScroll>

        {/* The site's standard CTA pair — same classes as CTASection so the
            two render identically. Figma's label colour is `#0B0B52`, a
            different navy from the `ink` token the variant ships. */}
        <RevealOnScroll delay={0.14}>
          {/* 142px under the copy on mobile, and it is measured from the last
              LINE, not from the text frame. Node 1447:13399 is a 192.48px box
              at y190 — a height inherited from the home hero's three-child
              version of the same frame — but its two children end at y341.05,
              so it carries 41.4px of trailing empty space. The CTA sits at
              y483, which is 141.95px below the paragraph and 100.5px below the
              frame; the first of those is the gap anyone actually sees. It was
              48px (`mt-12`), the figure the OLD mobile frame drew. */}
          <div className="mt-[142px] flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-[68px]">
            <Button
              asChild
              size="lg"
              variant="accent-ink"
              className="h-[46px] w-full max-w-[307px] px-6 py-0 text-lg font-semibold uppercase leading-none tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52] sm:max-w-none sm:w-auto"
            >
              <Link href="/products">
                <span className={CAP_TRIM}>{t("heroPrimary")}</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline-white"
              className="h-[46px] w-full max-w-[307px] border-0 px-6 py-0 text-lg font-semibold uppercase leading-none tracking-[0.36px] shadow-[inset_0_0_0_1.2px_#fff] hover:shadow-[inset_0_0_0_1.2px_#fff] sm:max-w-none sm:w-auto"
            >
              {/* Inset ring, not a border, and a cap-trimmed label — the
                  48-vs-46 / high-label fix shared with CTASection. */}
              <EnquiryLink>
                <span className={CAP_TRIM}>{t("heroSecondary")}</span>
              </EnquiryLink>
            </Button>
          </div>
        </RevealOnScroll>

        {/* Figma's 28px gutter between the two 592px cards on desktop. Mobile
            stacks them 12px apart (nodes 1447:13408 at y696 and 1447:13415 at
            y870, each 162 tall) and starts the pair 111.6px under the
            secondary CTA, which ends at y584.40 — both were 96/28px. */}
        <RevealOnScroll
          delay={0.1}
          className="mt-[112px] grid grid-cols-1 gap-3 md:mt-[274px] md:grid-cols-2 md:gap-7"
        >
          <VisionMissionCard
            title={t("visionTitle")}
            body={t("visionDesc")}
            bodyWidth="62.5%"
          />
          <VisionMissionCard
            title={t("missionTitle")}
            body={t("missionDesc")}
            bodyWidth="65.5405%"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
