# 404 Page — Design Analysis & Build Notes

A brand-aligned 404 for Poddar Pipes, derived from the homepage design language
and the `BRAND_IDENTITY.md` "Engineering the flow" system. This doc records the
analysis that drove it and the decisions taken.

## 1. What the homepage establishes (analysis)

Reading `app/[locale]/page.tsx`, `styles/globals.css`, and the home components,
the homepage's visual grammar is:

| Signal | Homepage usage | Token |
|---|---|---|
| Dominant surface | Dark navy hero + "credential vault" bands | `bg-ink` `#14134f` |
| Engineering paper | Blueprint grid on ink surfaces | `.bg-blueprint` (flow-cyan hairlines) |
| Type | One family (Anek Devanagari), hierarchy by weight/size | `font-display`, `.tech-label` |
| Eyebrows | Uppercase, wide-tracked "technical label" voice | `.tech-label` (0.2em) |
| Accent — action | Orange, CTA only, never small text on white | `amber-500/600` |
| Accent — water | Flow-cyan for schematic lines & highlights on dark | `flow-300/500` `#17b6d8` |
| Premium seal | Gold, used sparingly | `gold-500` `#e0af41` |
| Signature motif | Pipe/flow schematics (`FlowLine`, `PipeSchematicNav`) — the water network drawn as engineering diagram | — |
| Motion | Scroll/entrance reveals, animated flow pulses, all reduced-motion aware | `--animate-flow`, framer-motion |

Hard rules carried over from `BRAND_IDENTITY.md`: blue dominant; orange &
flow-cyan never as small text on white; every animation respects
`prefers-reduced-motion`; Indic coverage preserved (Anek).

## 2. 404 concept

**Editorial full-bleed hero, in the brand's own language.** Industry leaders'
404s (Georg Fischer, Aliaxis, Ashirvad) all lead with full-bleed pipe/water
imagery, one bold headline, and a single strong CTA. We take that idea and
express it with Poddar's *own* assets — never a competitor's mark or layout:

- **Full-bleed idea, own assets:** Poddar's own hero footage
  (`/hero/slide-1.webm`) runs full-bleed behind a deep-ink legibility wash —
  the GF/Aliaxis "full-bleed imagery" idea, in Poddar's footage, never a
  competitor's mark. Reduced-motion (or a missing clip) drops the video.
- **Site design language, not a generic look:** everything on top uses the
  actual system from `BRAND_IDENTITY.md` / `SectionHeading` /
  `QualityCertifications` — the orange corner-bracket + amber eyebrow, the
  `.bg-blueprint` field, a warm `amber-500/10` glow, and credential-style
  cards — rather than generic glass/aurora. **Accent is orange (Poddar's
  action colour), not blue/cyan** — most visible on the ink field — with
  neutral grey for the resting card UI so orange stays deliberate.
- **Boxes take the stage:** the HR + Distributor enquiry boxes occupy the
  prominent middle slot (the descriptive headline/paragraph is carried sr-only
  for SEO/AT instead), so the useful info is the hero. CTAs sit at the bottom.

## 3. Layout & tokens

- Surface: `bg-ink` base → full-bleed `<video>` (`object-cover`) → ink
  legibility gradient (top/bottom weighted, keeps text AA) → `.bg-blueprint`
  field at 40 % → one `bg-amber-500/10 blur-3xl` warm glow.
- Eyebrow: the brand corner-bracket (orange `#F28000` `<svg>`) + amber-500
  uppercase tracked label — the exact `SectionHeading` eyebrow voice.
- Code: `404` in `font-display` `font-bold`, **white with an `amber-500` accent
  "0"** and a soft `amber-500/15` glow. Sized `clamp(3.25rem, 15vh, 9rem)` —
  scales with viewport *height* so it never crowds the boxes below.
- **Enquiry boxes (middle slot):** credential-card styling from
  `QualityCertifications` — `rounded-xl border border-white/10 bg-white/[0.03]
  backdrop-blur-sm`, a neutral grey icon tile + grey `.tech-label` role +
  `slate-100` email **at rest, turning amber on hover** (border, icon,
  `ArrowUpRight`) since each box is a `mailto:` action. One column on mobile,
  two on `sm+`.
- Actions (bottom): `amber-500` "Back to Home" (primary, orange glow) + an
  `outline-white`/glass secondary to `/products`. A single wrapping row; orange
  only ever a filled button.
