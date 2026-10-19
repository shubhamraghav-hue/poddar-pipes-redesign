# Poddar Pipes: Pre-Launch SEO Audit

| | |
|---|---|
| **Audit date** | 19 October 2026 |
| **Repository** | `D:\Projects\claude-code` (working tree, including uncommitted changes) |
| **Preview inspected** | https://poddar-pipes-redesign.vercel.app/ |
| **Intended production origin** | https://www.poddarpipes.com. Today it serves a noindex "Launching Soon" holding page; `http://` and the apex 308 → `https://www` (verified 19 Oct 2026). robots.txt and sitemap.xml return 404 there. |
| **Market** | India |
| **Status** | **v2, re-run 19 Oct 2026 after implementation.** SEO-003, SEO-004 and SEO-005 are done; the installation guides were removed. Current state: §0. The original v1 findings (§A–§G) stay below as the baseline, with a status column added in §0. |

---

## 0. Audit v2: current state (re-run 19 Oct 2026)

**Method.** The full crawl was re-run on the local dev server (Googlebot user-agent) over every route in both locales, plus the six range URLs. A Hindi-content inventory compared every visible text node and attribute on 21 `/hi` URLs. English pages were checked against the v1 baseline crawl.

### 0.1 Readiness

| Area | v1 (baseline) | **v2 (now)** |
|---|---|---|
| Indexable product pages | 1 (`/products`, CPVC state only) | **6 range URLs** × 2 locales, each self-canonical with a unique title, description and H1 |
| Sitemap | 25 routes × 2, incl. 16 orphan/unconfirmed URLs | **14 routes × 2 = 28 URLs**, all linked, indexable and 200 |
| Orphan / unconfirmed pages | indexable | `noindex, follow` and out of the sitemap (still reachable for visitors) |
| Hindi pages | 3–30% Devanagari on many pages; English meta descriptions; English legal, contact, calculator and product text | **59–94% Devanagari**. All titles and descriptions in Hindi. English text segments on /hi down from **581 to 195**, and every remaining one is intentional (see 0.4) |
| English pages | — | Title, description, canonical, H1 and word count unchanged on every page, except the intended SEO-003 changes (`/products` → CPVC canonical; `?category=` → 308) and the removed installation page (404) |
| Type check / lint | — | `tsc` clean; ESLint 0 errors (7 pre-existing `<img>` warnings) |

**Overall: technically ready apart from the launch configuration (SEO-001/002) and the business confirmations (SEO-007/019/020).** Those are the only remaining blockers.

### 0.2 Issue status

| ID | Severity | Status | Note |
|---|---|---|---|
| SEO-001 | Critical | **Open: needs Vercel access** | `NEXT_PUBLIC_SITE_ENV=production` on the production project only |
| SEO-002 | Critical | **Open: needs Vercel + DNS** | www.poddarpipes.com still serves the "Launching Soon" page; redirect `*.vercel.app` and the apex to www |
| SEO-003 | High | **Done** | Range URLs `/products/<range>`; see the log below |
| SEO-004 | High | **Done** | Orphans noindexed and removed from the sitemap |
| SEO-005 | High | **Done** | Hindi translated site-wide (details in 0.3). Hindi stays in the sitemap and hreflang |
| SEO-006 | High | **Partly done** | The six range titles are done. The home title still lacks product terms (proposal in §C3, awaiting approval) |
| SEO-007 | High | **Open: business confirmation** | 1991 vs 1975; uPVC hot water; IS 4985 edition and size range; `taxID` |
| SEO-008 | Medium | Open (approved-ready) | Drop the retired SearchAction; Product markup has no offers or rating, so it's not rich-result eligible |
| SEO-009 | Medium | Open (approved-ready) | Over-long descriptions: /contact 176, /hi/contact 188; /careers 60 is thin; the FAQ description mentions warranty and support, which the FAQ doesn't cover. /hi/about title is 73 chars |
| SEO-010 | Medium | Open | Automatic language redirect (Accept-Language → /hi) |
| SEO-011 | Medium | Open: needs permission (Hero locked) | Hero video 12.9 MB / 4.9 MB |
| SEO-012 | Low | Open | 404 shows the homepage `<title>` |
| SEO-013 | Low | Open | Preview: Disallow + noindex; prefer Deployment Protection |
| SEO-014 | Low | Won't fix | `keywords` meta is harmless |
| SEO-015 | Low | Open | `lastmod` = build time |
| SEO-016 | Low | Open | One generic share image |
| SEO-017 | Medium | **Open: needs DNS + analytics choice** | Search Console Domain property; GA4 (needs consent) or cookieless |
| SEO-018 | Low | Open | `/About` → 200 (canonical handles it) |
| SEO-019 | High | **Open: legal/business** | "Since 1975" heritage wording |
| SEO-020 | High | **Open: product team** | CPVC "93°C" meta description (IS 15778 scope is 82°C); IS 16098 Part 1 vs 2; no ISI/"certified" wording |
| SEO-021 | High | **New: legal review** | The Hindi Privacy Policy and Terms are translations and **must be reviewed by legal counsel** before launch. No "English version prevails" clause was added; that's a legal decision. The English source itself has oddities that were translated faithfully: "last updated at the bottom of this page" (it's at the top), and the Terms are still the unreviewed standard draft |
| SEO-022 | Medium | **New: business decision** | Pre-filled enquiry messages are now Hindi on /hi (partner form, range partner strip, estimator material list), so the sales team will receive Hindi text. Keep, or force English? (one-line change each) |
| SEO-023 | Low | **New: terminology sign-off** | Hindi wording to confirm. "Fire retardant" appears as अग्नि-मंदक (range pages) but as अग्निरोधी, which can read as "fireproof", on product-detail pills, so pick one. Also: संक्षारण-मुक्त (corrosion-free), जीवाणु-/शैवाल-/कवक-रोधी (anti-bacterial/algae/fungal), and whether "Agri" stays Latin or becomes एग्री. Product-detail claims ("गारंटी" for guaranteed volume, "lowest bacterial growth", "50–60% cost saving", "रोडेंट-प्रूफ") must not read stronger than the English |

