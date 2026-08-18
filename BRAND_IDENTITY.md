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
- **`SectionHeading`:** engineering-index eyebrow (Space Mono + bracketed index) — propagates to ~20 sections site-wide. **Two-tone title spec, per designer review:**
  - The lead line (`title`) is thin/medium weight in brand blue (`text-ocean-600`, not the near-black `#0B0B52`/`ocean-950` it originally shared with the bold line).
  - The second line (`titleAccent`) is bold brand orange — **`amber-500` (`#f5951f`), always**, on every background, per an explicit designer directive superseding an earlier `amber-700` AA-contrast fix. Gold stays reserved for the sparing Boomerang/GoldStamp premium marks, never the heading accent. **Known tradeoff:** `amber-500` on white/paper-2 measures **~2.28:1** — below the 3:1 AA floor for large text (the `amber-700` it replaced cleared that floor at 4.07:1). On dark (`bg-ink`) backgrounds it's a comfortable **~7.45:1**. This is a conscious brand-consistency-over-strict-AA call by the designer team, not an oversight — flagged here so it isn't "fixed" back to `amber-700` without checking with them first.
  - **The accent line always starts its own line** — enforced with `display: block` on the `titleAccent` span, not left to depend on the string being long enough to wrap naturally. Two lines, every time, at every viewport width and in every locale.
  - See the designer's annotated reference on the homepage `CompanyOverview` ("A 50-year legacy of / excellence in plumbing.") and `LatestBlogs` ("Guides, notes, / and field stories.") headings — both render through this one shared component, so the fix is centralized in `components/shared/SectionHeading.tsx` and cascades to every section that passes `titleAccent` (Timeline, OurStory, MissionVision, Leadership, Facilities, Certifications, IndustriesServed, WhyChooseUs, QualityCertifications, ManufacturingExcellence, Sustainability, plus the two homepage sections above and the `/tools/find-a-plumber` page's `h1`).
  - **Swept beyond `SectionHeading` too:** `ProductCategories` ("SIX CATEGORIES. ONE STANDARD.") was a hand-rolled duplicate of the old pre-fix eyebrow+heading markup (near-black `#0B0B52` + gold `#E0AF40`, both bold, both on one line) — replaced outright with `<SectionHeading>` itself, so it can't drift from this spec again. The other dark-hero pages don't use `SectionHeading` at all (a different 3-line white/accent/bold pattern on `bg-ink`, keyed off `heroLine1`/`heroLine2`/`heroBold`) but shared the exact same hardcoded gold hex on their middle line — `Hero.tsx` (homepage slideshow), `OurStory`, `ProductsHero`, and the `about`/`careers`/`contact`/`industries`/`manufacturing`/`quality`/`resources`/`resources/installation`/`sustainability` page heroes. All 11 had `text-[#E0AF40]` swapped to `text-amber-500`, keeping their existing light/light/bold weight rhythm intact — only the color changed, not the structure (that pattern's "second line" was already forced via `block`, so no line-break fix was needed there).
- **Icon+text vertical-alignment fix, applied sitewide.** Root cause: any `<button>`/`<a>` styled `flex`/`inline-flex items-center` with a lucide icon next to a *bare* text string renders that string using Anek Devanagari's full, untrimmed font metrics (`fontBoundingBoxAscent: 14` / `fontBoundingBoxDescent: 10` at 14px — a large, asymmetric allowance for Devanagari conjunct stacks that Latin labels never use), regardless of any `line-height` or `text-box-trim` set on the *container* — confirmed by direct A/B toggling on a live button: removing `text-box-trim` from the container changed nothing, because it was never taking effect there. The measured result was a real ~3px optical high-shift of the label versus an adjacent icon (verified via canvas glyph-ink scanning, not just DOM boxes). **Fix:** wrap the bare text in its own `<span>` carrying `leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]` — giving the *label itself* a real element lets the browser actually apply the trim, which a bare anonymous flex-item text node never receives. Verified this drops the offset to ~0px (largest residual seen: 0.01px, pure sub-pixel rounding).
  - **Generalized into `components/ui/button.tsx`:** the shared `Button` now auto-wraps any plain-string child in the corrected span (icon elements and the single element child `asChild`/Slot usages pass through untouched), so every `<Button><Icon/> Text</Button>` call site gets this for free with no per-site change.
  - **Applied by hand everywhere the pattern exists outside the shared `Button`** (custom `<Link>`/`<a>`/`<button>`/`<span>` markup, since `asChild` usages hide their real children from `Button`'s own wrapping logic): `Navbar` (nav dropdown chevrons, both "Request a Quote" CTAs), `LanguageSwitcher` (trigger + dropdown items), `PlumberFinder` (Search button — via the generalized `Button`, pincode chips, the "Plumber" tag, the phone-number link), `ProductCategories` ("VIEW PRODUCTS" + "View the full catalogue"), `QualityCertifications`, `Sustainability`, `ManufacturingExcellence`, `LatestBlogs`, `IndustriesServed`, `BlogScrollRow` (date), `NewsletterSignup` (success state), `InquiryForm` (submit button, both loading/idle states), `PipeSchematicNav` ("Explore"), `ProductCard` ("View specifications"), `ProductDetail` (sizes heading), `Facilities` (`GlobalPresence` stats), `OfficeLocations` (phone/email), and the `products/category/[category]`, `resources`, `industries`, `contact`, `careers` pages.
  - **Not a hack:** no `translateY`, negative margins, or arbitrary padding anywhere in this fix — every instance is the same structural correction (give the label a real, independently-styleable box), so it stays correct if the label text, font weight, icon, or button width ever changes.
- **Input placeholder/value vertical-centering fix — same root cause as the icon+text fix above, different component, and a real correction after an initial wrong fix.** Reported symptom: the newsletter email field (and every other text `<Input>` site-wide, same shared component) showed a visibly larger gap *below* the placeholder text than above it inside a fixed-height box — the same asymmetric Anek Devanagari metric behind the button/icon bug (`fontBoundingBoxAscent: 14` / `Descent: 10` at 14px vs. real glyph ink around `actualBoundingBoxAscent: 10` / `Descent: 3`).
  - **First attempt was wrong and shipped anyway:** copied the button fix's technique verbatim — `leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]` on the input's own classes. `getComputedStyle` echoed the properties back and `CSS.supports()` returned `true`, which read as confirmation, but neither actually proves the browser *applies* `text-box-trim` to a native `<input>`'s internally-rendered placeholder/value text — form controls use UA-level text layout, not the normal CSS text-box model these properties assume. Proven wrong with a controlled A/B test: two inputs rendered side by side, one with the trim properties and one without, zoomed 2.5–5× — pixel-identical text position in both. The earlier "verified visually" note in this entry was an overconfident read of a genuinely ambiguous screenshot; flagged here so the failure mode (checking that a property *computes* rather than that it *renders differently*) doesn't repeat.
  - **Real fix:** algebraically, an input's baseline position from the top of its content box is `H/2 + (fontAscent − fontDescent)/2`, independent of `line-height` entirely (the `leading-none` in the first attempt did nothing, provably) — so the only lever that moves the visible glyph is asymmetric padding. Measured `actualBoundingBoxAscent/Descent` across four representative strings (English "Enter your email": 10/3; the actual Hindi translation "अपना ईमेल दर्ज करें": 13/3; "Anil Sharma": 10/1; a phone number: 10/1) and solved for the padding-top-minus-padding-bottom each needed to perfectly center: 3, 6, 5, 5px respectively — all in the *same direction* (ink sits high), so one compromise constant helps every case with no case pushed the wrong way. Landed on `pt-[5px]` (padding-bottom left at 0), which keeps every sample within ±1px of ideal (worst case the Hindi string, 1px under-corrected). Confirmed this one actually moves the render with the same A/B test used to falsify the first attempt.
  - **Generalized into `components/ui/input.tsx`:** every consumer gets this for free — `NewsletterSignup` (footer), `InquiryForm` (name/company/email/phone), and `PlumberFinder` (pincode search) — with no per-site change needed. Re-verified all three render cleanly after the shared-component edit.
- **`ProductCategories` grid redesign — always 3×2, square cards, single-lever resizing.** The original layout was `flex` rows of 3 that stacked to **1 column on mobile** — 6 full-width cards stacked vertically, requiring several screens of scrolling. Replaced with a real CSS Grid (`grid-cols-3`, no responsive column-count change) so it's 3×2 at every viewport width, and every card is `aspect-square` (height always equals width — never the old flat rectangle).
  - **One resize lever:** the grid container's `max-w-*` (currently `max-w-3xl`) is the only value that needs to change to resize all six cards — because they're `aspect-square` in a fixed 3-column grid, changing the container's max-width scales every card together, still square, still identical to each other. Never put a fixed `w-*`/`h-*` on an individual card — that would override `aspect-square` and break both the square guarantee and the responsiveness.
  - **Alignment mechanics** (so all six stay identical regardless of content): the logo sits in a fixed-height box (`h-8 sm:h-14`) rather than scaling freely, because the six wordmark SVGs have different intrinsic aspect ratios and would otherwise render at six different heights. The description is `line-clamp-2` **plus a matching `min-h`**, so a short one-line translation reserves the same vertical space as a full two-line one — without that, the "VIEW PRODUCTS" row below would land at a different height per card. That row now follows the description with a small fixed margin (`mt-1 sm:mt-2`); it originally used `mt-auto` to force-pin itself to the card's bottom edge for the same alignment reason, but that stretched to fill whatever space was left in the square, which read as an oversized, awkward gap between the description and the CTA. Reserving the space up front (via `min-h`) let the CTA sit close to the description instead, with any true leftover space landing as trailing space at the bottom of the card instead of a gap in the middle.
  - **Mobile overflow — fixed.** The description/CTA text was a flat `text-[16px]` with no smaller mobile override; on phones the card is only ~104px square (sized by viewport width ÷ 3 columns — the grid's `max-w-3xl` cap only engages once the viewport is wide enough to exceed it, around tablet width), so at 16px the content vertically overflowed and got clipped by the card's `overflow-hidden`. Changed to `text-[10px] sm:text-sm` (description) and `text-[10px] sm:text-xs` (CTA), with the description's reserved `min-h` recalculated to match (`min-h-[28px] sm:min-h-[38px]`) — matches the mobile/desktop-split pattern already used for this component's logo height/padding/corner-radius. Verified via `scrollHeight`/`clientHeight` at 375px: no overflow on any of the six cards, full description text present (not clipped mid-word), desktop (248×248px squares) unaffected.
  - Also fixed in passing: `sm:text-md` on the description span is not a real Tailwind class (the scale is `text-sm`/`text-base`, no `-md` step) — it was silently a no-op, so the mobile `text-[16px]` was leaking through at every breakpoint instead of scaling down. Corrected to `sm:text-sm`.
- **`Navbar`:** display-face links (Indic-safe — no uppercase-mono on translated labels).
- **Home:** sheet indices across the section narrative (01–08); all headings now Space Grotesk.
- **`PipeSchematicNav`:** a built, standalone component — product categories rendered as valve taps on a flowing distribution rail, in a dark ink+blueprint band with flow-cyan accents and mono spec annotations (SCH 40/80, 82°C RATED, IS 4985…). **Correction:** not actually wired into any page (`grep` for it in `app/` returns nothing) — the live homepage category grid is `ProductCategories.tsx` (see the square-card grid entry above), which this component was originally intended to replace. Kept here as a signature piece worth reviving in a future pass, not as a description of current homepage behaviour.
- **`Footer`:** blueprint grid + flow-cyan top accent and link hovers (fills the audit's missing-accent gap).
- **`ScrollWaterRail`:** an ambient scroll-progress indicator — water rising in a 3px column pinned to the extreme right edge of the viewport (flow-cyan fill + lit waterline, no labels or numbers, zero content footprint). Mounted globally; decorative/`aria-hidden`, ≥md only, reduced-motion aware.
- **Reimagined sections (responsive):** WhyChooseUs (dark blueprint feature card in the bento), ManufacturingExcellence (connected process flow — horizontal rail on desktop, vertical on mobile), QualityCertifications (dark "credential vault" band), LatestBlogs (featured-story + compact reading-list magazine layout). Section sheet-index numbering removed.
- **Products:** inherits the type/palette/eyebrow system (mono category labels, Space Grotesk names) on top of the earlier tilt/animation pass.
- **404 (`NotFoundView`):** an editorial full-bleed 404 — Poddar's own hero footage behind a deep-ink legibility wash and brand-colour aurora, a gradient "404" over a bold headline, orange-glow CTA, and the HR + Distributor enquiry cards. Takes the full-bleed-imagery idea from industry leaders (GF / Aliaxis / Ashirvad) in Poddar's own assets. Type is `vh`-clamped so everything — including the enquiry emails — stays above the fold on every screen. Shared by a **global** `app/not-found.tsx` (own document shell for unmatched/non-localised routes; needs the root pass-through `app/layout.tsx`) and the **locale** `app/[locale]/not-found.tsx` (translated, inside the Navbar/Footer shell). See `NOTFOUND_DESIGN.md`.
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
