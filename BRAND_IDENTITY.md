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

## Figma landing-page rebuild — Hero, Categories, Legacy, CTA (node 13:309)

A separate, later pass: pixel-match the homepage to a specific Figma file
(`RFfPXq5WraSb2tFlgEO6yr`, node 13:309) via `figma-design-to-code` — Hero →
Categories → Legacy → CTA, in that exact order. Sections the current homepage
had that the mock doesn't (WhyChooseUs, IndustriesServed,
ManufacturingExcellence, QualityCertifications, Sustainability, LatestBlogs)
were **commented out of `app/[locale]/page.tsx`, not deleted** — their
component files and translation keys are untouched, so they're one uncomment
away from coming back.

### A real, sitewide bug found along the way (not a Figma-matching issue)

Every `<Button asChild>` — i.e. every Link-wrapped CTA button using the
shared `components/ui/button.tsx`, on **every page**, not just the ones being
rebuilt — was rendering completely empty. `Button`'s own content logic ran
`React.Children.map` even for the single-element `asChild` case; that helper
always returns an array, even for one input, and Radix `Slot` needs a bare
element, not an array-of-one. The installed `@radix-ui/react-slot@1.1.1`
silently rendered nothing when handed that mismatched shape — no console
error, nothing — which is exactly why it went unnoticed. Upgrading to
`1.3.3` (which throws `"Slot failed to slot onto its children"` instead of
failing silently) is what actually surfaced it. Fixed the real bug in
`button.tsx`: `asChild` now passes `children` straight through, skipping
`.map()` entirely for that path. Verified fixed on the rebuilt pages *and*
spot-checked About/Contact (untouched by this rebuild) to confirm it wasn't
scoped to anything Figma-related.

### Hero video — five real problems, in the order they were found

1. **Figma's own hero video isn't recoverable.** The "MP4 2K1" layer only
   exports through the API as a flattened static PNG — there's no way to pull
   the actual video file out of Figma this way. The client supplied the real
   intended footage directly as a 91 MB GIF instead.
2. **First compression pass was too soft.** 1140×640 @ CRF 32 → 2.85 MB looked
   visibly blurry once actually compared side-by-side against the Figma
   prototype's own (much higher quality) preview. Re-encoded at 1920×1080 @
   CRF 30 → 10.86 MB — still a ~99% reduction from the source GIF, but sharp
   at the hero's real display size instead of looking upscaled.
3. **The real bug behind a "washed-out lavender" background**: the encode
   used `-pix_fmt yuv420p` (no alpha channel), which silently flattened the
   GIF's genuinely transparent background to solid white *before* any CSS
   ever touched it. A subsequent attempt to fix the resulting wash-out with a
   `mix-blend-multiply` CSS overlay was solving the wrong layer of the
   problem — proven by extracting a raw decoded frame and sampling actual
   pixel values via canvas (confirmed solid `rgb(255,255,255)`, not a light
   tint). Separately confirmed the source GIF *does* carry real transparency —
   extracted a PNG frame and ran a histogram on its alpha channel: ~62% of
   the frame is genuinely transparent, and it's clean binary alpha (no
   partial/antialiased pixels), not a soft mask. Re-encoded with
   `-pix_fmt yuva420p`; confirmed via the WebM's own `alpha_mode:1` tag.
   VP9-alpha-in-WebM is natively supported by `<video>` in every evergreen
   browser, so the earlier CSS blend-mode overlay became unnecessary and was
   removed — the grid backdrop now shows through the video's real transparent
   gaps on its own.
4. **"Outgrowing the section," then over-corrected, then reconciled with
   Figma's actual mechanism.** To satisfy an earlier ask that the video show
   behind the stat cards too, it was set to `absolute inset-0` of the whole
   *combined* hero+stats section — which, on real (taller) combined-height
   layouts, stretched the same 1512×846-composed footage well past its
   intended crop, visibly spilling fittings across multiple stat cards. The
   first fix confined the video to its own `overflow-hidden` box sized to
   Figma's exact 846-at-1512 ratio — technically correct, but it also killed
   the "pipe subtly peeking through the last tile" look that's actually
   present in Figma's own reference. Re-checked Figma's real layer numbers:
   the video there is *never* taller than 846px — the stats frame just
   starts 63.68px (846 − 782.32) *before* the video's own bottom edge, so the
   translucent cards simply reveal whatever the video still happens to be
   rendering in that shared band. Reproduced that directly: video lives at
   the outer-section level again (not re-stretched — same undistorted
   846-ratio size as the "confined" fix), and a redundant opaque `bg-ink`
   that had been added directly behind the stat cards (which was fully
   blocking the peek-through) was removed. The negative-margin overlap
   amount (`-mt-16`/`sm:-mt-20`, 64–80px) was already correctly calibrated
   against Figma's 63.68px from the very first pass.
5. **Mobile needed a genuinely different crop, not a resize.** Below `md` the
   hero box's own ratio flips from Figma's ~1.79:1 landscape to a ~0.6:1
   *portrait* shape — `object-cover`-ing the same 1920×1080 landscape clip
   into that meant scaling up until height fit, cropping away most of the
   width and leaving only a narrow, arbitrarily-positioned vertical sliver of
   the composition. Went back to the original 2576×1440 GIF source and cut a
   deliberate 1080×1440 (3:4) portrait crop by eye (checked the raw frame
   first, picked a region with a balanced spread of fittings, nothing halved
   awkwardly at the edge) — a real second composition, not the first one
   resized. Wired via two `<source media="...">` children inside one
   `<video>` (native browser-side switching, no JS needed for the swap
   itself) plus a small `matchMedia` check for the one thing that can't vary
   per-`<source>` — the `poster` attribute.
   - **Directly answered "should we just use GIF instead" here**: switching
     back to GIF wouldn't change any of this. Cropping/`object-cover`/
     `backdrop-filter` behavior is entirely CSS-driven and format-agnostic —
     a GIF crops exactly the same way a WebM does. The only thing GIF would
     change is undoing the whole point of the compression pass (91 MB → 12
     MB), reintroducing the load-time risk that pass specifically fixed.

### Stats cards — exact Figma ratio, and a real Tailwind bug found doing it

Card is locked to Figma's own `281.5:253` box via `aspect-[563/506]`, and
every internal measurement (corner radius, both digit sizes, insets, label
width) is expressed as a `cqw` (container-query-width) percentage of that
same box, so the ratio holds pixel-for-pixel at *any* rendered size instead
of only at a couple of hand-picked breakpoints. Found a real bug doing this:
Tailwind's `rounded-[value_cqw]` compiles to a nonstandard two-axis
(horizontal/vertical) border-radius that inflates hugely with `cqw`
specifically — turned every card into a near-circle. Font-size and
position `cqw` values on the *same* card computed correctly (confirmed via
`getComputedStyle`); it's specifically the `rounded-*` utility's own
codegen that mishandles `cqw`. Fixed by using a plain `%` for the radius
instead — percentages are natively self-relative for `border-radius` (no
container-query machinery needed for that one property), sidestepping the
bug entirely.

**Card surface — went through two looks, second one by explicit request.**
Figma's own exported fill for the card is a flat `bg-white/5` — the design
tool doesn't expose Figma's "background blur" effect or multi-stop gradient
fills as Tailwind output. First pass invented a glassmorphism look from the
card's rendered screenshot instead (diagonal gradient + `backdrop-blur-md`)
to approximate what the blur/gradient probably looked like. Reverted to
Figma's literal flat `bg-white/5`, no blur, per explicit direction ("a pure
overlay instead of the blurred one") — the video (and the last card's pipe
fitting) now shows through sharp and slightly shaded, not frosted.

### Category cards — a real hover interaction found in the Figma export, not designed from scratch

Figma's card component actually has Default/Hover variant data baked into
the exported code (node 13:317 and siblings): "VIEW PRODUCTS" sits parked
below the visible card (`bottom:-90px`) on Default and slides up to
`bottom:20px` on Hover, with the logo/description easing up ~90px to make
room. Reproduced as a reveal-on-hover (opacity + translate) rather than
literal absolute offsets, since this card's own layout is responsive
flex/aspect-square, not Figma's fixed 375px box.

### Other fixes from this pass

- **`ProductCategories` full-bleed background was clipped to a centered
  1400px column on screens wider than 1400px**, leaving white gutters on
  either side. Cause: `container-edge` (which bakes in `max-w-[1400px]
  mx-auto`) was applied directly to the `<section>` that also carried the
  section's own `bg-[#F5F5F5]` — so the *background* got width-capped along
  with the content. Every other section on the site avoids this by keeping
  the background on the outer full-width `<section>` and putting
  `container-edge` on an inner content `<div>` instead; moved it there.
