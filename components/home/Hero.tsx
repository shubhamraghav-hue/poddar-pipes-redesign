"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/shared/Counter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { AlphaVideo } from "@/components/home/AlphaVideo";

/**
 * Figma node 13:312 — one always-playing hero video.
 *
 * Full asset-pipeline history is in BRAND_IDENTITY.md. The rules that bite:
 *   - Regenerate the poster and the MP4 from the SOURCE GIF, never from the
 *     WebM. ffmpeg's default VP9 decode silently drops alpha and bakes the
 *     transparent areas in as flat WHITE (`-c:v libvpx-vp9` reads it
 *     correctly, if you must).
 *   - The MP4 is Safari's fallback and cannot carry alpha, so it is
 *     pre-composited onto the section's own `#14134f`. Do not bake the
 *     blueprint grid into it — `bg-grid-dark` below already paints over the
 *     whole video.
 *   - One source serves every breakpoint. Figma's mobile frame is the same
 *     2576×1440 clip, just cropped left-biased rather than centred, so it
 *     needs `object-position` and not a second file.
 */
const HERO_VIDEO = "/hero/hero-fittings.webm";
const HERO_VIDEO_MP4 = "/hero/hero-fittings.mp4";
const HERO_POSTER = "/hero/hero-fittings-poster.png";
// Alpha-packed H.264 for WebKit: colour image and alpha matte stacked in one
// frame, recombined by AlphaVideo's shader. Dimensions are the PACKED size
// (twice the visible height) and are REQUIRED — WebKit uploads a video
// texture at the element's rendered size, so anything smaller renders soft on
// Safari only. Module-level so their identity is stable; inlining these
// objects in JSX would rebuild the WebGL context on every render.
const HERO_PACKED = { src: "/hero/hero-fittings-packed.mp4", width: 2576, height: 2880 };
const HERO_PACKED_MOBILE = { src: "/hero/hero-fittings-packed-half.mp4", width: 1288, height: 1440 };
// Must match the `object-[2.525%_50%]` / `md:object-center` crop the plain
// <video> path uses, so both paths frame the shot identically.
const OBJECT_POS_X_MOBILE = 0.02525;
const OBJECT_POS_X = 0.5;
const MOBILE_QUERY = "(max-width: 767px)";
// For the raw `<video poster>` fetch only — the next/image overlay rejects a
// `?`-suffixed local src. Bump if the PNG is ever regenerated in place.
const CACHE_BUST = "?v=2";