### 0.3 What the Hindi implementation covers
- **Mechanism:** English data files are unchanged. Hindi lives in overlays under `lib/data/hi/` (`products`, `productShowcase`, `productDetails`, `articles`, `legal`, `estimator`, `enquiries`), merged by `lib/i18n/localize.ts` only for `hi`. UI strings moved into `messages/*.json` (en values identical to the old text). `i18n/request.ts` falls back to English for any missing key.
- **Pages:**
  - home
  - about (incl. the timeline)
  - all six range pages
  - articles (headlines, summaries, a11y labels)
  - careers
  - contact (hero, cards, form, validation, success state)
  - FAQ
  - privacy and terms
  - the noindexed industries, manufacturing, quality, sustainability, calculator and product-detail pages
  - the shared header, footer and skip link
  - both enquiry pop-ups
- **Metadata:** every page has a Hindi `<title>` and meta description.

### 0.4 English intentionally left on /hi
- Brand and legal names: "Poddar Plumbing System Pvt. Ltd.", the Hinglish brand line "Pipes ka Gold Standard. Phir se."
- Postal addresses, emails and phone numbers.
- Social network names; press outlet names (The Hindu, Deccan Herald…).
- Standard and product codes: CPVC, uPVC, SWR, UGD, IS/ASTM/EN/ISO numbers, SDR, SN, units.
- Range pills; a hidden anti-spam form field.
- Everything posted to the backend: field names and option values. Only the on-screen text changed.

### 0.5 Recommended next batch
1. **Approve SEO-006 home title, SEO-008 and SEO-009.** No visual change; I can do these immediately.
2. **Answer SEO-007/019/020/022/023** (facts, wording, sales-language preference).
3. **Legal review of the Hindi legal pages (SEO-021).**
4. **Launch configuration SEO-001/002 and Search Console (SEO-017).** Then run §F on production.

### How this audit was done
- **Source code read directly:** routing, metadata, robots, sitemap, structured data, data files, components and config.
- **Rendered HTML crawled:** 58 URLs (English and Hindi) on the local dev server, using a Googlebot user-agent. The tool captured status, title, description, canonical, robots, hreflang, H1/H2, JSON-LD types, images/alt and internal links.
- **Preview deployment probed with `curl`:** headers, robots.txt, sitemap.xml, redirects, URL variants and language negotiation.
- **Keyword and competitor research:** live web search on 19 Oct 2026. Sources are cited in §C and in `docs/seo/keyword-research.md`.
- **Not available:**
  - Google Search Console, GA4 and any paid keyword tool (no search volumes; see §C).
  - Field Core Web Vitals (CrUX).
  - A production deployment.

  No live performance test was run. URLs were not submitted to Google or any third-party testing service, because you asked for nothing to be submitted. All performance notes are code-level observations.

### Labels used
- **Verified:** reproduced, with evidence.
- **Potential:** likely, but depends on configuration that can't be observed yet.
- **Recommendation:** an improvement, not a defect.
- **Needs business confirmation:** a fact only Poddar can confirm.

---

## Implementation log

| Date | Item | Status |
|---|---|---|
| 19 Oct 2026 | **SEO-003 range URLs** (approved: 1A /products → canonical CPVC; 2A screen-reader H1 per range; titles and descriptions as proposed) | **Done.** `/products/{cpvc-pipes,upvc-pipes,swr-pipes,agricultural-pipes,ugd-pipes,tanks}` (+ `/hi/…`) are 200, self-canonical, with unique title and description, one H1 and reciprocal hreflang, and are in the sitemap. `/products` canonicalises to `/products/cpvc-pipes` and is out of the sitemap. `?category=x` and `/products/category/x` give a single 308 to the range URL (`?q=` kept). Range buttons are links; 18 internal links updated. Verified: tsc, lint, crawl, browser (pill click, search, Back, home-card arrival); visual unchanged. |
| 19 Oct 2026 | **SEO-004 orphan pages** | **Done.** `noindex, follow` (still reachable by visitors) and out of the sitemap: /industries, /manufacturing, /quality, /sustainability, /tools/calculator and the 10 product-detail pages (`buildPageMetadata({ noindex })`). The sitemap now holds 14 indexable routes × 2 locales. |
| 19 Oct 2026 | **SEO-005 Hindi site-wide** | **Done.** Five parallel streams covered range pages, product details, legal, contact/forms/estimator, and the rest (about timeline, articles, global strings, page meta). English on /hi went from 581 to 195 segments, all intentional; Devanagari share is now 59–94%. English pages unchanged. New follow-ups: SEO-021/022/023. |
| 19 Oct 2026 | **Installation guides removed** (client decision) | /resources/installation (now 404), its stepper and data, the product-detail "Installation" tab and its per-product steps, and all related message keys in every locale. Keyword cluster #13 and the "re-link the installation guide" recommendations are withdrawn. |

## A. Executive summary

### Overall readiness: **Not ready to launch for search yet. The fixes are well-defined and mostly small.**

The technical foundation is good:
- server-rendered App Router pages
- self-referencing canonicals
- hreflang in the HTML, the HTTP `Link` header and the sitemap
- per-page Open Graph data
- environment-gated robots
- a correct 404 status
- Organization, WebSite, BreadcrumbList and Product JSON-LD
- `next/font` and `next/image`
- a skip link

The gaps are in configuration and information architecture, not code quality.

### Critical launch blockers
1. **SEO-001: the site launches as `noindex` and `Disallow: /` unless `NEXT_PUBLIC_SITE_ENV=production` is set** on the production Vercel project. This is verified in code (`lib/seo.ts`, `app/robots.ts`, `app/[locale]/layout.tsx`). Nothing else matters if this is missed.
2. **SEO-002: production host configuration is unverified.**
   - www.poddarpipes.com currently serves a separate "Launching Soon" holding page (noindex; robots.txt and sitemap 404). The http → https and apex → www redirects already work there.
   - If the env var is set project-wide while `poddar-pipes-redesign.vercel.app` stays reachable, that `*.vercel.app` host also becomes crawlable. Canonical tags reduce, but do not remove, the duplicate-host risk.
   - Re-verify both redirects once the domain points at this project.

