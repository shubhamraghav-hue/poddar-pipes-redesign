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
- [ ] Contact page bottom spacing: Figma 240px under the form, built 120
      (site standard). *(needs user decision)*
- [ ] Product page bulk-order CTA could pre-fill the product name in the
      enquiry pop-up like the hero's Request a Quote. *(needs user decision)*
- [ ] Fix `ScrollWaterRail` hydration mismatch under `prefers-reduced-motion`.
- [ ] i18n pass for English-only copy (see §4 item 6).

## Last prompt

> Go with option B: keep Resources as a dropdown label only and remove /resources

**Status: done, verified in Playwright (desktop, iPad touch, phone).**
- `lib/data/nav.ts`: `href` optional; "Resources" has none. Navbar renders it
  as a `<button>` that OPENS (never toggles — touch fires mouseenter then
  click) the dropdown; tap outside the header / Escape / mouseleave closes.
  Active (navy) when on /articles or /tools/calculator. Mobile menu shows it as
  a non-link label above its two links.
- `app/[locale]/resources/page.tsx` deleted (in git). `/resources` and
  `/hi/resources` 308 → `/articles`; `/resources/installation` kept and now
  linked from every product page's Installation tab.
- "Download Catalogue" everywhere (CTASection default `#catalogues`, QuoteCTA
  on the calculator) opens a catalogue picker pop-up (5 PDFs) — `CatalogueLink`
  in components/enquiry/EnquiryProvider.tsx, same shell as the enquiry pop-up.
- Footer "Resources" column: News & Media, Pipe Material Estimator, Contact.
  Sitemap no longer lists /resources. The /resources FAQ copy is dropped (/faq
  remains).

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
- **Figma MCP** is on a Starter plan with a call cap — prefer `get_metadata`;
  the 1512 viewport in browsers includes a 15px scrollbar (column 1197, not
  1212).

---

_Last updated: 2026-10-08 — end of session 6._
