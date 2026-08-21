# Brand Audit — Phase 1

Records what already existed vs. what this pass built/fixed, and the color-ratio
check per the Playbook's 50% Blue / 20% Orange / 20% White / 10% Gold guide.

## Reality check: most of "Phase 1" already existed

Before making changes, an audit of the codebase found the Tailwind theme
(`styles/globals.css`) already encodes the exact Brand Playbook hex values —
`#171796` / `#F28000` / `#e0af41` / `#aceffa` / `#f4f2ee` / `#292728` — and the
following components already exist and are already wired in:

- `components/shared/Boomerang.tsx` — gold gradient boomerang, already composed
  into every `SectionHeading` (used by ~20+ sections site-wide).
- `components/shared/GoldStamp.tsx` — medal-shaped certification badge, already
  used on the homepage and `/quality` page.
- `components/ui/badge.tsx` `brand-pill` / `brand-pill-dark` variants — orange
  1.5px outline, never filled, matching the "Orange Elements" rule.
- `components/ui/button.tsx` — pill CTA with `primary`/`secondary`/`outline-light`
  etc. variants.

This pass therefore focused on **auditing and fixing** the existing system
against the Playbook's explicit rules, rather than building it from scratch —
several real bugs were found in the process (below).

## Bugs found and fixed this pass

1. **Duplicate Button component.** `components/ui/outlineButton.tsx` was a
   byte-for-byte fork of `components/ui/button.tsx` with one extra variant
   (`outline-white`), imported only by `Hero.tsx`. Any fix to `button.tsx`
   would have silently missed `Hero.tsx`. Merged `outline-white` into the
   canonical `button.tsx`, repointed the import, deleted the duplicate.