### High priority (before launch)
3. **SEO-003: five of six product ranges have no indexable URL.**
   - Ranges exist only as `/products?category=…`, and every variant canonicalises to `/products`. Google will index one products page (default CPVC state).
   - The uPVC, SWR, Agri, UGD and Tank "What is" and "Why" content will not be indexed as its own page, so there is no landing page for "uPVC pipes", "SWR pipes" and similar searches.
4. **SEO-004: 16 sitemap URLs are orphans** (no HTML link from navigation, footer, home or products):
   - 10 product-detail pages
   - /industries, /manufacturing, /quality, /sustainability, /resources/installation, /tools/calculator

   Several carry legacy or unverified content (stock imagery, an IS-standard year that conflicts with the new pages, a uPVC "hot & cold water" claim that contradicts the rest of the site). 
   ***DON'T WORK ON THIS POINTER UNTIL I SAY SO***
5. **SEO-005: the Hindi (`/hi`) pages are only partly translated** but are all in the sitemap and hreflang.
   - Product-detail bodies are about 70% English.
   - Legal, contact, calculator and articles pages are mostly English.
   - Most `/hi` meta descriptions are English.
6. **SEO-006: titles and H1s on the two most important pages carry no product or category terms.**
   - Home H1: "Engineered for every drop of India's growth"
   - Products H1: "Solutions that Keep India moving"
   - Suggested changes are in §B and §C, as proposals for approval; approved brand copy is not changed.
7. **SEO-019/020: heritage wording and standards claims need legal and product sign-off.**
   - The "Since 1975" line overlaps a competitor's (Ashirvad's) publicly stated heritage.
   - A meta description says "rated up to 93°C", while IS 15778's scope is 82°C.
   - The company holds no BIS certification yet, so the site must not use ISI or "certified" wording.
8. **SEO-007: factual inconsistencies visible to search engines.**
   - The hero says "Manufacturing since 1991"; the legacy section and Organization schema say 1975.
   - Product data conflicts with the range pages (IS 4985:2000 vs 2021; uPVC for hot water).
   - The unverified GSTIN-format `taxID` is published in Organization JSON-LD.

### Important, can wait until after launch
- Structured-data clean-up (SEO-008): Product markup that can't earn rich results; a retired SearchAction.
- Description lengths (SEO-009).
- Automatic language redirects (SEO-010).
- Hero video weight (SEO-011; Hero is locked, recommendation only).
- 404 HTML shell (SEO-012).
- Per-page share images.
- Content expansion around IS standards and comparisons (§C).

