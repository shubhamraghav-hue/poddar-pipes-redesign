# Figma Implementation — Session Notes & Handover

Running record of the Figma-driven work on this site: what was built, the decisions
taken (and who took them), the measurements behind them, and what is still open.
Written so the next pass can start here rather than re-deriving everything.

Scope of the session this records:

1. An eight-item update across Home, About and the Footer
2. The Vision/Mission "glass" investigation — built, then reverted on request
3. The footer logo asset fix
4. Two new pages built from Figma: `/tools/calculator` and `/contact`
5. A pixel-fidelity pass, then a responsive/mobile pass on those two pages

---

## 0. READ THIS FIRST — the cache trap

**The Tailwind build silently ignores newly created files until `.next` is cleared.**

This cost real time twice and produced *confidently wrong measurements* both times:
`h-[50px]` rendered at 29px, `text-[20px]` at 16px, `size-[57px]` at 24px. Classes
that happened to already exist elsewhere in the codebase (`text-[28px]`,
`rounded-[25px]`) worked fine, which makes the failure look like a CSS bug rather
than a build-cache one.

A plain dev-server restart does **not** fix it. The sequence is:

```
stop the dev server   (properly — see below)
rm -rf .next
start the dev server
```

**Stop the server before deleting `.next`.** Deleting it underneath a running server
corrupts its state and every route then 500s with `ENOENT ... build-manifest.json`
and `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`. Recovery is the same
three steps, done in the right order.

> Sanity check before trusting any measurement: pick one arbitrary value you just
> wrote, create a bare element with that class in the console, and confirm the
> computed value. If it doesn't apply, you are measuring an unstyled page.

This matches the pre-existing note that `next build` leaves the dev server serving
404s for every route but `/`.

---

## 1. Figma sources

| Area | Node | Notes |
|---|---|---|
| Home — desktop | `1447:12599` | |
| Home — mobile | `1447:12904` | |
| About — desktop | `1447:13170` | |
| About — mobile | `1447:13392` | |
| Calculator page | `1488:14461` | desktop only; **no mobile frame exists** |
| Estimator component | `1582:8480` | component set: `default` (empty) / `selected` (filled) |
| Estimator tab strip | `1488:14339` | |
| Contact page | `1606:11700` | desktop only; **no mobile frame exists** |
| Glass material probe | file `RFfPXq5WraSb2tFlgEO6yr`, node `59:1241` | separate scratch file |

File key for all but the last: `6jLHH8FxOKbRcIWOpIiWcx`.

**Figma MCP is on a Starter plan with a tool-call cap.** It can run out mid-task; the
error names the limit explicitly. Budget calls — prefer `get_metadata` for structure
and reserve `get_design_context` for nodes whose type/geometry you actually need.

---

## 2. Completed work

### 2.1 Home / About / Footer (eight-item update)

| Item | Where | Note |
|---|---|---|
| `uPVC` lowercase | `ProductCategories.tsx` + re-exported `upvc-wordmark.png` | The visible mark is a PNG, not text; re-exported at 4× from the updated component (530×170). `title` is alt text only. |
| Hero → stats gap, mobile | `Hero.tsx` `-mt-16` → `mt-[23px]` | **Locked file — permission was given explicitly for this.** Mobile does not overlap the video; `sm:-mt-20` desktop overlap untouched. |
| Mobile heading leading | `SectionHeading.tsx` | Sizes were already correct at 28px. The defect was leading/tracking running the desktop pair (108% / 0.32px) on mobile instead of 102% / 0.2088px. |
| Footer tagline | `Footer.tsx` `BrandTagline` | "PIPES KA **GOLD** STANDARD. PHIR SE." — `GOLD` in `#d9b365`, orange bracket mark. Stacked on mobile, side-by-side at `lg`. |
| Instagram icon | `SocialIcons.tsx` | `ring` 13 → 11, `size` 20 → 17. Deliberately *under*-matched on ink: it is a closed rounded square, so equal ink height still reads heavier than the open letterforms beside it. |
| About mobile hero | `AboutHero.tsx` | Backdrop floor 322 → 481px, 190px top pad, 36px/307px type. |
| Vision/Mission cards | `AboutHero.tsx` | Two geometries: 342×162 mobile, 592×450 desktop (the 450 per the newer node, chosen over the Sep 2026 360px pass). |
| Footer logo | `public/logo.svg` | See §2.2. |

