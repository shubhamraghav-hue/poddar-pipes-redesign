# Poddar Pipes — Brand Identity v2: "Engineering the Flow"

A bold rebrand of the Poddar Pipes visual identity, applied flagship-first (home +
products + shared layout). It keeps the **hard brand constraints** — the brand
colours must be present and contrast must meet WCAG AA — while deliberately
moving the *expression* beyond the original Brand Playbook (see `BRAND_AUDIT.md`
for the prior system).

## Concept

**Engineering the flow.** The site reads like a precision engineering document:
technical, confident, kinetic. Water moves through engineered networks —
pressure, valves, junctions, standards — and the identity makes that literal
through type, a blueprint aesthetic, and the pipe-flow motif.

## Typography (single typeface)

The identity uses **one typeface — Anek Devanagari — for every role**, with
hierarchy built from **weight and size**, not from contrasting families. All
three semantic tokens resolve to it (wired via `next/font` in
`app/[locale]/layout.tsx`, composed in `styles/globals.css`):

| Role | Token | Used for |
|---|---|---|
| Display | `--font-display` / `font-display` | Headlines, nav, large type — heavier weights |
| Technical | `--font-mono` / `.tech-label` | Eyebrows, spec data, standard codes, indices — uppercase + `0.2em` tracking + weight 500 carry the "label" character without a mono face |
| Body | `--font-body` | Paragraphs — regular weight |

Anek is a variable font covering Latin + Devanagari and many Indic scripts, so
the 11-locale site keeps full coverage from a single family. (An earlier draft
paired Space Grotesk + Space Mono; that was reverted to a one-face system by
request — single-typeface is also the original Brand Playbook's principle.)

## Colour (expanded, constraints kept)

Locked brand colours remain and blue stays dominant:

- **Blue** `#171796` (`ocean-*`) / ink navy `#14134f` — dominant surface & structure
- **Orange** `#F28000` (`amber-*`) — CTA / accent / active state **only** (never small text on white — fails AA)
- **Gold** `#e0af41` (`gold-*`) — sparing premium seal (Boomerang, GoldStamp)

**New accent — "Flow" cyan** (`--color-flow-200…500`, e.g. `#17b6d8`): water in
motion. Used for schematic lines, flow highlights, and accents on ink surfaces
where it clears AA. Subject to the same rule as orange — never small text on
white.

## Motifs & devices

- **Blueprint backdrop** — `.bg-blue` (fine minor grid + heavier major grid), engineering-drawing paper on ink surfaces.
- **Technical label** — `.tech-label` (Space Mono, uppercase, 0.18em) for the engineering voice.
- **Engineering sheet index** — `SectionHeading` accepts `index` ("01", "02"…), rendered as a bracketed mono tag; the homepage numbers its sections like a drawing sheet-set (an honest sequence read top-to-bottom).
- **Pipe-flow motif** — the existing original `FlowLine` (not a competitor's mark) is the backbone; it evolves into schematic dividers and (planned) interactive category navigation.
- Retained: **Boomerang** (gold heading accent), **GoldStamp** (credentials), **FeaturePill** (orange outline).

## Applied so far (flagship — shipped & verified)

- **Foundation:** type system, flow-cyan palette, `.bg-blue`, `.tech-label` — transforms the whole site's type instantly.
- **`SectionHeading`:** engineering-index eyebrow (Space Mono + bracketed index) — propagates to ~20 sections site-wide.
- **`Navbar`:** display-face links (Indic-safe — no uppercase-mono on translated labels).
- **Home:** sheet indices across the section narrative (01–08); all headings now Space Grotesk.
- **Signature — `PipeSchematicNav`:** product categories rendered as valve taps on a flowing distribution rail, in a dark ink+blueprint band with flow-cyan accents and mono spec annotations (SCH 40/80, 82°C RATED, IS 4985…). Replaces the old category card grid on the homepage.
- **`Footer`:** blueprint grid + flow-cyan top accent and link hovers (fills the audit's missing-accent gap).
- **`ScrollWaterRail`:** an ambient scroll-progress indicator — water rising in a 3px column pinned to the extreme right edge of the viewport (flow-cyan fill + lit waterline, no labels or numbers, zero content footprint). Mounted globally; decorative/`aria-hidden`, ≥md only, reduced-motion aware.
- **Reimagined sections (responsive):** WhyChooseUs (dark blueprint feature card in the bento), ManufacturingExcellence (connected process flow — horizontal rail on desktop, vertical on mobile), QualityCertifications (dark "credential vault" band), LatestBlogs (featured-story + compact reading-list magazine layout). Section sheet-index numbering removed.
- **Products:** inherits the type/palette/eyebrow system (mono category labels, Space Grotesk names) on top of the earlier tilt/animation pass.
- Builds on the prior bold-animation pass (`poddar-pipes-motion`): parallax hero, tilt cards, marquees, word-rise headings.

## Planned next (remaining)

1. **Product spec-sheet treatment** — dedicated Space Mono spec tables and dimension annotations (Ø, IS codes) on `ProductDetail`.
2. Extend bespoke treatment page-by-page: about, contact, resources, quality, careers (these already inherit the type/palette/eyebrow system automatically; they need per-page polish + verification).
3. Optional: evolve `FlowLine` schematic dividers between more sections; consider a persona/segment selector (skill `pipe-design-inspirations`, pattern #2).

## Hard rules (never break)

- Brand blue/orange/gold must be present; blue dominant.
- Orange **and** flow-cyan: never small/body text on white (AA). Outline/border/tint/large-on-dark only.
- Every animation respects `prefers-reduced-motion`.
- Indic-script coverage preserved (Anek fallback in every stack).
- Motifs stay **original** — inspiration from industry leaders, never a competitor's logo/mark/layout.