- **`CTASection` gained a `variant` prop** (`"card"` default, `"flush"` new) —
  the homepage's Figma-exact full-bleed CTA (node 13:456) needed a
  fundamentally different treatment (no rounded corners, no outer margin)
  from the rounded-card version every other page using this shared component
  already relies on. Scoped via the variant, not a new component, so the
  other ~14 call sites (About, Contact, Quality, Sustainability, Industries,
  FAQ, Articles, Calculator, Installation Guide, Plumber Finder, category
  pages…) are completely unaffected.
- **`Navbar` made static.** Was `fixed` + transparent-over-hero, turning solid
  (`bg-paper/95`) on scroll past 20px — matching Figma's actual header
  (always solid white, no scroll-state) meant removing the `scrolled` state
  and every `solid`-conditional branch, not just changing a default. Verified
  it still reads correctly on both dark-hero pages (Home) and light-hero
  pages (About, Contact) afterward.
- **Real assets committed instead of stock/placeholder photography or
  Figma's own ~7-day-expiring asset URLs**: 6 category-card product photos +
  the "GOLD" ribbon badge SVG (`public/products/category-cards/`), the
  Legacy section's manufacturing-floor photo, and the CTA section's
  background photo (the last one scoped only to the homepage's new `flush`
  variant — the ~14 other `CTASection` call sites keep their existing stock
  photo unchanged).
