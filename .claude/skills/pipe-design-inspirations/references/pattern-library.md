# Pattern library — build recipes

Reusable patterns distilled from the reference sites, each with a build recipe mapped to this project's stack (Next 16, Tailwind v4, framer-motion, and the existing shared primitives: `FlowLine`, `Counter`, `TiltCard`, `Marquee`, `WordReveal`, `Parallax`). Prefer these existing pieces before adding dependencies. Every interactive/animated pattern must respect `prefers-reduced-motion`.

---

### 1. Interactive pipe-schematic navigation  ⭐ highest payoff
*Inspiration: Westlake hotspot diagram.*

A schematic of a pipe network (SVG) with clickable nodes; each node is a product family or application segment. Hovering a node highlights the connected run; clicking routes to that category.

**Build:** Extend `FlowLine` into a `PipeSchematicNav` — reuse its self-drawing `motion.path` + valve-node circles, but make each node a focusable `<Link>` (or `<button>`) with an accessible label. Animate the connecting run with the existing `--animate-flow` dash. On hover, brighten the active branch (`stroke` → `--color-amber-500`) and scale the node. Provide a plain stacked list fallback for reduced-motion and small screens (the SVG is decorative-plus; the links must exist in the DOM regardless).
**Guardrail:** keep the schematic *original* — an abstract flow network, not a traced copy of any brand's diagram.

### 2. Persona / segment selector
*Inspiration: Westlake entry modal.*

"I'm a: Contractor · Architect · Homeowner · Distributor" (or by application: Home Plumbing · Agriculture · Infrastructure · Industrial). Sets a preference that reorders/filters product surfaces.

**Build:** A row of `TiltCard` chips or a compact segmented control near the hero. Persist choice in a cookie or `searchParams` (this repo already reads product filters from `searchParams` server-side in `ProductFilterGrid` — mirror that so it stays SSR-friendly and crawlable). Avoid a hard entry *modal* that blocks content — prefer an inline, dismissible selector so no-JS/crawlers still reach everything.

### 3. Scale-stats block (animated counters)
*Inspiration: Astral stats box.*

Concrete numbers as social proof: years, categories, dealers, capacity, countries.

**Build:** Already implemented — `Counter` + `useCounter` (see `CompanyOverview`). Reuse it. For a bolder beat, set the numerals oversized and add a subtle `Parallax` drift, with a one-line label beneath each. Keep to 3–5 figures.

### 4. Credential wall
*Inspiration: Astral warranty badges + Westlake certification letters.*

Warranty length, ISI/ISO marks, downloadable datasheets/cert letters as confident cards — not fine print.

**Build:** Reuse `GoldStamp` for marks and a `Marquee` for a continuous credential ticker (already done in `QualityCertifications`). Make datasheets real download links with file type/size. Give warranty ("50-year") a large numeral treatment.

### 5. Technical tools hub
*Inspiration: Westlake calculators + spec tables.*

Flow-rate, pressure-drop, pipe-sizing calculators; spec/loading tables.

**Build:** A `/resources` or `/tools` route with small client-side calculators (pure functions, no backend) and sortable spec tables. Link datasheets. This is deep utility for trade users — high retention, low visual risk. Keep inputs labelled in trade vocabulary (nominal bore, schedule, working pressure).

### 6. Trust-conversion devices
*Inspiration: Plumbing Solutions reviews / offers / anniversary badge.*

Review counter, testimonial carousel, offer cards, anniversary starburst.

**Build:** Testimonial carousel via the project's `embla-carousel-react`. Review counter with `Counter`. Anniversary starburst as an SVG badge (original shape). **Skew B2B** for a manufacturer: emphasize project references and dealer testimonials over consumer coupons — use offer cards sparingly, if at all.

### 7. Application-photo hero carousel
*Inspiration: Astral rotating application imagery.*

Full-bleed application/job-site imagery, brand-narrative headline, credential sub-CTAs.

**Build:** The existing `Hero` already does crossfading full-bleed media with `AnimatePresence`, pause control (WCAG 2.2.2), and scroll parallax. Feed it real application photography and keep credential links (warranty, certifications) as secondary CTAs alongside the primary "Explore Products".

---

## Palette & type cues (category-fluent defaults)

- **Base:** industrial blue/teal + generous white; charcoal body text; light-gray section fills.
- **Accent:** a single warm tone (orange) reserved for primary CTAs/active states. This project's tokens already encode exactly this (blue `#171796`, orange `#F28000`, gold `#e0af41`) — use them.
- **Type:** geometric sans, bold headlines, high legibility, restrained letter-spacing. Let motion + structure carry personality.
- **Motion:** restrained by default; one memorable interactive device (favor #1). Everything honors reduced-motion.

## IP boundary

Borrow structure, motion, and information architecture — never a brand's logo, exact layout, proprietary illustration, copy, or recognizable signature mark. When a pattern is strongly identified with one brand (e.g. a specific hotspot diagram), transform it into an original expression for the subject at hand.
