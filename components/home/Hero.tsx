"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/shared/Counter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Single Figma-matched scene (node 13:312): one always-playing video, no
 * slide/crossfade logic. `preload="auto"` + `fetchPriority="high"` since
 * there's only one clip to front-load.
 *
 * hero-fittings.webm is transcoded from a 91 MB source GIF at its own
 * native 2576×1440 (~24 MB VP9) — not downsampled — so it stays sharp on
 * displays running >100% OS scaling. Encoded with `-pix_fmt yuva420p` +
 * `-metadata:s:v:0 alpha_mode=1` `-auto-alt-ref 0` to carry the GIF's real
 * alpha channel through; VP9-in-WebM alpha decodes natively in Chromium's
 * `<video>`, so the grid backdrop shows through the transparent gaps with
 * no CSS blend-mode needed. hero-fittings-poster.png is generated from the
 * GIF directly, never from the WebM — ffmpeg's own CLI decode of a WebM
 * alpha stream silently drops the alpha channel (even though real browser
 * playback decodes it correctly), so extracting a poster frame from the
 * already-encoded WebM would silently ship an opaque poster.
 *
 * hero-fittings-mobile.webm is a separate 1080×1440 (3:4) crop from the
 * same source GIF, not the desktop clip resized — the mobile hero box is
 * portrait-shaped (see `133.333vw` below), and `object-cover`-ing the
 * landscape desktop clip into that shape would leave only an arbitrary
 * vertical sliver of the composition.
 */
const HERO_VIDEO = "/hero/hero-fittings.webm";
const HERO_POSTER = "/hero/hero-fittings-poster.png";
const HERO_VIDEO_MOBILE = "/hero/hero-fittings-mobile.webm";
const HERO_POSTER_MOBILE = "/hero/hero-fittings-mobile-poster.png";