### Dependencies needing business input or access
- **Vercel:** access to set the env var, attach www.poddarpipes.com, and redirect `*.vercel.app` and the apex domain to `www`.
- **DNS:** for the domain go-live.
- **Search Console:** a Domain property (DNS TXT verification) and sitemap submission.
- **Business confirmations:**
  - founding or manufacturing-since year
  - GSTIN or `taxID`
  - IS standard versions per range, and BIS licence status (the site must not imply certification that isn't held)
  - uPVC application scope
  - the Agri size range
  - which legacy product-detail pages and off-nav pages should exist at launch
- **Analytics choice:** GA4 (needs a consent banner) or a cookieless alternative.
- **Google Business Profile:** eligibility for the Bengaluru office or the Vemagal plant (§C6).

---

## B. Route-by-route audit

All routes are server-rendered (App Router, `[locale]` segment, `localePrefix: "as-needed"`). English has no prefix; Hindi is under `/hi`. Every page builds metadata through `buildPageMetadata` (`lib/seo.ts`), which sets:
- a self-canonical
- hreflang for en, hi and x-default
- Open Graph and Twitter tags
- the `/opengraph-image` share image

Robots: `noindex, nofollow` everywhere until SEO-001 is fixed (expected on preview).

The **Linked** column shows whether the page is reachable through normal HTML links from navigation, footer, home or /products.

| Route | Purpose | Linked | Title (len) | Meta description | H1 | Assessment and fixes |
|---|---|---|---|---|---|---|
| `/` | Brand + category hub | Yes | "Poddar Pipes \| Engineering India's Water Infrastructure" (55) | Good, 153 chars | "Engineered for every drop of India's growth" (Hero, **locked**) | Title and H1 carry no product terms (SEO-006). Category cards link to `?category=` URLs that canonicalise to /products (SEO-003). Organization + WebSite JSON-LD. "Manufacturing since 1991" conflicts with 1975 (SEO-007). Hero video 12.9 MB desktop / 4.9 MB phone (SEO-011). |
| `/about` | Company / E-E-A-T | Yes | "About Us — Our Story, Vision & Quality Assurances \| Poddar Pipes" (64) | Good, 152 | "A Legacy Built to Move Forward" | Fine for a brand page. Story and assurances are strong E-E-A-T content. Could link to the range pages once they exist. **Design approved; no change proposed.** |
| `/products` | Category hub | Yes | "Products — uPVC, CPVC, SWR, TANKS, UGD & Agriculture \| Poddar Pipes" (67) | 127 | "Solutions that Keep India moving" | Renders only the selected range (default CPVC). Range content for the other five is not separately indexable (SEO-003). H1 is generic (SEO-006). Search uses `?q=` (no SEO value; SEO-008). |
| `/products?category=*` (6) | Range landing pages in practice | Yes (home cards, nav mega-menu, footer) | Same as /products | Same | Same | **Canonical → /products.** These are the URLs everyone links to, but none can rank. Needs path URLs (SEO-003). |
| `/products/<slug>` (10) | Product detail (legacy design) | **No** (only sitemap + cross-links between themselves) | "Poddar uPVC Gold Plumbing Pipes \| …" etc. (45–53) | 72–112, some short | Product name | Orphans (SEO-004). Content predates the new range pages and conflicts in places (SEO-007). Product + BreadcrumbList JSON-LD; the Product has no offers, review or rating, so it's not rich-result eligible (SEO-008). Links real catalogue PDFs (5 of 6 ranges; no CPVC PDF). |
| `/articles` | Press coverage | Yes | "News & Media — Press Coverage \| …" (44) | 147 | "In the News & Media" | Fine. Outbound links to the press are good brand signals. |
| `/faq` | Support / informational | Yes | "Frequently Asked Questions \| …" (41) | 120; mentions "warranty, technical support", which the new FAQ copy doesn't cover → update | "Your questions, Answered." | FAQPage JSON-LD: valid, but FAQ rich results are now limited to authoritative government/health sites (SEO-008). Good internal-link opportunity to the range pages. |
| `/contact` | Conversion | Yes | "Contact Us — We'd Love to Hear From You \| …" (54) | **176 (too long)** | "We'd Love To Hear From You" | Trim the description (SEO-009). The /hi H1 is English (SEO-005). |
| `/careers` | Jobs | Yes (footer) | "Careers \| …" (22) | **60 (thin)** | "Build the pipes that build India." | Low priority. Expand the description. |
| `/privacy-policy`, `/terms-of-service` | Legal | Yes (footer) | Fine | Fine | Fine | Keep indexable, at low sitemap priority (already 0.3). /hi versions are English (SEO-005). |
| `/industries` | Applications | **No** | "Industries We Serve \| …" | 151 | "Built into the infrastructure of everyday India." | Orphan. Uses stock photography (`lib/data/industries.ts`, Unsplash/Pexels). Not part of the Figma redesign → noindex and drop from the sitemap until reviewed (SEO-004). |
| `/manufacturing` | Plant / capability | **No** | "Manufacturing Excellence \| …" | 122 | "From resin to tested, dealer-ready pipe." | Orphan; capability claims need confirmation (SEO-004/007). |
| `/quality` | Standards / QA | **No** | "Quality Assurance & Standards \| …" | 122 | "Quality tested in, not inspected after." | Orphan. High topical value (IS standards) once facts are confirmed (SEO-004). |
| `/sustainability` | CSR | **No** | "Sustainability & CSR \| …" | 140 | "Durability is our sustainability strategy." | Orphan; claims unverified (SEO-004). |
| `/resources/installation` | Installation guide | **No** (one link from the calculator) | "Solvent-Weld Installation Guide \| …" (46) | **181 (too long)** | "Easy, 100% leak-proof installation." | The most useful informational page (785 words). Worth linking from the CPVC/uPVC/Agri range pages and the FAQ. "100% leak-proof" is an absolute claim → confirm (SEO-004/007). |
| `/tools/calculator` | Estimator | **No** | "Pipe Material Estimator — … \| …" (67) | **165** | "Estimate Your Piping Needs" | Orphan. Earlier audit flagged placeholder ₹ prices (`lib/data/estimator.ts`) → confirm before indexing (SEO-004). |
| `/hi/*` (all of the above) | Hindi | Yes (language switcher) | Mostly Hindi titles; product titles English | **English on most pages** | Mixed | Partial translation (SEO-005). |
| 404 (`/anything`) | — | — | Shows the **homepage title** | Homepage description | none in initial HTML | Status 404 + `noindex` is correct. The body arrives through the RSC payload, not the initial HTML, and the title is wrong (SEO-012, Low). |

**Performance observations (code level, no lab or field data):**
- `next/image` with AVIF/WebP and `priority` on hero LCP images (Products, About, Contact).
- `next/font` with `display: swap`. Self-hosted WebP/SVG assets.
- Main risks: the home hero video (SEO-011) and client-side animation libraries (framer-motion, GSAP, Lenis) inflating JavaScript and INP.
- Measure with PageSpeed Insights / Lighthouse after launch (§F).

---

## C. Keyword strategy

> **Data limits (read first).**
> - No search-volume tool was available: no Keyword Planner, Ahrefs or Semrush, and Google Trends returned HTTP 429.
> - Live Google India results pages could not be observed. The research tool is US-located, so SERP features (local pack, Shopping, People Also Ask) were **not measured**.
> - Demand evidence below is **qualitative**: Google autocomplete with `gl=in`, plus the result lists the research tool returned on 19 Oct 2026.
> - **No volume numbers appear in this report.** Full sources (51) are in `docs/seo/keyword-research.md`.
> - Once the site is live, replace these signals with Search Console query data and Keyword Planner volumes.

### C1. Positioning constraints (these shape every keyword choice)
- **Certification.** `lib/data/certifications.ts` records that the company **currently holds no ISI/BIS certification**.
  - Do not target or claim "ISI pipes", "ISI marked", "BIS certified" or "ISI water tank".
  - Use "manufactured/designed to IS xxxx" only where the business confirms that is accurate.
- **No "leading / top / No.1 / best" claims.** Competitors rank with listicles; those are not claims Poddar can make.
- **Heritage wording.**
  - News coverage describes the company as founded by the former Ashirvad promoters.
  - Ashirvad's own heritage is publicly described as "since 1975".
  - The site's "Since 1975" copy should therefore be framed as **family** history. Do not imply continuity with, or endorsement by, Ashirvad. **This needs legal/business sign-off** (SEO-019).
- **Brand disambiguation.**
  - "Poddar Pipes" results currently show Poddar Enterprises (a Nagpur pipe trader on IndiaMART/TradeIndia) and Orissa Plasto (MD Kaushal Poddar).
  - The official site, consistent NAP, a Google Business Profile (if eligible) and verified marketplace profiles are the legitimate fixes.

### C2. Prioritised keyword clusters

| # | Cluster | Primary keyword | Secondary / semantic | Intent | Landing page | Demand evidence (qualitative, 19 Oct 2026) | Competition observed | Priority |
|---|---|---|---|---|---|---|---|---|
| 1 | Brand | poddar pipes | poddar plumbing, poddar pipes bangalore / kolar, poddar pipes price list, poddar pipes careers / job vacancy, poddar pipes website, poddar pipes fittings | Navigational | `/` (+ `/contact`, `/careers`, `/about`) | Autocomplete shows bangalore, kolar, fittings, price list, careers, job vacancy, location, website, logo | No official page ranks (site not live); a Nagpur trader and news sites hold the SERP | **P1** |
| 2 | CPVC | cpvc pipes | cpvc pipes and fittings, cpvc pipe for hot water, cpvc pipe sizes, cpvc full form, cpvc pipe hsn code | Commercial + informational | CPVC range URL (SEO-003) | Price, sizes, full form, HSN code, "for hot water" | Astral, Ashirvad, Apollo, Prince; price aggregators for price queries | **P1** |
| 3 | uPVC | upvc pipes | upvc pipes and fittings, upvc plumbing pipe, upvc full form, upvc pipe sizes | Commercial + informational | uPVC range URL | Price, full form, sizes, HSN | Prince, Utkarsh, Ori-Plast, directories | **P1** |
| 4 | SWR | swr pipes | swr drainage pipes, swr pipe full form, swr pipe fittings names, soil waste rainwater pipe | Commercial + informational | SWR range URL | Full form, fittings name list, price, size, meaning | Hindware, Finolex (brochure PDFs rank), Utkarsh | **P1** |
| 5 | UGD | ugd pipes | underground drainage pipes, ugd pipe full form, ugd pipe standard / is code, sewer pipe | Commercial + informational | UGD range URL | Full form, price per metre, IS code | BIS PDFs, Ashirvad | **P1** (IS-part check: SEO-020) |
| 6 | Agri | agricultural pipes | agriculture pvc pipe, upvc pressure pipe for agriculture, irrigation pipe, column pipe for borewell* | Commercial | Agri range URL | Price by size, **subsidy**, borewell / submersible | Finolex, Vectus, Ashirvad, Apollo | **P1** (*column pipe only if Poddar sells it; confirm) |
| 7 | Tanks | water storage tank | 3 layer / 4 layer water tank, plastic water tank, overhead tank, 500 / 1000 / 2000 litre | Commercial / transactional | Tank range URL | Capacity × layer × price. Generic "water tank" is local-service intent (cleaning, near me), so avoid the head term | Vectus, Astral, Prince, IndiaMART | **P2** |
| 8 | Manufacturer (local) | pvc pipe manufacturer in bangalore | pipe manufacturers in karnataka, plumbing pipe manufacturer bangalore, pipe manufacturer kolar | Commercial / B2B | `/about` + `/contact` with genuine office and plant details; **no city template pages** | "pipe manufacturers in bangalore" is the top autocomplete completion | Weak: APL Apollo city templates without a local address | **P2** (only with real NAP; ties to GBP) |
| 9 | Manufacturer (national) | pipe manufacturer in india | plumbing pipe manufacturer, cpvc / upvc pipe manufacturer | Commercial | `/` + range pages | Listicle-dominated | Listicles (Tofler, Prayag), big brands | **P3** (low winnability; don't chase with claims) |
| 10 | Comparison | cpvc vs upvc | price difference, "in hindi", which pipe for hot water | Informational | New explainer (post-launch; FAQ q0 already answers briefly) | Autocomplete includes "in hindi" | Astral dominates | **P2** |
| 11 | Comparison gap | swr vs ugd | difference between swr and ugd pipes | Informational | New explainer (FAQ q1 already answers briefly) | Thin SERP, so an open gap | Almost none | **P2** (best content opportunity) |
| 12 | Standards | is 15778 / is 4985 / is 13592 / is 16098 / is 12701 | "ugd pipe is code", "cpvc pipe is code" | Informational (engineers, B2B) | Range pages (spec block); a standards hub later | Autocomplete for UGD "standard / is code" | BIS PDFs, consultants, unreliable aggregators | **P3** (facts first: SEO-020) |
| 13 | Installation | cpvc pipe installation / solvent cement joint | how to join upvc pipe, solvent weld steps | Informational | `/resources/installation` (exists, orphaned) | Not measured | Ashirvad and Astral have install tabs | **P2** (re-link: SEO-004) |

### C3. Page-to-keyword map (one primary per page)

| Page | Primary | Proposed `<title>` (metadata only; **for approval**) | H1 direction |
|---|---|---|---|
| `/` | poddar pipes | `Poddar Pipes — CPVC, uPVC, SWR & UGD Pipes and Water Tanks` (58) | Hero H1 is locked and approved; leave it. The title and range cards carry relevance |
| `/products` | pipes and fittings | `Pipes, Fittings & Water Tanks — All Ranges \| Poddar Pipes` | Approved copy stays. Option (only if you approve): a visually identical H1 with a screen-reader-only lead |
| CPVC range | cpvc pipes | `CPVC Pipes & Fittings for Hot and Cold Water \| Poddar Pipes` | Range name as H1; the existing "What is CPVC?" stays an H2 |
| uPVC range | upvc pipes | `uPVC Pipes & Fittings for Cold Water Plumbing \| Poddar Pipes` | as above |
| SWR range | swr pipes | `SWR Drainage Pipes & Fittings \| Poddar Pipes` | as above |
| UGD range | ugd pipes | `UGD Underground Drainage Pipes \| Poddar Pipes` | as above |
| Agri range | agricultural pipes | `Agricultural uPVC Pressure Pipes \| Poddar Pipes` | as above |
| Tank range | water storage tanks | `Water Storage Tanks — 3 & 4 Layer \| Poddar Pipes` (confirm the range) | as above |
| `/about` | poddar pipes company | keep the current title | approved; no change |
| `/contact` | poddar pipes contact | `Contact Poddar Pipes — Bengaluru Office & Kolar Plant` (confirm the plant is public) | keep |
| `/careers` | poddar pipes careers | `Careers at Poddar Pipes — Jobs in Bengaluru & Kolar` (confirm) | keep |
| `/faq`, `/resources/installation` | supporting | keep the titles; fix the descriptions (SEO-009) | keep |

**Cannibalisation today:**
- All six ranges collapse into `/products` (SEO-003).
- The ten legacy `/products/<slug>` pages overlap the same terms with older, partly conflicting copy (SEO-004/007).
- **Recommendation:** either (a) range URL = primary, with product-detail pages targeting specific product names (e.g. "Poddar UGD Gold Pushfit") and linked from the range page; or (b) noindex the product-detail pages until the content is reconciled.

### C4. Competitor observations (summarised; nothing copied)
- **Ashirvad (Aliaxis):**
  - Navigation by audience, then use case, then product system.
  - Each system page has Products, Features, Applications, Installation steps, Do's & Don'ts, FAQ and a brochure.
  - Also offers calculators, a BIM library and a dealer locator.
- **Astral:**
  - Twelve categories with sub-brands; spec sections (IS/ASTM), pressure tables, installation steps and ~12 FAQs per product.
  - Long and repetitive, with inconsistent temperature claims.
  - Dominates comparison queries through its blog and web stories.
- **Finolex:**
  - Breadcrumbs, short prose, **full dimension tables** and batch-number decoding.
  - Brochure PDFs rank on their own.
- **Prince:** 2026 catalogue PDF plus a price-list flipbook.
- **Vectus:** tanks by sub-brand × layers × capacity.
- **APL Apollo:** ranks locally with template city pages that have no local address. The local "manufacturer in Bangalore" SERP is weak and winnable with genuine information.
- Competitor JSON-LD could not be verified with the available tools.

### C5. Content recommendations
Each needs fact confirmation; none needs a redesign.
1. **Range pages (SEO-003):** use the existing "What is / Why" copy. Then, in a later batch, add a **specification table** (confirmed data only) and the **catalogue PDF link**; 5 of 6 PDFs exist, CPVC is missing.
2. **Short "full form / applications / sizes" FAQ per range**, matching the dominant autocomplete patterns. HSN codes only if finance confirms them.
3. **Re-link the installation guide** from the CPVC, uPVC and Agri range pages and from the FAQ.
4. **Post-launch explainers:**
   - "SWR vs UGD" (open gap)
   - "CPVC vs uPVC" (also in Hindi)
   - a tank-layers explainer that honestly notes IS 12701 does not define layer counts
5. **Genuine local signals:** Bengaluru office and Vemagal plant details on `/contact` and `/about`, consistent with the Google Business Profile. **No** city template pages.
6. **Price intent:** "poddar pipes price list" is an existing autocomplete. Publishing prices is a **commercial decision**.
7. **Not proposed:** a Dealers page (excluded by your brief), city doorway pages, keyword-variation pages.

### C6. India visibility
- **Search Console:** Domain property via DNS TXT. Submit the sitemap at launch.
- **Analytics:** GA4 needs consent handling (DPDP Act); a cookieless alternative avoids that.
- **Google Business Profile:** only for a staffed location customers can visit during stated hours (the Bengaluru office, if so; the Vemagal plant only if it receives visitors). One profile per real location.
- **NAP consistency:** use the exact `COMPANY` data (`lib/data/offices.ts`) on the site, GBP, IndiaMART/TradeIndia (a verified manufacturer profile helps disambiguate the brand) and LinkedIn.
- **Legitimate links:**
  - existing press coverage, which the News page already links to
  - associations: Indian Plastics Institute, PlastIndia Foundation, Indian Pipe Manufacturing Association (membership terms unverified)
  - a GeM seller presence is a business decision
- **BIS:** publish CM/L licence numbers, verifiable on manakonline.in or the BIS Care app, only once licences are issued.
- **Hindi:** there is real "in hindi" comparison demand. That argues for properly translated range and comparison pages, not half-English /hi pages (SEO-005).

---

## D. Technical issue register

| ID | Severity | Affected | Evidence and reproduction | Current behaviour | Recommended correction | SEO impact | Effort | Dependencies | Approval / confirmation |
|---|---|---|---|---|---|---|---|---|---|
| SEO-001 | **Critical** (Verified) | `lib/seo.ts:13`, `app/robots.ts`, `app/[locale]/layout.tsx` (robots) | `curl https://poddar-pipes-redesign.vercel.app/robots.txt` → `Disallow: /`; every page has `<meta name="robots" content="noindex, nofollow">` | Indexing is on only when `NEXT_PUBLIC_SITE_ENV=production` | Set the env var **only** on the production deployment that serves www.poddarpipes.com, then redeploy. No code change. | Without it the whole site is invisible | 5 min | Vercel access | Yes (hosting change) |
| SEO-002 | **Critical** (Potential) | Vercel domains; `lib/seo.ts`, `app/robots.ts` | www currently serves a holding page (noindex; robots.txt 404) from a different deployment; `poddar-pipes-redesign.vercel.app` answers 200 | If the same project serves both hosts after the env var is set, the vercel.app host is crawlable too | (a) In Vercel, redirect `poddar-pipes-redesign.vercel.app` and the apex to `https://www.poddarpipes.com` (308). (b) Optional code guard: `isProductionSite()` also requires `VERCEL_PROJECT_PRODUCTION_URL`/host = www.poddarpipes.com (`lib/seo.ts`; robots then reads the request host). | Duplicate-host indexing; split signals | 30 min | Vercel + DNS | Yes |
| SEO-003 | **High** (Verified) | `app/[locale]/products/page.tsx`, `components/products/ProductShowcase.tsx`, `lib/seo.ts`, `app/sitemap.ts`, `next.config.ts` (redirect), home and nav links | `curl …/products?category=swr-pipes` → `canonical=/products`; the SWR "What is" content is present but canonicalised away | Six ranges share one canonical URL | Give each range a crawlable path URL, e.g. `/products/cpvc-pipes` (or restore `/products/category/<id>`, currently a 307 to the query). Same component and design; self-canonical; unique title/description/H1 suffix; add to sitemap and hreflang; 301 `?category=x` → path; update the internal links (home cards, mega-menu, footer, pills). | Creates the six ranking pages the site lacks | 1–1.5 days | URL pattern decision | **Yes (URL structure)** |
| SEO-004 | **High** (Verified) | `app/sitemap.ts`; 16 routes (see §B) | Link graph from the crawl: no inbound links from nav/footer/home/products | Orphan URLs submitted for indexing; some carry legacy or unverified content | Per page, either **(a)** keep: verify the content and link it (e.g. the installation guide from range pages + FAQ; product details from range pages), or **(b)** hide: `robots: noindex` in that page's metadata and remove it from the sitemap until ready. Suggested defaults: (a) installation; (b) industries, manufacturing, sustainability, calculator, quality, product details (until reconciled with the new range content). | Avoids thin or contradictory pages diluting the site | 0.5 day | Business decision per page | **Yes** |
| SEO-005 | **High** (Verified) | `i18n/routing.ts`, `app/sitemap.ts`, page metadata, `messages/hi.json`, `lib/data/*` (English-only) | Devanagari share in the crawl: product details about 0.3, legal about 0.03, contact H1 English; /hi descriptions English | Hindi URLs advertised as Hindi but often English | Option 1 (recommended): ship /hi only for fully translated pages; the others get noindex + no hreflang + no sitemap entry, until translated. Option 2: remove /hi from the sitemap and hreflang entirely at launch. Translate the meta descriptions either way. | Prevents near-duplicate, low-quality locale pages | 0.5 day + translation | Translator / business | Yes |
| SEO-006 | **High** (Verified) | Home and /products titles and H1s | Crawl: titles and H1s lack category terms | Weak relevance for "pipes", "CPVC pipes" etc. | Titles: metadata-only change (no visual change) as proposed in §C. H1s: visual copy is approved and Home Hero is **locked**. Proposed alternatives (e.g. a visually-unchanged H1 with a keyword lead) are for your decision only. | Medium-high for non-brand queries | 1 h (titles) | Copy approval | **Yes (copy)** |
| SEO-007 | **High** (Verified) | `messages/*.json` heroEyebrow ("since 1991"), `lib/data/products.ts` (uPVC "hot & cold water", Agri IS 4985:2000 vs productDetails 2021, size ranges), Organization `taxID`, `foundingDate` | grep + crawl | Conflicting facts across pages and schema | Business confirms the facts; the data is aligned in one pass; `taxID` is removed unless confirmed | Trust (E-E-A-T) and accurate snippets | 1 h after confirmation | **Business confirmation** | Yes |
| SEO-019 | **High** (Business/legal) | Home + About heritage copy; Organization `foundingDate` | Research §1.4 (keyword-research.md S4, S11–S13): news says the company was founded by former Ashirvad promoters; Ashirvad's heritage is publicly "since 1975" | "Since 1975" may read as a competitor's heritage claim | Legal/business review of the wording (e.g. the Poddar family's history in PVC piping) | Trust, legal risk, brand clarity | — | **Business + legal** | **Yes** |
| SEO-020 | **High** (Verified + needs confirmation) | `lib/data/products.ts` (CPVC shortDescription "rated up to 93°C", used as the meta description); UGD standard citations; any ISI/certified wording | BIS IS 15778 scope is 82°C (S23). IS 16098-2 covers PE/PP non-smooth pipe, so smooth uPVC UGD likely falls under Part 1 (S28). `lib/data/certifications.ts`: no BIS certification held. | Possibly misleading snippets and specs | Product team confirms each standard and edition; descriptions use the continuous rating; no ISI/certified claims until licences exist | Trust; avoids misleading claims | 1 h after confirmation | **Business confirmation** | Yes |
| SEO-008 | Medium (Verified) | `app/[locale]/layout.tsx` (WebSite SearchAction), `products/[slug]/page.tsx` (Product), `faq/page.tsx` (FAQPage), product BreadcrumbList | Code review against current Google docs | Product without `offers`/`review`/`aggregateRating` → Rich Results Test "missing field" and no product snippet. Sitelinks search box is retired (Nov 2024), so SearchAction has no effect. FAQ rich results are limited to gov/health sites. The breadcrumb item points to a canonicalised `?category=` URL. | Keep Organization + WebSite (drop `potentialAction`). Keep Product markup only if it remains accurate, and **never** add fake price, rating or availability (it may simply not be eligible). Point the breadcrumb at the new range URLs (SEO-003). FAQPage can stay (harmless) or go. Add BreadcrumbList to range pages. | Cleaner validation; no false expectations | 2 h | — | Yes |
| SEO-009 | Medium (Verified) | Page metadata | Lengths: contact 176, installation 181, calculator 165; careers 60; FAQ description mentions topics not on the page | Truncated or mismatched snippets | Rewrite to 120–160 chars, matching the content (§C proposals) | Snippet CTR | 1 h | Copy approval | Yes |
| SEO-010 | Medium (Verified) | `i18n/routing.ts` (next-intl locale detection) | `curl -H "Accept-Language: hi" …/about` → 307 `/hi/about` | Automatic redirect by browser language | Set `localeDetection: false` (keep the switcher + cookie) per Google's multilingual guidance; or keep it and rely on hreflang | Crawlers and users seeing a different language than linked | 15 min | — | Yes (behaviour change) |
| SEO-011 | Medium (Verified, **locked**) | `components/home/Hero.tsx`, `public/hero/*` | Files: `hero-fittings.webm` 12.9 MB, phone 4.9 MB, poster 194 KB | Large transfer on the first visit; affects data use and possibly INP/LCP on slow networks | Recommendation only: lower bitrate or shorter loop, `preload="none"` + start after LCP, serve the poster for `prefers-reduced-data`/save-data. **Needs explicit permission (Hero locked).** | Performance on mobile networks | 2–4 h | Your approval | **Yes** |
| SEO-012 | Low (Verified) | `app/[locale]/[...rest]`, `app/not-found.tsx` | 404 HTML has the homepage `<title>`; body only in the RSC payload | Correct 404 + noindex; cosmetic | Give the catch-all 404 a "Page not found" title via metadata | Minimal | 15 min | — | No |
| SEO-013 | Low (Verified) | Preview hosting | Preview: `Disallow: /` **and** a noindex meta | Disallow stops Google seeing the noindex; a linked preview URL could be indexed URL-only | Prefer Vercel Deployment Protection on previews, or the `X-Robots-Tag: noindex` header without Disallow | Low | 10 min | Vercel | Yes |
| SEO-014 | Low (Verified) | `app/[locale]/layout.tsx` `keywords` | Present | Ignored by Google | Leave (harmless) or remove | None | — | — | No |
| SEO-015 | Low (Verified) | `app/sitemap.ts` | `lastModified = build time` for every URL | Every URL claims to change on each deploy | Use per-route dates or omit `lastmod` (Google uses it only if consistently accurate) | Low | 30 min | — | No |
| SEO-016 | Low (Recommendation) | OG images | One generic `/opengraph-image` for every page | Same share card everywhere | Per-range OG images once range URLs exist | Social CTR | 2 h | Assets | No |
| SEO-017 | Medium (Verified) | Analytics / verification | No GA4, GTM, Vercel Analytics or `google-site-verification` found in the code | Launch can't be measured | Search Console **Domain property via DNS TXT** (no code). Analytics per the business choice (GA4 needs consent handling under India's DPDP Act). | Measurement | 1–2 h | Business + DNS | Yes |
| SEO-018 | Low (Verified) | Case-variant URLs | `/About` → 200 | Duplicates resolve to canonical /about | Optional: lower-case redirect in the proxy | Low | 30 min | — | No |

---

## E. Proposed implementation plan

> Nothing below is done yet. Each batch is small and reviewable, keeps the current UI, and runs `npx tsc --noEmit`, `npm run lint`, a production build on a copy (see the note) and the §F checks.
> **Build note:** running `next build` in this working directory breaks the running dev server (`.next` collision; see the project memory). Builds will run in a separate worktree or with the dev server stopped.

### 1. Must fix before launch
| Item | Files | How functionality is preserved |
|---|---|---|
| SEO-001 env var | none (Vercel production env) | Config only |
| SEO-002 host redirects | none (Vercel domains); optional host guard in `lib/seo.ts`, `app/robots.ts` | Guard only narrows when indexing is allowed |
| SEO-004 orphan decision | `app/sitemap.ts` (route list); `generateMetadata` of the chosen pages (`robots: { index: false }`) | Pages stay reachable; only their indexing changes |
| SEO-005 Hindi scope | `app/sitemap.ts`, `lib/seo.ts` (`buildAlternates` per-route language list), affected pages' metadata | /hi pages still work for users |
| SEO-007 facts | `messages/en.json` + `hi.json` (approved strings only), `lib/data/products.ts`, `app/[locale]/layout.tsx` (`taxID`) | Text values only, after confirmation |

### 2. Recommended before launch
| Item | Files | Preservation |
|---|---|---|
| SEO-003 range URLs | new `app/[locale]/products/[slug]` branch (or the restored `/products/category/[category]`), `components/products/ProductShowcase.tsx` (pills become links), `components/home/ProductCategories.tsx`, `lib/data/nav.ts`, `components/layout/Footer.tsx`, `next.config.ts` (query → path 301), `app/sitemap.ts` | The same components render, so the design is identical; the pill switching stays instant (client navigation) |
| SEO-006/009 metadata copy | page `generateMetadata` functions; `messages/*` `meta` keys | Metadata only; no visible change |
| SEO-008 schema clean-up | `app/[locale]/layout.tsx`, `products/[slug]/page.tsx`, range pages | Invisible to users |
| SEO-017 Search Console | DNS TXT (no code) | — |

### 3. Post-launch
- SEO-010 locale redirect.
- SEO-011 hero video (only with permission).
- SEO-012 404 title.
- SEO-015 lastmod.
- SEO-016 OG images.
- SEO-018 case redirects.
- Content additions from §C (IS-standard explainers, CPVC vs uPVC, SWR vs UGD), each after fact confirmation.

### 4. Ongoing
- Monthly Search Console review (queries, pages, indexing, CWV).
- Content updates driven by real query data.
- Legitimate profiles and citations (§C).
- Keeping facts consistent across the site, the Business Profile and directories.

---

## F. Verification and launch checklist

| Check | Acceptance criterion | How |
|---|---|---|
| Indexing env | `https://www.poddarpipes.com/robots.txt` shows `Allow: /` and a `Sitemap:` line; no page has `noindex` | `curl -s https://www.poddarpipes.com/robots.txt`; `curl -s URL \| grep -i 'name="robots"'` |
| Hosts | apex, `http://` and `*.vercel.app` → single 308 to `https://www.poddarpipes.com/…` | `curl -sI http://poddarpipes.com/about` (expect 308/301 → https://www…) |
| Preview stays private | Preview URLs answer noindex or are protected | `curl -sI <preview>/` |
| Sitemap | 200 `application/xml`; every `<loc>` returns 200, is self-canonical and is not noindex; no orphans or hidden pages included | Script: fetch the sitemap, then each loc → status + canonical + robots (the audit crawler `crawl.mjs` can be reused) |
| Canonicals | Every indexable page: canonical = its own absolute www URL; range pages are self-canonical | Same script |
| hreflang | Reciprocal en/hi pairs; only for translated pages; x-default → en | Same script; Search Console international report is gone, so validate with the script |
| Metadata | Unique titles ≤ 60–65 chars and descriptions 120–160 chars on all indexable pages | Same script |
| Structured data | Rich Results Test + Schema Markup Validator: no errors; Product only where accurate | https://search.google.com/test/rich-results, https://validator.schema.org (manual, after launch) |
| Broken links | 0 internal 4xx/5xx | Same crawler over all internal links, plus PDFs |
| Redirects | `/products?category=x` → 301 → range path (if SEO-003 is approved); `/resources` → /articles; no chains | `curl -sI` |
| Mobile | Content parity mobile vs desktop; tap targets; no horizontal scroll | Chrome DevTools device mode; the existing 375/768/1024/1512 checks |
| Performance | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 (field) | PageSpeed Insights after launch; Search Console CWV report after about 28 days of data |
| Forms and contact | Enquiry, newsletter, `tel:` and `mailto:` work in production | Manual end-to-end test |

---

## G. 30-day monitoring plan

| When | Action |
|---|---|
| Day 0 (launch) | Verify the Search Console Domain property (DNS TXT); submit `https://www.poddarpipes.com/sitemap.xml`; run URL Inspection → "Request indexing" for Home, Products, About and the six range pages (only these few; it's not a bulk tool). Confirm §F passes on production. |
| Days 1–7 | Search Console → Pages: watch "Excluded by noindex", "Duplicate without user-selected canonical", "Alternate page with proper canonical", 404s. Sitemap status "Success". Brand query "poddar pipes" impressions start. Check the analytics events for enquiry submits. |
| Days 8–14 | Performance → Queries: map early queries to the intended pages (§C map); fix mismatches through internal links or titles, not new pages. Check that the legacy URLs (if any old-site URLs existed) return 301/404 as intended. |
| Days 15–30 | Core Web Vitals report (once data exists); landing-page CTR; first content additions using real queries (e.g. if "cpvc vs upvc" impressions appear, prioritise that explainer). Monthly crawl with the audit script for broken links and unexpected noindex. |
| Ongoing | Monthly: query/page review, the Indexing report, CWV, broken links, consistent business details (site ↔ Business Profile ↔ directories). Indexing and rankings are not guaranteed and take time; no ranking positions are promised. |

---

### Appendix: evidence files (not committed)
- Crawl output: `scratchpad/seo/local.json` (58 URLs)
- Crawler: `scratchpad/seo/crawl.mjs` (reusable for §F)
- Keyword and competitor research: `docs/seo/keyword-research.md`
