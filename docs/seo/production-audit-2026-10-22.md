# Production audit — https://www.poddarpipes.com (2026-10-22)

Read-only: GET/HEAD requests and a browser load only. No form was submitted.
Scope: 40 routes (20 English + 20 Hindi), 880 linked images/assets, redirects,
robots/sitemap, share tags, security headers, console errors, structured data.

## Blockers

| # | Finding | Evidence | Fix | Who |
|---|---|---|---|---|
| P1 | **Search engines are blocked site-wide.** robots.txt is `Disallow: /` and every page carries `<meta name="robots" content="noindex, nofollow">` (some `noindex, follow`). | `lib/seo.ts` `isProductionSite()` only returns true when `NEXT_PUBLIC_SITE_ENV === "production"`; the live build does not have it. | Vercel → Project → Settings → Environment Variables: add `NEXT_PUBLIC_SITE_ENV=production` for the **Production** environment only, then redeploy (it is a build-time `NEXT_PUBLIC_` var). Previews and the vercel.app alias stay blocked only if the var is scoped to Production. Pages deliberately hidden (SEO-004: /industries, /manufacturing, /quality, /sustainability, /tools/calculator, legacy product slugs) stay `noindex, follow`. | Owner (Vercel account) |
| P2 | **Enquiry / partner / newsletter delivery unverified.** The API is live (`GET /api/enquiry` → 405 as expected). In production it returns **503 "not_configured" and drops the enquiry** unless `SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET` (or `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` + `ENQUIRY_FROM_EMAIL`) are set in Vercel. Local `.env` has the Sheets pair; Vercel's values could not be seen. | `lib/forms.ts` `deliver()` | Confirm the Sheets pair exists in Vercel Production, then send one real test enquiry from /contact and check the sheet. | Owner |

## Should fix

| # | Finding | Evidence | Fix | Who |
|---|---|---|---|---|
| S1 | **HTTP→HTTPS and apex→www redirect with 302 (temporary)**, and `http://poddarpipes.com` takes two hops. Search engines treat 302 as "keep the old URL". | `http://www…/` → 302; `https://poddarpipes.com/` → 302; `http://poddarpipes.com/` → 302 → `https://poddarpipes.com/` → 302 → www. | Vercel → Domains: set `poddarpipes.com` to **redirect to www.poddarpipes.com with 308 (permanent)**. If DNS/forwarding is at the registrar or Cloudflare, switch that forwarding to 301. | Owner (DNS / Vercel) |
| S2 | **favicon.ico and apple-touch-icon 404.** | `/favicon.ico` 404, `/apple-icon.png` 404 | **Fixed in code (not yet deployed):** `app/favicon.ico` (48px) and `app/apple-icon.png` (180px), both from `public/icon-mark.svg`. | Deploy |
| S3 | **The live build predates today's changes** — e.g. the live homepage og:title is still the old title, the share card is the old text card, and the deck fixes are not live. | Live `/` og:title = "Poddar Pipes \| Engineering India's Water Infrastructure" | Deploy the current branch. | Owner |
| S4 | `poddar-pipes-redesign.vercel.app` still serves the full site (200). It is `noindex` and canonicalises to www, so it is not an SEO risk today. | | Optional: Vercel → Domains → redirect the vercel.app alias to www. | Owner |

## Passed

- All 40 routes return 200; `/does-not-exist` returns a real 404; trailing slash 308s to the clean URL; `/en/*` 307s to the unprefixed URL.
- Legacy URLs: `/products?category=<id>` → 308 to `/products/<id>` (en + hi); `/products/category/<id>` → 308; `/resources` → 308 `/articles`.
- **880 / 880** linked images, videos, PDFs and internal links load (no 4xx/5xx).
- Every page has its own `<title>`, description, canonical, `og:url`, `og:title`, `og:description`, Twitter tags and en/hi/x-default hreflang; `<html lang>` is correct per locale; exactly one `<h1>` per page; JSON-LD present (4–6 blocks) and parses.
- Security headers present: HSTS (2 years, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`.
- Browser load of `/`: no console errors, no mixed content, no third-party requests.
- Sitemap serves 28 URLs (14 routes × 2 locales) on the www host.

## Not covered

- No analytics or Search Console tag is installed (no third-party requests at all). Add one only if wanted — SEO-017 (Search Console via DNS TXT) is still open.
- Lighthouse / Core Web Vitals were not measured in this pass.

## Re-audit (same day, after the owner's redeploy)

| Item | Before | Now |
|---|---|---|
| P1 indexing | robots.txt `Disallow: /`, all pages noindex | **Fixed.** robots.txt `Allow: /` + sitemap; 30 pages `index, follow`; the 10 SEO-004 pages stay `noindex, follow` and are not in the sitemap (28 URLs). vercel.app alias still noindex + canonical to www. |
| S2 icons | favicon.ico / apple-icon 404 | **Fixed** (200). |
| S3 stale build | old share card / title | **Fixed.** Share card = round mark; home og:title = "Poddar Pipes \| Pipes Ka Gold Standard. Phir Se." |
| S1 redirects | 302, two hops for http apex | **Still 302** — owner, Vercel → Domains (308). |
| P2 forms | unverified | **Still unverified** — owner: one real test enquiry. |
| NEW: image optimiser timeouts | — | 12 of 882 `/_next/image` requests returned 502/504 under parallel load; all 200 on retry. Cause: the home/product card sources were ~11MB PNGs (cpvc/swr/agri/ugd-hero.png, 2747x4096). **Fixed in code (deploy needed):** re-encoded to WebP q90 at full resolution (`<range>-hero-v2.webp`, ~0.3MB, mean pixel diff ~1/255); PNGs removed from public/. |

WhatsApp preview: fetched as `WhatsApp/2.x` and `facebookexternalhit`, `/` returns 200 in ~50–350ms with og:title/og:image inside the first 6KB of `<head>`. A blank preview in WhatsApp is its client-side cache / a fetch that didn't complete — not the server.
