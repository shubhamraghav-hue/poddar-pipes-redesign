# Content TODOs

Real facts and assets still needed before this site can go live. Per the golden rule
("never invent facts"), every item below is currently either omitted, disabled, or
rendered as a bracketed placeholder rather than fabricated. Do not fill any of these
in with invented data — replace with verified information only.

## Resolved since the last pass

- **About Us page rebuilt from Figma (node 1001:5531), Sep 2026.** The old page and its
  five About-only components were deleted; the new one reuses `LegacyStory` and
  `CTASection` and adds two new sections. Copy for both new sections is real, translated
  content in **all eleven locale files**, not placeholders. Two content side-effects:
  - `gu.json` never had an `about` namespace at all, so `/gu/about` and the Facilities
    section on `/gu/manufacturing` had nothing to render. It has been seeded with the new
    About copy plus the eight `facilities*` keys. (Gujarati is still unrouted — see
    `i18n/routing.ts` — so this only matters when the locale is re-enabled.)
  - The `about` namespace dropped from 76 keys to 29 in every locale: the removed
    sections' keys (story, values, leadership, members, presence, timeline, milestones,
    and the About-local `cta*`) are gone. The `facilities*` keys were deliberately kept —
    `/manufacturing` still renders `components/about/Facilities.tsx` against them.

- **Category logo assets — fully resolved.** Auditing the homepage category grid
  (`components/home/ProductCategories.tsx`) first found that 4 of the 6 wordmark SVGs at
  `public/products/*-logo.svg` did not contain the artwork their filename claimed:
  `swr-logo.svg` actually rendered "PODDAR PP-R GOLD", `agri-logo.svg` actually rendered
  "PODDAR PP-RC GOLD" — both from the unconfirmed Playbook mockup filler noted below —
  while the real SWR artwork was sitting under `tanks-logo.svg` and the real AGRI artwork
  under `ugd-logo.svg`. This was invisible to any code-level check (the `alt` text and
  hrefs were always correct) — only opening each SVG file directly revealed it. TANKS and
  UGD briefly had no real artwork at all and showed an honest placeholder. The brand team
  then supplied a complete, correctly-labelled set of all 6 wordmarks (`upvc.svg`,
  `cpvc.svg`, `swr.svg`, `tank.svg`, `ugd.svg`, `agri.svg`), now installed at
  `public/products/*-logo.svg` — all six categories show real artwork, matching the file's
  own name. The category grid's display order was also changed per brand-team request to
  CPVC, UPVC, SWR, AGRI, UGD, TANKS (was UPVC, CPVC, SWR, TANKS, UGD, AGRI).

Several items previously flagged here turned out to have real source material sitting
in the user's Downloads folder that just hadn't been pointed to yet:

- **Brand Playbook** — `Brand Playbook_Poddar Pipes_Final_V1.pdf` exists and was read in
  full (text-extracted). Confirms every color/CTA/boomerang/stamp/container rule already
  built matches exactly, and corrects one detail: icon construction is a **60×60px canvas
  with a 4pt stroke** (not 64×64px as a separate internal asset-requirements doc says —
  the Playbook is the primary source, trust that one). Also confirms Paramount Neo (logo)
  and Torque (product-unit lockup, e.g. "PODDAR CPVC GOLD") are artwork/typeface assets,
  never live-typed — matches how the logo is already handled.
  - Caution: the Playbook's own layout-example pages use generic template filler, not
    real Poddar facts — e.g. "Manufactured in Gurgaon, India," "+91 98476543210," "since
    1982," "Wavin Vectus," "Prabhudas Liladhar" (an unrelated stock-broking firm) all
    appear as mockup copy from the design agency's template library. Don't mistake these
    for real Poddar facts if referencing this file again.
  - The Playbook also lists product-unit lockups for "PP-R GOLD" and "PP-RC GOLD" — these
    aren't among the 6 confirmed real categories and appear in the same section as the
    generic mockup examples above, so treat as unconfirmed rather than a 7th/8th category
    until a real PP-R/PP-RC catalogue turns up.
- **Real Agri Manual** — `Poddar Pipes Agri Manual [27th JUNE].pdf` exists and was read in
  full. This resolves the earlier IS 4985 data gap: real Class 2 (4 kgf/cm²) / Class 3
  (6 kgf/cm²) pipe dimensions and IS 7834 fitting classes now power a new **Poddar Agri
  Gold Pressure Pipes** product entry in `lib/data/products.ts`.
- **Logo variant #1 confirmed real** — `Orange Logo_Poddar.svg` in Downloads is
  byte-identical to `public/logo.svg` already in the repo, confirming that's the real
  Orange-on-White variant, not a placeholder.
