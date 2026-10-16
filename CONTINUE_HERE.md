# Continue here — living hand-off

**This file is the entry point for every session.** The user starts a session
with just "read CONTINUE_HERE.md and continue" (sometimes plus extra changes).
No other prompt is needed — everything required is below.

---

## 0. Instructions for Claude (do these, in order)

1. Read this whole file, then `FIGMA_SESSION_NOTES.md` (detailed measurements,
   decisions and gotchas behind everything listed here).
2. Respect the standing rules: `components/home/Hero.tsx` is **LOCKED** (ask
   before any change that alters its output, directly or indirectly), and the
   environment traps in §5 — especially the `.next` cache and Tailwind v4
   precedence.
3. If the user's message adds new changes, do those first. Otherwise take the
   first unchecked item in **§1 Next up** and continue from there. Ask the user
   only about items marked *(needs user decision)*.
4. Verify every UI change in the browser at 375 / 768 / 1024 / 1512, and
   confirm one arbitrary Tailwind value actually computes before trusting any
   measurement.
5. **Before ending EVERY response, update this file:** replace "Last prompt"
   with the user's latest message (verbatim) and its status, tick or add items
   in "Next up", and record anything new in §2–§5. Keep it current — the next
   session will know only what is written here.

---

## 1. Next up (ordered)

- [ ] **Work through `LAUNCH_AUDIT.md`** — most blockers need client inputs
      (phone, plant cities, certs, rates, jobs, history). Dev-only items first:
      form endpoint, env var/sitemap/canonical/OG image, remove fake downloads +
      find-a-plumber, focus ring/skip link, mobile menu. Hero.tsx items need OK.

- [ ] **Commit the backlog.** Nothing from the 2026-10-07/08 sessions is
      committed (~50 files on top of `64d0cec`). Show `git status`, propose a
      split (enquiry pop-up; contact page; calculator; media page; products
      page; centring/CTA fixes), and commit only after the user confirms.
      *(needs user decision: confirm the split)*