// Figma node 13:427 — radial vignette, transparent at (1102.7, 396.74,
// right-of-center in the 1512×846 box) fading to `#14134f` outward at 35%
// opacity. Ported as Figma's exact SVG rather than a CSS `radial-gradient`
// since the `gradientTransform` matrix rotates the ellipse, which
// `radial-gradient()` has no syntax for. `encodeURIComponent` so the
// `#grad` fill reference survives inside the data URI.
const HERO_VIGNETTE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg viewBox="0 0 1512 846" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" opacity="0.35"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(-110.27 44.926 -80.347 -173.26 1102.7 396.74)"><stop stop-color="rgba(11,11,82,0)" offset="0"/><stop stop-color="rgba(20,19,79,1)" offset="1"/></radialGradient></defs></svg>`
  );
// Tailwind's `md` breakpoint — one literal since the JS poster pick and
// the <source media> query below must agree exactly.
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

// Figma's exact display strings — value/suffix kept separate so Counter's
// count-up lands on "50,000"-free literal text.
const STATS = [
  { value: 50, suffix: "+", labelKey: "overviewStat0" as const },
  { value: 6, suffix: "", labelKey: "overviewStat1" as const },
  { value: 500, suffix: " +", labelKey: "overviewStat2" as const },
  { value: 50, suffix: "k +", labelKey: "overviewStat3" as const },
];

export function Hero() {
  const t = useTranslations("home");
  const videoRef = useRef<HTMLVideoElement>(null);

  // <video poster> is one attribute, not one per <source>, so the
  // mobile/desktop poster swap needs JS even though the clip swap doesn't.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    setIsMobile(mq.matches);
    const update = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Belt-and-suspenders on `autoPlay`: observed it occasionally leaving the
  // video paused on mount. `key={isMobile ? ...}` remounts this on every
  // mobile/desktop crossing, and this re-fires alongside it.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [isMobile]);

  return (
    <section
      // Navbar is `fixed` (out of flow) and always-solid, so without this
      // offset the hero's own background starts at y:0, hidden behind the
      // nav for its first 80px. Figma's own (non-fixed) nav has the hero
      // body start at top:93.32px against an 80px header — `mt-[93px]`
      // reproduces that ~13px gap.
      className="relative mt-[93px] overflow-hidden bg-ink"
    >
      {/* Video sized to Figma's 846-at-1512 hero ratio, NOT clipped by its
          own wrapper — it lives at the outer section level so its bottom
          edge coexists with the translucent stat cards below, which start
          63.68px before the video's own bottom edge (Figma node 13:314:
          846 − 782.32). `h-[55.95vw]` is deliberately uncapped past 1512px:
          the text box below shares this exact literal so the two stay in
          lockstep at every width, which is what keeps the fixed
          `-mt-16/-mt-20` stats overlap landing on the same relative point
          on the video. Do not cap one without capping the other identically.
          Below `md`, `h-[133.333vw]` (= 1440/1080, the mobile clip's own
          3:4 ratio) matches the mobile crop's aspect exactly at every width
          in that range — the text box below mirrors this literal too. */}
      <video
        key={isMobile ? "mobile" : "desktop"}
        ref={videoRef}
        poster={isMobile ? HERO_POSTER_MOBILE : HERO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-x-0 top-0 z-[2] h-[133.333vw] w-full object-cover md:h-[55.95vw]"
        onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
        {...({ fetchPriority: "high" } as Record<string, string>)}
      >
        {/* Browser picks the first matching `media` and ignores the rest —
            same query as MOBILE_MEDIA_QUERY/Tailwind's `md`. */}
        <source src={HERO_VIDEO_MOBILE} type="video/webm" media={MOBILE_MEDIA_QUERY} />
        <source src={HERO_VIDEO} type="video/webm" />
      </video>

      {/* Text box: `min-h`, not fixed height — this box only needs ENOUGH
          room for the text, not exact room, and `min-h-[133.333vw]`/
          `md:min-h-[55.95vw]` mirror the video's own formulas so both stay
          in sync at every width without ever forcing an overflow. */}
      <div className="relative flex min-h-[133.333vw] flex-col justify-center md:min-h-[55.95vw]">
        {/* `z-[3]` on this and the two layers below: they must paint above
            the video (`z-[2]`) — an unindexed sibling would lose to the
            video's explicit z-index regardless of DOM order — but below
            the text content's `z-10`. Height capped at `calc(100% - 4rem)`
            (`5rem` at `sm:`) rather than `inset-0` so none of the three
            reach into the stats-tile overlap band below; `maskImage` tapers
            the last 20% of that height so the cutoff doesn't read as a
            hard seam. */}
        <div
          className="absolute inset-x-0 top-0 z-[3] h-[calc(100%-4rem)] bg-grid-dark sm:h-[calc(100%-5rem)]"
          style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* Legibility gradient (Figma node 13:426): ink at the left edge.
            Figma's own value fades to transparent by 75% width; tuned to
            50% on request so the pipe imagery past center stays untinted. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)]"
          style={{
            background: "linear-gradient(to right, #14134f, transparent 50%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Vignette (node 13:427, see HERO_VIGNETTE_SVG). `md:` only — this
            belongs to Figma's desktop 1512×846 composition, which has no
            equivalent for the mobile crop's own distinct composition. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] hidden h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] md:block"
          style={{
            backgroundImage: `url("${HERO_VIGNETTE_SVG}")`,
            backgroundSize: "100% 100%",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="container-edge relative z-10 flex flex-col gap-8 pt-20 pb-12 sm:gap-10 sm:pt-24 sm:pb-16 md:gap-12 md:pt-28 lg:gap-[60px]">
          <div className="flex max-w-2xl flex-col gap-5">
            {/* Figma node 13:430 — reaches its exact 16px/1.6px-tracking size
                at `md`, graduated up from smaller rather than jumping at `sm`. */}
            <span className="text-xs font-light uppercase tracking-[1.6px] text-white/75 sm:text-sm md:text-base">
              {t("heroEyebrow")}
            </span>
            <h1 className="text-balance font-display text-2xl font-light uppercase leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.1] md:text-4xl md:leading-[1.08] lg:text-5xl lg:leading-[1.05] xl:text-6xl xl:leading-[1.02] xl:tracking-[0.32px]">
              <span className="block">{t("heroSlide_growth_line1")}</span>
              <span className="block">{t("heroSlide_growth_line2")}</span>
              <span className="block font-normal">{t("heroSlide_growth_bold")}</span>
            </h1>
            <p className="max-w-xl text-balance text-sm leading-[1.3] text-white sm:text-base sm:leading-[1.2]">
              {t("heroSlide_growth_desc")}
            </p>
          </div>

          {/* Figma button spec (nodes 13:434-437): content-driven height
              from padding, not `size="lg"`'s fixed `h-14` — `cn()`'s
              tailwind-merge lets these overrides win over that default. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 uppercase md:gap-[15px]">
            <Button
              asChild
              size="lg"
              variant="accent-ink"
              className="h-auto w-full px-6 pb-3 pt-4 text-lg font-semibold tracking-[0.36px] sm:w-auto"
            >
              <Link href="/products">{t("heroPrimaryCta")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline-white"
              className="h-auto w-full px-6 pb-3 pt-4 text-lg font-semibold tracking-[0.36px] sm:w-auto"
            >
              <Link href="/contact">{t("heroSecondaryCta")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar (Figma "stats frame", node 13:314) — no `bg-ink` of its
          own; the section already supplies it. `-mt-16`/`-mt-20` pulls it
          up to match Figma's 846 − 782.32 = 63.68px overlap with the video.

          Split into two layers sandwiching the video (`z-[2]`) rather than
          one div showing the video through a translucent background,
          because Figma's actual "pipe peeking through the last tile" is
          the pipe rendered IN FRONT of the card — genuinely occluding its
          glass panel and ghost digit, not a panel dimming the video behind
          it. One div can't be both above the video (for its own border/
          shadow/ghost-digit) and below it (for the pipe to cover them);
          two elements sandwiching an explicitly z-indexed video can. No
          `z-index` on this wrapper itself — that would trap its whole
          subtree as one atomic stacking unit and block the interleaving.

          Per Figma's own node tree (13:313), the video sits above the
          ENTIRE stats group in z-order, not just the shell — what actually
          keeps the real counter (y=881) and label (y=933) readable is
          geometry, not stacking: both already sit below the video's y=846
          edge, so the video can't physically reach them. Only the ghost
          digit (y≈772) is within the video's band, which is why it's the
          one thing living in Layer 1 below. */}
      <div className="relative -mt-16 sm:-mt-20">
        {/* Layer 1 — card shells + ghost digit, below the video (`z-[1]`).
            In normal flow (defines the actual layout height); Layer 2
            below is `absolute inset-0` and doesn't contribute to it. */}
        <div className="container-edge grid grid-cols-2 gap-4 py-10 sm:grid-cols-4 sm:gap-5 sm:py-14">
          {STATS.map((stat) => (
            /* Card: fixed 281.5:253 box (Figma node 810:1028, file
               6jLHH8FxOKbRcIWOpIiWcx) — every internal measurement is a
               cqw percentage of that box (% = value / 281.5). `#0b0b52`
               (fill backdrop + stroke) is Figma's literal value, not the
               `ink` token (`--color-ink: #14134f`) — Figma's own hero base
               rect (node 13:358) uses this same distinct navy.

               The card also carries a Figma "Glass" effect (fill FFFFFF,
               stroke 0B0B52 inside, light −16°/80%, refraction 100,
               dispersion 100, depth 32, frost 0) that Figma's dev-mode
               code export has no translation for and silently drops with
               no error. CSS has no equivalent for refraction/dispersion
               (needs real backdrop distortion — an SVG filter or WebGL),
               so the sheen/rim-light below approximate the visual READ,
               not the mechanism. `frost: 0` (clear glass) is why there's
               still no `backdrop-blur` here. */
            <div
              key={stat.labelKey}
              aria-hidden="true"
              className="@container relative z-[1] aspect-[563/506] overflow-hidden rounded-[8.88%] border border-[#0b0b52] bg-white/5"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 32%, transparent 55%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.14), inset 1px 0 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Ghost digit lives here (below the video) rather than with
                  the counter/label below, so the pipe crosses over it too.
                  Position nests through Figma's wrapper frames rather than
                  the card's own inset: 30px/11px/10px/10px lefts stack to
                  60px (21.28cqw); −25px/10px/10px tops net to −5px
                  (−1.78cqw). Color/tracking are Figma's exact `#0b0b52` /
                  `-1.4539px`, not the `ink` token or a rounded value. */}
              <div className="pointer-events-none absolute top-[-1.78cqw] left-[21.28cqw] select-none whitespace-nowrap text-[51.65cqw] font-display font-semibold leading-none tracking-[-0.516cqw] text-[#0b0b52]">
                {stat.value}
                {stat.suffix}
              </div>
            </div>
          ))}
        </div>

        {/* Layer 2 — counter + label only, above the video (`z-[5]`).
            Identical container-edge/grid-cols/gap/py classes to Layer 1
            mean CSS Grid computes matching cell rects with no manual pixel
            alignment. `pointer-events-none` on the grid — decorative
            digits, not controls. */}
        <div className="container-edge pointer-events-none absolute inset-0 z-[5] grid grid-cols-2 gap-4 py-10 sm:grid-cols-4 sm:gap-5 sm:py-14">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.labelKey} delay={i * 0.08} className="@container relative aspect-[563/506]">
              {/* Positioned independently, not counter-then-margin-label —
                  Figma places these as two separate sibling frames, not a
                  shared stack. Both share left-[13.85cqw] (card-left 29px +
                  each frame's own 10px text inset = 39px); tops differ per
                  each frame's own y in the export. Anchored from the TOP,
                  same as the ghost digit's wrapper — Figma leaves genuine
                  empty space at the card's bottom rather than filling it. */}
              <div className="absolute top-[33.4cqw] left-[13.85cqw]">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-[22.74cqw] font-display font-semibold leading-none tracking-[-0.227cqw] text-white"
                />
              </div>
              <p className="absolute top-[55cqw] left-[13.85cqw] max-w-[56.5cqw] pt-[5cqw] text-[5.68cqw] leading-[1.1] text-[#c0c0c0]">
                {t(stat.labelKey)}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