- **Founding history & brand story** — the user supplied the real brand story, "About Us"
  copy (long/short), and 7 core values directly. This corrected two previously-fabricated
  facts that had been sitting unflagged in the codebase: the founding year (was "1981" in
  `lib/data/timeline.ts` and "since 1981" in `components/about/OurStory.tsx` — corrected
  to **1975**) and the CPVC introduction year (was "2005" — corrected to **1997**, and
  reframed as Poddar being a CPVC *pioneer* per the user's copy, not just an adopter).
  "45 years" / "three decades" references across `CompanyOverview.tsx`, `Leadership.tsx`,
  and `heroSlides.ts` updated to "50 years" / "five decades" to match. Wired into
  `OurStory.tsx` (About page hero + story body), `CompanyOverview.tsx` (home page), and
  `MissionVision.tsx` (all 7 core values replaced). Also added `foundingDate: "1975"` to
  the Organization JSON-LD schema in `app/[locale]/layout.tsx`.
  - Founder is referred to only as "Mr. Poddar" / "the Poddar family" — no first name or
    photo given, and it's not confirmed whether he holds (or held) the Managing Director
    title specifically vs. Chairman/Founder — the copy says "erstwhile owner," implying a
    past/possibly-different role. Don't assume he's the same person as `lib/data/team.ts`'s
    `[Managing Director Name]` placeholder without confirming the current title.
  - The remaining timeline milestone years (1998 SWR, 2012 UGD, 2018 Agri, 2023 facility)
    were never verified against any real source either — they predate this session's
    golden-rule enforcement and slipped through unflagged. Only 1975 and 1997 are now
    confirmed real; the other four remain unverified guesses.

- **Category card product photography — now supplied and live.** All six cards
  (`components/home/ProductCategories.tsx`) render real studio shots of the actual
  products on the brand's dark backdrop; the earlier placeholder-ish crops and the
  tank's `.svg` card art were deleted once unreferenced. Each card carries its own
  measured `photoPos` crop value — see BRAND_IDENTITY.md, "Category card photography
  replaced", before changing any of them, and note the hover-visibility ceiling that
  governs the tank's size.
  - **Tank card re-supplied twice, Sep 2026** — pair-of-tanks shots replaced the
    single-tank `tank-alt-R4.png` crop. Sizing is now scripted:
    `node scripts/crop-tank-card.mjs "<src>" 660 --right 0.92 --slack 100 --tag g3` writes a
    `tank-card-<tag>-z<width>.png` per zoom step and prints what each does on the card.
    `tank-card-g3-z660.png` is live (tanks at 76.7% of the shared 68% frame; vertical placement is `photoPos` Y in the component, no regeneration needed); `g2` is the
    second background gradient, supplied Sep 2026 with the tanks in the same position. See
    BRAND_IDENTITY.md, "LIVE — the tank pair, sized by script", for the hover
    ceiling that governs the choice.
    - Source files (`Tanks v2.png` / `Tanks v3.png`) live in the user's Downloads,
      not the repo — only the crops are committed.
- **Architectural line drawing supplied Sep 2026** — a building with its underground
  water/drainage runs, now at `public/home/legacy-blueprint.webp`. It replaces the
  `manufacturing-floor.jpg` photo in the homepage "A 50-year legacy of excellence in
  plumbing" section (`CompanyOverview.tsx`). Pre-cropped to a square right-hand
  1024x1024 because the source's left 45% is empty; the card went light (the linework
  is 6.39:1 on white vs 3.00:1 on the old navy scrim) and the caption moved to the top
  so the bottom gradient stops veiling the pipe run. See BRAND_IDENTITY.md,
  "CompanyOverview image: blueprint drawing replaces the photo".
  - It was first tried as the `LegacyStory` backdrop on `/about` and **reverted** —
    that section is back to Figma's gold line-work. Don't re-add it there.
  - `public/home/manufacturing-floor.jpg` is now unreferenced but left in place.

## Still open — brand assets

- **About hero water-ripple video** — Figma node 1027:8205 is a video *fill*, not a
  timeline, so `export_video` refuses it and the file cannot be pulled through MCP. The
  brand/design team needs to supply the actual footage. A Figma-side render of the node
  currently stands in as the poster at
  `public/about/water-ripple-poster-1512.webp` (1512x895, the node's full natural
  size) — it is a still, so the hero does not move. Even at 1512 it upscales on a
  2x display; Figma cannot render the node any larger, so real sharpness needs the
  footage. **Re-cut the poster from the video's first frame when it arrives.**

  To enable it, drop the file(s) into `public/about/` and add one entry to
  `RIPPLE_SOURCES` in `components/about/AboutHero.tsx`:

  ```ts
  const RIPPLE_SOURCES = [
    { src: "/about/water-ripple.webm", type: "video/webm" },
    { src: "/about/water-ripple.mp4", type: "video/mp4" },
  ];
  ```

  No other change is needed — the `<video>` element, poster and `object-left` crop are
  already wired. Spec to match the node: 1688x946, silent, seamless loop. Follow the
  hero-video budget in the asset-requirements doc, and re-render the poster from the
  real first frame once the footage lands.