2. **Orange text on white — real AA failures.** The Playbook explicitly bans
   orange body/small text on white ("~2.9:1"). Measured contrast confirms it:
   `amber-600` (#F28000) on white ≈ **2.7:1**, `amber-700` (#c2650a) on white ≈
   **4.15:1** — both fail the 4.5:1 AA threshold for normal-size text. This
   pattern was live in ~13 places: the `button.tsx` `secondary` variant (which
   directly contradicts the brief's own spec — "secondary = orange outline +
   blue text" — but had orange text), the `badge.tsx` `amber`/`brand-pill`
   variants, and hand-rolled pill/label markup across `OfficeLocations`,
   `Certifications`, `ProductCard`, `LatestBlogs`, `QualityCertifications`,
   the careers/contact/quality/resources pages. All now use `text-ocean-700`
   (blue) for the text, keeping the orange as an outline/border/background
   tint only — orange still carries the accent, just never as small text.
   Decorative icon colors (Quote, MapPin, Telescope, CheckCircle2 bullets)
   were left orange — icons are accent elements under the 50/20/20/10 mix,
   not the "body text/small links" the rule targets.
3. **Undefined-in-theme color reference.** `outline-light` and
   `brand-pill-dark` referenced `amber-400`, a shade never defined in the
   theme (`--color-amber-400` doesn't exist) — Tailwind was silently falling
   back to its stock, off-brand amber-400. Replaced with theme-defined
   `amber-300` (button, on dark backgrounds — high contrast, on-brand) and
   `white` (badge dark variant).
4. **Mega-menu unreachable by keyboard.** The desktop mega-menu opened only
   on `onMouseEnter`/`onMouseLeave` — a keyboard user tabbing through the nav
   had no way to open it, making every product-category sub-link
   keyboard-unreachable except by navigating to `/products` directly. Added
   `onFocus` to open the correct menu, `aria-haspopup`/`aria-expanded` on the
   trigger, `Escape` to close, and a header-level `onBlur` (checking
   `relatedTarget` against the header) so the panel doesn't close the instant
   focus moves from the trigger into its own links. This is a disclosure
   pattern, not a full ARIA `menu`/`menuitem` widget with arrow-key roving
   tabindex — a further pass could add that, but reachability is now real.
5. **Icon+text labels rendering ~3px high across every icon-adjacent CTA
   sitewide.** Root cause confirmed via canvas glyph-ink measurement (not
   just DOM box math, which was initially misleading — see the SectionHeading
   entry above): Anek Devanagari's font metrics reserve `ascent:14 / descent:10`
   at 14px, and a bare text node sitting directly inside a `flex items-center`
   container uses that full untrimmed box regardless of any `line-height` or
   `text-box-trim` set on the container — verified by toggling `text-box-trim`
   live on a real button and finding zero measured change, because it was
   never reaching the text. Fixed by wrapping every such label in its own
   `<span leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]>`,
   which gives the label a real box the browser will actually trim. Generalized
   into `components/ui/button.tsx` (auto-wraps string children); applied by
   hand to ~25 custom-markup instances across Navbar, LanguageSwitcher,
   PlumberFinder, ProductCategories, and most CTA links site-wide that don't
   go through the shared `Button`. See `BRAND_IDENTITY.md` for the full list.
6. **Two of six homepage category logos were showing unconfirmed mockup
   branding ("PP-R GOLD" / "PP-RC GOLD") under the SWR and AGRI filenames** —
   a pure asset mix-up (the React code, `alt` text, and links were always
   correct), invisible to any DOM-level check since it lived inside the SVG
   artwork itself. First fixed by moving the real SWR/AGRI art (which was
   sitting under the `tanks-logo.svg` / `ugd-logo.svg` filenames) into the
   correct files, with an honest placeholder standing in for TANKS/UGD (no
   real art existed for either at that point). The brand team then supplied a
   complete, correctly-labelled 6-file set — all six categories now show real
   artwork under their own filename, and the grid's display order changed to
   CPVC, UPVC, SWR, AGRI, UGD, TANKS per their request. See `CONTENT_TODOS.md`.
7. **`ProductCategories`'s category-card description used `sm:text-md`, which
   isn't a real Tailwind class** (the scale is `text-sm`/`text-base`, there's
   no `-md` step) — a silent no-op, so the mobile `text-[16px]` size leaked
   through unchanged at every breakpoint instead of scaling down on
   tablet/desktop as intended. Corrected to `sm:text-sm`. Found while fixing
   an unrelated layout issue on the same component (see `BRAND_IDENTITY.md`
   for the full grid redesign) — worth grepping the compiled CSS whenever a
   "responsive override" doesn't visibly do anything.
8. **`ProductCategories` mobile card content overflow — fixed.** Same flat
   `text-[16px]` description/CTA text (bug #7's leaked-through mobile size)
   was also too large for the ~104px mobile card to hold — the logo + 2-line
   description + CTA didn't fit and the bottom was clipped by the card's
   `overflow-hidden`, confirmed via `scrollHeight > clientHeight` on a live
   375px-wide render. Changed to `text-[10px] sm:text-sm` (description) /
   `text-[10px] sm:text-xs` (CTA), with the description's reserved `min-h`
   recalculated to match. Re-verified at 375px: no overflow on any of the six
   cards; desktop (248×248px squares) unaffected. See `BRAND_IDENTITY.md`.
9. **Text `<Input>` placeholder/value sitting visibly high, with dead space
   collecting below it — same root cause as bug #5, and an initial fix that
   was verified wrong before landing the real one.** Reported on the footer
   newsletter email field, same shared component as `InquiryForm` and
   `PlumberFinder`. First attempt copied bug #5's technique verbatim
   (`leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]`
   on the input itself) and was logged as verified because
   `getComputedStyle`/`CSS.supports()` confirmed the properties were
   accepted — which turns out not to prove they render, since native
   `<input>` text uses UA-level layout, not the CSS text-box model those
   properties assume. A controlled A/B test (two inputs side by side, one
   with the properties and one without, zoomed 2.5–5×) showed pixel-identical
   text position — the first fix did nothing, and the "verified visually"
   claim in the first pass was an over-read of an ambiguous screenshot.
   **Real fix:** an input's baseline sits at `H/2 + (fontAscent −
   fontDescent)/2` regardless of `line-height` (algebraically provable, and
   confirmed `leading-none` changed nothing) — so only padding can move the
   visible glyph. Measured real ink across four strings, including the
   actual Hindi translation of this placeholder (not just the English copy),
   to make sure the fix wouldn't help one script while breaking another:
   all four needed 3–6px more padding-top than padding-bottom to center,
   same direction in every case. Landed on `pt-[5px]` (`pb` unchanged at 0),
   within ±1px of ideal for every sample. Re-ran the same A/B test to confirm
   this one actually moves the render, then re-verified `InquiryForm` and
   `PlumberFinder` still lay out correctly with the shared-component change.

## Bugs found and fixed — Figma landing-page rebuild pass

A later, separate pass (pixel-matching the homepage to a specific Figma file,
node 13:309 — see `BRAND_IDENTITY.md` for the full narrative). Numbering
continues from the list above; these are the concrete, verifiable bugs found
along the way, not the Figma-matching work itself.

10. **Every `<Button asChild>` site-wide rendered completely empty** — every
    Link-wrapped CTA button using the shared `components/ui/button.tsx`, on
    every page, not just the ones being rebuilt. Root cause: `Button`'s
    content logic ran `React.Children.map` even for the single-element
    `asChild` case; that helper always returns an array, even for one input,
    and Radix `Slot` needs a bare element, not an array-of-one. The
    installed `@radix-ui/react-slot@1.1.1` silently rendered nothing for
    that mismatched shape — no console error. Surfaced by upgrading to
    `1.3.3`, which throws `"Slot failed to slot onto its children"` instead
    of failing silently. Fixed the real bug (`asChild` now passes `children`
    straight through, skipping `.map()`), not just the symptom of upgrading
    the dependency. Verified on the rebuilt pages and spot-checked
    About/Contact (untouched by the rebuild) to confirm it wasn't
    rebuild-specific.
11. **Tailwind's `rounded-[value_cqw]` inflates into a near-circle.** Sizing a
    card via container-query units (`cqw`) so every internal measurement
    holds its ratio at any rendered size — font-size and position `cqw`
    values computed correctly (`getComputedStyle` confirmed exact expected
    pixels), but `rounded-[8.88cqw]` compiled to a nonstandard two-axis
    border-radius that computed roughly 5× too large specifically for this
    utility. Fixed by using a plain `%` for border-radius instead — it's
    natively self-relative for that property, no container-query machinery
    needed, sidestepping the bug entirely rather than working around it.
12. **A "washed-out lavender" hero background traced to the wrong layer.**
    First diagnosis assumed a CSS overlay/blend-mode problem and a
    `mix-blend-multiply` fix was applied — but the actual cause was one step
    earlier: the video was encoded with `-pix_fmt yuv420p` (no alpha
    channel), which silently flattened the source GIF's genuinely
    transparent background to solid white *before* any CSS ever ran.
    Confirmed by extracting a raw decoded frame and sampling actual pixel
    values via canvas (solid `rgb(255,255,255)`, not a light tint), then
    separately confirming the source GIF really does carry ~62% genuine
    (clean binary, non-antialiased) transparency via an alpha-channel
    histogram on an extracted PNG frame. Re-encoded with `-pix_fmt
    yuva420p` (confirmed via the WebM's own `alpha_mode:1` tag) and removed
    the now-unnecessary blend-mode overlay. Lesson for next time: verify
    which layer (asset vs. CSS) actually owns a color/transparency problem
    before fixing the CSS side.
13. **Hero video "outgrowing" the section, then a first fix that
    overcorrected.** Setting the video to `absolute inset-0` of the whole
    combined hero+stats section (to satisfy an earlier ask that it show
    behind the stat cards) stretched the same 1512×846-composed footage past
    its intended crop on real (taller) combined-height layouts, spilling
    fittings across multiple cards messily. The first fix — confining the
    video to its own `overflow-hidden` box at the exact 846-ratio — was
    technically correct but also eliminated a real, intentional design
    detail present in Figma's own reference (the last stat card's glass
    subtly revealing the pipe fitting behind it). Re-examining Figma's actual
    layer numbers showed the video there is never taller than 846px at all —
    the stats frame simply starts 63.68px before the video's own bottom edge,
    letting translucent cards reveal it naturally. Reconciled by keeping the
    video at its outer-section, undistorted 846-ratio size and removing a
    redundant opaque fill that had been placed directly behind the stat
    cards (which was blocking the reveal). Three passes to get right —
    "zero overlap" and "full-height stretch" were both wrong; the fix was
    Figma's actual (narrower) mechanism.
14. **`ProductCategories`'s full-bleed grey background was clipped to a
    centered 1400px column on screens wider than 1400px**, leaving white
    gutters on either side. `container-edge` (which bakes in
    `max-w-[1400px] mx-auto`) had been applied directly to the `<section>`
    that also carried the section's own background color — clipping the
    *background* along with the content width. Moved `container-edge` to an
    inner content `<div>`, background staying on the outer full-width
    `<section>` — the same pattern every other section on the site already
    uses. Verified full-bleed at 1920px viewport width.
15. **Hero text overflowed into the stats row at in-between viewport
    ratios** (reported at 768×846) — the hero text wrapper used a *fixed*
    height (`h-[55.95vw]`, originally chosen to match the video's own
    Figma-ratio sizing) rather than a minimum. Text and video don't actually
    need to share an exact height once they're separate elements (see bug
    13), so at narrower widths the formula produced a box shorter than the
    text stack needed, and the buttons overflowed straight into the stat
    cards below. Fixed by switching the text wrapper to `min-h` (uncapped).
    A related but separate issue found at the same time: the type scale
    itself jumped to full desktop size at the very first breakpoint (640px)
    and never changed again, while the box kept growing continuously with
    width — reworked to a graduated `base→sm→md→lg→xl` scale so text size and
    available room grow roughly in step. See `BRAND_IDENTITY.md` for the
    full breakpoint values.

## New components built

- `components/shared/FeaturePill.tsx` — the Playbook's orange-outline pill for
  short feature tags (Lead-Free, UV-Resistant, etc.), with a `dark` variant
  for use on `bg-ink` sections. Wired into `ProductDetail`'s hero via
  `lib/productTags.ts`, which derives tags from a product's own
  features/benefits/materials text (never asserts a claim the product data
  doesn't already make) — also replaces three hand-rolled pill instances
  (`LatestBlogs`, `resources` blog cards) that were duplicating this pattern
  inline with the wrong text color.
- `lib/motion.ts` — `BRAND_EASE` / `BRAND_DURATION` constants, wired into
  `RevealOnScroll`/`StaggerItem` (the most-reused animation primitive) so the
  easing curve is a named, shared token instead of a magic array repeated
  per-component. Not yet swept into every individual component's inline
  Framer Motion calls — most already use the same `[0.16, 1, 0.3, 1]` curve
  by convention, just not by import.
- Type-scale tokens (`--text-display` through `--text-caption`) and
  `--radius-pill` added to `styles/globals.css` `@theme`, available as
  `text-display`/`text-h1`/etc. and `rounded-pill` utilities. Existing
  headings already sit at equivalent sizes via Tailwind's default scale
  (e.g. `SectionHeading`'s `text-3xl sm:text-4xl md:text-5xl` ≈ 30/36/48px,
  close to H1/H2) — not rewritten to the new named classes wholesale, since
  that's a cosmetic-only sweep across dozens of files for no visual change.

## Color-ratio spot-check (50/20/20/10)

Sampled representative sections rather than every page:

| Section | Dominant | Orange | White/grey | Gold |
|---|---|---|---|---|
| Homepage hero | Ink navy background, white text | Accent CTA button + outline-light secondary | — | — |
| `SectionHeading` (used ~20×) | Thin ocean-600 lead line | Bold amber-500 accent line, always on its own line (corrected from gold, then re-pinned to amber-500 per designer review — see `BRAND_IDENTITY.md`; known sub-AA contrast on light backgrounds, accepted by design) + eyebrow rule | Paper background | — (no longer used in this component) |
| Product detail hero | Ink background | Accent CTA, FeaturePill outlines | — | — |
| Certifications / quality | Slate/white cards | Pill outlines only (no fill) | Dominant card background | GoldStamp medallions |
| Footer | Ink background, slate text | — (no orange in footer currently) | — | — |

Blue reads as dominant everywhere it appears (headings, primary buttons, link
text, icons), orange is consistently outline/accent-only post-fix (never
body text), gold is confined to Boomerang + GoldStamp per the "use sparingly"
rule. No section skews orange- or gold-heavy. The footer has no orange
accent at all — a minor missed opportunity for the 20% orange target, not a
violation (absence isn't a ratio violation, just under-usage) — worth an
orange accent (e.g. a FeaturePill-style link hover state) in a later pass.

## Deferred / not done this pass

- **Icon stroke standardization (60×60 canvas, 4pt stroke).** Current Lucide
  icons use `strokeWidth` values ranging 1.5–1.8 across components. Scaled to
  a 60px canvas, a 4pt stroke ≈ `strokeWidth 1.6` in Lucide's 24-unit
  viewBox — the existing range is already in that ballpark and visually
  indistinguishable at these deltas. Standardizing to a single value (1.75)
  site-wide would mean touching dozens of files for a sub-pixel-scale
  cosmetic change with no custom icon artwork to validate against. Flagged
  here rather than done as a low-value mechanical sweep; happy to run it if
  wanted.
- **Full ARIA menu widget for the mega-menu** (arrow-key roving tabindex,
  `role="menu"`/`menuitem`) — current fix makes it keyboard-reachable via
  Tab/Escape, which is a real, working disclosure pattern, but not the
  full native-menu keyboard model.
- **BRAND_AUDIT color-ratio check** is a spot-check across representative
  sections, not a page-by-page audit of all ~15 routes × 11 locales.