- Heading: real `<h1>`/`<p>` rendered `sr-only` (page still has a descriptive
  heading for SEO/AT); the visible `404` is `aria-hidden` decoration.

## 4. Motion, accessibility & responsiveness

- Staged framer-motion entrance (opacity/rise), disabled under
  `useReducedMotion`; the background video is also gated on it, `muted` +
  `playsInline` + `aria-hidden`.
- Contrast clears AA over the wash (white / grey card text / amber-500 accent &
  label / amber button); the logo link is labelled; the video is AT-skipped.
- **Emails on first view, every screen:** gap-based stack + `vh`-clamped `404`,
  so the whole composition (both enquiry boxes) fits above the fold. Verified at
  375×812 (mobile, 1-col boxes), 550×607 (awkward mid), 760×820, and 1280×800
  (desktop, 2-col boxes): last box bottom ≤ viewport height in all, CTAs below
  the boxes, emails never truncated.

## 5. Architecture — global vs locale

`<html>`/`<body>` live in `app/[locale]/layout.tsx`, so a **global** 404 needs
its own document shell. Setup:

- **`app/layout.tsx`** — root pass-through (`return children`) so both the
  locale layout and the global not-found can each own their `<html>`/`<body>`.
  Standard next-intl pattern for catching non-localised / unmatched routes.
- **`app/not-found.tsx`** — the global 404. Renders its own `<html lang="en">`
  with the Anek font, imports `globals.css`, English copy, plain `<a>` links,
  and shows the brand mark (no Navbar exists here). Triggered for unknown
  top-level segments (an invalid locale makes `[locale]/layout` call
  `notFound()`, which escalates to this root boundary).
- **`app/[locale]/not-found.tsx`** — the in-locale 404, for explicit
  `notFound()` calls inside a locale (e.g. a bad product slug). Renders inside
  the full Navbar/Footer shell with **translated** copy and locale-aware links.

Both render the shared **`components/shared/NotFoundView.tsx`** so the two 404s
are visually identical. `showBrand` shows the logo only on the standalone global
route (the locale route already has the Navbar — prevents a doubled logo).

### Role-based enquiry contacts

Under the CTAs the page shows two mailto **cards** — **HR** and **Distributor**
enquiries (icon + role label + flow-cyan email). Addresses live in
`lib/data/enquiries.ts` (`HR_EMAIL` / `DISTRIBUTOR_EMAIL`) as **placeholders**
(`hr@poddarpipes.com` / `distributors@poddarpipes.com`), matching the
placeholder phone numbers already in `offices.ts` — swap for verified inboxes
when available. `NotFoundView` takes a `contacts` prop (`{ label, email, kind }`)
so each route supplies its own (translated) label while sharing the emails; the
`kind` picks the card icon.

### i18n keys added (`messages/en.json`, `messages/hi.json`)

`notFound.eyebrow`, `notFound.productsButton`, `notFound.hrEnquiry`,
`notFound.distributorEnquiry`, alongside the existing `code` / `title` / `desc`
/ `backButton`.

## 6. Files

| File | Change |
|---|---|
| `components/shared/NotFoundView.tsx` | Shared brand 404 view — full-bleed video hero, aurora fallback, vh-clamped type, enquiry cards |
| `app/layout.tsx` | New — root pass-through layout |
| `app/not-found.tsx` | New — global 404 (own shell, English, brand mark) |
| `app/[locale]/not-found.tsx` | Rewired onto `NotFoundView`, adds products CTA + contacts |
| `lib/data/enquiries.ts` | New — placeholder HR / distributor enquiry emails |
| `messages/en.json`, `messages/hi.json` | `eyebrow`, `productsButton`, `hrEnquiry`, `distributorEnquiry` keys |

## 7. Verified

- Global 404 (`/<junk>`): brand mark + full-bleed video hero, gradient 404,
  orange-glow + glass CTAs, both enquiry cards. `noindex`.
- Locale 404 (`/en|hi/products/<bad-slug>`): full Navbar/Footer shell,
  translated copy + enquiry labels (Hindi rendered ✓).
- Responsive / emails-first-view: 375×812, 550×607, 1280×800 — all fit above
  the fold, emails untruncated, cards 1-col → 2-col at `sm`.
- `tsc --noEmit` clean; fresh-server console error-free.
