# Poddar Pipes — Pre-launch audit

_2026-10-08 · Website on `main` + uncommitted work · Checked in the browser
(19 pages × 5 widths: 320 / 375 / 768 / 1024 / 1440, plus `/hi`) and by
reading through the source (forms, SEO, languages, accessibility, performance)._

> **Update 2026-10-08 (session 5): the dev-only fixes are done** — see
> "Progress" at the bottom. What remains is mostly client input (§1–2, §9)
> plus the locked-Hero items.

**Verdict: not ready to go live yet.** The design is in good shape and
nothing breaks on any screen size. The blockers are about **what happens
behind the forms** and **content that is still placeholder or fake**. Most
fixes are small; several need information only Poddar can supply (marked
**Client**).

Severity: 🔴 Blocker (must fix before going live) · 🟠 High (fix in launch
week) · 🟡 Medium (soon after) · ⚪ Low (polish)

---

## 1. Launch blockers 🔴

| # | Issue | Where | Fix | Owner |
|---|---|---|---|---|
| 1.1 | **No form sends anything.** The enquiry pop-up, /contact, careers applications, the product-page enquiry and the footer newsletter all show "success" after a fake delay. Every lead is lost. | `components/enquiry/EnquiryForm.tsx:140`, `components/contact/InquiryForm.tsx:40`, `components/shared/NewsletterSignup.tsx:13` | Add a server endpoint (email via Resend, or CRM) + spam protection (honeypot + Cloudflare Turnstile) + a real error state. Only show success on a 2xx response. | Dev + Client (which inbox/CRM) |
| 1.2 | **Phone number +91 98888 22333 is unverified** (internal notes say no verified number exists). It appears in the footer of every page, /contact, the success screen and the legal pages. | `Footer.tsx:236`, `ContactHero.tsx:171`, `EnquiryForm.tsx:325`, `LegalPage.tsx:89` | Confirm the real number and keep it in one shared constant. | Client |
| 1.3 | **/manufacturing shows "[Plant City 1]…[State]"** to the public (it's linked in the footer and listed in the sitemap). | `components/about/Facilities.tsx:12-15` | Real plant locations, or remove the section. | Client |
| 1.4 | **"Download" buttons give a fake .txt "sample placeholder" file:** certificate downloads on /quality and "Download Datasheet" on every product page. | `components/shared/CertDownloadButton.tsx`, `components/products/ProductDetail.tsx:17-56` | Link real PDFs, or hide the buttons. | Client (PDFs) + Dev |
| 1.5 | **Estimator shows placeholder ₹ prices** (the code says "REPLACE BEFORE THIS GOES LIVE"). Those prices are also pasted into enquiries. | `lib/data/estimator.ts:17` | Load the real MRPs, or hide the ₹ totals until they exist. | Client |
| 1.6 | **Careers lists jobs at "Plant Location"**, and the application form discards submissions (see 1.1). | `lib/data/blog.ts:50+` | Confirm the real openings and locations, or hide the section. | Client |
| 1.7 | **/tools/find-a-plumber lists 17 made-up plumbers with real-looking phone numbers** (they could belong to real people). It isn't in the menu, but it is reachable and indexable. | `lib/data/plumbers.ts` | Remove the route (or `notFound()`) until a real directory exists. | Dev |
| 1.8 | **The production build will fail.** The pre-build placeholder check stops on `[XXXXX]` markers, including some in unused files. | `lib/data/offices.ts`, `components/contact/ContactInfo.tsx` (unused) | Supply the real data and delete the dead files (§10). | Dev + Client |
| 1.9 | **The site goes live as "noindex" unless `NEXT_PUBLIC_SITE_ENV=production` is set** on the hosting project. This isn't documented anywhere. | `lib/seo.ts:7`, `app/robots.ts` | Set the env var in Vercel production and add a `.env.example`. | Dev |
| 1.10 | **Contradictory company history.** The hero says "Manufacturing since **1991**"; the overview says "Founded in **1975**" and "50-year legacy"; the timeline says the company exited in 2018, returned in 2026, and "products launching soon"; yet the site also claims "500+ dealers" and "50k+ tonnes capacity". | `messages/en.json:124,144`, `Hero.tsx:60-65` (locked), `LegacyStory.tsx` | Agree one story and one set of numbers, and verify them. | Client |
| 1.11 | **Certification claims are unverified** (ISO 9001/14001 have no certificate numbers; the file says "replace before publishing"). A false claim is a legal risk. | `lib/data/certifications.ts`, /quality | Supply certificate numbers or remove the claims. | Client |

---

## 2. Business details to confirm 🟠 (Client)

- **One email address.** The footer and /contact use `hello@poddarpipes.com`; the structured data and legal pages use `poddarpipes@gmail.com`. Pick one (a Gmail address on legal pages looks unprofessional). `hr@` and `distributors@` (shown on the 404 page) are also unverified.
- **One address format.** "3rd Floor, 1202, HAL 2nd Stage…" (footer) vs "#1202, 100 Feet Road…" (contact page, no "3rd Floor").
- **Company ID in the Google structured data:** labelled "CIN" but it's a GSTIN-format number, and its PAN segment doesn't match "Poddar". Fix the label or remove it (`app/[locale]/layout.tsx:108`).
- **Place-name spelling:** "Vemgal" vs "Vemagal". Use "Vemagal".
- **Product naming:** TANKS / TANK / Tanks and AGRI / Agri / Agriculture are all in use. Pick one per category.
- **No CPVC catalogue PDF**, although CPVC is the first and default category. All 5 other PDFs exist and download.
- **Facebook** isn't linked (no page exists). Fine, but the Figma footer shows the icon.

---

## 3. SEO and sharing 🟠

| Issue | Fix |
|---|---|
| **No share image anywhere** (`og:image` missing on every page), so links on WhatsApp, LinkedIn and X show no picture. | Add `app/opengraph-image` (one branded 1200×630 image) and per-page images later. |
| **Hindi pages tell Google to index the English page instead** (`/hi/about` sets its canonical to `/about`), and inner pages have no hreflang. Google will drop the Hindi pages. | Build a shared `alternates(locale, path)` helper and use it in each page's `generateMetadata`. |
| **Hindi pages have English titles and descriptions** (16 pages use static English `metadata`). | Use `generateMetadata` + `getTranslations`. |
| **Sitemap** is missing `/articles`, `/faq`, `/privacy-policy` and `/terms-of-service`; it includes `/manufacturing` (placeholder text) and `/industries` (not in the menu, stock photos); it has no hreflang; `lastModified` changes on every request. | Fix the route list and add alternates. |
| **Duplicate title:** "Find My Plumber — Poddar Pipes \| Poddar Pipes". | Drop the suffix from the page title. |
| **Product pages can't be reached by browsing.** /products has no link to any product, so they're reachable only via the sitemap. | Link the showcase card (or add "View products" under it) to the category's products. |
| Only `icon.svg`: no `apple-icon`, `favicon.ico`, manifest or theme colour. | Add them. |
| Structured data: `sameAs` is empty although social links exist; the logo is the favicon. | Fill them in. |

---

## 4. Responsiveness (measured in the browser) ✅ mostly good

**Passed everywhere:** no horizontal scrolling at any width on any page, no
broken images, one `<h1>` per page, meta descriptions present, `<html lang>`
switches for Hindi.

| Issue | Where | Fix |
|---|---|---|
| 🟠 **Hero stat labels are 7–8px on phones** ("Years manufacturing piping systems", etc.): 6.8px at 320, 8.4px at 375, 8.7px at 768. They can't be read. | Home hero — `Hero.tsx` **(locked — needs your OK)** | Min 12px on mobile. |
| 🟡 About page card text is 9–12px at 320–768 (vision/mission cards, timeline). | `components/about/*` | Min 12–13px. |
| 🟡 Footer copyright and legal links are 10px on phones. | `Footer.tsx` | 12px. |
| 🟡 /quality badge text is 9–11px ("IS 15778 / 13592 / 16098"). | /quality | 12px+. |
| 🟡 **Small tap targets on phones** (Google recommends ≥ 44px): footer links are 22px tall; the footer email/phone are 13px tall; careers "Apply" is 26px; product breadcrumbs are 14px; find-a-plumber pincode chips are 22px; the hamburger is 40px; the language button is ~32px. | Footer, careers, product detail, navbar | Add padding (hit area) without changing the look. |
| 🟡 **Mobile menu** doesn't cover the screen (the page shows below it with no backdrop), doesn't lock page scroll, doesn't close on Escape, and **stays open when you tap a category while already on /products**. | `components/layout/Navbar.tsx` | Full-height sheet + scroll lock + close on link tap. |
| ⚪ The Hindi hero etc. haven't been visually checked for clipped matras under the cap-trim treatment. | `/hi` | Spot-check. |

---

## 5. User experience and clarity 🟠

- **Seven different labels open the same enquiry pop-up:** "Request a Quote", "Start a Conversation", "Talk to Our Team", "Send Us a Message", "Get in Touch", "Contact us about this estimate", and the navbar CTA. Visitors can't tell these apart. → Use **one** primary label (recommend "Request a Quote") and one secondary one.
- **On /contact the hero buttons open a pop-up** even though the same form is already on the page. → Scroll to the inline form instead.
- **"Download Catalogue" doesn't download.** It goes to /resources. → Rename it "View Catalogues", or link the PDF directly.
- **Menu labels don't match page names:** "Blogs & Articles" → page titled "News & Media"; "Pipe & Cement Calculator" → "Pipe Material Estimator"; "UPVC" in the menu vs "uPVC" everywhere else.
- **Pages nobody can find:** Industries, Find a Plumber and the Installation Guide aren't in the menu (Manufacturing, Quality, Sustainability and Careers are footer-only). → Decide for each: link it, or remove/noindex it.
- **/resources shows 4 "blog" teaser cards** with made-up dates that link nowhere. → Remove them until the articles exist.
- **404 page shows a large "COMING SOON"** (reused launch video) and no visible "Page not found" heading. Under `/hi/...` it's English, with no menu or footer. → Use a neutral video or a still, show the title, and add the localized catch-all route.
- **/products search:** when nothing matches it says "no results" but leaves the previous card visible, which looks like a result.
- **Calculator:** "Calculate Estimate" stays disabled without saying what's missing; quantities can only be changed ±1 (no typing).
- **Careers:** every "Apply" goes to one generic form, with no role pre-filled and no CV upload.
- **Home page feels thin:** six sections are commented out, and LegacyStory is marked "preview placement". Decide the final section list.
- **Stock photos:** a Pexels image is hot-linked in the CTA band on 8 pages, and Unsplash images on /industries and /resources. → Replace with real photography (also removes a dependency on third-party image hosts).

---

## 6. Accessibility 🟠

- **No visible keyboard focus on any button** (`components/ui/button.tsx:13` removes it), and the global focus outline is near-invisible on navy sections (1.6:1). → Add a focus ring: white on dark, navy on light.
- **No "Skip to content" link.**
- **Low-contrast text:** white on orange "Calculate Estimate" (2.7:1) and the 404 "Back home" button (2.3:1) → use navy text, as other orange buttons already do. Grey `#86868c` small text (3.6:1) and orange text on white (2.7:1, including the visitor's name on the success screen) → darken.
- **Hero video autoplays and loops** with no pause button and ignores "reduce motion" (WCAG 2.2.2) — `Hero.tsx` **(locked)**.
- **Keyboard:** desktop dropdown menu items can't be reached by Tab; the hamburger lacks `aria-expanded`; the language switcher has no Escape, no current-language marker, and its list can't be scrolled with the mouse wheel (Lenis).
- **Forms:** only "enquiry type" shows an inline error; others rely on browser bubbles; the mobile number accepts any text; the pincode error says "match the requested format". The careers form has no required markers and loses focus after sending.
- **Home category cards** show their description only on mouse hover, not keyboard focus.
- **Hydration warning** for users with reduced motion (`components/shared/ScrollWaterRail.tsx`).
- ✅ Good already: alt text, one h1 per page, the enquiry pop-up (focus trap, Escape, focus return, announced success).

---

## 7. Performance 🟠

- **The home hero video is 23.8 MB** (Chrome/Android) or 15.3 MB (Safari), with `preload="auto"`; the poster is a 2.7 MB PNG. Mobile versions (2.9–5.1 MB) exist but are unused. This is the single biggest load-time problem, especially on mobile data. → Serve the mobile file to phones, `preload="metadata"`, WebP/AVIF poster, and skip the video under reduce-motion / Save-Data. **(Hero.tsx locked — needs your OK)**
- **The second home section is invisible until JavaScript runs** (`components/shared/SectionReveal.tsx` starts at opacity 0) — the same iPhone Safari issue that got the other reveal animation disabled. → Make it start visible.
- `legacy-gold-bg.png` (1.3 MB) is served unoptimised on /about.
- **~28 MB of unused files** in `public/` (alpha/mobile hero videos, Figma reference PNGs, test page). → Delete.
- Unused dependency: `gsap`.

---

## 8. Hindi (`/hi`) — the only other live language

Only `en` and `hi` are switched on (the other 9 language files exist but
aren't routed).

- ✅ Hindi translations of the message files are complete.
- 🟠 **Large parts bypass translation and show English on `/hi`:** the enquiry pop-up (all labels, success screen), /contact (~95% English), /tools/calculator (~100%), product pages (~80%: product names, specs, FAQs), /articles cards, About timeline, /products taglines, all page titles.
- 🟡 Switching language drops `?category=` (you land on the default category).
- 🟡 Legal pages are English-only → add a Hindi line saying the English version governs.
- Before switching on other languages: the font covers only Latin + Devanagari (Tamil, Bengali etc. fall back to system fonts); Gujarati is ~80% untranslated; the others are missing the whole home page and menu.

---

## 9. Legal and compliance 🟠 (Client + legal review)

- **Privacy Policy is a generic template.** It claims to collect passwords, "sensitive personal information (ethnicity, religious beliefs, mental health)" and geolocation — none of which the site collects — and it uses GDPR wording. It doesn't mention India's **DPDP Act 2023**, has **no Grievance Officer**, and has no cookie section. → Rewrite for the actual form fields.
- **Terms of Service** is marked "NOT reviewed by legal" in the code (the draft banner is commented out, so it looks final).
- **Newsletter** has no consent text.
- **No analytics** (GA4 / Vercel Analytics / Plausible), so the launch and enquiries can't be measured. Adding analytics will also need a cookie/consent banner.

---

## 10. Technical hygiene and deploy checklist

- [ ] `NEXT_PUBLIC_SITE_ENV=production` set on the live project; add `.env.example`.
- [ ] Security headers in `next.config.ts` (X-Frame-Options/CSP frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy); `poweredByHeader: false`.
- [ ] Add `app/[locale]/error.tsx` + `app/global-error.tsx` (currently an unbranded Next error screen).
- [ ] `npm run lint` is broken (`next lint` was removed in Next 16) → `eslint .` with `ignores` for `build/**`, `.claude/**`, `.next/**`; bump `eslint-config-next` to 16.
- [ ] TypeScript: ✅ 0 errors.
- [ ] Delete dead code: ~25 unused components (e.g. ProductsHero, ProductFilterGrid, IndustriesGrid, ContactInfo, OfficeLocations, MapPlaceholder, PipeCalculator, WhyChooseUs…), `lib/data/{categoryContent,timeline,installationGuide,agriTechnicalData}.ts` and an empty `components/layout/Footer/`. `categoryContent.ts` is being kept to restore the category pages — decide.
- [ ] Remove the stock-photo hosts from `images.remotePatterns` once real photos land.
- [ ] **Commit the backlog** — ~55 files are uncommitted.
- [ ] Never run `next build` while the dev server is running (it corrupts `.next`).
- [ ] After deploy: Search Console + sitemap submit, test every form end-to-end, Lighthouse on mobile, real-device check (iPhone Safari + mid-range Android).

---

## Suggested order

1. **Client inputs (unblocks the most):** phone/email/address, plant locations, history and stats, certificates and PDFs, estimator rates, job openings, the decision on find-a-plumber/industries.
2. **Dev, launch week:** form endpoint + spam protection → env var + sitemap/canonical/OG image → remove placeholders/fake downloads → focus ring + skip link + contrast → mobile menu fixes → hero video weight (with your OK) → error pages → analytics.
3. **Soon after:** Hindi coverage of hard-coded pages, CTA label consolidation, tap-target/size polish, dead-code cleanup, security headers.

---

## Progress — dev-only fixes done (session 5, verified in browser)

- ✅ **Forms are real** (1.1, dev side): `app/api/enquiry`, `app/api/newsletter`
  (`lib/forms/*`). Server validation, honeypot + 3s min-fill + per-IP rate
  limit, delivery via Resend; inline error states with phone/email fallback.
  **Needs env vars** `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`
  (see `.env.example`) — without them production returns 503, never fake success.
- ✅ 1.4 fake downloads removed — product pages link the real catalogue PDF
  (none for CPVC); /quality certificate buttons hidden until real PDFs.
- ✅ 1.7 /tools/find-a-plumber returns 404 (component kept).
- ✅ 1.8 dead files that failed the build check deleted (offices.ts + Facilities.tsx
  still flag — client data).
- ✅ 1.9 `.env.example` documents `NEXT_PUBLIC_SITE_ENV`.
- ✅ §3 per-locale canonical + hreflang on every page, Hindi titles where keys
  exist, full sitemap with alternates, OG/Twitter share image, `sameAs`,
  `taxID` relabel, duplicate title fixed.
- ✅ §4 footer 12px legal text + bigger tap targets, careers Apply 44px,
  breadcrumbs, stamp text 11–12px, About vision text ≥12px, About timeline
  stacked/2-col below 1024 (was 9px), mobile menu full-screen + scroll lock +
  Escape + closes on tap, hamburger/language 44px. CTA labels wrap on small
  phones (was clipped at 320 on 6 pages).
- ✅ §5 404 shows a real "page not found" (no COMING SOON video), localized
  under /hi with nav/footer; menu labels match page names ("News & Media",
  "Pipe Material Estimator", "uPVC"); /resources fake blog teasers hidden;
  /products no-match dims the card; calculator explains why it's disabled.
- ✅ §6 visible focus ring sitewide (except locked hero), skip link, white-on-
  orange buttons → navy text, language switcher (Escape, lang, wheel-scroll,
  keeps `?category=`), focus return after mobile-menu enquiry, category cards
  reveal on keyboard focus, ScrollWaterRail hydration fix.
- ✅ §7 SectionReveal no longer hides the second home section.
- ✅ §10 security headers, `poweredByHeader:false`, error.tsx + global-error,
  lint script fixed (0 errors), TypeScript 0 errors.
- ✅ **Overlap sweep**: 21 pages × 14 widths (320–1920) — no text overlapping
  text, no clipped text, no horizontal scroll.

**Still open (dev):** Hindi coverage of hard-coded components (§8), CTA label
consolidation (§5, needs your call), desktop mega-menu keyboard order, analytics
(needs account), unused public assets (~28 MB). **Locked hero (needs OK):**
7–8px stat labels on phones, 24 MB video, no pause/reduced-motion, focus ring.

---

## Session 6 — Playwright UI/UX audit + client source of truth

### Playwright audit (Chromium; 8 device profiles × 22 pages = 176 loads + 16 interaction tests)

Devices: 320 phone, 390 iPhone-size, 412 Android, 768 iPad, 1024 iPad landscape
(touch), 1280, 1440, 1920. Each page: full-page screenshot, text overlap / clipped
text, horizontal scroll, tiny text, tap targets, contrast, console errors,
failed requests, layout shift (CLS).

**Result after fixes:** no overlap, clipping or sideways scroll on any page or
device; worst CLS 0.021 (good < 0.1); no console errors; 16/16 flows pass
(skip link, focus ring, desktop mega-menu by keyboard, mobile menu, enquiry
pop-up open/validate/submit/focus-return, language switch keeps category,
product pills + search, calculator, footer accordion, 404, reduced motion,
no-JS, 16px inputs on iPhone).

**Bugs it found and that are fixed:**
- 🔴 Product name invisible on all 10 product pages (dark navy on the navy hero).
- Desktop dropdown menu unreachable by keyboard (panel rendered after the nav row).
- Product page "Download Catalogue" navy-on-navy; tabs wrapped "FAQs" alone (now 2×2).
- /contact email split "hello@poddarpipes.co|m" at 320.
- Footer legal links broke to "Privacy / Policy" at 320; 12px-tall at 768.
- Tap targets: nav links on iPad landscape 29px, installation steps 36px, logo,
  footer links/legal, "Relevant products".
- Contrast: form placeholder, gold certification stamp text.
- 404 labels 11.5px.

**Not testable here:** real iPhone Safari (WebKit needs Windows system libraries
that aren't installed) — check on a real iPhone before launch.

### Client source of truth — applied

- ✅ Email `hello@poddarpipes.com`, phone `+91 98888 22333`, address
  "#1202, 100 Ft Road, HAL 2nd Stage, Domlur, Indiranagar, Bengaluru - 560008,
  Karnataka, India" — one source (`COMPANY`, lib/data/offices.ts) feeds footer,
  /contact, legal pages, enquiry screens, 404, JSON-LD. Gmail address and
  "3rd Floor" wording gone; regional-office placeholders deleted.
- ✅ Plant: Plot No. 96 & 97, Vemagal … Kolar Dist., Karnataka - 563157 —
  /contact (PIN fixed from 563128) and /manufacturing (single plant card
  replaces four "[Plant City]" placeholders).
- ✅ Certifications: none claimed anywhere live (en + hi). ISI/ISO stamps, ISO
  entries, "certified" copy, NSF/ISI tags removed; standards phrased as design
  intent. "ISI 2-Layer" tank renamed; old URL 308-redirects.
- ✅ Pricing: calculator keeps every input but shows a **material list, no ₹**,
  with "Get a quote" pre-filled. `SHOW_PRICES` in lib/data/estimator.ts turns
  the priced table back on once real MRPs exist.
- ✅ Careers: job list, application form and unverified perks removed; HR card
  → kusuma.kt@poddarpipes.com (also the 404's HR contact).
- ✅ Production placeholder check now passes (build no longer blocked).

---

## WHAT'S LEFT (as of session 6)

### A. Decisions / inputs needed from the client

| # | Decision | Why it matters | Options |
|---|---|---|---|
| A1 | **Home hero (locked) — OK to edit?** | Says "Manufacturing since **1991**" but About says founded **1975**; stat labels are 7–9px on phones; 24 MB video, no pause button; no keyboard focus ring | Approve hero fixes (recommended) / leave as is |
| A2 | **Hero stats** "500+ dealers", "50k+ tonnes/yr" | Unverified; About page doesn't state them | Confirm figures / remove those two stats |
| A3 | **Form delivery setup** (built; client's sheet connected locally + all forms verified live 2026-10-09 — only Vercel env left) | Forms → Google Sheet + email via Apps Script; nothing is stored until the sheet is connected | Follow integrations/google-sheets/README.md (≈10 min), then set `SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET` in Vercel |
| A4 | **One CTA label** | 7 labels open the same pop-up | "Request a Quote" (recommended) / other |
| A5 | **Brand orange text on white** (About timeline years, /contact "Reg./Mfd. Office", success-screen name) | ~2.7:1 contrast, below accessibility minimum | Keep brand orange / use darker orange for text only |
| A6 | **Privacy Policy & Terms** | Generic template; no India DPDP Act 2023, no Grievance Officer; Terms unreviewed | Provide Grievance Officer name + email; legal review |
| A7 | **Analytics** | Launch & enquiries can't be measured | GA4 / Vercel Analytics / none (GA4 needs a cookie banner) |
| A8 | **Tax ID in Google data** (29AAECO2313F1ZQ) | Unverified; looks like a GSTIN | Confirm / remove |
| A9 | **CPVC catalogue PDF** | CPVC is the lead category but has no download | Supply a compressed PDF (<5 MB) |
| — | ~~/resources page~~ | Removed (session 6): Resources is a menu label; /resources → /articles; catalogues in a pop-up | Done |
| A10 | **/industries page** | Not in the menu, stock photos | Link it from the menu / remove it |
| A11 | **Home page sections** | Only 5 sections live; 6 are switched off | Approve final list |
| A12 | **Photography** | Stock (Pexels/Unsplash) on CTA cards (8 pages) and /industries | Supply real photos / keep |
| A13 | **Hindi** | Enquiry form, /contact, calculator, product details, articles are English on /hi | Translate now / launch English-only for those |
| A14 | **Product data accuracy** | Specs, sizes, FAQs in lib/data/products.ts never client-verified | Client review |
| A15 | **Social links** | X, LinkedIn, YouTube, Instagram URLs unconfirmed; no Facebook | Confirm |

### B. Dev work remaining (no client input needed)
- Commit the backlog (~110 changed files) — needs your go-ahead on the split.
- Unused public assets (~28 MB) and dead components still in the repo.
- Desktop `<img>` lint warnings (7, cosmetic).
- After deploy: Search Console + sitemap, end-to-end form test with real email,
  Lighthouse mobile, real iPhone Safari + Android check.