- **3 of 4 logo variants still missing** — only Orange-on-White exists. Need
  Orange-on-Blue, White-on-Black, and Black-on-White as SVG files. (`Poddar Icon Logo.dwg`
  in Downloads is a CAD file, not directly usable on the web without export/conversion —
  hasn't been opened.)
- **Torque (product-unit lockup) and Paramount Neo (logo) artwork/fonts** — confirmed
  needed by the real Playbook, still not present as files. Product category badges
  ("uPVC", "CPVC", etc.) currently render as plain Anek Devanagari text, not true lockup
  artwork.
- **Icon pack** — the Playbook references a "Click here for Icon Pack" link (likely
  Figma or similar); the hyperlink target wasn't captured by text extraction. Current
  site uses Lucide icons at a stroke width approximating the 4pt/60px spec, not the
  brand's own icon pack.
- Several unopened files in Downloads may contain more real assets and haven't been
  checked yet: `Poddar Website Templates.fig.zip` (Figma export — likely full mockups),
  `poddar-pipes-design-system.zip` / `poddar-pipes-website-complete.zip` /
  `poddar-pipes-corporate-website.zip`, and the `poddar-pipes-hero` / `poddar-pipes-why-poddar`
  directories (possibly real photography/video for those two homepage sections). Worth
  opening before assuming photography must stay a TODO.

## Contact & office data

- **Phone numbers** — no verified phone number exists for any office. `lib/data/offices.ts`
  (all 4 entries), `components/contact/ContactInfo.tsx` all show `+91 [XXXXX XXXXX]`.
- **Regional office locations** — North/West/South India regional office city, address, and
  email are bracketed placeholders in `lib/data/offices.ts`. Only the Bengaluru HQ address
  is real (verified consistently across all 6 real catalogues).
- **WhatsApp Business number** — `components/shared/WhatsAppButton.tsx` currently renders
  nothing (returns `null`) rather than link to a fabricated number.

## People

- **Leadership names** — no longer blocking anything on the live site. The About page
  rebuild (Sep 2026) removed the Leadership section, and `lib/data/team.ts` (4 role-only
  entries with bracketed name placeholders and no photographs) went with it as its only
  consumer. Real names, titles and photographs are still needed if a leadership section
  is ever rebuilt; recover the old file from git history rather than re-inventing it.

## Manufacturing facilities

- **Plant cities/states** — `components/about/Facilities.tsx` has 4 placeholder plant
  city/state entries.

## Statistics / unverified numeric claims

Not sourced from any catalogue or other verified material — inherited placeholder-style
content, still need verification or removal before launch:
- "500+ dealers/distributors" (`CompanyOverview.tsx`, `WhyChooseUs.tsx` — the third
  consumer, `Facilities.tsx`'s `GlobalPresence`, was deleted with the old About page)
- "28 states with dealer coverage", "22 regional distribution hubs" (`Facilities.tsx`)
- "50,000+ tonnes annual production capacity" (`CompanyOverview.tsx`)

## Certifications

- ISO 9001 / ISO 14001 claims (`lib/data/certifications.ts`) are asserted without a
  certificate number or issuing body reference — confirm real numbers or remove. The IS
  4985/7834/13592/14735/15778/16098 and ASTM D1785/D2466/D2467 entries are sourced
  directly from real catalogues and don't need further verification.

## Content flagged as needing a real source before writing

- **Hariyali Drip Irrigation Lines** (`lib/data/products.ts`, `p-agri-dripline`) — this
  entry predates this session's catalogue-verification work and has never been checked
  against a real Poddar source. The real Agri Manual covers pressure pipes only (no drip
  emitter product), so Hariyali's IS 13487 standard and spec figures remain unverified,
  not confirmed real. Leave as-is (removing it would be presumptuous — drip irrigation
  may well be a real product line) but don't treat its specs as fact-checked the way every
  other product in the file now is.
- **Infrastructure Projects** — no real project references, client names, or outcomes
  exist anywhere in the source material. Needs a real, approved list before this section
  is built.
- **Case studies** (`lib/data/blog.ts`) — same problem as the testimonials that were
  removed in Phase 0: fabricated client names (Regional Water Board, Deshpande AgriFarms,
  Sundar Developers) with invented outcomes, plus references to non-existent product
  lines (InfraLine HDPE, FlexiFit). Needs the same treatment — remove or replace with
  real, approved case studies.
- **Testimonials** — removed entirely in Phase 0 rather than replaced. Needs real,
  approved customer quotes before this section comes back.
- **Photography** — hero video slides (`public/hero/slide-*.webm`) don't match the asset-
  requirements doc's spec (WebM, ≤3-5MB — current files are webm, some up to 25MB) and
  aren't confirmed as real Poddar footage vs. stock. The asset-requirements doc confirms
  final photography for "What We Manufacture," "Why Poddar Pipes," "Industries Served,"
  and other homepage sections is still pending delivery from the design team — current
  site imagery there is a stand-in, not final.
