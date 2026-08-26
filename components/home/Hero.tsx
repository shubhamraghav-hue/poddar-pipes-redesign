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
 * hero-fittings.mp4 (Aug 2026) — Safari fallback. Safari has never
 * supported WebM (VP8 or VP9) at all, so without this the `<video>` had no
 * playable source there and rendered blank. Re-derived from the same
 * original source GIF (not from the .webm file — confirmed ffmpeg's CLI
 * decode of the VP9-alpha .webm silently drops the alpha side-channel and
 * returns an opaque frame with the transparent areas baked in as flat
 * WHITE, the same documented gotcha as the poster-PNG lesson above, just
 * rediscovered independently while building this fallback). The GIF's real
 * alpha (confirmed via `alphaextract`: a clean binary mask, no
 * partial/antialiased pixels) is instead composited onto the section's own
 * flat `#14134f` navy — NOT a copy of the blueprint grid baked into the
 * video: that grid is a separate CSS overlay (`bg-grid-dark` below) that
 * already paints on top of the ENTIRE video regardless of source format,
 * so baking a second copy into the video itself would double it up
 * incorrectly. Since what the alpha cutouts actually reveal today is just
 * that flat navy, compositing onto navy reproduces the exact same result
 * Chromium's real alpha decode already produces — not an approximation.
 * Encoded H.264 `-crf 27 -preset slow` (7.4 MB) — visually clean at this
 * fallback-only quality bar; no need to match the primary WebM's own
 * higher bitrate.
 *
 * H.264/MP4 cannot carry alpha the way VP9/WebM can — this is Safari's
 * fallback specifically, ordered after the WebM `<source>` so browsers
 * that support WebM never reach it (see the `<source>` ordering below).
 *
 * One shared source for every breakpoint (Aug 2026) — there used to be a
 * separate `hero-fittings-mobile.webm` (a hand-cropped portrait 1080×1440
 * clip). Figma's own mobile frame (node 50:669) turned out to need no
 * separate crop at all: its "MP4 2K 1" box is 798×446 inside a 402px-wide
 * frame — exactly this same 2576×1440 source scaled down by object-cover
 * (max(402/2576, 446/1440) = 0.3097 → 2576×0.3097 ≈ 798, 1440×0.3097 ≈
 * 446, matching to the pixel), just left-biased instead of centered (only
 * 10px of the 396px horizontal overflow trimmed from the left edge). So
 * the mobile framing below is reproduced with `object-position` on this
 * one file, not a second asset.
 */