### 2.2 The logo asset

The old `logo.svg` carried a **uniform 72-unit margin baked into its viewBox** (72.00
left/right, 72.50 top/bottom of a 757.01×323.89 box). Only **55.2%** of any height
given to it was artwork — which is why the footer mark never aligned left with the
address, and why it kept getting nudged up (44 → 50 → 65px).

Replaced with a tight-cropped SVG (113×33). All three call sites were compensated to
`h-9` so the rendered artwork size is unchanged — only the dead space went:

- `Footer.tsx`, `Navbar.tsx`, `NotFoundView.tsx`
- Desktop logo→tagline gap went from ~73px to **59px** (Figma: 59.4) for free, because
  the old asset's 72-unit *right* margin was padding the `gap-[59px]` out

Old file recoverable via `git show HEAD:public/logo.svg`.

### 2.3 `/tools/calculator`

- Hero, 4-tab switcher, estimator panel (empty + filled states), CTA band
- `lib/data/estimator.ts` — tab definitions, item taxonomy, rates, `estimate()`
- `components/tools/Estimator.tsx` — the whole interactive panel

### 2.4 `/contact`

- `components/contact/ContactHero.tsx` — hero + the Call/Email cards (they sit **on**
  the hero's navy band in the mock, hence same component)
- `components/contact/SendMessage.tsx` — copy, both registered addresses, 8-field form
- Replaced the old composition (ContactInfo / OfficeLocations / MapPlaceholder /
  InquiryForm / FAQ). **Those files were left in place**, not deleted — `InquiryForm`
  is still used elsewhere and FAQ has its own route.

---

## 3. Decisions taken (do not silently re-litigate)

| Decision | Choice | Who |
|---|---|---|
| Estimator tabs 2–4 (undesigned) | Build all four, inputs inferred from the trade | user |
| Estimator maths | Originally "UI only"; superseded — real engine, placeholder rates | user |
| Vision/Mission desktop card | Follow the newer node: 592×450, 64px title | user |
| SVG refraction glass | **Reverted.** Snapshot in `stash@{0}` | user |
| Container width | Page-local `.container-figma`, *not* a global change | user |
| Mobile tab nav | Disclosure (the house pattern) | user |

### 3.1 The glass revert

Real refraction + dispersion *was* built and worked — `backdrop-filter` accepts an SVG
filter reference and `feDisplacementMap` warps the live backdrop (verified in Chrome
152). It was then reverted on request. The full implementation is in:

```
git stash show -p stash@{0}
```

If it is ever revived, the node values are: desktop `radius 0, refraction 1, depth 32,
lightAngle 344, lightIntensity 0.8, dispersion 1, splay 0`; mobile `radius 100,
depth 36, lightAngle 326, splay 0.41`. `radius` is the frost and it is **zero** on
desktop — an earlier pass fitted a 4px backdrop blur to the published render and was
wrong about the mechanism.

### 3.2 The container

`container-edge` gives a 1272px column at x120; Figma's body column is 1212px at x150.
Changing `container-edge` would have fixed these two pages **and** the About cards
(622 → 592) and the CoreValues row — but it feeds `Hero.tsx`, which is locked, so the
narrower change was taken:

```css
.container-figma { @apply mx-auto w-full max-w-[1512px] px-6 md:px-10 xl:px-[150px]; }
```

Used by `/tools/calculator` and `/contact` only (4 call sites). **Known accepted cost:**
on those two pages the content sits 30px right of the navbar and footer, which stay on
`container-edge` — a visible step at the top and bottom of each page.

---

## 4. The Ashirvad reference

`ashirvad.com/plumbing-calculator` is the tool this design was drawn from (identical
inputs, identical "Cost breakdown" wording).

**There is no algorithm to extract.** The maths is server-side — the page POSTs to
`wp-admin/admin-ajax.php` and receives rendered HTML. Probing it with two input sets
shows a strictly linear per-fixture lookup:

```
1 bathroom + 1 kitchen  -> CPVC 741.68,   bathroom column 33,327.86
2 bathrooms + 1 kitchen -> CPVC 1,483.35, bathroom column 66,655.72
```

Exactly 2×, kitchen column unchanged. So `cost = count × rate(item, column, pipeType)`,
totals summed. That is what `estimate()` implements.

**Their rates were deliberately not transplanted.** The line items in that response are
Ashirvad SKUs (Aqualife, Aqualife Reclaim, Concealed Diverters, Flush Valves) for
products Poddar does not make — the wrong catalogue as well as someone else's
commercial data. Note also that per this site's own About timeline the Poddar family
exited that business in 2018; ashirvad.com is Aliaxis's now.

---

## 5. ⚠️ Blocking before launch

**`lib/data/estimator.ts` ships placeholder rates.** They are round illustrative
numbers chosen so the tool demonstrably works and so nobody mistakes them for a price
list. The UI says so in orange under every result.

To go live: fill in `rate` for every row from the real Poddar price list. Nothing else
needs editing — engine, UI and totals all read from that one file. Then delete the
"Indicative rates only" line in `ResultTable`.

**Tabs 2–4 inputs are inferred**, not designed (`fromDesign: false` on each). Drainage
uses floors + bathrooms/floor, UGD uses trench metres + chambers, Agriculture uses
acres + outlets. First thing to check with the designer.

---

## 6. Measurements worth keeping

Re-deriving these is slow; they were each measured, not estimated.

| Thing | Value | Why it matters |
|---|---|---|
| Estimator tab row | 245 / 238 / 310 / 319 wide, 20px gaps, 20/13 frame padding | Sums to exactly **1212** — the full content column, only available at a 1512 viewport. Hence the `min-[1512px]` gates. |
| Tab type | 18px, active SemiBold, rest Regular, no per-pill border | An earlier pass inferred 14px uppercase semibold and measured ~20px narrow. |
| Rail vertical rhythm | controls at y154 / 268 / 382 / 444 | 114px pitch; group = label 24 + 8 + control 50 = 82, so inter-group gap = 32 (`gap-8`). |
| Contact form | 621 wide, 35px padding, 266.33 columns, **18px** column gap, 114px row pitch | The column gap is 18, not the 20 it looks like. |
| Email in Anek | sets at **10.14×** its font size | Drives the `clamp(22px, 9.7cqw, 44px)` on the contact cards. |
| Anek numerals | proportional "111" = 16.14px vs "000" = 27.17px at 16px | A 68% swing for the same digit count — currency columns need `tabular-nums`. |

---

## 7. Responsive / mobile work

Neither Figma frame has a mobile design; everything below is a judgement call.

**Fixed:**

- **iOS page-zoom on every form on the site.** `Input` / `Textarea` / `SelectTrigger`
  are all `text-sm` (14px); iOS Safari zooms on focus below 16px and does not zoom
  back. A `@media (pointer: coarse)` rule bumps them to 16px. It lives **outside
  `@layer utilities`** at the foot of `globals.css` — inside it, Tailwind's own
  `.text-sm` outranks a bare `input` selector and wins. Unlayered beats layered
  regardless of specificity, so no `!important` needed. Hero has no form controls, so
  this cannot reach it.
- **81px of horizontal page overflow at 1024** — the tab strip switched to
  `overflow-visible` at `lg` before the column was wide enough.
- **Email broke to 3 lines at 768 and 2 at 1280.** A per-breakpoint ramp cannot fix it:
  the card is one-up below `lg` and two-up above, so its width does *not* track the
  viewport monotonically — 1280 gives the card **less** content box (351px) than 768
  does (572px). Container query instead.
- **Radio circle rendered as an oval.** It is a flex item and `flex-shrink` defaults to
  1, so a label too long for its pill took the space out of the *circle* —
  "Combination" squashed while CPVC/uPVC stayed round. `shrink-0`, plus one column
  below `sm` so the label isn't ellipsed either.
- Tab nav below `lg` is now a **disclosure**, matching the footer accordions and the
  navbar hamburger. The row hid 630px of a 955px control at 375 with one pill visible.
- Press feedback (`:active`), `touch-manipulation`, `select-none`, `touch-pan-y` +
  `overscroll-x-contain` on both horizontal scrollers. Submit button → `min-h-[44px]`.
- Currency right-aligned with `tabular-nums`.

**Audited clean** at 320 / 360 / 375 / 414 / 768 / 1024 / 1280 / 1512: zero horizontal
overflow, no touch target under 44px (bar the tab pills at ≥1512, which is Figma's 43
on a mouse-driven width), email always one line.

---

## 8. Still open

**Calculator, mobile — the biggest remaining UX gap.** Measured at 375×812 with the
estimator filled:

- Calculate button sits at y=786 of 812 when tapped
- The page does **not** move on press (`scrollMovedAfterCalc: 0`)
- The result table starts **138px below the fold**; TOTAL COST is **623px** down
- The table is 520px wide in a 275px window → 245px of sideways scroll per row

**Done (items 1–3):** Calculate now scrolls the result pane to y96 (just under the
80px navbar) when it rendered below the button — TOTAL COST lands at y209–262 on a
375×812 phone. Below `md` the table is replaced by `ResultCards`: a navy total card
with the per-column split, then one entry per line item. At `md`+ the table is
unchanged, and at `lg`+ (side by side) nothing scrolls. Verified 375 / 768 / 1512,
all four tabs.

> **Lenis trap:** a native `scrollIntoView({behavior:"smooth"})` fights the site's
> Lenis smooth scroll (the page went *backwards*). Use `scrollToElement()` from
> `hooks/useLenis.ts`, which passes Lenis a numeric target from `scrollY` and calls
> `resize()` first so a stale `limit` cannot clamp it. Also: when testing, scripted
> `window.scrollTo` races Lenis too — wait ~1.5s for it to settle between steps.

**Second pass (Oct 7):**

- Calculator CTA rebuilt from node **1488:14348** as `components/tools/QuoteCTA.tsx`:
  a 25px-radius card *inside* the white estimator section (120 under the panel, 80
  above the footer), replacing `CTASection variant="flush"` on this page. Measured
  match: pads 80/20/80/80, buttons 242×46 + 239×46, gap 15.
- Icons from Figma (calculator 1582:8421, phone 1582:8384, share 1582:8386) in
  `components/tools/EstimatorIcons.tsx` — paths verbatim, stroke → `currentColor`.
  The raw exports carry Figma canvas junk (page-background rects); don't use them.
- Call/Share hover: orange ring + glyph, 2px lift, orange shadow (`ACTION_BUTTON`).
- Result reveal + stepper tick via framer-motion (`EASE_OUT`).
- Outlined hero CTAs on /tools/calculator and /contact: border → inset shadow ring,
  48px → 46px (the 59e95b7 fix).
- Breakpoint audit, both pages, 320→1920, empty and filled: fixed radio pills
  spilling 105px at 1024, result pane pushed 40px past the panel (`lg:min-w-0`),
  tab row clipped 28px at 1024, cramped table → cards/table now switch on the
  **pane's** width (`@container`, 540px), not the viewport.

> **Tailwind v4 precedence trap:** `md:`/`lg:` are emitted AFTER `min-[1512px]:`,
> so `lg:x min-[1512px]:y` silently resolves to `x` at 1512. Bound the lower rule
> (`lg:max-[1511px]:x`). Also: v4 `-translate-*` / `scale-*` set the `translate` /
> `scale` CSS properties, so a `transition-[…transform]` list must name them too.
>
> **Testing trap:** the in-app browser pane reports `visibilityState: hidden` when
> not on screen; rAF stops and framer animations freeze at frame 0. Use Playwright
> for anything animated. Its 1512 viewport includes a 15px scrollbar (1497 content).

- **Label centring.** Every control on /tools/calculator had its label 3–5.5px
  HIGH (Anek's bottom-heavy line box). Fixed with `CAP_TRIM`
  (`components/shared/capTrim.ts`) on a span around each label → all within
  ±0.25px. `Button`'s own trim does NOT reach `asChild` labels (bare text node in
  the `<a>`), so every `Button asChild` CTA sitewide has this — including Hero.tsx
  (locked) and `CTASection`. CTAs here are now `h-[46px] py-0` + trimmed span
  instead of Figma's pt16/pb12, which still measured 3.5px high.

**Global enquiry pop-up (Oct 8), Figma node 1605:11496:**

- `components/enquiry/EnquiryForm.tsx` — the one enquiry form, `variant="page"`
  (/contact, unchanged look) or `"dialog"` (the pop-up). Ids are `useId`-prefixed
  because /contact renders both at once.
- `components/enquiry/EnquiryProvider.tsx` — one Radix dialog for the site,
  mounted in `app/[locale]/layout.tsx`; `EnquiryLink` opens it. It is still a
  real `/contact` link: no-JS, pre-hydration and ctrl/cmd-click navigate.
  Stops Lenis while open (`setScrollLocked`), returns focus to the opener.
- Wired: navbar Request a Quote (desktop + mobile menu), every `CTASection` /
  `QuoteCTA` button whose href is `/contact`, home hero Talk to Our Team
  (Hero.tsx — approved one-line change), About hero, calculator hero, category
  hero, /contact hero (both), product Request a Quote (pre-fills product), the
  estimate call button (pre-fills the estimate). Phone/email/catalogue links
  untouched; careers keeps `InquiryForm`.
- Enquiry type is enforced in `handleSubmit` — Radix's hidden select reports
  VALID while empty, so `required` alone never blocked a submit (also true of
  the old /contact form).
- Testing: the Playwright window gets throttled to ~2fps when occluded — use
  `emulate_media reducedMotion: reduce` and generous waits; and its min width
  is 500, so 375 checks go through the in-app browser.

**Enquiry success state (Oct 8)** — `EnquirySuccess` in `EnquiryForm.tsx`, both
surfaces. No Figma frame; built from the system (light/bold caps heading, orange
accent, navy = done). Echoes first name, enquiry type and email; three "what
happens next" steps; office phone to escalate. Deliberately NO reference number
until a backend issues real ones. Holds the form's height at sm+ only (no jump);
on phones it collapses and scrolls itself into view (dialog panel → top).
Focus moves to the heading. Also fixed: the select's options sat UNDER the
dialog overlay (z-50 vs z-60) — the type could not be chosen in the pop-up.

**News & Media page (Oct 8)** — `/articles` rebuilt from Figma node 1653:9258:
"IN THE / NEWS & MEDIA" heading + a 3×2 grid of press cards (outlet chip,
headline, summary, Read Article pill). Matches the mock to the pixel at 1512
(cards 385×460, 28 gaps, chip 40/32, headline 107, button 382). Data is the
mock's six (copy from Figma, links verified by the client, incl. BusinessLine);
MB Patil / Construction Week / Manufacturing Frontier dropped on request — URLs
kept in a comment in `lib/data/articles.ts`. Closing `CTASection` removed (not
in the mock). Heading/button copy changed in en.json only — the other 10
locales still say "Poddar in the headlines." / "Read full story" until
translated. Route stays `/articles` (no URL change).

**/products rebuilt (Oct 8)** from Figma node 1530:7102 (six category frames):
heading, six pills (CPVC first/default) + search, one 1212x650 category card
linking to `/products/category/<id>`, catalogue banner, flush CTA (homepage
copy). `components/products/ProductShowcase.tsx`, data in
`lib/data/productShowcase.ts`, assets in `public/products/showcase/`.

- Photos: each "<cat>-card 1" layer exported at 2x — Figma clips the export to
  the visible 1212x650 band — then webp (41–77 KB).
- Wordmarks: the PNG export is unusable (instance has a WHITE frame fill under
  white lettering). SVG export outlines the Torque type; it also carries every
  ancestor's background rect, so only `<g id="<cat>">` is kept.
- Search = category picker (client said follow Figma, no results UI): word
  match, all words any order; category hit outranks product hits. `?q=` and
  `?category=` both still work (SearchAction schema).
- Old ProductsHero / ProductFilterGrid / IndustriesGrid are now unused; files
  left in place. Heading copy changed in en.json only.
- New dev-server failure mode: `.next/dev/prerender-manifest.json` written twice
  (duplicated tail) → EVERY route 500s with "JSON.parse … line 1". Cause: two
  routes compiling at once on a fresh `.next`. Fix: stop, rm .next, start, and
  let `/` finish compiling before requesting another route.

**Category detail pages switched off (Oct 8).** `app/[locale]/products/category`
deleted (restorable from git; re-apply its Request-a-Quote → `EnquiryLink`
swap if restored). `/products/category/<id>` and `/<locale>/products/category/<id>`
307 to `/products?category=<id>` via `next.config.ts` redirects (temporary on
purpose). Homepage category cards and footer product links point straight at
`/products?category=<id>`; the /products card is no longer a link.
`lib/data/categoryContent.ts` kept. Product detail pages (`/products/<slug>`)
unchanged. Also fixed: ProductShowcase now follows URL changes while mounted
(footer links / Back on /products used to leave the card stale).

**Products card on small screens (Oct 8).** Below `lg` the copy has its own
`#141b28` band (sampled photo backdrop) and the photo sits under it with a
fade — the tagline used to run over the bright pipes at 375 and 768. From `lg`
the card copy is in `cqw` (60/1212 etc.) so it keeps the mock's composition at
1024–1512 instead of crowding the photo. See CONTINUE_HERE.md for the session
hand-off and the continuation prompt.

**/products responsive pass (Oct 8, session 3).** No small-screen frames
exist, so below `lg` the page uses its own scale (spacing 64/40 → md 96/64 →
lg Figma 120/121), phone pills in an even 3x2 grid, the card photo masked into
the copy band (overlay left a 1px seam), and the catalogue banner stacked
until `lg`. `lg`+ is untouched and still measures as the mock.

**CTA band fixed sitewide (session 3), Figma 1530:7318/7321.** `CTASection`'s
`CtaLink` dropped Slot's className → all its buttons were unstyled text. Fixed
(props spread), plus 46px / inset ring / `CAP_TRIM` / gap 15 / 80 above the
buttons / flush pads 120-176 from `lg`. Same button fix in `AboutHero`.
`Hero.tsx` still has the 48-vs-46 issue (locked). /products' catalogue strip
replaced by a category quote strip (`QuoteBanner`) opening the enquiry pop-up.
- **/contact centring (Oct 8):** hero CTAs, Submit (+ "Sending", success button),
  select trigger + dropdown items, Call/Email cards — all now within ±0.4px.
  Inputs were already centred (the shared `Input` carries a 5px top pad).
  Gotchas: Radix `SelectValue` DROPS `className` — trim via the `placeholder`
  node; trimming SelectItem labels collapsed rows 36→25, held with `min-h-9`;
  the cards trim only their outer edges (`trim-start` on the label, `trim-end` on
  the value) so the 12px label→value gap is unchanged. Playwright's window can't
  go below 500px wide — use the in-app browser's emulation for 375.

Still proposed:

4. Hide the native scrollbar (`.scrollbar-hide` exists) **plus** an edge fade — hiding
   it alone removes the only "there's more" signal
5. The orange "Indicative rates only" line as a proper notice chip
6. Phone/mail glyphs on the two contact cards so they read as the actions they are

**Both new pages are not internationalised.** Copy is hardcoded English while the rest
of the site routes through `messages/`. Figma supplied English only; ~40 keys × 11
locales is its own pass.

**No sitewide mobile baseline.** Missing: `viewport-fit=cover`, `theme-color`,
`-webkit-tap-highlight-color: transparent`, `overscroll-behavior`. These belong in
`app/[locale]/layout.tsx` and `globals.css` and would touch all 18 routes **including
the locked Hero** — `-webkit-text-size-adjust` in particular can change its text size
in landscape. Needs the lock waived.

**Known pre-existing lint errors**, untouched and not ours: unused `GOLD_BADGE`
(`ProductCategories.tsx`), unused `onKeyDown` (`Coverflow.tsx`), unused `code` /
`eyebrow` and `<a href="/">` (`NotFoundView.tsx`, `not-found.tsx`). Baseline is 15
errors across `components/ app/ lib/`; the six files added this session lint clean.

---

## 9. File map

**New**

```
lib/data/estimator.ts                      tabs, items, rates, estimate()
components/tools/Estimator.tsx             the estimator panel + tab switcher
components/contact/ContactHero.tsx         hero + Call/Email cards
components/contact/SendMessage.tsx         copy, offices, enquiry form
public/tools/calculator-hero-1512.webp
public/contact/contact-pipes-1512.webp
public/brand/tagline-mark.svg
public/about/vision-mission-card-mobile.svg
```

**Modified**

```
app/[locale]/tools/calculator/page.tsx     rewritten
app/[locale]/contact/page.tsx              rewritten
components/home/Hero.tsx                   LOCKED — mobile stats gap only
components/home/ProductCategories.tsx      uPVC
components/about/AboutHero.tsx             mobile hero + card geometry
components/layout/Footer.tsx               tagline, logo lockup
components/layout/Navbar.tsx               logo height
components/shared/NotFoundView.tsx         logo height
components/shared/SectionHeading.tsx       mobile leading/tracking
components/shared/SocialIcons.tsx          Instagram
styles/globals.css                         .container-figma, 16px controls,
                                           narrowed a.flex centering rule
public/logo.svg                            retired the baked-in margin
messages/*.json  (11)                      footer.brandTagline
public/products/category-cards/upvc-wordmark.png
```

**`Hero.tsx` is locked.** Ask before any change that alters its rendered output —
directly, or indirectly through a shared component, token or global style it consumes.
