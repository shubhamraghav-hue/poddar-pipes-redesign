import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

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

// The backdrop covers the band's top 895 of 1245px.
const BACKDROP_HEIGHT = "71.8876%";

const CARD_SHAPE = "/about/vision-mission-card.svg";

/**
 * One of the two translucent panels (nodes 1029:8303 / 1029:8304). The panel
 * artwork is a single vector whose top-right quotation mark is SUBTRACTED
 * from the fill — a hole, not an overlay — so it has to be the exported
 * asset; a plain `bg-white/5` div cannot punch it.
 *
 * `@container` plus the frame's own 592x360 ratio, so the 48px title and 18px
 * body stay in Figma's proportion at every width (the same technique as the
 * product category cards).
 *
 * Re-fetched Sep 2026 from node 1187:5893, which reworked these boxes: the
 * card lost 90px of height (450 -> 360) and the type came down with it —
 * title 64 -> 48px at -0.64 -> -0.48px tracking, body 28 -> 18px and now
 * carrying 0.18px tracking of its own. Because every value here is expressed
 * in `cqw` against the card, the ratio had to change too; leaving it at
 * 592/450 would have scaled the new sizes against the wrong box.
 */
function VisionMissionCard({
  title,
  body,
  /** % of card width — Figma sets the two copy blocks to 370px and 388px. */
  bodyWidth,
}: {
  title: string;
  body: string;
  bodyWidth: string;
}) {
  return (
    <div className="@container relative aspect-[592/360] w-full overflow-hidden rounded-[25px]">
      {/* 582x518 pinned top-left inside a 592x360 box, exactly as Figma has
          it. The shape now overhangs the bottom by considerably more than it
          used to — 518 into 360 — and is clipped; the 10px strip down the
          right stays empty navy. */}
      <img
        src={CARD_SHAPE}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[143.8889%] w-[98.3108%] max-w-none"
      />

      {/* Both blocks are vertically centred on their Figma y, hence the
          -translate-y-1/2 against a `top` of that coordinate. */}
      <h3
        className="absolute -translate-y-1/2 font-semibold uppercase leading-none text-white"
        style={{
          left: "8.4459%",
          top: "52.7778%",
          fontSize: "8.1081cqw",
          letterSpacing: "-0.0811cqw",
        }}
      >
        {title}
      </h3>
      <p
        className="absolute -translate-y-1/2 text-white"
        style={{
          left: "8.4459%",
          top: "73.6111%",
          width: bodyWidth,
          fontSize: "3.0405cqw",
          letterSpacing: "0.0304cqw",
          lineHeight: 1.2,
        }}
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: BACKDROP_HEIGHT }}
      >
        {/* `priority` because this is the LCP element — it sits at the very top
            of the page, so Next must not lazy-load it. */}
        <Image
          src={RIPPLE_STILL}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
        />

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

      <div className="container-edge relative pb-24 pt-24 md:pb-[150px] md:pt-[150px]">
        <RevealOnScroll>
          <h1 className="max-w-[511px] font-display text-[40px] uppercase leading-[1.02] tracking-[0.32px] text-white sm:text-5xl md:text-[60px]">
            <span className="font-light">{t("heroTitle")} </span>
            <span className="font-bold">{t("heroTitleBold")}</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-7 max-w-[486px] text-base leading-[1.2] text-white">
            {t("heroDesc")}
          </p>
        </RevealOnScroll>

        {/* The site's standard CTA pair — same classes as CTASection so the
            two render identically. Figma's label colour is `#0B0B52`, a
            different navy from the `ink` token the variant ships. */}
        <RevealOnScroll delay={0.14}>
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-[68px]">
            <Button
              asChild
              size="lg"
              variant="accent-ink"
              className="h-auto w-full px-6 pb-3 pt-4 text-lg font-semibold uppercase tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52] sm:w-auto"
            >
              <Link href="/products">{t("heroPrimary")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline-white"
              className="h-auto w-full border-[length:1.2px] border-white px-6 pb-3 pt-4 text-lg font-semibold uppercase tracking-[0.36px] sm:w-auto"
            >
              <Link href="/contact">{t("heroSecondary")}</Link>
            </Button>
          </div>
        </RevealOnScroll>

        {/* Figma's 28px gutter between the two 592px cards. */}
        <RevealOnScroll
          delay={0.1}
          className="mt-24 grid grid-cols-1 gap-7 md:mt-[274px] md:grid-cols-2"
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