const HERO_VIDEO = "/hero/hero-fittings.webm";
const HERO_VIDEO_MP4 = "/hero/hero-fittings.mp4";
const HERO_POSTER = "/hero/hero-fittings-poster.png";
// Alpha-packed H.264 for WebKit — ordinary video with no alpha channel,
// carrying the colour image and its alpha matte stacked in one frame for
// `AlphaVideo` to recombine in a shader. Two sizes because the packed file is
// twice the height of the visible frame: the full encode is 14.6 MB, the
// half-scale one 3.3 MB and visually ample at phone widths.
// Dimensions are the PACKED size (twice the visible frame's height) and are
// required, not decorative: WebKit uploads a video texture at the element's
// rendered size, so the off-screen element has to be laid out at full
// resolution or the hero renders visibly soft on Safari only.
// Module-level constants so their identity is stable — inlining these objects
// in JSX would rebuild AlphaVideo's WebGL context on every Hero render.
const HERO_PACKED = { src: "/hero/hero-fittings-packed.mp4", width: 2576, height: 2880 };
const HERO_PACKED_MOBILE = { src: "/hero/hero-fittings-packed-half.mp4", width: 1288, height: 1440 };
// Must match the `object-[2.525%_50%]` / `md:object-center` crop the plain
// <video> path uses, so both paths frame the shot identically.
const OBJECT_POS_X_MOBILE = 0.02525;
const OBJECT_POS_X = 0.5;
const MOBILE_QUERY = "(max-width: 767px)";
// Cache-busting suffix for the plain `<video poster>` attribute only
// (below) — that fetches the raw static file directly, unlike the
// `next/image` overlay, which goes through Next's own optimizer and
// rejects a `?`-suffixed local `src` outright (`images.localPatterns`).
// This filename is unchanged from the earlier flat-white version, so a
// browser that already cached the old bytes by URL has no other signal to
// refetch. Bump the suffix again if the PNG is regenerated in place a
// second time.
const CACHE_BUST = "?v=2";

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

  // Mobile browsers (confirmed on real devices, not just a theoretical
  // policy edge case) can silently decline `autoPlay` even with `muted` +
  // `playsInline` set correctly — Low Power Mode, data-saver modes, and
  // plain slow buffering over cellular all do this. `onLoadedData` firing
  // (used elsewhere below) only means the video is READY, not that it's
  // actually rendering motion — `onPlaying` is the one event that means
  // frames are genuinely advancing. The poster-image overlay rendered
  // right after the `<video>` below stays up until this fires, so a
  // blocked/delayed autoplay never shows a stuck frame or a mismatched
  // background — it shows the correct static hero indefinitely instead,
  // which reads as an intentional design, not a broken video.
  const [isPlaying, setIsPlaying] = useState(false);

  // Belt-and-suspenders on `autoPlay`: observed it occasionally leaving the
  // video paused on mount.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // Real-device finding (Aug 2026): some newer iOS/Safari builds report
  // `canPlayType('video/webm')` as playable — Apple added base VP9 hardware
  // decode on newer chips — but WebKit has never implemented the alpha
  // side-channel Chromium invented for VP9-in-WebM, so it decodes the
  // color planes ONLY and renders the "transparent" cutouts as flat WHITE
  // (the same underlying gotcha as the MP4-fallback build notes above,
  // just hit live in the browser instead of via ffmpeg's CLI). The MP4
  // fallback exists specifically to avoid this, but a browser that
  // half-supports WebM never reaches it via the normal `<source>`
  // fallthrough, since it never fails the WebM `<source>` in the first
  // place. Fixed by not OFFERING WebM at all to any WebKit engine — every
  // iOS browser (Safari, Chrome-iOS, Firefox-iOS, etc. are all WebKit
  // under Apple's platform policy, not their desktop engines) plus desktop
  // Safari, regardless of what `canPlayType` claims. `null` (not `false`)
  // until this resolves client-side, and the `<video>` below isn't
  // rendered at all until then — this must be correct in the very first
  // markup the browser's own HTML parser sees, since that parser starts
  // evaluating `<source>` elements and fetching the moment it reads them,
  // before React hydration/effects would otherwise get a chance to fix a
  // wrongly-guessed initial source list.
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
      // Navbar is `fixed` (out of flow) and always-solid, so without this
      // offset the hero's own background starts at y:0, hidden behind the
      // nav for its first 80px. Figma's own (non-fixed) nav has the hero
      // body start at top:93.32px against an 80px header — `mt-[93px]`
      // reproduces that ~13px gap.
      className="relative mt-[80px] overflow-hidden bg-ink"
    >
      {/* Video sized to Figma's 846-at-1512 hero ratio at `md`+, NOT clipped
          by its own wrapper — it lives at the outer section level so its
          bottom edge coexists with the translucent stat cards below, which
          start 63.68px before the video's own bottom edge (Figma node
          13:314: 846 − 782.32). `md:h-[55.95vw]` is the desktop FULL,
          uncapped height, matching the text box's own `md:min-h` exactly.

          Below `md`, `h-[110.945vw]` matches Figma's own mobile frame
          (node 50:669) exactly: its video box is 446px tall on a 402px
          frame (446/402 × 100 = 110.945), noticeably shorter than
          desktop's ratio — a real, distinct mobile composition, not the
          same scene just narrower. `object-[2.525%_50%]` (reset to
          `md:object-center`) biases the crop toward the left of the
          source frame instead of centering it, matching Figma's own
          near-left-flush crop (only 10px of the 396px horizontal overflow
          trimmed from the left edge — see the constants above for the
          math showing this is the same 2576×1440 source, not a separate
          asset).

          Below `md` the video's last `4rem`/`sm:5rem` must not reach the
          stats row (that band is mobile's 2-row grid reflow, not a Figma
          spec — see the stats section below). Two earlier approaches both
          failed, in different ways:

          1. Shrinking the video's own `h-*`. Broke the composition —
             `object-cover`'s crop is relative to the box's current size,
             so a shorter box cut straight through the pipe fittings at
             some viewport widths (caught by the user).
          2. `mask-image` on the `<video>` itself. Correct in Chromium,
             but on real iOS the fade silently didn't apply at all and the
             video's hard rectangular edge sliced across the top of the
             stat cards (also caught by the user, on-device). NOT a
             missing vendor prefix — Tailwind v4's Lightning CSS does emit
             `-webkit-mask-image` here, confirmed in the compiled output.
             It's WebKit's long-standing weakness with masks over
             hardware-composited subtrees: `<video>` decodes in its own
             compositing layer, and masking across that boundary is
             unreliable there.

          Current approach avoids masks entirely, so nothing depends on
          video compositing behavior. This wrapper is CLIPPED short
          (`overflow-hidden`) while the `<video>` inside keeps its FULL
          `110.945vw`/`md:55.95vw` height — so `object-cover` still measures
          against the full box and the crop math is byte-for-byte identical
          to the unclipped case, sidestepping failure (1). The taper is a
          plain background-gradient div at the clip edge (below),
          sidestepping failure (2). `overflow: hidden` and background
          gradients are universally supported, so this renders the same on
          every engine.

          The `md:` height branches on `needsMp4Only` because of a THIRD,
          separate bug — the one that actually caused the reported "tiles
          look cropped" on iOS (the mask theory above turned out not to be
          it).
          The stats cards sit at `z-[1]`, BELOW this video's `z-[2]`, and
          the video overlaps their top edge by exactly 24px at every
          breakpoint from `sm` up (`-mt-20` minus the stats row's own
          `py-14`; below `sm` it's `-mt-16` minus `py-10`, also 24px).
          Figma intends that overlap — the pipe is supposed to render in
          FRONT of the card — and on WebM it works, because the clip's
          alpha lets the card show through everywhere there's no pipe.
          **But H.264/MP4 cannot carry alpha**, so the Safari/iOS fallback
          is pre-composited onto flat navy (see the constants above) and is
          100% OPAQUE — measured: 0 transparent samples across that bottom
          band, vs ~95% transparent on the WebM. On every MP4 engine the
          overlap therefore paints a solid navy bar across the top of all
          four tiles instead of a pipe.

          **This is now SOLVED, and the clip only survives as a fallback.**
          `AlphaVideo` gives WebKit real transparency by reconstructing alpha
          at runtime from an ordinary H.264 file (colour and matte stacked in
          one frame, recombined in a shader) — see that component for the
          full reasoning and for why HEVC-with-alpha was abandoned. So
          `needsMp4Only` engines now get the designed pipe-over-card overlap
          exactly like WebM engines, and `md:h-[55.95vw]` applies to both.

          The 24px clip is retained ONLY for `alphaUnsupported` — an engine
          on the MP4 path that also has no WebGL. There the video really is
          opaque and really would paint a bar across the tiles, so cutting it
          short remains correct. */}
      {/* Not rendered at all until `needsMp4Only` resolves (see that state's
          comment) — mounting the `<video>` is what makes the browser's own
          HTML parser start evaluating `<source>`s and fetching, so the
          source list must already be correct the first time this exists in
          the DOM, not corrected a tick later. `opacity-0` (not just relying
          on the poster overlay painted on top) until `isPlaying`: a
          same-z-index sibling can't be trusted to fully hide certain
          mobile browsers' own native "tap to play" affordance for a
          stalled/blocked `<video>` — that UI has been seen bleeding through
          a purely CSS-stacked overlay on real devices, since some engines
          composite inline video in its own layer outside normal paint
          order. Actually hiding the video element itself, belt-and-
          suspenders with the overlay below, closes that gap. */}
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
            {/* Browser walks these in order and uses the first one whose
                `type` it can play. `needsMp4Only` engines never see the WebM
                `<source>` at all (see that state's comment for why — some
                can technically decode base VP9 now, just not this file's
                alpha channel, which is worse than not offering it). */}
            {!needsMp4Only && <source src={HERO_VIDEO} type="video/webm" />}
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
          </video>
          )}

          {/* Taper at the clip edge — replaces what the old `mask-image`
              did, without depending on masks. Fades to the section's own
              `bg-ink` (`#14134f`) rather than to transparent, which is
              visually identical here (the video's own alpha gaps already
              reveal exactly that navy) but works on every engine.
              `rgba(20,19,79,0)`, NOT the keyword `transparent`: Safari
              resolves bare `transparent` as transparent BLACK, which makes
              a fade to it read as a dark smudge instead of a clean fade.
              `md:hidden` — nothing is clipped at `md`+, so there's no edge
              to taper there. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 ${
              clipForOpaqueVideo ? "" : "md:hidden"
            }`}
            style={{ background: "linear-gradient(to bottom, rgba(20,19,79,0), #14134f)" }}
          />
        </div>
      )}

      {/* Poster-image overlay (Aug 2026) — same box as the video (identical
          position/size classes, same `z-[2]`, but painted on top since it
          comes after the video in DOM order at equal z-index), so swapping
          it away when the video starts causes zero layout shift. Exists
          for two reasons at once: (1) autoplay can be silently blocked or
          delayed on mobile (see the `isPlaying` state comment above) — this
          is what actually shows during that gap, correctly (matching the
          video's real navy background) rather than falling through to a
          blank/mismatched frame; (2) a plain `<Image priority>` is a faster
          LCP candidate than waiting on video decode, on every screen size,
          not just mobile — hence this renders at every breakpoint, only
          its mask (below) is `md:`-gated. `object-cover` plus the same
          `object-[2.525%_50%]`/`md:object-center` split as the video above
          — matches its crop behavior exactly since both share the same
          source and aspect formulas. Reuses `HERO_POSTER` (regenerated
          from the source GIF composited onto the real navy background —
          see the constants above); the previous poster PNG was flat
          white, a real mismatch against the video that made blocked
          autoplay look broken rather than just static.

          Clipped and tapered exactly like the video above, for exactly the
          same two reasons — the inner full-height box keeps `fill`'s own
          sizing (and therefore `object-cover`'s crop) measured against the
          real `110.945vw` height rather than the clipped wrapper, so
          shortening the wrapper can't cut through the poster PNG's
          pipe-fitting composition. See the video's comment above for the
          full history of why this is clip-plus-gradient and not a mask. */}
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

      {/* Text box: `min-h`, not fixed height — this box only needs ENOUGH
          room for the text, not exact room, and `min-h-[110.945vw]`/
          `md:min-h-[55.95vw]` mirror the video's own formulas so both stay
          in sync at every width without ever forcing an overflow. */}
      <div className="relative flex min-h-[110.945vw] flex-col justify-center md:min-h-[55.95vw]">
        {/* `z-[3]` on this and the two layers below: they must paint above
            the video (`z-[2]`) — an unindexed sibling would lose to the
            video's explicit z-index regardless of DOM order — but below
            the text content's `z-10`. Height capped at `calc(100% - 4rem)`
            (`5rem` at `sm:`) rather than `inset-0` so none of the three
            reach into the stats-tile overlap band below; `maskImage` tapers
            the last 20% of that height so the cutoff doesn't read as a
            hard seam.

            `WebkitMaskImage` alongside every `maskImage` on this and the
            layers below: React inline styles are assigned straight onto
            the DOM node and never pass through PostCSS/Lightning CSS, so
            unlike the Tailwind arbitrary-value mask utilities used
            elsewhere in this file, these get NO automatic vendor prefix
            and silently did nothing on iOS — the taper never applied and
            each layer ended in a hard horizontal seam instead. Masking a
            plain `<div>` (no composited video inside) is reliable in
            WebKit once the prefix is actually present, which is why these
            keep using masks while the video/poster above had to drop them
            entirely. */}
        <div
          className="absolute inset-x-0 top-0 z-[3] h-[calc(100%-4rem)] bg-grid-dark sm:h-[calc(100%-5rem)]"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Legibility gradient, mobile (Figma node 50:674, its own distinct
            mobile-frame spec): ink at the left edge fading to FULLY
            transparent by 100% width — not capped at 50% like the desktop
            version below. Figma's own gradient runs edge-to-edge (753px
            tall against a 736px section) with no stats row to clash with,
            but THIS layout's stats bar overlaps the bottom of this box by
            `-mt-16`/`-mt-20` (see the stats section below) — an edge-to-
            edge gradient here bled a visible dark tint across the top of
            the stat cards (caught by the user). Capped at the same
            `calc(100%-4rem)`/`sm:calc(100%-5rem)` height (and given the
            same bottom taper) as the desktop version and the grid-dark
            layer above, for the same reason theirs already is: so it
            stops short of the stats-tile overlap band instead of painting
            over it. `md:hidden`: desktop uses its own separately-tuned
            version instead, same split as the vignette further down.

            `rgba(20,19,79,0)` rather than the keyword `transparent` (same
            on the desktop version below): Safari resolves bare
            `transparent` as transparent BLACK, so a fade from navy to it
            passes through grey/black and reads as a dark smudge rather
            than a clean fade. Spelling out a zero-alpha version of the
            SAME navy keeps the interpolation clean on every engine. */}
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

        {/* Vignette (node 13:427, see HERO_VIGNETTE_SVG). `md:` only — this
            belongs to Figma's desktop 1512×846 composition, which has no
            equivalent in Figma's own distinct mobile-frame composition
            (node 50:669). */}
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
            {/* `max-w-md` (448px), not the `max-w-xl` (576px) every other
                line in this box uses — explicit request to make this
                description narrower and force a 3-line wrap instead of 2.
                Tested against the actual live text: 448px sits in the
                middle of a wide stable range (360–520px all wrap to
                exactly 3 lines), not a value that barely clears 2 lines
                by chance. */}
            <p className="max-w-md text-balance text-sm leading-[1.3] text-white sm:text-base sm:leading-[1.2]">
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
