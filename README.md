# Poddar Pipes — Corporate Website

A premium, production-oriented corporate website for Poddar Pipes, an Indian piping systems
manufacturer (uPVC, CPVC, SWR, UGD, agricultural piping, and rotomoulded water storage tanks,
plus fittings, valves, and accessories). Built to the company's real Brand Playbook.

## ⚠️ Before publishing

This is a **template with realistic placeholder content**, not verified company data. Before
going live, replace:

- Leadership names (`lib/data/team.ts`) — currently role-only placeholders
- Office/plant addresses and phone numbers (`lib/data/offices.ts`, `Facilities.tsx`) — bracketed placeholders
- Dealer contact numbers (`lib/data/dealers.ts`) — placeholder format
- Certificate numbers and issuing details (`lib/data/certifications.ts`) — references standard
  applicable BIS/ISO certifications, not your actual certificate numbers
- The WhatsApp Business number in `components/shared/WhatsAppButton.tsx`
- Product specifications — verify every number in `lib/data/products.ts` against your actual
  datasheets before publishing; they're realistic but illustrative
- 8 of 11 languages (`messages/*.json`) — see i18n section below

## Brand System (from Brand Playbook)

- **Colors**: Blue `#171796` (dominant, ~50%), Orange `#F28000` (CTA/accent, ~20%), Gold
  `#e0af41` gradient (rare accent, ~10%), White/Warm Grey `#F4F2EE` (~20%)
- **Typography**: Anek Devanagari (variable weight) — the Playbook's single primary typeface,
  covering both Latin and Devanagari scripts natively
- **Logo**: `public/logo.svg` (full lockup), `app/icon.svg` (cropped icon-only mark for favicon)
- **Boomerang**: `components/shared/Boomerang.tsx` — the signature gold graphic, paired with
  every primary section heading via `SectionHeading`, top-left, per spec
- **Orange Elements**: outline-only pill/circle/line devices (`Badge` variant `brand-pill`) —
  never filled, per the Playbook's "Orange Elements" rule
- **CTA Buttons**: Primary = filled blue pill; Secondary = orange-outline pill
  (`components/ui/button.tsx` variants `primary` / `secondary`). A `primary-on-dark` (white pill)
  variant is used specifically on dark-blue hero/CTA sections where a blue button would lack
  contrast — this is an interpretation, not explicit in the Playbook's CTA page.
- **Gold Stamps**: `components/shared/GoldStamp.tsx` — medallion badges for certifications,
  used sparingly per the "use gold sparingly" rule

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `styles/globals.css`)
- next-intl (locale routing, translated messages, language switcher)
- Framer Motion (scroll reveals, stagger, micro-interactions)
- shadcn/ui-style primitives on Radix (`components/ui`)
- Lucide React icons, Embla Carousel, Lenis (smooth scroll)

## Internationalization

Routed locales are currently **English + Hindi only** (`i18n/routing.ts`). URL routing, locale
detection, and a 1-year persistence cookie all work via `next-intl` middleware.

**What's fully translated**: navigation, footer, forms, validation, common UI strings, and the
homepage hero (`messages/en.json`, `messages/hi.json`).

**Disabled, not deleted**: 9 other locale message files still exist on disk
(`messages/{gu,mr,bn,ta,te,kn,ml,pa,or}.json`) but aren't in `routing.locales`, so they're
unrouted. They contain English placeholder strings under the correct keys, not real
translations — re-enabling a locale is a one-line addition to `routing.locales`, but should wait
until that locale's content is actually translated, otherwise it just ships English pages behind
a native-script language switcher entry. Most page body copy (About, Products, Manufacturing,
etc.) is also still hardcoded English in components rather than pulled from message files —
migrating it into `messages/*.json` is the next step before any locale beyond en/hi is worth
re-enabling.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/hi` for Hindi (English stays at
`/`, per `localePrefix: "as-needed"`).

## Project Structure

```
app/[locale]/          # All routes, locale-scoped (home, about, products, industries,
                        # manufacturing, quality, sustainability, resources, dealers, careers, contact)
app/{icon.svg,robots.ts,sitemap.ts}  # Locale-independent metadata routes
i18n/                  # next-intl routing, request config, navigation helpers
messages/               # Translation JSON files, one per locale
middleware.ts           # next-intl locale detection/routing
components/
  layout/               # Navbar (mega menu), Footer, SmoothScroll
  home/, about/, products/, contact/, dealers/   # Page-specific sections
  shared/               # SectionHeading, Boomerang, GoldStamp, RevealOnScroll, Counter,
                        #   LanguageSwitcher, WhatsAppButton, Breadcrumbs, download buttons
  ui/                   # Reusable shadcn-style primitives (button, card, dialog, tabs, etc.)
lib/data/               # Product catalog, industries, team, timeline, dealers, blog, FAQ
types/                  # Shared TypeScript interfaces
styles/globals.css      # Tailwind v4 theme tokens (brand palette, fonts, animations)
```

## Notes

- Product detail pages (`/products/[slug]`) are statically generated per product × locale, with
  JSON-LD `Product` schema for SEO.
- Download buttons (datasheets, catalogues, certificates) generate a sample `.txt` file
  client-side — there's no backend or real file storage.
- The contact/inquiry/dealer forms simulate submission (no backend); the map is a stylized
  placeholder, not a live Google Maps embed.
- Server Components are used by default; `"use client"` is added only where interactivity
  (state, animation, Radix primitives, next-intl hooks) requires it.
