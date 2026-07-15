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
| `SectionHeading` (used ~20×) | Ocean-700 eyebrow/headings | Boomerang accent line (gold, not orange) + eyebrow rule | Paper background | Boomerang gradient |
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