- **Hero text wasn't actually responsive — two related but distinct bugs,
  found from the same user-reported screenshot (768×846 viewport).**
  1. The hero text wrapper used a *fixed* height (`h-[55.95vw]`, chosen to
     match the video's own Figma-ratio sizing) rather than a minimum. Text
     and video don't need to share an exact height — they're separate
     elements — so at narrower widths the formula produced a shorter box
     than the text stack actually needed, and the overflow spilled straight
     into the stats row below it (visible as the CTA buttons overlapping the
     stat cards). Fixed by switching to `min-h` (uncapped), decoupling the
     text box's sizing from the video's crop-ratio requirement entirely.
  2. Separately: eyebrow/headline/description/gaps/padding all jumped
     straight to their full Figma desktop size at the very first breakpoint
     (`sm:`, 640px) and then never changed again all the way up past 1512px —
     while the box height keeps growing continuously with width the whole
     time. Reworked to a graduated `base → sm → md → lg → xl` scale that only
     reaches Figma's exact numbers at `xl` (1280px+), so text size and
     available box height grow roughly in step instead of racing on
     completely different curves.
- **Parallax removed from the Hero** (explicit request) — the
  scroll-scrubbed `videoY`/`videoScale`/`contentY`/`contentOpacity`
  transforms (video drifting + scaling, text lifting + fading as the hero
  scrolls) taken out entirely; both `motion.div` wrappers simplified back to
  plain `div`s. The scroll-driven curved-bottom-edge clip-path was a
  *separate* effect (a shape, not a scroll-parallax) and was deliberately
  left in place at the time since it wasn't part of that request — later
  removed outright in a subsequent pass (see below), so this is history,
  not current state.
- **Curved-bottom-edge clip-path removed entirely (Aug 2026, explicit
  request).** The `<section>` was a `motion.section` purely to animate
  `clipPath: ellipse(${rx}% ${r}% at 50% 0%)` as `heroRy` tracked
  `scrollYProgress` — the hero's bottom edge dipped into a curve as it
  scrolled toward the top of the viewport. Removed along with everything
  that only existed to support it: the `rx` state + its resize listener
  (`getCurveRx` from `lib/motion.ts` — still used elsewhere, e.g.
  `SectionCurve.tsx`, don't touch that file for this), `scrollYProgress`/
  `heroRy`/`heroClipPath`, `sectionRef` (was only the scroll target),
  `prefersReducedMotion`/`useReducedMotion` (only gated this clip-path),
  and the entire `framer-motion` import — none of it had any other use in
  this component once the curve was gone. `motion.section` reverted to a
  plain `<section>`. If a scroll-driven shape effect is ever wanted back
  on the Hero specifically, `SectionCurve.tsx` already has the working
  pattern to reuse rather than reintroducing bespoke state here.
- **A `mt-[93px]` nav-clearance gap was added, then explicitly reverted.**
  Figma's own nav sits in normal document flow (not fixed), so its hero body
  genuinely starts at `top:93.32px` against an 80px header — a real ~13px
  gap baked into the design. Once the Navbar went static/solid (see above),
  the video's visible content began exactly at the nav's bottom edge with no
  breathing room, so the margin was added to reproduce Figma's gap. Later
  removed again on request — current state has no gap; the two options and
  the reasoning for each are preserved here in case it comes up again.
- **Copy: kept accurate content over literal Figma text once, then matched
  Figma exactly once told to.** Figma's copy says "Manufacturing since 1991"
  and lists "uPVC, CPVC, HDPE, and SWR" in the hero description — but the
  site's existing copy said "1981," and HDPE isn't one of the 6 real product
  categories anywhere else on the site (the real six are uPVC, CPVC, SWR,
  TANKS, UGD, Agriculture). First pass kept the existing, seemingly-more-
  accurate copy and flagged the discrepancy rather than silently overriding
  a factual claim. Explicitly told "I want the Figma as it is" afterward —
  both values (English and Hindi) were changed to match Figma's literal text.
- **A quiet false alarm, worth recording so it doesn't get "fixed" again**:
  `video.paused` intermittently read `true` with `currentTime` genuinely
  stalled during testing. Root cause was the *test tooling* — a background
  browser tab that was created but never brought to the front, and browsers
  throttle/pause media in inactive tabs to save power. Confirmed by fronting
  the tab: playback resumed immediately. Not a real autoplay bug — a site
  visitor's tab is always the active one. A defensive explicit `.play()`
  call (on mount and on `onLoadedData`) was added anyway as cheap insurance,
  but it wasn't fixing anything that was actually broken.

### Hero — August 2026 follow-up pass (video sync, occlusion, vignette)

A later session revisited the Hero after the above had already shipped
uncommitted. **Read the actual numbers below before touching any of
`h-[55.95vw]`, `h-[133.333vw]`, the `-mt-16`/`-mt-20` overlap, or the two
gradient divs — every one of them is calibrated against a specific Figma
node, not a guess, and changing one without the others re-breaks something
this pass fixed.**

**Video/text-box height sync — a cap on one side silently breaks the other.**
The video and the text box above it both use the literal `55.95vw` (desktop)
formula so their heights always match at every viewport width — that's what
makes the fixed `-mt-16 sm:-mt-20` overlap land in the same place on the
video regardless of screen size. At one point the video alone picked up
`md:max-h-[846px]` (matching Figma's exact reference-width pixel value) —
correct at 1512px, but it stops the video from growing past that on wider
screens while the uncapped text box keeps growing, which both shrinks the
video relative to the viewport AND reopens a gap between the video's bottom
edge and the stats overlap. Fixed by removing the cap so both sides stay
uncapped and in sync — matches how this pair worked before the cap was
added. **Rule going forward: never cap only one of this pair.**

**Below-`md` (mobile/phablet) zoom drift — height must track the crop's own
ratio, not a flat pixel value.** The mobile crop is a fixed 3:4 (1080×1440)
composition, but the box holding it used a flat `h-[640px]` regardless of
width. Box aspect (`width / 640`) only matched the crop's `0.75` exactly at
480px; everywhere else `object-cover` cropped increasingly hard — up to
~37% of the frame lost by 767px, cropping from the sides below 480px and
from top/bottom above it. Fixed by using `h-[133.333vw]` (`= 1440/1080`) on
both the video and its sibling text box, so the box always matches the
crop's own ratio exactly, at every width below `md` — zero cropping loss
anywhere in that range, not just "less than before."

**Desktop video re-encoded at native 2576×1440, not 1920×1080 — a real
resolution ceiling, found from a DPI-scaling complaint, not a compression
setting.** On any display running >100% OS scaling (125%/150% is the
Windows default on most laptops), the video's rendered CSS width can
exceed 1920 *physical* pixels, forcing an upscale of a source with no more
detail to give — visibly softest at the small, high-contrast stats-tile
overlap crop. The original 91MB source GIF is actually 2576×1440 (confirmed
via `ffprobe`) — the desktop encode had been *downsampled* to 1920×1080
along the way for no documented reason. Re-encoded directly from the GIF at
its own native resolution (same `-pix_fmt yuva420p -metadata:s:v:0
alpha_mode=1 -auto-alt-ref 0` alpha settings, `-crf 30 -b:v 10M -maxrate
14M` to keep the ~1.79× pixel-count increase from ballooning file size
unboundedly — landed at ~24MB, up from ~12MB, a real bandwidth trade-off
made deliberately, not by accident). **Gotcha that will resurface if this
is ever re-encoded again:** `ffmpeg`'s own CLI decode of a WebM VP9 alpha
stream silently drops the alpha side-channel and returns fully-opaque
frames — even though the exact same file decodes alpha correctly during
real `<video>` playback in Chromium (confirmed both ways via canvas pixel
sampling). So the poster PNG must always be extracted from the *original
GIF/source*, never re-extracted as a frame of the already-encoded WebM, or
it silently ships an opaque poster with no error or warning anywhere.

**Stats-tile "pipe peeking through" — checked against Figma's real node
tree (`13:313`, "hero + stats"), not eyeballed:**
- Video box: Figma `y = 0 → 846`.
- Stats frame: starts at `y = 782.32` → 63.68px shared with the hero box
  (the number the `-mt-16`/`-mt-20` margin is already calibrated to).
- Cards themselves start at `y = 796.0` (stats frame + 13.68px inner
  padding) → the actual video/card overlap is **50px, ~20% of each card's
  253px height**.
- Figma's own layer order lists the entire "stats frame" group *before*
  "Hero Section" as a sibling — the video sits above the WHOLE stats group
  in Figma's own z-order, not the reverse. What actually protects the real
  counter (`y=881`) and label (`y=933`) isn't z-index, it's pure geometry:
  both already sit below the video's `y=846` bottom edge, so the video can
  never physically reach them regardless of stacking. Only the oversized
  ghost-digit watermark (`y≈772`) is inside the video's reach.

Implemented as two grid layers sandwiching the video by explicit z-index
(`z-[1]` shell+ghost digit, below the video's `z-[2]`; `z-[5]` counter+label
only, above it) rather than one div showing the video through a translucent
background — a single div can't be simultaneously above the video (so its
own border/shadow/ghost-digit render) and below it (so the pipe genuinely
occludes them), only two elements sandwiching a z-indexed video can. Both
grids share identical `container-edge`/`grid-cols`/`gap`/`py` classes so
CSS Grid computes matching cell rects with no manual pixel alignment. The
wrapper itself carries no `z-index` — that would make its whole subtree one
atomic stacking unit and block the video from interleaving between the two
layers at all.

**The two hero gradients — both real Figma layers, not designer's-eye
approximations:**
- **Legibility gradient** (node `13:426`): linear, ink `#14134f` solid at
  the left edge fading to transparent by `1138/1512` (~75%) of the hero's
  width. Implemented as a plain CSS `linear-gradient`.
- **Vignette** (node `13:427`, added this pass — this is the "top-left
  corner darkening"): a *radial* gradient, transparent at its own center
  `(1102.7, 396.74)` — right-of-center in the 1512×846 box — fading to solid
  ink outward, at 35% opacity overall. Since the transparent point sits
  right-of-center, the corner farthest from it (top-left) is where it reads
  strongest — that's the effect, not a separate top-left-specific layer.
  The `gradientTransform` matrix Figma exports rotates the ellipse; CSS
  `radial-gradient()` has no syntax for that rotation, so this is ported as
  the exact SVG Figma generates (`HERO_VIGNETTE_SVG` in `Hero.tsx`) rather
  than hand-approximated — a hand conversion would only be a lossy guess at
  something already available exactly. `md:` only (`hidden md:block`): this
  belongs to Figma's desktop 1512×846 composition specifically, which has
  no defined equivalent for the mobile portrait crop's own distinct
  composition.

**Follow-up bug found immediately after adding the above: giving the video
an explicit `z-[2]` (for the stats-tile occlusion fix) silently neutralized
BOTH gradients over the headline.** `bg-grid-dark`, the legibility gradient,
and the vignette had no `z-index` of their own — an element with an
explicit *positive* z-index paints above every `z-index: auto` sibling
regardless of DOM order, so once the video picked up `z-[2]`, it started
painting over all three instead of the reverse, even though they come
later in the DOM. The headline still looked fine at a glance (the busy
video imagery just showed through undimmed), which is exactly why this
kind of regression is easy to ship unnoticed — always check the *headline*
area, not just the stats tiles, after touching any z-index in this
component. Fixed by giving all three `z-[3]` (above the video's `z-[2]`,
below the text content's existing `z-10`). They also geometrically reach
into the stats-tile overlap sliver (this box's height matches the video's
via the shared `55.95vw`/`133.333vw` formulas), so they now paint above
that region's card shell (`z-[1]`) too — confirmed harmless, since the
legibility gradient is already faded to near-transparent by that point
(past 75% width) and the vignette's transparent center sits almost exactly
over that side of the hero.

### Tagchips (stats cards) — rebuilt against a second, more precise Figma source

A later request asked specifically about the tagchips (stat card) internals
against a *different* Figma file — `6jLHH8FxOKbRcIWOpIiWcx`
("Poddar-Pipes-Website"), node `810:1025` — which has the identical
structure/numbers as the original `RFfPXq5WraSb2tFlgEO6yr` node `13:314` but
was pulled via `get_design_context` (not just `get_metadata`) for the actual
CSS this time, not just positions. That surfaced several real errors in the
earlier hand-derived values — **read this before touching any cqw value,
border color, or shadow on this card again:**

- **Border color was wrong.** Figma's exact export: `border
  border-[#0b0b52]` — a dark navy, not `border-white/15`. `#0b0b52` is
  deliberately literal here, NOT the `ink` design token (`--color-ink:
  #14134f`) — it's the same slightly-different navy Figma's own hero base
  rect (node 13:358) uses, distinct from the token used everywhere else on
  the page. Don't "fix" it to match the token; it's a real, separate value
  in the source.
- **The inset-highlight + drop-shadow was invented, not from Figma.**
  Figma's actual export for this card has no `box-shadow` at all — just the
  flat `bg-white/5` + `border-[#0b0b52]`. Removed entirely.
- **Ghost digit and counter/label position were both wrong** — both had
  been approximated as sitting directly at the card's own edge insets. The
  real Figma structure nests each through 2–3 padded wrapper frames before
  reaching the actual glyph, which shifts the true position measurably:
  - Ghost digit: `left: 21.28cqw, top: -1.78cqw` (was `10.3cqw, -8.9cqw`).
    Derived by walking the actual nesting: card → `Frame 30` (left 29px) →
    `Frame 28` (row, left 0) → `Frame 27` (left 11px) → `Frame 26` (left
    10px) → text itself (left 10px) = 60px total = 60/281.5 = 21.28cqw. Top
    similarly nets to −5px (not −25px) once the two 10px top-paddings on
    the way down are added back to the wrapper's own −25px.
  - Counter + label were previously anchored to the card's BOTTOM edge —
    wrong on the mechanism, not just the number. Figma anchors this whole
    block from the TOP (the same `Frame 30` the ghost digit hangs off, at
    `top: -25px`), which is why there's genuine empty space at the bottom
    of every real card in Figma's own screenshot, never filled by content.
    Counter: `top: 33.4cqw, left: 13.85cqw`. Label: `top: 53.64cqw, left:
    13.85cqw` (positioned independently, not as `margin-top` under the
    counter — they're two separate sibling frames in the source, not a
    shared stack, so compounding one's position off the other's box model
    would drift). Font-size/color/line-height/max-width for both were
    already correct (they happened to already match this file's numbers);
    only the anchor edge and left/top offsets were wrong.
  - Both digits' `letter-spacing` were also off: ghost is `-1.4539px`
    (`-0.516cqw`), counter is `-0.64px` (`-0.227cqw`) — Figma exports exact
    fractional tracking, not a rounded value.
- **Ghost digit and counter still live in separate DOM layers** (below vs
  above the video z-sandwich from the previous pass) even though Figma
  itself expresses their relationship as a single flex row with negative
  margins (`margin-right: -57px` pulling the counter to overlap the ghost
  digit, both `items-end` in an `isolate`d row). That mechanism only works
  between true DOM siblings in normal flow — it can't reach across the two
  separate stacking layers the occlusion fix requires, so both were
  converted to independently-computed absolute coordinates instead
  (documented above) rather than ported as literal flex/margin CSS. The
  resulting on-screen position matches Figma's; the DOM mechanism
  necessarily doesn't, and that's why.
- **Explicit user decision, overrides literal Figma fidelity on this one
  point:** in Figma's own source, the video's effects group (which the
  grid pattern + both gradients belong to) sits above the ENTIRE stats
  frame in z-order and geometrically reaches 63.68px into it — so Figma's
  own composition technically does let those effects reach the first
  sliver of the stats tiles. The user explicitly asked that they NOT
  affect the tile section regardless. Implemented by capping all three
  overlays' height at `calc(100% - 4rem)` / `sm:calc(100% - 5rem)` (NOT
  `inset-0`) — exactly where the `-mt-16`/`-mt-20` negative margin starts
  pulling the stats tiles up, confirmed pixel-exact via
  `getBoundingClientRect` (overlay bottom = shell grid top, zero overlap).
  If Figma fidelity on this specific point is ever requested again, this
  is the one deliberate exception to revert.
- **Second explicit override on the same gradient:** the legibility
  gradient's fade point was moved from Figma's literal `75%` to `50%`
  (`transparent 50%` in the `linear-gradient`) on request — negligible
  from the horizontal middle onward instead of reaching most of the way
  across, so the pipe imagery past center reads clean and untinted. Purely
  a user preference call, not a Figma-derived number; if a future pass
  wants Figma's literal value back, that's `75%`.
- **The height-cap above (`calc(100% - 4rem)`) then needed a taper, not
  just a hard cutoff.** Clipping all three overlays at a flat height left
  a visible seam right above the stats tiles — none of the three fade to
  zero on their own by that exact point (the grid pattern repeats
  indefinitely, the vignette's falloff is gradual, not zero at any fixed
  radius), so an abrupt clip reads as a hard edge/band rather than a clean
  disappearance. Fixed by adding `maskImage: linear-gradient(to bottom,
  black 80%, transparent 100%)` to all three — tapers out over the last
  20% of their (already-capped) height, landing at the same cutoff point
  with no visible seam. Confirmed via `getComputedStyle(...).maskImage` on
  all three during verification.
- A small, expected residual gap exists between the coded `top` percentage
  and the browser-rendered glyph's visual top (confirmed a few percentage
  points off via `getBoundingClientRect` during verification, while the
  `left` values matched exactly) — normal cross-tool font-metric drift
  (ascent/line-box handling differs between Figma's text engine and
  browsers), not a math error in the values above.

### Tagchips — the "3D bulge" was a real Figma "Glass" effect dev-mode silently drops

A user screenshot of the Figma desktop app's Effects panel (not dev-mode/
code view) revealed a **Glass** effect on the card that had been assumed
absent: fill `FFFFFF`, stroke `0B0B52` (matches what was already
implemented), light −16°/80%, refraction 100, dispersion 100, depth 32,
frost 0. Every earlier `get_design_context` call on this card — including
one with `forceCode: true` specifically to rule out truncation — showed no
shadow/effect property at all. **Lesson: dev-mode codegen can silently
drop an effect type it has no translation for, with no error and no
placeholder — "not in the code export" is not reliable evidence an effect
doesn't exist.** For a component that looks suspiciously flat, checking a
raw Figma screenshot (or asking the user to check the Effects panel
directly, as happened here) is worth doing before concluding there's
nothing there.

CSS has no real equivalent for refraction/dispersion — that requires
actual backdrop distortion (an SVG filter or WebGL shader), not achievable
with border/shadow/gradient. Implemented a visual approximation of the
*read* instead of the mechanism: a diagonal sheen
(`background-image: linear-gradient(115deg, ...)`) plus a rim-light
(`box-shadow: inset 0 1px 0 ..., inset 1px 0 0 ...`) along the top/left
edges, where the −16° light would catch. `frost: 0` in Figma (clear, not
frosted glass) is why there's still no `backdrop-blur` here — consistent
with the earlier explicit "sharp, not frosted" direction from the first
tagchips pass, not a reversal of it.

First-pass opacities read as too strong ("bulged," correctly — Figma's own
effect is subtle at 80% light intensity on a dark navy card, not a bright
highlight). Halved: sheen `rgba(255,255,255,0.16/0.04)` →
`rgba(255,255,255,0.07/0.02)`, rim-light `rgba(255,255,255,0.28/0.1)` →
`rgba(255,255,255,0.14/0.05)`. **If this needs adjusting again, tune those
two opacity pairs in the `style` prop on the card shell in `Hero.tsx` —
don't re-derive the approach.**

### Dead-code cleanup + comment consolidation (Aug 2026)

A pass through the whole Hero area to remove content the site no longer
needs, now that the old 5-slide carousel is fully gone:

- **`lib/data/heroSlides.ts` deleted outright** — the `HeroSlide` interface
  and its 5-slide array had zero remaining imports anywhere once `Hero.tsx`
  moved to the single Figma scene; nothing else ever referenced it directly
  (unlike the slide video files, see next point).
- **`public/hero/slide-2.webm` through `slide-5.webm` deleted** —
  orphaned once `heroSlides.ts` (their only referencer) was gone.
  `slide-1.webm` and `poster-placeholder.svg` were kept: `NotFoundView.tsx`
  references both directly by path for the 404 page's own background
  video, independent of the Hero carousel that used to share them.
- **16 orphaned `heroSlide_{decades,infrastructure,trust,irrigation}_*`
  translation keys removed from `messages/en.json` and `messages/hi.json`**
  (the only two locales that had ever been translated for the old
  carousel's other 4 slides — the other 9 locales never had them). Only
  `heroSlide_growth_*` remains, matching the single scene actually in use.
- **`Hero.tsx`'s inline comments condensed** — the file had accumulated a
  detailed engineering-diary style of comment (full "earlier this was X,
  then Y, then Z" narratives) from several iterative passes. Trimmed each
  to state the current invariant and its one non-obvious reason, since the
  full history serves no one reading the component going forward — that
  history now lives in this file instead, in the sections above. If you
  need the detailed reasoning/derivation behind a specific number or
  decision in `Hero.tsx`, it's documented here under this section's
  siblings above, not truncated — the code comment is intentionally the
  short version.

## Legacy section (`CompanyOverview.tsx`) — checked against Figma node 810:1159

Same canonical file as the tagchips work (`6jLHH8FxOKbRcIWOpIiWcx`). Four
real deviations found and fixed, two of which collided with sitewide brand
decisions made in an earlier pass — confirmed with the user before
resolving either way rather than picking a side silently:

- **Heading, 2nd line color.** Figma: both lines the same navy (`#0b0b52`
  ≈ `ocean-950`), weight is the only distinction (light → bold). The
  shared `SectionHeading` component's `titleAccent` prop instead forces
  every accent line to brand orange sitewide — itself a deliberate past
  designer directive (see the component's own code comment). **Resolved
  in Figma's favor for this section specifically**, via a new opt-in
  `matchAccentColor` prop on `SectionHeading` (default `false`, so every
  other of its ~20 call sites is unaffected) — when true, both spans use
  `ocean-950`/weight-only instead of the orange accent. Also caught in the
  same fix: the *lead* line was rendering `ocean-600` (`#171796`, a bright
  blue-purple), not `ocean-950` (`#0c0b3f`, the one actually close to
  Figma's `#0b0b52`) — `matchAccentColor` corrects both spans at once.
- **"MANUFACTURE" label color.** Figma: `#f28000` — exactly the
  `amber-600` token (confirmed via `globals.css`, not `amber-500`, a
  different, lighter orange used elsewhere). Was `text-flow-300` (cyan),
  left over from the "Engineering the Flow" rebrand pass applying its new
  accent broadly. **Resolved in Figma's favor** — this label reads as a
  literal callout tag on a photo, not a rebrand-scoped UI element.
- **Description text color** — Figma `#606060`, was Tailwind `slate-600`
  (`#475569`, a cooler blue-gray unrelated to Figma's neutral gray). Pure
  drift, not a deliberate choice; fixed to the literal hex.
- **Photo gradient overlay** — Figma `rgba(9,12,40, 0→0.92)` (near-black),
  was `ink/95` (`#14134f`-based, visibly more purple/lighter). Pure drift;
  fixed to the literal rgba values, fade point kept equivalent (Figma's
  45%-start ≈ Tailwind's default `via` midpoint, close enough not to need
  an exact stop position).

**Left alone, not a mismatch:** the eyebrow ("WHO WE ARE" + corner-bracket
icon) has no equivalent in this specific Figma frame at all — Figma's own
static comp predates the numbered-eyebrow system added sitewide during the
bold-rebrand pass (see above). That system is a deliberate site convention
layered on top of individual Figma frames, not something any one frame is
expected to show — don't remove it just because one frame doesn't have it.

**Follow-up fix, same section — text/image placement.** The two-column
row below the heading used CSS Grid (`md:grid-cols-2`): both children were
stretched to their own full column-width track first, THEN aligned within
it (`sm:justify-self-end` on the image). Since neither the text
(`max-w-lg`, narrower than its track) nor the image (`sm:max-w-sm`,
likewise) filled their tracks, the leftover space in BOTH columns stacked
on top of the grid gap — producing a much wider separation than Figma's
actual relationship (measured from the node: 599px text, a 282px gap,
then a fixed 331px square, all packed together with no extra slack).
Switched to flexbox (`flex md:flex-row`) so the two elements sit directly
against each other with just the row `gap` between them: text is
`md:flex-1` up to Figma's literal `599px` cap (so IT flexes narrower on
medium widths, e.g. tested working correctly at 900px viewport), image
stays a fixed `331px` from `md:` up (Figma's literal size, doesn't resize
with viewport). Below `md`, unchanged from before: stacks vertically, wide
21:10 crop under `sm` (no Figma mobile frame exists to match — a full
331×331 square reads too tall/dominant on a narrow phone), true square
from `sm` up. Verified at 1512px (Figma's own reference width), 900px
(mid-`md` squeeze), and 375px (mobile stack) — no overflow, no oversized
gap, at any of the three.

## Global heading spec + eyebrows removed sitewide (Aug 2026)

A follow-up to the Legacy-section heading fix above: the user supplied the
exact computed CSS from Figma for both heading lines and asked to make it
the **global** heading standard, replacing the previous per-section/
per-`titleAccent` treatment, and to remove the eyebrow (small label + index
+ corner-bracket icon) from every section.

**New global spec for every `SectionHeading` title/titleAccent, sitewide:**
```
color: #0B0B52 (dark:true sections keep white — unreadable otherwise, not
                overridden by this spec)
font-family: Anek Devanagari (already the site's only display font)
font-size: 48px (existing responsive scale text-3xl → sm:text-4xl →
                 md:text-5xl already tops out at exactly 48px from `md`
                 up — kept as-is rather than flattened to a single
                 non-responsive size, since it already matches at the
                 reference width and degrades sensibly smaller)
font-weight: 300 (font-light)
line-height: 108% (leading-[1.08])
letter-spacing: 0.32px (tracking-[0.32px])
text-transform: uppercase (already the default)
```

This **replaces** the previous `titleAccent` behavior entirely (lead line
`ocean-600` medium weight, accent line `amber-500` bold — see the "Type
decision" / rebrand history earlier in this file for how that pattern
came to exist). The `matchAccentColor` prop added minutes earlier in the
same session (for the Legacy-section-only fix) became redundant the
moment this became the universal default — removed from `SectionHeading`'s
interface entirely rather than left as inert opt-in cruft.

**Correction immediately after the above shipped:** the first version made
both lines fully identical (weight 300, no distinction at all). The user
clarified right away — `titleAccent` should always be bold (700) while
`title` stays light (300); same color/size/spacing on both, weight is the
one deliberate difference. Fixed by wrapping `title`'s render path (all
three: `titleAccent` present, `WordReveal`, and the plain-string fallback)
in `font-light`, and `titleAccent`'s span in `font-bold`, rather than
setting weight once on the shared `<Heading>` wrapper — since the two
lines now need to diverge on that one property. Verified via
`getComputedStyle` on both spans: `A 50-year legacy of` → weight `300`,
`excellence in plumbing.` → weight `700`.

**Eyebrows removed sitewide, but as a single-file change, not touching the
~29 other files that call `SectionHeading`:** the `eyebrow`/`index` props
still exist on the interface (marked `@deprecated`) so none of those call
sites needed editing or risk breaking — `SectionHeading` itself simply no
longer renders the eyebrow block regardless of what's passed. If a fully
clean sweep (removing the dead prop-passing in each of those ~29 files) is
ever wanted, that's a mechanical follow-up, not a design decision — the
props are already inert everywhere today.

Verified via `getComputedStyle` on the Legacy section's heading at 1512px
width: `font-weight: 300`, `font-size: 48px`, `line-height: 51.84px`
(exactly 108% of 48), `letter-spacing: 0.32px`, `color: rgb(11, 11, 82)`
— all match the spec exactly, not approximated. Spot-checked the About
page (a `titleAccent` call site) to confirm the sitewide effect and
confirm no eyebrow renders there either.

## Categories section (`ProductCategories.tsx`) rebuilt against Figma's exact layout, size, and hover mechanism

Checked against Figma node `810:1149` (canonical file `6jLHH8FxOKbRcIWOpIiWcx`), which — critically — has each category card's Default AND Hover variant baked into the dev-mode export as two sets of absolute coordinates. That's not literal exportable JS (Figma's prototype "Smart Animate" between two static frames has no JS to copy), but it gives the exact pixel deltas to reproduce with CSS transitions.

**Real mismatches found, all fixed:**
- **Cards rendered far smaller than Figma** — capped at 260px square via `max-w-[260px]`/`aspect-square`, vs Figma's actual 400×375 (aspect ~1.067, not square). Fixed via `aspect-[400/375]` on a full-width grid cell instead of a fixed/capped pixel size, so it's correct at any container width, not just Figma's 1512px reference.
- **Grid gap** was 12px (`gap-3`), Figma uses 26px — changed to `gap-6` (24px, close enough without hand-tuning a non-standard value).
- **Photo occupied only 44% of card height** (a plain top-cropped band) vs Figma's ~75% (`280/375`, where the wordmark begins) — fixed to `h-[74.67%]`.
- **Description/CTA typography** was much smaller than spec (`text-xs`/`text-sm`) — Figma: description 16px `#606060`, "VIEW PRODUCTS" 18px *medium* (not bold) `#171796` (= the `ocean-600` token's hex, confirmed). Fixed via `cqw`-scaled sizes matching those literal px-at-400-reference values.
- **"View Catalogue" button** was an outlined blue-border/blue-text button — Figma (node `810:1157`) is a solid brand-orange fill with navy text, the *same* spec Hero's `accent-ink` button variant already implements. Reused that variant rather than duplicating it, with a local `className` override for the text color to Figma's literal `#0B0B52` (not the variant's own `ink` token `#14134F` — same reasoning as every other fidelity pass this session). The override is scoped to just this one `<Button>` instance, not the shared variant — `accent-ink` is also used by the (locked) Hero, so the shared definition itself was never touched.

**Hover mechanism — reproduced from the actual Default/Hover variant deltas, confirmed identical across all 6 cards, not per-card guesses:**
- Photo + wordmark rise together by exactly 90px (at Figma's 400px-reference card) on hover.
- Description + CTA are entirely BELOW the visible card frame at rest (description `top:395`, CTA `bottom:-90` — both past the card's own 375px bottom edge, clipped by its `overflow-clip`) and slide up into view together by 110px on hover.
- Implemented as independently absolutely-positioned elements (photo; wordmark; description+CTA) each getting the same `translate-y` on `group-hover` where they need to move together, rather than one shared flex-grouped wrapper — see the correction below for why.
- **Real bug caught during verification, worth remembering for any future translate-based hover:** CSS `translate`/`transform` percentages resolve against the TRANSLATED ELEMENT's OWN box, not its parent — `translate-y-[X%]` on a small text block computed against that block's own small height, not the card's, so it barely moved instead of clearing the card. Fixed by using `cqw` (resolves against the `@container` ancestor — the card — regardless of which element is being translated) instead of `%` for every translate value. `top`/`right`/`width`/`height` percentages were NOT affected by this — those correctly resolve against the parent already, per normal CSS, no container query needed for them.
- Border radius capped with `rounded-[min(25px,6.25cqw)]`, not a flat `6.25cqw` — Figma's radius is a fixed 25px, not proportional; `6.25cqw` only equals 25px at exactly the 400px reference width and grows past it on any wider-rendered card. `min()` gives a true 25px ceiling while still scaling down (not capping) on cards narrower than 400px.

**Real asset bug found and fixed — a genuine duplicate, not a Figma mismatch:** the pre-existing `*-logo.svg` files (one per category) each bundled an extra "GOLD" pill baked directly into the graphic, alongside "PODDAR" + the category name. At the old ~40px render height this was invisible; enlarging the wordmark to Figma's actual proportion (per the fix above) made it clearly visible, duplicating the separate gold ribbon badge Figma specifies in the card's top-right corner. Fixed by exporting fresh wordmark assets directly from Figma (`download_assets` on node `707:7360` and the equivalent "Default"-variant wordmark sub-frame for each of the other 5 cards, 3x scale, saved as `*-wordmark.png` in `public/products/category-cards/`) — each export is scoped to just the wordmark sub-frame, with no gold pill baked in at all. The old `*-logo.svg` files were deleted (confirmed zero remaining code references first).

**Correction immediately after the above shipped — wordmark position was still wrong, just differently.** First fix: capped the photo at `h-[85%]` of a shared 74.67%-tall flex wrapper and made the wordmark a normal-flow sibling after it (`mt-[2%] h-[13%]`), reasoning that flexbox would keep the two from overlapping. It did stop the overlap, but the wordmark's actual landing position (~65% down the card) didn't match Figma at all (74.67% down) — the flex/margin approximation was never actually anchored to Figma's real numbers, just a plausible-looking guess. The user then supplied the exact numbers straight from Figma's own dev-mode inspector on the live instance: `left: 40px, top: 280px, width: 220.816px, height: 70.75px` on a 380×375 card = `left: 10.53%, top: 74.67%, width: 58.11% (max), height: 18.87%`. Fixed by making the wordmark an independently absolutely-positioned element at those exact percentages (`object-contain object-left` so the fresh PNG's own aspect ratio — not a stretch to the box — determines its actual rendered width up to that 58.11% ceiling), and shrinking the photo to a flat `h-[68%]` (no longer tied to the wordmark's box at all) so the two don't overlap, with a gap comparable to Figma's own per-category photo-to-wordmark spacing. Verified via `getBoundingClientRect` against the card: `left 10.53%, top 74.67%, height 18.87%` — exact match, not approximated. **Lesson: when a fix "looks right" but was derived by guessing a plausible split rather than reading the actual Figma coordinates, verify the guess numerically before considering it done — it looked fine here too, until the real numbers proved it wasn't.**

## CTA section + Footer — checked against a third Figma reference (Aug 2026)

A later pass checked the two pieces flagged as outstanding above — the
homepage's flush `CTASection` ("start a conversation") and the sitewide
`Footer` — against a **third** Figma reference: file `RFfPXq5WraSb2tFlgEO6yr`
(the original landing-page file, same one node `13:309` came from), node
`34:243` ("19th August, changes") — a single composite frame containing the
full page (header, Hero, Categories, Legacy, CTA, Footer) inside a mocked
browser-chrome frame. Its Hero/Categories/Legacy content matches what's
already shipped, which is what makes it a reliable reference for the two
sections that weren't checked yet — CTA is node `34:390`, Footer is node
`34:398` ("Poddar Pipes - Footer Ideation 2") inside it.

**`CTASection.tsx` (`flush` variant only — the `card` variant used by the
other ~14 call sites is untouched):**
- **No background photo at all** — Figma's export for this band is a flat
  `bg-[#0b0b52]`, no image, no gradient overlay. The previous flush
  treatment (`/home/cta-background.png` + a `to-ink` gradient) was from an
  earlier iteration of this same Figma file; this newer frame supersedes it.
  Background switched to the literal flat hex (not the `ink` token —
  same distinct-navy reasoning as the tagchips border/hero base rect
  elsewhere in this doc), and the now-fully-orphaned background image
  deleted (`public/home/cta-background.png`, confirmed zero remaining
  references first).
- **Eyebrow removed** — Figma has none on this band.
- **Heading is two sentences, not one uniform line** — lead sentence white/
  light, second sentence amber-600/semibold, both on their own line (CSS
  `uppercase` on the container, not literal caps in the copy — same
  convention as the global heading spec). The existing `home.ctaTitle`
  translation already contains both sentences as one string in every
  locale, so rather than adding new `titleLead`/`titleAccent` keys (11
  locales to touch for a purely visual split), a small `splitLeadAccent()`
  helper splits the resolved string at the first sentence boundary
  (`.`/`!`/`?` + whitespace) at render time. English and Hindi's existing
  copy already splits cleanly this way.
- **Description color/width** — Figma: `#c0c0c0` at a `518px` max width, was
  `slate-300` at `max-w-lg`. Fixed to the literal values.
- **Primary button text color** — Figma's `#0b0b52` literal, not the
  `accent-ink` variant's own `ink` token (`#14134f`) — same local-className-
  override pattern already used on the Categories "View Catalogue" button,
  applied here too rather than editing the shared variant (still used by
  the locked Hero).
- **Secondary button border** — Figma's border is fully-opaque white, not
  the `outline-white` variant's default `white/70` — overridden locally to
  `border-white` for this one instance.
- Copy itself needed no changes — `home.ctaTitle`/`ctaDesc`/`ctaPrimaryHome`/
  `ctaSecondaryHome` already matched this Figma frame's literal text
  exactly (case differences are CSS `uppercase`, not the stored strings).

**`Footer.tsx`:**
- **Background color** — Figma: flat `#0b0b52`, was `bg-ink` (`#14134f`) —
  fixed to the literal hex, same reasoning as the CTA background above.
- **A decorative overlay div (`bg-blue`) was dead code** — `bg-blue` isn't a
  real Tailwind utility in this project (no `blue` token, no `.bg-blue`
  class in `globals.css`) and no Tailwind color ships a bare `blue` without
  a shade suffix, so it was rendering as fully transparent — removed along
  with the background-color fix; nothing visible changes.
- **Nav columns were missing a whole column and half of another's links —
  a real gap, not a Figma mismatch.** Figma's footer has three nav columns:
  COMPANY (About Us, Manufacturing, Quality, Sustainability, Careers — 5
  links), PRODUCTS (uPVC…UGD, unchanged, already correct), RESOURCES
  (Resources, Contact — its own column). The shipped code had folded
  Resources/Contact into the COMPANY column and commented out Manufacturing/
  Quality/Sustainability/Careers entirely (down to 3 company links and only
  2 nav columns rendered, with a `resourceLinks` array already stubbed out
  in a comment). Confirmed all four pages exist (`app/[locale]/manufacturing`,
  `/quality`, `/sustainability`, `/careers`) and their `nav.*` translation
  keys were already present in every locale file — so this wasn't
  gated on missing pages/copy, just an incomplete wire-up. Restored the full
  5-link COMPANY column and un-commented the RESOURCES column as its own
  third column, matching Figma exactly.
- **Newsletter input border** — Figma: solid `#c0c0c0`, was `white/25` —
  fixed in `NewsletterSignup.tsx` (shared by this footer and nothing else).
- **Left alone, not a mismatch:** the logo/wordmark is rendered from a
  single `/logo.svg` asset (used identically in the header) rather than
  Figma's literal separate "P" mark + "poddar"/"pipes" wordmark layers —
  consistent with how the site already represents this logo everywhere
  else; not rebuilt from raw layers here. The contact email
  (`hello@poddarpipes.com`) also differs from Figma's literal
  `poddarpipes@gmail.com` — kept as-is (looks like the deliberate, more
  official-looking address rather than Figma placeholder copy) rather than
  silently overridden; flagging here per the same "flag copy conflicts,
  don't silently change them" convention used earlier in this doc for the
  Hero's manufacturing-year copy.

Verified with `tsc --noEmit` and `eslint` on the three touched files (both
clean — the one pre-existing `<img>`-vs-`next/image` lint warning on the
footer logo predates this pass). **Not verified live in a browser this
pass** — the session's dev-server preview tool was blocked by the auto-mode
permission classifier; if something looks off, that's the first thing to
check, not a sign the fix above was wrong on paper.

## Category-card fixes from user review (Aug 2026)

Two issues spotted directly in a screenshot of the live category grid:

**"VIEW PRODUCTS" + arrow, misaligned.** Same root cause as the sitewide
icon+text vertical-alignment fix documented earlier in this file (Anek
Devanagari's asymmetric font metrics render bare text visibly high next to
a flex-centered icon) — but `ProductCategories.tsx` was fully rebuilt for
the Figma-exact grid redesign after that fix was first applied, and the
rebuild's "VIEW PRODUCTS" span only kept `leading-none`, not the
`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both]` pair that
actually does the trimming. Added both back. Verified via
`getBoundingClientRect` on the label span vs. the `ArrowRight` icon:
centers now match to within 0.008px (was visibly offset before).

**Tank category artwork.** User supplied the real Figma asset for this
card — an SVG (`Group 11.svg`, saved as `public/products/category-cards/
tank.svg`) whose content is actually a raster-embedded PNG: Figma's own
two-overlapping-tank-photo composition with its own drop shadow, matching
the original `get_design_context` export for `TankCard` (`image 28` /
`image 29`) — not a text wordmark, despite the generic filename. Replaces
the old 1.4KB placeholder `tank.png` (deleted, confirmed unused elsewhere
first). Rendered via a plain `<img>` with `object-contain` rather than
`next/image` — this project doesn't set `images.dangerouslyAllowSVG`, so
`next/image` would 400 on a local SVG source (same reason the `GOLD_BADGE`
SVG in this same file already bypasses it). `object-contain`, not the
other five cards' `object-cover`: this asset already composites its own
artwork + shadow against a transparent canvas, so cropping it would cut
into that composition rather than just re-framing a photo.

## Two follow-up fixes from user review (Aug 2026)

**Legacy section photo, below `md`.** The `sm:max-w-sm sm:aspect-square`
switch (added when the earlier right-floating-gap bug was fixed) made the
photo a small square between `sm` and `md` — reported as looking wrong at
that in-between size. Per explicit request, that range now keeps the same
wide `aspect-[21/10]`, full-width, centered treatment used below `sm`
instead of shrinking to a square; the fixed 331px square is still Figma's
real spec, but it now only applies once `md:flex-row` actually puts the
photo beside the text.

**One standard CTA button pair, sitewide.** `CTASection`'s two variants
("card", used by ~14 pages, and "flush", the homepage-only band) had two
different button treatments — `primary-on-dark`/`outline-light` (bg-white/
navy-text primary, amber-outline secondary) on "card" vs. the literal Figma
`accent-ink`/`outline-white` pair (orange fill + navy text / solid-white
outline, `text-lg font-semibold tracking-[0.36px]`, content-driven padding
via `h-auto px-6 pb-3 pt-4`) already used by Hero and the "flush" variant.
Per explicit request, the Figma pair is now the ONE standard: both variants
render the identical button markup (factored into a shared `ctaButtons`
block in `CTASection.tsx`) — only the surrounding card/background/heading
treatment still differs by variant, not the buttons themselves.

**Correction, caught in the same user screenshot as the fix above (it
showed "VIEW CATALOGUE" next to "Start a Conversation"/"Download
Catalogue" and the case mismatch was the giveaway that they were still
different CTAs at a glance):** the new `ctaButtons` block was missing
`uppercase`. Figma's literal export has `text-transform: uppercase` on
every one of these buttons — Categories' "VIEW CATALOGUE" (already
correct, unchanged) as well as this pair — so its absence was a real gap
in the first pass, not a deliberate omission. Added `uppercase` to both
buttons in `ctaButtons`. Hero's own buttons ("Explore Products", "Talk to
Our Team") remain the one intentional exception — Figma's export has
`uppercase` there too, but Hero is locked and already shipped without it,
so this fix does not touch Hero.

**Deliberately left outside this pass** (not part of "the website's CTAs"
in the sense meant here, or would actually contradict Figma if changed):
- `Navbar`'s "Request a Quote" — Figma's own header CTA is blue-filled
  (`bg-[#171796]`) with white text, not orange/white; changing it would
  have moved it away from Figma, not toward it.
- The 404 page's buttons (`accent` + `outline-white`) — a separate,
  already-documented design pass (`NOTFOUND_DESIGN.md`) with its own
  full-bleed-imagery treatment; `accent` is a different, lighter amber
  (500, white text) than the CTA pair's `accent-ink` (600, navy text).
- `ProductDetail`'s spec-sheet `outline-light` button — a utility action on
  a product page, not a promotional CTA pair.

`accent-ink`/`outline-white` themselves (in `button.tsx`) were left
untouched rather than having the padding/typography baked into the variant
definitions — Hero also consumes those two variants and is locked, so
changing the shared variant strings (even to make Hero's own rendering
identical) needs asking first, per the hard rule above; the standardization
here is done entirely via each call site's own `className`, matching the
pattern Hero/Categories already established.

## Scroll-curve removal + CTA heading line-break fix (Aug 2026)

**`SectionCurve` removed sitewide, not just from Hero.** The scroll-driven
curved-bottom-edge `clip-path` effect was already removed from Hero
specifically (see "Curved-bottom-edge clip-path removed entirely" above),
but a separate, reusable `SectionCurve` component implementing the same
kind of effect (`useScroll`/`useTransform` animating an `ellipse(...)`
clip-path, `rx` from `getCurveRx` in `lib/motion.ts`) was still wrapping
Categories (`ProductCategories`) and Legacy (`CompanyOverview`) on the
homepage. Per explicit request, unwrapped both in `app/[locale]/page.tsx`.
With no remaining live usage anywhere in the codebase, deleted
`components/shared/SectionCurve.tsx` outright and removed `getCurveRx`
from `lib/motion.ts` (that file's other exports — `BRAND_EASE`,
`BRAND_DURATION`, `BRAND_SPRING`, `BRAND_VIEWPORT` — are still used
elsewhere and were left alone). Verified via `getComputedStyle` sitewide:
zero elements have a non-`none` `clip-path` after this change.

The homepage's commented-out "old sections" block (`WhyChooseUs` etc. —
not part of the current Figma-matched homepage, kept in case they come
back) had each been wrapped in `<SectionCurve>` too; updated that comment
to drop the wrapper so a future revival doesn't reintroduce the effect,
and — since fixing this file anyway — removed those six components'
now-fully-unused imports (they were only ever referenced inside the
comment, which doesn't count as usage to ESLint; this was a real,
pre-existing lint error, not something this change introduced) in favor
of a note listing which imports to re-add if reviving.

**CTA heading — accent line wasn't guaranteed to start its own line.**
`CTASection`'s flush-variant heading (`splitLeadAccent`) rendered the lead
and accent sentences as two inline `<span>`s with only a space between —
so whether the accent line actually started fresh depended on whether the
two sentences happened to overflow the `max-w-2xl` container at a given
viewport width, not on a rule. Per explicit request, and matching the same
convention already established for `SectionHeading`'s `titleAccent` (see
"Global heading spec" above), both spans are now `display: block`,
so the orange accent sentence always starts on its own line regardless of
viewport width or how short the lead sentence is.

## CTA section re-checked against a focused Figma pull (Aug 2026)

A follow-up request to double-check the flush CTA's own font/styles pulled
`get_design_context` on just node `34:390` directly (rather than the
earlier composite-frame pull) for a cleaner, focused reference. Found two
small remaining gaps and fixed both:

- **Description line-height** — Figma: `leading-[1.5]`; Tailwind's
  `text-sm` utility (used for the 14px size, which was already correct)
  carries its own default line-height of `1.25rem`/`0.875rem` ≈ `1.43`,
  not `1.5`. Added an explicit `leading-[1.5]` (plus `font-normal`, matching
  Figma's `Anek_Devanagari:Regular`, for clarity even though it was already
  the inherited default).
- **Secondary button border width** — Figma: `1.2px`; the `outline-white`
  variant's own default is `border-2` (2px). Overridden locally to
  `border-[length:1.2px]` (the `length:` type hint matters here — a bare
  `border-[1.2px]` and `border-[1.2px]` without the hint both compile fine
  in this project's Tailwind v4 setup, so that wasn't the issue; it was
  purely for clarity that this is a width, not a color, arbitrary value).
  **Verified this makes no visible difference in practice** — a quick
  isolated test (`getComputedStyle` on a plain test element with an inline
  `border-width: 1.2px`) showed the browser itself rounds any sub-integer
  border-width to the nearest whole pixel when reporting/using it, so `1px`
  and `1.2px` render identically here regardless of which class is used.
  Kept the `1.2px` value anyway since it's harmless and literally matches
  Figma's number, but don't spend more time chasing sub-pixel border
  fidelity anywhere else on this site — it's not achievable/visible.

Everything else already matched: heading weights (`Light`/`SemiBold`
mapping to `font-light`/`font-semibold`), colors (`#f28000`/`#c0c0c0`/
`#0B0B52`/white), button padding (`px-6 pb-3 pt-4`), `text-lg`,
`tracking-[0.36px]`, and `uppercase` on both buttons.

## CTA heading was wrapping to 3 lines, not Figma's 2 (Aug 2026)

User caught that the flush CTA's heading rendered on three visual lines
at normal desktop widths, not the two Figma actually shows. Root cause:
the earlier `display: block` fix (previous section) guaranteed the accent
sentence starts its own line, but didn't guarantee it STAYS one line —
the shared `max-w-2xl` (672px) wrapper around heading + description +
buttons was narrower than "WE'LL RECOMMEND THE RIGHT PIPING SYSTEM." needs
at this site's `text-5xl` (48px), so that sentence itself was wrapping a
second time, producing 3 lines total. Figma's own heading container is
literally `whitespace-nowrap` — each sentence is meant to be exactly one
line, full stop, at its 1512px reference width.

Fixed by widening the shared wrapper from `max-w-2xl` to `max-w-5xl`
(1024px) — verified both sentences now render as one line each (2 total)
at 1280px and 1440px viewports. The description keeps its own tighter
`max-w-[518px]` (already set directly on the `<p>`, narrower than the
parent either way) and the buttons are content-sized flex items, so
neither is affected by the wider parent.

**Deliberately not literal `whitespace-nowrap`** — this stays responsive:
at genuinely narrow (mobile) viewports the second sentence still wraps,
which is expected, since Figma has no mobile frame for this section (same
reasoning already applied to Hero's mobile crop elsewhere in this doc). If
an even wider viewport or a longer translation ever re-wraps this sentence
again, the fix is the same lever — widen `max-w-5xl` further — not
re-adding a per-line hack.

## Legacy + Categories heading color — a scoped exception to the global spec (Aug 2026)

A fresh `get_design_context` pull on Figma node `43:415` — a separate,
apparently more recent copy of the "2. legacy" frame than the `810:1159`
node this section's heading was originally checked against — showed its
heading at `#4a4a4a` (medium gray), not the sitewide global-heading-spec
navy (`#0B0B52`) every `SectionHeading` call site uses. Flagged the
conflict rather than silently picking one; user's direction: make Legacy
and Categories share the same color (not a resolution of which Figma
frame is "more correct" sitewide — scoped to just these two).

**Added `titleColorClassName` to `SectionHeading`** — an optional prop
overriding the default `text-[#0B0B52]` on light backgrounds (no effect
when `dark`, which always stays white). This is the same shape of escape
hatch the removed `matchAccentColor` prop was (see "Legacy section" above)
but more general — a plain color class instead of a single boolean — since
this time two call sites need to share a value that isn't the global
default. Applied `text-[#4a4a4a]` at both:
- `CompanyOverview.tsx`'s `SectionHeading` (Legacy)
- `ProductCategories.tsx`'s `SectionHeading` (Categories)

Every other `SectionHeading` call site (~27 others) is unaffected —
they don't pass the prop, so they keep the global navy default. Verified
via `getComputedStyle`: both headings now compute to `rgb(74, 74, 74)`
(`#4a4a4a`) exactly.

## Planned next (remaining)

1. **Product spec-sheet treatment** — dedicated Space Mono spec tables and dimension annotations (Ø, IS codes) on `ProductDetail`.
2. Extend bespoke treatment page-by-page: about, contact, resources, quality, careers (these already inherit the type/palette/eyebrow system automatically; they need per-page polish + verification).
3. Optional: evolve `FlowLine` schematic dividers between more sections; consider a persona/segment selector (skill `pipe-design-inspirations`, pattern #2).

## Hard rules (never break)

- **`components/home/Hero.tsx` is LOCKED (Aug 2026).** Never edit it — directly, or indirectly via a shared component/token/translation key it consumes (`RevealOnScroll`, `Counter`, `lib/motion.ts`, `globals.css` tokens, `home.hero*`/`home.overviewStat*` keys) — without asking the user first, every time, even for an obvious bug fix or as a side effect of a broader "update the site" task. This is a standing instruction, not a one-time approval; it does not expire and does not need to be re-confirmed as still active.
- Brand blue/orange/gold must be present; blue dominant.
- Orange **and** flow-cyan: never small/body text on white (AA). Outline/border/tint/large-on-dark only.
- Every animation respects `prefers-reduced-motion`.
- Indic-script coverage preserved (Anek fallback in every stack).
- Motifs stay **original** — inspiration from industry leaders, never a competitor's logo/mark/layout.

## Current status (Aug 2026) — read this first to pick up where things left off

Figma source of truth for all of the below: file `6jLHH8FxOKbRcIWOpIiWcx`
("Poddar-Pipes-Website", dev-mode) — reuse this fileKey directly rather
than asking the user for a link again. The homepage section order is
Hero → Categories → Legacy → CTA (`app/[locale]/page.tsx`).

- **Hero (`Hero.tsx`) — LOCKED, considered done.** Video re-encoded at
  native resolution, stats-tile pipe occlusion + both gradients matched to
  Figma, tagchips card CSS/positioning verified pixel-exact, global heading
  spec (see below) applied, scroll-driven curve removed. See every section
  above from "Hero video — five real problems" onward for the full history.
  **Do not touch this file or anything it depends on without asking first
  — see Hard rules above.**
- **Global heading spec — done, sitewide.** Every `SectionHeading` title:
  `#0B0B52`, weight 300 (titleAccent: 700), 108% line-height, 0.32px
  tracking, uppercase, 48px at `md`+. Eyebrows removed sitewide (props
  still exist on ~29 call sites, marked `@deprecated`, inert — not a
  30-file cleanup unless explicitly asked for one).
- **Legacy section (`CompanyOverview.tsx`) — done.** Heading colors,
  description color, photo gradient, and text/image placement all checked
  against Figma node `810:1159` and fixed. See "Legacy section" and its
  "Follow-up fix — text/image placement" above.
- **Categories section (`ProductCategories.tsx`) — done.** Layout/size,
  typography, the "View Catalogue" button, and the hover mechanism all
  checked against Figma node `810:1149` and fixed, including two real
  (non-Figma-mismatch) bugs: a duplicate gold badge baked into the old
  logo SVGs (fixed by exporting fresh wordmark-only PNGs from Figma) and a
  wordmark position that was approximated rather than read off Figma's
  real numbers (corrected to the exact `left:10.53%, top:74.67%,
  height:18.87%` from the user's own dev-mode inspector). See "Categories
  section... rebuilt against Figma's exact layout, size, and hover
  mechanism" above, including its correction note.
- **CTA (`CTASection.tsx`, `flush` variant) and Footer (`Footer.tsx`) —
  done.** Checked against a third Figma reference, file
  `RFfPXq5WraSb2tFlgEO6yr` node `34:243` ("19th August, changes" — a
  composite full-page frame in the same file node `13:309` came from) —
  CTA is its node `34:390`, Footer its node `34:398`. Background colors
  fixed to the literal `#0b0b52`, the CTA's background photo/gradient
  removed (Figma shows a flat band, no image — this newer frame supersedes
  the earlier photo-background iteration), the CTA heading split into its
  Figma two-tone lead/accent lines, and the Footer's missing nav column +
  links restored. See "CTA section + Footer — checked against a third
  Figma reference" above for the full list, including two real (non-Figma)
  bugs fixed along the way: an orphaned background image and a dead
  `bg-blue` CSS class. Verified live in the browser in a later pass (the
  permission classifier that blocked it initially wasn't an issue on
  retry).
- **Category-card fixes — done.** "VIEW PRODUCTS" + arrow alignment fixed
  (a sitewide fix that hadn't survived this component's Figma-redesign
  rebuild), and the TANK card now uses the user-supplied real Figma
  two-tank artwork instead of a 1.4KB placeholder. See "Category-card
  fixes from user review" above.
- **CTA buttons — now ONE standard pair, sitewide, done.** Every
  `CTASection` call site (both `card` and `flush` variants — ~15 pages
  total) and `ProductCategories`' "VIEW CATALOGUE" render the identical
  Figma button spec: `accent-ink` orange-fill/navy-text primary +
  `outline-white` solid-white-outline secondary, `text-lg font-semibold
  uppercase tracking-[0.36px]`, content-driven `h-auto px-6 pb-3 pt-4`
  padding. Hero's buttons are the one intentional exception (same colors/
  padding, but no `uppercase` — Hero is locked and already shipped that
  way). See "Two follow-up fixes from user review" above, including its
  uppercase correction and the list of buttons deliberately left out of
  scope (Navbar's blue "Request a Quote", the 404 page, `ProductDetail`'s
  spec-sheet button).
- **Legacy section photo, below `md` — done.** The `sm`-to-`md` range now
  keeps the same wide, full-width, centered letterbox crop used below
  `sm`, rather than shrinking into a small off-center square — fixed
  alongside the CTA-button work above, see that same section.
- **Scroll-driven section curve — removed sitewide, done.** `SectionCurve`
  (the reusable clip-path-on-scroll effect, separate from the one already
  removed from Hero specifically) no longer wraps Categories or Legacy on
  the homepage, and the component + its `getCurveRx` helper were deleted
  outright — no page uses it anymore. See "Scroll-curve removal + CTA
  heading line-break fix" above.
- **CTA heading accent line — always its own line, done.** The flush CTA's
  lead/accent sentences are now `display: block`, matching the
  `SectionHeading`/`titleAccent` convention — no longer dependent on
  viewport width to force the break. Same section as above.