- [ ] **Hero spacing on /tools/calculator and About** — both use `sm:mt-7` /
      `md:mt-[68px]` / `sm:gap-4`; Figma wants copy 20 under the heading,
      buttons 60 under the copy, 15 between buttons (confirmed for calculator,
      frame 1488:14461; check About's frame first). Same fix already applied
      in `components/contact/ContactHero.tsx`.
- [x] ~~Outlined CTA 48-vs-46px + high labels~~ — done in `CTASection` (all
      ~14 pages) and `AboutHero` (session 3). Only `Hero.tsx` still has it —
      *locked, ask the user before touching it*.
- [x] ~~/products detail content for all six ranges~~ — done 2026-10-16 (Figma 1859:12796).
      in `lib/data/productDetails.ts` once the client finalises it.
- [ ] /products banner: Figma 1731:7511 says "Request a quote" but the client
      asked for "Become a Partner" (2026-10-09) — which wins?
      *(needs user decision)*
- [x] ~~Navbar: "ABOUT US" wraps to two lines at 1024~~ — fixed 2026-10-14 (nowrap + px-2.5 below xl).
- [x] ~~Navbar focus ring after clicking a nav link~~ — done 2026-10-14.
- [x] ~~Hero poster cache-bust~~ — CACHE_BUST is ?v=3 (2026-10-14).
- [ ] Contact page bottom spacing: Figma 240px under the form, built 120
      (site standard). *(needs user decision)*
- [ ] Product page bulk-order CTA could pre-fill the product name in the
      enquiry pop-up like the hero's Request a Quote. *(needs user decision)*
- [ ] Fix `ScrollWaterRail` hydration mismatch under `prefers-reduced-motion`.
- [ ] i18n pass for English-only copy (see §4 item 6).

## Last prompt

> https://www.figma.com/design/6jLHH8FxOKbRcIWOpIiWcx/Poddar-Pipes-Website?node-id=1606-11700&m=dev
> check and fix for any mismatch on the contact us page

**Status: hero fixed; 3 items need user decisions.** Measured /contact at 1512
against Figma 1606:11505 (section 1606:11700).
- FIXED: hero background is now Figma "contact page BG 1" (node 1861:12806,
  grey pipes, 4096x2286 -> public/contact/contact-pipes-grey.webp q88),
  placed as Figma does: 2289x1278 at (-87,-200) of the 1512x895 box, as %
  (left -5.754 top -22.346 w 151.389 h 142.793), object-cover inside so the
  481px phone floor crops, not stretches. Old contact-pipes-1512.webp removed.
- Matches (<=3px): hero h1/copy/buttons, Send-message h2/intro/rule/office
  labels/addresses, form position, 48px inputs r10 #c0c0c0, labels 16/500/1px.
- Intentional deviations kept: hero cards sized per 2026-10-14 requests
  (section 1075 tall vs Figma 1125); section column x150 vs Figma 147.
- NEEDS DECISION 1: Figma form has "Select Type Of Enquiry *" (form 737 tall);
  ours has none (626 tall). It was REMOVED deliberately in commit 429d5a5
  "forms integrated" (2026-10-09) — server/Sheet always record "General".
- NEEDS DECISION 2: addresses differ from COMPANY (client-approved):
  "100 Ft Road" vs Figma "100 Feet Road"; plant PIN 563157 (+", India") vs
  Figma 563128.
- NEEDS DECISION 3 (old): Figma leaves 240px under the form; we use 120.

### Previous prompt (heading sizes)

> What is / PODDAR TANK? / Why / PODDAR TANK? — also check for both headings font size
(answers: keep caps; both headings 48px; "make sure font size is consistent throughout the page")

**Status: done.** ProductDetailSections: What-is h2 now uses the Why h2's type,
and both follow CTASection's ramp: 28 / 36 (sm) / 48px (md+). Measured on
/products at 375/640/768/1024/1512: What is = Why = Tell us (CTA) at every
width, no wraps. Figma had What-is at 60px. Hero h1 (60px) left as the page title.

### Previous prompt (heading consistency)

> also check for all product pages that their section headings should be consistent

**Status: done.** Measured all six ranges at 1512: heading STYLES were already
identical (What-is 60px 300/700 white; Why 48px 300/700 #606060; banner 24px
500 #606060). Only TANK broke the TEXT pattern: "PODDAR / TANK" (from Figma
1858:11843) vs "WHAT IS / X?". Now "WHAT IS / PODDAR TANK?" (lib/data/
productDetails.ts; lead removed), matching its "WHY / PODDAR TANK?". Fits on
one line at 375 and 1512. Deviation from the TANK mock — by request.

### Previous prompt (404 on every route)

> [screenshot: 404 page at /products?category=cpvc-pipes#range] why is it showing 404 page for every product? i want them active on these types of links like it was earlier working

**Status: fixed, no code change.** The dev server's .next was corrupted —
EVERY route but / returned 404 (/about, /contact too), not just products.
Stopped the dev server, rm -rf .next, restarted, warmed / first. All routes
200 again; /products?category=cpvc-pipes#range and ?category=tanks#range open
with the range selected and the pills scrolled under the navbar. See the
.next trap in §5 — it happened this time with no build (two dev servers?).

### Previous prompt (all six product pages)

> https://www.figma.com/design/6jLHH8FxOKbRcIWOpIiWcx/Poddar-Pipes-Website?node-id=1859-12796&m=dev
> use the design for all product pages and make them all responsive

**Status: done, measured at 375 / 768 / 1023-1024 / 1512 for all six ranges.**
Figma section 1859:12796 = one 1512 frame per range (CPVC 1858:10809, uPVC
1858:11020, UGD 1858:11226, SWR 1858:11432, AGRI 1858:11638, TANK 1858:11843).
No mobile frames exist — responsive behaviour is ours.
- lib/data/productDetails.ts now has ALL six ranges. New fields: whatIs.lead
  (TANK: "Poddar" / "TANK"), whatIs.bodyW (TANK 505), art.washW (AGRI
  605/813), WhyCard.flipX (SWR soil/waste/rain card). CPVC titles now use
  "&". UGD: 4 new card photos (card 4 now has one); "Leak-Proof Joints" is a
  new photo, rotated 160.6deg + flipped in Figma, baked (582x698).
- Assets: public/products/{swr,agri,tank}/*, ugd updates,
  showcase/tank-wide.webp (4096x2286) — full source res, webp q90. SWR
  What-is render is only 1767x2633 in Figma.
- ProductDetailSections WhatIs: below lg shows the SAME crop as the desktop
  band (box ratio w:780, object-position from art geometry) — every range
  framed as its mock. lg..1512: art width clamp(w*780/h px, w/15.12 vw, w px)
  and top clamp(780-artH, Figma centre, 0) so the box always covers the band
  (plain scaling left 37-108px gaps at 1024). At 1512 = Figma exactly.
- TANK range card: showcase photoWide via <picture> (getImageProps): portrait
  below 1024, landscape from 1024; each device downloads only its one file
  (two next/images with CSS hiding made phones fetch both).
- Checks: no horizontal overflow anywhere; all 30 Why titles one line
  (21px desktop, ~15px at 375); every card has its photo.

### Previous prompt (What-is cropping on tablet)

> [screenshot: uPVC "What is" molecule cut off top and bottom on a tablet] Why is this getting cropped

**Status: fixed, measured at 375 / 768 / 1023 for CPVC, uPVC, UGD.** Cause:
below lg the render was a full-width strip of FIXED height (420 / 520px)
with object-cover; the 2:3 image at 768 wide showed only 27-72% of its
height, the molecule spans 20.5-75%. Now (ProductDetailSections.tsx WhatIs):
below lg the box is aspect 1.0818 (shows 62% of the height), object-position
50% 45% => window 17.1-79.1% at every width (subjects: CPVC 20.5-75,
uPVC 23-75.2, UGD 29.9-68, measured from the cut-outs), max-w 600 centred,
sides faded with a mask (lg:[mask-image:none]); top wash 50% -> 14% (it
 would have dimmed the molecule top). Desktop (lg+) unchanged.
- Note: .next/dev/types/routes.d.ts was found corrupted (a stale tail after a
  shorter rewrite — two dev servers writing one .next?). tsc on source is
  clean; if a build fails on it: stop dev, rm -rf .next, restart.

### Previous prompt (British English)

> yes convert all to British English

**Status: done, verified in rendered HTML** (/, /contact, /privacy-policy,
/terms-of-service, a tank product page, /about). Site copy is now British
 English throughout. Changed (values/strings only; keys, ids and code kept):
- messages/*.json: Inquiry/inquiry/inquiries -> Enquiry/enquiry/enquiries,
  Catalog/catalog -> Catalogue/catalogue, organized -> organised (en: 13;
  the 9 English-placeholder locales: 4 each). Key form.inquiryType unchanged.
- lib/data/legal.ts: enquiries/enquiry x5, unauthorised x3, authorised,
  license (noun) -> licence (verb sub-license kept); faq.ts organised;
  products.ts UV-stabilised x11, pressurised, minimises; productDetails.ts
  Unplasticised; LegacyStory.tsx revitalised; EnquiryForm.tsx visible
  strings: Enquiry details, Send Partnership Enquiry.
- Left as code: id="inquiry" anchor (ProductDetail), autoComplete=organization,
  schema.org Organization, CSS center/color, Next internal unauthorized key.
- Rule going forward: write new copy in British/Indian English.

### Previous prompt (which English)

> Also can you check which english are we using on our site

**Status: answered, no change.** Site copy is British/Indian English (catalogue
~100x, enquiry ~180x, colour, centre, labour, metre, grey, rotomoulded,
minimise, centralised). American strays: inquiry/inquiries (messages/en.json
form.*, home.whyResponse*, manufacturing.ctaEyebrow, contact.heroDesc /
formHeading / formDesc; lib/data/legal.ts), catalog (en.json
nav.navViewFullCatalog, products.ctaCustomTitle), organized (faq a4 in en.json
+ lib/data/faq.ts), UV-stabilized x8 + minimizes (lib/data/products.ts),
authorized (legal.ts). Converted next prompt (2026-10-14).

### Previous prompt (delete verify-hevc-alpha)

> delete the verify-hevc-alpha script too

**Status: done.** scripts/verify-hevc-alpha.mjs git-rm'd (staged). Nothing
ran it (not in package.json); BRAND_IDENTITY.md ~L2025 still mentions it as
history, left as is.

### Previous prompt (hero optimizations)

> yes do all three hero optimizations

**Status: done, verified at 375 / 767 / 768 / 1512.** User-approved edits to
the LOCKED Hero.tsx (this prompt only):
1. Poster: HERO_POSTER = /hero/hero-fittings-poster.webp (189KB, q85,
   2576x1440) replacing the 3.3MB PNG (git rm). Used by <video poster> and
   the next/image overlay. New path, so no stale caches.
2. Phones: new /hero/hero-fittings-phone.webm = the phone crop only
   (crop=970:1076:24:0 of the 1924x1076 source, native res, crf31) — 4.9MB
   vs 12.6MB. The crop equals the phone box ratio (1/1.10945) at the
   object-[2.525%_50%] position, so framing is identical. Chosen in JS
   (isPhone = matchMedia(MOBILE_QUERY), set in the same effect as
   needsMp4Only), not <source media>, which unsupporting browsers ignore.
   <=767 loads the phone file, >=768 the full one. Safari path unchanged.
3. Deleted (git rm): hero-fittings-alpha.mp4 (18MB; only
   scripts/verify-hevc-alpha.mjs used it — script deleted next prompt),
   hero-fittings-mobile.webm/.mp4/-poster.png, _figma-herostats-full.png,
   slide-1.webm. public/hero: ~80MB -> 33MB.

### Previous prompt (uPVC + UGD product pages)

> https://www.figma.com/design/6jLHH8FxOKbRcIWOpIiWcx/Poddar-Pipes-Website?node-id=1809-9139&m=dev
> create a similar page as cpvc for upvc design according to the figma directly export assets from figma and try to keep the image quality at its best

(mid-turn) > https://www.figma.com/design/6jLHH8FxOKbRcIWOpIiWcx/Poddar-Pipes-Website?node-id=1809-9345&m=dev
> and do the same for UGD

**Status: done, verified at 1512 + 375 for CPVC / uPVC / UGD.**
- `lib/data/productDetails.ts`: entries for upvc-pipes (Figma 1809:9139) and
  ugd-pipes (1809:9345). New `whatIs.art` {w,h,centerY} (CPVC/uPVC 778x1160
  +40; UGD 757x1129 +100.5 = top -74); `WhyCard.image/crop` optional.
- Assets: public/products/upvc/*, public/products/ugd/* exported from Figma
  at FULL source resolution, webp q90 (no upscaling). CPVC set re-exported
  the same way (was resized, q80). UGD What-is images are only 848x1264 /
  687x1024 in Figma — the max available.
- UGD "Leak-Proof Joints": Figma flips + rotates the photo 159.15deg; baked
  into why-leak-proof.webp (613x735, source scale) instead of CSS transforms.
- UGD "Corrosion Resistant & Rodent Proof" has NO photo in the mock — card
  renders navy + footer. Needs an image from the client. *(needs user input)*
- uPVC "Resistant to Chemicals" photo is 470 tall in Figma (10px short of
  the card) — scaled to 480 about its centre.
- `ProductDetailSections.tsx`: range names keep case (normal-case → "uPVC");
  art box data-driven (CSS vars); Why cards now use the newer frames' style
  for ALL ranges: 21px one-line titles (5.25cqw), x30 (7.5%), bottom 7cqw,
  200px footer (41.67%) at 8px blur; quality 90; per-card sizes = crop width
  (wide crops were served soft). Navy wash extended 1px left (hairline seam).
- Banner in the UGD frame says "Request a quote for uPVC" (copy-paste in
  the mock); site keeps the client's Become a Partner banner.

### Previous prompt (Why card titles one line)

> [screenshot: the Why CPVC cards, titles wrapping] Make text smaller to fit in one line.

**Status: done, measured at 375 / 768 / 1512.** components/products/ProductDetailSections.tsx:
the Why cards are now @container and the h3 is whitespace-nowrap at 5cqw
(20px on the 400px card, ~14.6px on the 293px phone card), insets 10% /
bottom 8cqw. Sized by the longest title, Self-Extinguishing and Fire
Retardant (15.16x its font size = 303px of the 320px inner width). All
five titles one line at every width. A longer future title needs this
size revisited.

### Previous prompt (old card images, media load, 1975 copy)

> yes delete the old card images, also see if we can reduce the image and
> media load time site wide

(mid-turn) > on about us page change just the text for 1975 [old: "The
> Poddar Family was founded in Patna, beginning its journey in pipe
> manufacturing." → new: "The Poddar Family began it's journey in pipe
> manufacturing in Patna."]

**Status: done (non-hero parts); hero parts need user OK.**
- Deleted (git rm, staged): `public/products/category-cards/{cpvc,upvc,swr,agri,ugd}-card.png`,
  `tank-card-g4-z820.png` (7.2MB, unused). Wordmarks kept.
- About "Our Story" gold backdrop (`components/home/LegacyStory.tsx`): 1.2MB
  PNG served `unoptimized` → `public/legacy/legacy-gold-bg.webp` (62KB
  master, opaque) through next/image: 18KB transferred at 1512. Old PNG
  git-rm'd. New path on purpose (Next's optimiser caches by path).
- `/products` range card: dropped `priority` (below the fold since
  ProductsHero went in above it; it competed with the hero for first paint).
- 1975 copy (LegacyStory.tsx `desc`): "The Poddar Family began its journey
  in pipe manufacturing in Patna." — "its", not the screenshot's "it's".
- Audit, measured, NOT done (Hero.tsx locked — ask):
  1. `<video poster>` fetches the raw 3.3MB PNG; as WebP q82 it is ~171KB
     (~92KB at 1924w). Needs HERO_POSTER path change in Hero.tsx.
  2. Phones download the same 12.6MB desktop WebM (Safari phones already get
     the 2.7MB packed-half). A 1288x720 WebM (crf 32) is ~5MB; needs a
     `<source media="(max-width: 767px)">` in Hero.tsx.
  3. Desktop WebM: native 1924 crf30 ≈ 12.2MB vs 12.6MB now — not worth it.
  *(needs user decision)*
- Unused (not loaded, only deploy weight): hero-fittings-mobile.webm (5MB),
  -mobile.mp4 (2.9MB), -mobile-poster.png, _figma-herostats-full.png,
  slide-1.webm; hero-fittings-alpha.mp4 (18MB) only referenced by test
  page/scripts. Offered to delete. *(needs user decision)*

### Previous prompt (home product images + header)

> Also can we update the product images that we used in there and use the
> same in the home page product section, i just want to enhance the quality
> of the images is it possible or not?

(mid-turn) > remove the calculater link from header and keep only News&
> Media section instead of Resources dropdown

**Status: both done, verified in-browser.**
- **Home product cards** (`components/home/ProductCategories.tsx`): all six
  now use the /products 4K shots (`/products/showcase/*-hero.webp`) at
  `quality={90}`, replacing the older grey studio set (848-1029px, no
  high-res originals). Pipes keep `photoPos` 50% 100%. Tank: measured lids
  y≈53.6%, bases ≈86% → desktop `50% 82%` (whole tanks), phones get
  `photoPosMobile: "50% 64%"` (the 2.5:1 phone frame shows only ~27% of the
  height, so the bases are cropped, lids kept). Positions go through
  `--pos`/`--pos-m` + `object-[var(--pos-m)] sm:object-[var(--pos)]`.
  PHOTO_PAN is now empty (mechanism kept; old tank values in a comment).
  Old `public/products/category-cards/*-card*.png` (7.2MB) are now unused —
  offered to delete. *(needs user decision)*
- **Header** (`lib/data/nav.ts`): Resources dropdown → plain
  `{ key: "navBlogsArticles", href: "/articles" }` ("News & Media"); the
  calculator left the header (still in the footer, page still live).
  `nav.navBlogsArticles` was missing in 9 locales (no next-intl fallback →
  raw key) — added as English "News & Media" placeholders (bn, gu, kn, ml,
  mr, or, pa, ta, te). Navbar triggers now `whitespace-nowrap`, `px-2.5`
  below `xl` (`xl:px-4`): no two-line labels from 1024 up.
- Pre-existing uncommitted edits seen in messages/*.json
  (`newsletterDescription` comma) are not from this session.

### Previous prompt (hero poster cache bust)

> yes bump the hero poster cache bust too

**Status: done.** User-approved one-line edit to the LOCKED Hero.tsx:
CACHE_BUST "?v=2" -> "?v=3" (the <video poster> URL). Verified on / : poster
attr is /hero/hero-fittings-poster.png?v=3, video plays. The next/image poster
overlay (src without a query) is not busted by this; Next 16 caches optimized
images for minimumCacheTTL (4h default), so returning visitors could see the
old frame there briefly within that window. Renaming the PNG would fully bust
it, but needs another Hero.tsx edit (ask first).

### Previous prompt (navbar focus fix + card heights)

> yes add the navbar focus fix, also the font sizes that you reduced should
> also make their cards smaller accordingly so there is not extra vacant space

**Status: done, verified in-browser.**
- **Navbar focus fix** (`components/layout/Navbar.tsx`): on a pathname
  change, if focus sits outside `<main id="main" tabIndex={-1}>` (nav,
  footer, menu), it moves to `<main>` with `preventScroll`. Verified: click
  CONTACT → focus on MAIN, scrollY 0; pressing ↓ draws no ring in the header;
  Tab then lands on "Send Us a Message" with its ring. Query-only changes
  (/products?category=) are untouched.
- **About Vision/Mission cards** (`components/about/AboutHero.tsx`): from
  `md` the height follows the content — 50px sides/bottom (8.4459cqw), title
  starts 20px under the quote cut-out (pt 28.2095cqw; level with it the
  title hit the cut-out on the 323px two-up cards at 768). The shape SVG
  (`preserveAspectRatio="none"`) keeps its 582/518 ratio pinned top-left and
  is clipped. `bodyWidth` props are now cqw. 1512: 622x359 (was ~473 tall);
  1024: 451x261; 768: 323x208. Mobile strip layout unchanged.
- **Contact cards** (`components/contact/ContactHero.tsx`): no min-height,
  equal padding (p-7 / md:p-[58px]). 1512: 189 tall (was 240); 375: 108.

### Previous prompt (hero card type sizes)

> also for about us hero section and contact us hero section the cards below
> should follow the consistent font size as in the home page hero section 4 cards

**Status: done, measured at 375 / 768 / 1024 / 1512.** Hero.tsx untouched.
- New `--hero-card-w` / `--hero-card-figure` (x0.2274) /
  `--hero-card-label` (x0.0568) on `:root` at the END of
  styles/globals.css — the home stat card's width rebuilt from the viewport
  per breakpoint (container-edge + 2 cols/gap16, 4 cols/gap20 from sm). If
  Hero's grid or container-edge changes, update those widths.
- About Vision/Mission: title = stat number size, body = stat label size
  (12px floor). Contact cards: label = stat label (12px floor), value =
  min(stat number, the email's one-line fit 9.7cqw) — at 1512 that is 45px,
  not 69, because the email would overflow the card at 69.
- Measured (number / label px): home 68.9/17.2 at 1512 = about 68.9/17.2;
  1024 home 49.4/12.3, about 50.3/12.6 (100vw includes the scrollbar).
- Hit the .next trap: the dev server never picked up the globals.css append
  until stop -> rm -rf .next -> start.

### Previous prompt (navbar focus ring)

> [screenshot: /contact, orange ring around CONTACT in the navbar] why is it
> that sometimes i see a orange hover on navbar selection and not always?

**Status: answered, no code change.** It is the keyboard-focus ring
(`:focus-visible`, 3px #d96d00, unlayered in styles/globals.css ~L632), not
a hover. The clicked nav link keeps focus after client-side navigation (the
navbar never unmounts); Chrome shows the ring only once the last input was a
key (Tab, arrows, Space/PageDown to scroll, shortcuts), hence "sometimes".
Offered fix: on route change, move focus off the header to the page
(`<main>`), which clears the ring and is better for screen readers.
*(needs user decision)*

### Previous prompt (2026-10-14, hero video)

> "C:\Users\VX-LT-360\Downloads\Updated Homepage Hero Image for Poddar Pipes Website (1).webm"
> update the video for the hero section and keep the allignment as same across all the layouts and screen sizes

**Status: done, verified at 375 / 768 / 1024 / 1512 + the WebKit packed
path on `/_alpha-packed-test.html`.** Hero.tsx was NOT edited (locked) —
only its five assets in `public/hero/` were replaced, same names and
dimensions:
- Source: 1924x1076 VP9 with alpha, 10s (old: 2576x1440, 15.12s). Same
  scene and framing: alpha-matte diff at 0 offset was the best match, so
  every crop (incl. the mobile `object-[2.525%_50%]`) lines up as before.
- Upscaled (lanczos) to the existing 2576x1440 so Hero.tsx/AlphaVideo
  constants still match. NOTE `setsar=1` is required — the source aspect
  isn't exactly 16:9-ish 2576:1440, and without it the WebM decoded as
  2576x1441 in Chrome.
- Recipes as in BRAND_IDENTITY.md: WebM (yuva420p, alpha_mode=1, crf30
  10M/14M), MP4 on #14134f (crf27 slow), packed + packed-half (premultiplied
  colour over luma matte, crf23), poster = frame 0 on #14134f, RGB.
- Not changed: `CACHE_BUST = "?v=2"` in Hero.tsx for the poster
  (its comment says to bump it when the PNG is regenerated in place). Locked
  file — ask the user before bumping it.
  *(needs user decision)*
- Unused legacy files left alone: hero-fittings-alpha.mp4, -mobile.*.

### Earlier prompt (2026-10-13)

> the product images we used for product page should be of higher quality
> since i provided 4k images? but they are breaking on smaller screens

**Status: done** — /products range photos re-exported from the 4K originals,
`quality={90}` (see §5 "Image quality").

---

## 2. State of the repo

- **Nothing from this session is committed.** Last commit is `64d0cec`
  ("Enlarge the footer brand lockup on mobile"); ~50 files are modified or new.
  Commit before starting anything large. Suggested split: enquiry pop-up;
  contact page; calculator; media page; products page; centring/CTA fixes.
- `components/home/Hero.tsx` is **LOCKED** — ask before any change that alters
  its output, directly or via shared components/tokens/global CSS. Two
  approved one-off edits are already in the working tree (mobile stats gap;
  "Talk to Our Team" → enquiry pop-up).
- Dev server: `.claude/launch.json` → `poddar-dev` (`npm run dev`, port 3000).

## 3. What was built / changed this session (all verified in-browser)

| Area | Where | Notes |
|---|---|---|
| Calculator mobile UX | `components/tools/Estimator.tsx`, `hooks/useLenis.ts` | Scroll-to-result (through Lenis), cards below 540px pane width (`@container`), Figma icons, hover, breakpoint audit |
| Calculator CTA card | `components/tools/QuoteCTA.tsx` | Figma 1488:14348 |
| Label centring | `components/shared/capTrim.ts` | `CAP_TRIM` on every pill/CTA label on /tools/calculator and /contact |
| Global enquiry pop-up | `components/enquiry/` | Figma 1605:11496; every `/contact` CTA opens it via `EnquiryLink`; product + estimate presets; designed success state |
| Contact page | `components/contact/*`, `EnquiryForm` page variant | Audited against Figma 1606:11505, all discrepancies fixed |
| News & Media | `app/[locale]/articles/page.tsx`, `lib/data/articles.ts` | Figma 1653:9258, six cards, client-supplied links |
| Products | `components/products/ProductShowcase.tsx`, `lib/data/productShowcase.ts`, `public/products/showcase/` | Figma 1530:7102, assets exported from Figma |
| Category pages | removed; `next.config.ts` 307-redirects `/products/category/<id>` → `/products?category=<id>` | Home cards + footer repointed. Product detail pages kept |

## 4. Open items — background detail (queue order is in §1)

1. **Same hero-spacing bug on two pages** — `/tools/calculator` and About use
   `sm:mt-7` / `md:mt-[68px]` / `sm:gap-4`; Figma (confirmed for calculator,
   frame 1488:14461) wants 20 / 60 / 15. Fixed on /contact only.
2. **Outlined CTA 48-vs-46px + high labels** in `CTASection` (~14 pages) and
   `AboutHero` — same inset-ring + `CAP_TRIM` fix as /contact. `Hero.tsx`
   has it too (locked — ask).
3. **Contact bottom spacing** — Figma leaves 240px under the form, we use 120
   (site standard). Awaiting the client's call.
4. **Product page bulk-order CTA** could pre-fill the product name in the
   pop-up like the hero's Request a Quote does. Offered, not answered.
5. **`ScrollWaterRail` hydration mismatch** under `prefers-reduced-motion`
   (pre-existing, real users with that setting hit it).
6. **i18n** — English-only: /tools/calculator, /contact copy, the new headings
   on /articles ("In the / News & Media") and /products ("Solutions that /
   Keep India moving"); other 10 locales still show the old wording.
7. **Launch blockers** — `lib/data/estimator.ts` ships placeholder rates; the
   enquiry form has no submission endpoint (simulated 1.2s success).
8. **Dead code** — `ProductsHero`, `ProductFilterGrid`, `IndustriesGrid`, old
   contact components, `lib/data/categoryContent.ts` (kept for restoring the
   category pages). Pre-existing lint error: unused `GOLD_BADGE`.

## 5. Environment traps (each one cost real time)

- **`.next` corruption (2026-10-16):** every route but / 404s — also without a build. Fix: stop dev, rm -rf .next, restart, warm / first.
- **`.next` cache:** new files' Tailwind classes are ignored until
  stop server → `rm -rf .next` → start. Stop FIRST or every route 500s.
- **Double-compile:** after a fresh start, let `/` finish compiling before
  requesting another route — two concurrent first compiles corrupted
  `.next/dev/prerender-manifest.json` ("JSON.parse … line 1") and 500'd
  every page.
- **Sanity check** one arbitrary class you just wrote before trusting any
  measurement.
- **Tailwind v4:** `md:`/`lg:` are emitted after `min-[1512px]:` — bound the
  lower rule (`lg:max-[1511px]:`). `-translate-*`/`scale-*` set the
  `translate`/`scale` properties — name them in `transition-[…]` lists.
- **Lenis:** never `scrollIntoView({behavior:"smooth"})` — use
  `scrollToElement` / `setScrollLocked` from `hooks/useLenis.ts`.
- **In-app browser pane** is often hidden → rAF frozen → framer animations
  stuck at frame 0. Measure with `offsetTop`/`offsetLeft`, or load pages in
  fixed-width offscreen iframes (immune to the user resizing the pane).
- **Playwright** window is throttled to ~2fps when occluded and can't go below
  500px wide; use `emulate_media reducedMotion: reduce` + generous waits.
- **Dev server on :3000 may belong to the user/another chat** — `preview_start`
  then exits ("Another next dev server is already running"). Just point the
  Browser pane at http://localhost:3000. Playwright's window has a 500px
  minimum (innerWidth reports 500 at a 375 viewport) — use the pane's
  `resize_window` with a tall height for whole-section screenshots instead.
- **`Button asChild` + custom wrapper:** the wrapper MUST spread props —
  Radix Slot passes className/ref/handlers to it. Dropping them silently
  unstyles the button (cost: every CTASection on the site, session 3).
- **Contact data lives in ONE place:** `COMPANY` in lib/data/offices.ts
  (client-approved). Never hard-code email/phone/address in components.
- **No certifications may be claimed** (client rule). Standards only as design
  intent ("designed to IS …"). Calculator prices hidden via `SHOW_PRICES`.
- **Playwright on this machine:** Chromium only (WebKit lacks Windows DLLs);
  mobile emulation works with `isMobile: true` contexts. In Git Bash prefix
  `MSYS_NO_PATHCONV=1` when passing `/route` args.
- **Overlap sweep technique:** host the script on `http://localhost:3000/robots.txt`
  (same origin, never HMR-reloads), load each route in an off-screen iframe,
  resize the iframe through the widths, compare text-node Range rects using a
  cap-height band (±0.36em around centre) — full line boxes flag every
  tight-leading 2-line heading. Hidden-by-clip text (home category cards'
  hover copy) is a known false positive.
- Focus ring is UNLAYERED in globals.css and excludes `section.bg-ink.mt-[80px]`
  (the locked Hero) — remove the exclusion once the owner approves.
- A JSX `{/* */}` comment placed directly before a component's root element in
  `return (` breaks the parse (two roots) — put it inside the element.
- **Image quality:** next/image defaults to q75 AVIF, which smears dark
  gradients and small print. Use full-size, high-quality masters and
  `quality={90}` (already allowed in next.config.ts). Images pasted into chat
  arrive downscaled (1341x2000); the user's originals are in
  `C:/Users/VX-LT-360/Downloads`.
- **Figma MCP** is on a Starter plan with a call cap — prefer `get_metadata`;
  the 1512 viewport in browsers includes a 15px scrollbar (column 1197, not
  1212).

---

_Last updated: 2026-10-12 — /products rebuilt to Figma 1731:7511 (CPVC)._