// Figma node 13:427 — radial vignette. Ported as Figma's own SVG rather than
// a CSS `radial-gradient` because the `gradientTransform` rotates the
// ellipse, which `radial-gradient()` cannot express.
const HERO_VIGNETTE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg viewBox="0 0 1512 846" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" opacity="0.35"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(-110.27 44.926 -80.347 -173.26 1102.7 396.74)"><stop stop-color="rgba(11,11,82,0)" offset="0"/><stop stop-color="rgba(20,19,79,1)" offset="1"/></radialGradient></defs></svg>`
  );

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

  // Mobile can silently decline autoPlay even when muted + playsInline are
  // correct (Low Power Mode, data-saver, slow cellular). `onPlaying` is the
  // only event meaning frames are actually advancing — `onLoadedData` just
  // means ready. The poster overlay stays up until this fires, so a blocked
  // autoplay shows a correct static hero rather than a stuck frame.
  const [isPlaying, setIsPlaying] = useState(false);

  // Belt-and-suspenders on `autoPlay`: observed it occasionally leaving the
  // video paused on mount.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // Never offer WebM to a WebKit engine. Newer iOS reports
  // `canPlayType('video/webm')` as playable but has no VP9 alpha
  // side-channel, so it decodes the colour planes only and renders the
  // cutouts flat WHITE — and because it never FAILS the WebM source, it
  // never falls through to the MP4. UA-sniffed rather than feature-detected
  // for exactly that reason. All iOS browsers are WebKit under Apple policy.
  //
  // `null` until resolved, and the <video> is not rendered before then: the
  // HTML parser starts fetching `<source>`s the moment it reads them, so the
  // list must be right in the first markup, not corrected after hydration.
  const [needsMp4Only, setNeedsMp4Only] = useState<boolean | null>(null);
  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isDesktopSafari = /^((?!chrome|android).)*safari/i.test(ua);
    setNeedsMp4Only(isIOS || isDesktopSafari);
  }, []);

  // Set only if a WebKit engine also turns out to have no WebGL, in which
  // case `AlphaVideo` cannot run and we fall back to the plain, opaque MP4 —
  // which then genuinely does need the 24px clip to keep it off the cards.
  const [alphaUnsupported, setAlphaUnsupported] = useState(false);
  const useAlphaVideo = needsMp4Only === true && !alphaUnsupported;
  const clipForOpaqueVideo = needsMp4Only === true && alphaUnsupported;

  return (
    <section
      // Clears the fixed navbar, which is out of flow and would otherwise
      // sit over the hero's first 80px.
      className="relative mt-[80px] overflow-hidden bg-ink"
    >
      {/* Heights are Figma's: `md:h-[55.95vw]` (846 at 1512) and
          `h-[110.945vw]` below it (446 at 402, node 50:669) — a genuinely
          different mobile composition, not the same scene narrowed.
          `object-[2.525%_50%]` reproduces its left-biased crop.

          The wrapper is CLIPPED (`overflow-hidden`) while the video inside
          keeps its FULL height, so `object-cover` still measures against the
          full box. Do not shrink the video's own `h-*` instead: the crop is
          relative to the box, and a shorter box cuts through the pipe
          fittings at some widths. Do not reach for `mask-image` either —
          WebKit will not reliably mask across a `<video>`'s own compositing
          layer, and it fails silently (prefixes are not the problem).

          `clipForOpaqueVideo` trims 24px at `md`+ ONLY when WebGL is
          unavailable on a WebKit engine. The stat cards sit at `z-[1]` below
          this video's `z-[2]` and Figma wants the pipe overlapping them,
          which needs real alpha; without AlphaVideo the MP4 is fully opaque
          and would paint a navy bar across all four tiles. */}
      {/* `opacity-0` until `isPlaying`, as well as the poster overlay on top:
          some engines composite inline video in its own layer outside normal
          paint order, and their native "tap to play" affordance has been seen
          bleeding through a purely CSS-stacked overlay on real devices.
          Hiding the element itself closes that gap. */}
      {needsMp4Only !== null && (
        <div
          className={`absolute inset-x-0 top-0 z-[2] h-[calc(110.945vw-4rem)] overflow-hidden sm:h-[calc(110.945vw-5rem)] ${
            clipForOpaqueVideo ? "md:h-[calc(55.95vw-24px)]" : "md:h-[55.95vw]"
          }`}
        >
          {/* WebKit path: real transparency rebuilt in a shader from an
              alpha-packed H.264, so the pipes overlap the stat cards exactly
              as they do on WebM. Falls back to the plain <video> below if
              WebGL is unavailable. */}
          {useAlphaVideo ? (
            <AlphaVideo
              desktop={HERO_PACKED}
              mobile={HERO_PACKED_MOBILE}
              mobileQuery={MOBILE_QUERY}
              objectPosXMobile={OBJECT_POS_X_MOBILE}
              objectPosX={OBJECT_POS_X}
              onPainted={() => setIsPlaying(true)}
              onUnsupported={() => setAlphaUnsupported(true)}
              className={`h-[110.945vw] w-full transition-opacity duration-700 md:h-[55.95vw] ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
          <video
            ref={videoRef}
            poster={HERO_POSTER + CACHE_BUST}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className={`h-[110.945vw] w-full object-cover object-[2.525%_50%] transition-opacity duration-700 md:h-[55.95vw] md:object-center ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
            onPlaying={() => setIsPlaying(true)}
            {...({ fetchPriority: "high" } as Record<string, string>)}
          >
            {/* WebKit engines are never offered the WebM at all — see the
                `needsMp4Only` comment for why half-support is worse here
                than no support. */}
            {!needsMp4Only && <source src={HERO_VIDEO} type="video/webm" />}
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
          </video>
          )}

          {/* Softens the clip edge. `rgba(20,19,79,0)`, NOT the keyword
              `transparent`: Safari resolves bare `transparent` as transparent
              BLACK, turning the fade into a dark smudge. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 ${
              clipForOpaqueVideo ? "" : "md:hidden"
            }`}
            style={{ background: "linear-gradient(to bottom, rgba(20,19,79,0), #14134f)" }}
          />
        </div>
      )}

      {/* Poster overlay — identical box to the video so swapping it away
          causes no layout shift. Covers blocked/delayed autoplay, and is a
          faster LCP candidate than video decode at every breakpoint. The
          inner full-height box matters: it keeps `fill`'s sizing measured
          against the real height rather than the clipped wrapper, so
          clipping cannot cut through the composition. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-[calc(110.945vw-4rem)] overflow-hidden transition-opacity duration-700 sm:h-[calc(110.945vw-5rem)] ${
          clipForOpaqueVideo ? "md:h-[calc(55.95vw-24px)]" : "md:h-[55.95vw]"
        } ${isPlaying ? "opacity-0" : "opacity-100"}`}
      >
        <div className="relative h-[110.945vw] w-full md:h-[55.95vw]">
          <Image
            src={HERO_POSTER}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[2.525%_50%] md:object-center"
          />
        </div>

        {/* Same taper as the video's, same reasoning (see there). */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 ${
            clipForOpaqueVideo ? "" : "md:hidden"
          }`}
          style={{ background: "linear-gradient(to bottom, rgba(20,19,79,0), #14134f)" }}
        />
      </div>

      {/* `min-h` mirrors the video's own height formulas so the two stay in
          sync at every width without ever forcing an overflow. */}
      <div className="relative flex min-h-[110.945vw] flex-col justify-center md:min-h-[55.95vw]">
        {/* `z-[3]` on this and the two layers below: above the video's
            `z-[2]` but below the text's `z-10`. Heights stop short of the
            stats-tile overlap band rather than using `inset-0`.

            Every `maskImage` here needs its `WebkitMaskImage` twin: React
            inline styles bypass PostCSS/Lightning CSS entirely, so unlike
            Tailwind's mask utilities they get no automatic prefix. Masking
            these plain divs is fine — unlike the video, there is no
            composited child involved. */}
        <div
          className="absolute inset-x-0 top-0 z-[3] h-[calc(100%-4rem)] bg-grid-dark sm:h-[calc(100%-5rem)]"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Legibility gradient, mobile (Figma node 50:674) — fades out by
            100% width, unlike desktop's 50%. Height is capped rather than
            edge-to-edge as Figma draws it: full height bled a dark tint
            across the top of the stat cards.

            `rgba(20,19,79,0)` rather than `transparent` here and below:
            Safari resolves bare `transparent` as transparent BLACK, so the
            fade would pass through grey. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] md:hidden"
          style={{
            background: "linear-gradient(to right, #14134f, rgba(20,19,79,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Legibility gradient, desktop (Figma node 13:426): ink at the
            left edge. Figma's own value fades to transparent by 75% width;
            tuned to 50% on request so the pipe imagery past center stays
            untinted. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] hidden h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] md:block"
          style={{
            background: "linear-gradient(to right, #14134f, rgba(20,19,79,0) 50%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Vignette (node 13:427). `md:` only — Figma's mobile frame has no
            equivalent. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] hidden h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] md:block"
          style={{
            backgroundImage: `url("${HERO_VIGNETTE_SVG}")`,
            backgroundSize: "100% 100%",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="container-edge relative z-10 flex flex-col gap-8 pb-12 sm:gap-10 sm:pb-16 md:gap-12 lg:gap-[60px]">
          <div className="flex max-w-2xl flex-col gap-5">
            <span className="text-xs font-light uppercase tracking-[1.6px] text-white/75 sm:text-sm md:text-base">
              {t("heroEyebrow")}
            </span>
            <h1 className="text-balance font-display text-2xl font-light uppercase leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.1] md:text-4xl md:leading-[1.08] lg:text-5xl lg:leading-[1.05] xl:text-6xl xl:leading-[1.02] xl:tracking-[0.32px]">
              <span className="block">{t("heroSlide_growth_line1")}</span>
              <span className="block">{t("heroSlide_growth_line2")}</span>
              <span className="block font-normal">{t("heroSlide_growth_bold")}</span>
            </h1>
            {/* `max-w-md`, narrower than the rest of the box, to force a
                3-line wrap. 360–520px all give 3 lines, so 448 is safely
                mid-range rather than borderline. */}
            <p className="max-w-md text-balance text-sm leading-[1.3] text-white sm:text-base sm:leading-[1.2]">
              {t("heroSlide_growth_desc")}
            </p>
          </div>

          {/* Figma wants height driven by padding, not `size="lg"`'s fixed
              `h-14`; tailwind-merge lets these overrides win. */}
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

      {/* Stats bar (Figma node 13:314). `-mt-16`/`-mt-20` gives Figma's
          63.68px overlap with the video.

          Deliberately TWO layers sandwiching the video rather than one
          translucent panel: Figma has the pipe rendering in FRONT of the
          card, occluding its glass panel and ghost digit. A single div
          cannot be both above the video (for its own border and ghost
          digit) and below it (so the pipe covers them). Do not add a
          `z-index` to this wrapper — that traps the subtree as one stacking
          unit and breaks the interleaving.

          Only the ghost digit needs to sit below the video; the counter and
          label are already clear of its bottom edge geometrically. */}
      <div className="relative -mt-16 sm:-mt-20">
        {/* Layer 1 — card shells + ghost digit, below the video. In normal
            flow, so it defines the layout height; Layer 2 is absolute. */}
        <div className="container-edge grid grid-cols-2 gap-4 py-10 sm:grid-cols-4 sm:gap-5 sm:py-14">
          {STATS.map((stat) => (
            /* Card is Figma's 281.5:253 box; every inner measurement is a
               cqw percentage of it (% = value / 281.5). `#0b0b52` is
               Figma's literal navy, deliberately not the `ink` token.

               Figma's "Glass" effect has no CSS equivalent (refraction and
               dispersion need real backdrop distortion), so the sheen and
               rim-light below approximate the look, not the mechanism. Its
               `frost: 0` is why there is no `backdrop-blur`. */
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
              {/* Ghost digit sits in this layer, not with the counter, so
                  the pipe crosses over it. Offsets come from nesting through
                  Figma's wrapper frames, not the card's own inset. */}
              <div className="pointer-events-none absolute top-[-1.78cqw] left-[21.28cqw] select-none whitespace-nowrap text-[51.65cqw] font-display font-semibold leading-none tracking-[-0.516cqw] text-[#0b0b52]">
                {stat.value}
                {stat.suffix}
              </div>
            </div>
          ))}
        </div>

        {/* Layer 2 — counter + label, above the video. Its grid classes must
            stay identical to Layer 1's so both resolve to the same cell
            rects without manual alignment. */}
        <div className="container-edge pointer-events-none absolute inset-0 z-[5] grid grid-cols-2 gap-4 py-10 sm:grid-cols-4 sm:gap-5 sm:py-14">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.labelKey} delay={i * 0.08} className="@container relative aspect-[563/506]">
              {/* Two independently positioned frames, not a stack — Figma
                  anchors both from the TOP and leaves real empty space at
                  the card's bottom. */}
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
