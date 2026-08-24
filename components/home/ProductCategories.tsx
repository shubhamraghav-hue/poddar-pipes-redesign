import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Display order per brand team request: CPVC, UPVC, SWR, AGRI, UGD, TANKS
// (Figma's own layout order is UPVC/CPVC/UGD, AGRI/SWR/TANK — deliberately
// not followed here, per that earlier request). `photo` + the gold badge
// are the exact assets exported from Figma (node 13:83 and siblings).
//
// `logo` fresh-exported directly from Figma (node 707:7360 and siblings —
// each card's "Default"-variant wordmark frame, fileKey
// 6jLHH8FxOKbRcIWOpIiWcx) at 3x scale, replacing the old hand-built
// `*-logo.svg` files. Those older SVGs each bundled an EXTRA embedded
// "GOLD" pill next to the wordmark, invisible at the old ~40px render
// height but clearly visible (and duplicating the separate gold ribbon
// badge below) once enlarged to Figma's actual proportion — the fresh
// export is scoped to just the wordmark sub-frame, with no gold pill
// baked in at all. `logoW`/`logoH` are these new PNGs' real pixel
// dimensions (all 213px tall at 3x, width varies by name length).
const CATEGORIES = [
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/category/cpvc-pipes",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/category-cards/cpvc-wordmark.png",
    logoW: 645,
    logoH: 213,
    photo: "/products/category-cards/cpvc.png",
  },
  {
    id: "upvc",
    title: "UPVC",
    href: "/products/category/upvc-pipes",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/category-cards/upvc-wordmark.png",
    logoW: 663,
    logoH: 213,
    photo: "/products/category-cards/upvc.png",
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/category/swr-pipes",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/category-cards/swr-wordmark.png",
    logoW: 618,
    logoH: 213,
    photo: "/products/category-cards/swr.png",
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/category/agricultural-pipes",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/category-cards/agri-wordmark.png",
    logoW: 627,
    logoH: 213,
    photo: "/products/category-cards/agri.png",
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/category/ugd-pipes",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/category-cards/ugd-wordmark.png",
    logoW: 576,
    logoH: 213,
    photo: "/products/category-cards/ugd.png",
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/category/tanks",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/category-cards/tank-wordmark.png",
    logoW: 675,
    logoH: 213,
    // User-supplied artwork (the two overlapping tank shots with their own
    // drop shadow, matching Figma's real TankCard composition) — an SVG
    // with an embedded raster, not the plain PNG crop every other card
    // uses. Rendered via a plain <img> below (next/image blocks local SVGs
    // unless `images.dangerouslyAllowSVG` is set, which this project
    // doesn't set — same reason the GOLD_BADGE SVG above bypasses it too).
    photo: "/products/category-cards/tank.svg",
  },
] as const;

const GOLD_BADGE = "/products/category-cards/gold-badge.svg";

export async function ProductCategories() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-32">
      <div className="container-edge flex flex-col gap-10">
        {/* `#4a4a4a`, not the sitewide global-heading-spec navy — matches
            Legacy's own heading override (see CompanyOverview.tsx), per
            explicit request that the two sections share one heading color. */}
        <SectionHeading
          eyebrow={t("categoriesEyebrow")}
          title={t("categoriesH1")}
          titleAccent={t("categoriesH2")}
          description={t("categoriesDesc")}
          titleColorClassName="text-[#4a4a4a]"
        />

        <div className="flex flex-col items-center gap-10">
          {/* Figma card is 400×375 (aspect ~1.067, not square) at a 26px
              grid gap — both real mismatches from the previous build (a
              260px-capped square card at a 12px gap), fixed here via
              `aspect-[400/375]` + `gap-6` (24px, close enough to Figma's 26
              without hand-tuning a non-standard gap value) rather than
              literal fixed pixels, so it stays correct at any container
              width instead of only at Figma's own 1512px reference. */}
          <RevealOnScroll className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                // `@container` + `cqw` below: only for the properties that
                // don't natively scale with the parent box (font-size,
                // letter-spacing, border-radius) — top/right/width/height
                // percentages already resolve against this card's own
                // rendered box per normal CSS, no container query needed
                // for those. `min(25px,6.25cqw)`, not a flat `6.25cqw`:
                // Figma's radius is a fixed 25px, not a proportional one —
                // 6.25cqw only equals 25px at the 400px reference width and
                // grows past it on any wider-rendered card. `min()` caps it
                // at the true 25px ceiling while still scaling down (not
                // capping) on cards narrower than 400px.
                className="group @container relative block aspect-[400/375] w-full overflow-hidden rounded-[min(25px,6.25cqw)] bg-white"
              >
                {/* GOLD badge — Figma: 70.08×26.4 at a 400px-wide card,
                    top-right, unaffected by hover. */}
                <div className="absolute right-[3.48%] top-[3.47%] z-20 flex h-[7.04%] w-[17.52%] items-center justify-center rounded-full bg-[#e0af40]">
                  <img src={GOLD_BADGE} alt="" className="h-[55%] w-auto" />
                </div>

                {/* Photo — Figma's own per-category photo assets each end
                    a bit above where the wordmark begins (a real, if
                    per-category-variable, gap); this simplified uniform
                    photo crop stops at 68% (vs. the wordmark's exact 74.67%
                    top below) to leave a comparable gap rather than
                    touching/overlapping it. Rises with the wordmark on
                    hover — see that element's comment for the shared
                    translate amount and the `cqw`-not-`%` reasoning. */}
                <div className="absolute inset-x-0 top-0 h-[68%] overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]">
                  {cat.photo.endsWith(".svg") ? (
                    // next/image blocks local SVGs unless
                    // `images.dangerouslyAllowSVG` is set (it isn't here) —
                    // same reason GOLD_BADGE above uses a plain <img>.
                    // `object-contain`, not `-cover`: this asset already
                    // composites its own artwork + drop shadow against a
                    // transparent canvas, so cropping it would cut into
                    // that composition rather than just re-framing a photo.
                    <img src={cat.photo} alt="" className="size-full object-contain object-center" />
                  ) : (
                    <Image
                      src={cat.photo}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover object-center"
                    />
                  )}
                </div>

                {/* Wordmark — exact Figma box (node 707:7360 and siblings,
                    read directly off this instance's own dev-mode
                    inspector: left 40px, top 280px, width 220.816px,
                    height 70.75px on a 380×375 card = left 10.53%, top
                    74.67%, width 58.11% (max — the fresh-exported PNG's own
                    aspect ratio is what actually constrains rendered
                    width, via `object-contain object-left`, so this is a
                    ceiling not a stretch target), height 18.87%. Previously
                    positioned via `mt-[2%]` after an 85%-tall photo in a
                    flex column — an approximation that actually landed the
                    wordmark ~10 percentage points higher than Figma's real
                    74.67%, not this exact box. Kept as an independent
                    absolutely-positioned element (not grouped with the
                    photo in a shared wrapper) specifically so its position
                    is a direct, unambiguous read of Figma's own numbers —
                    a nested-percentage wrapper would need re-deriving this
                    same box relative to the wrapper's own size instead of
                    the card's, an unnecessary extra step. Shares the
                    photo's exact hover translate so the two move in
                    lockstep despite being independent elements, matching
                    Figma's own two-independently-positioned-layers reality
                    more closely than a shared wrapper would. */}
                <Image
                  src={cat.logo}
                  alt={cat.title}
                  width={cat.logoW}
                  height={cat.logoH}
                  className="absolute left-[10.53%] top-[74.67%] h-[18.87%] w-auto max-w-[58.11%] object-contain object-left transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]"
                />

                {/* Description + CTA — Figma keeps this pair entirely
                    below the visible 375px-tall card frame at rest
                    (description top:395, CTA bottom:-90 — both PAST the
                    card's own bottom edge, clipped by its own
                    `overflow-clip`), sliding up into view on hover
                    (top:285 / bottom:20 — a matching 110px = 27.5% of the
                    card's WIDTH shift for both, confirmed identical across
                    all 6 cards). Modeled the OPPOSITE way from the group
                    above: this block's own untransformed CSS position IS
                    the Figma hover/visible position, with a `translate-y`
                    pushing it down out of view at rest — rather than
                    starting fully off-frame and translating up on hover —
                    since its natural bottom-anchored layout already
                    matches the visible state; only rest needs an offset.
                    `cqw`, not `%`: CSS `translate` percentages resolve
                    against the TRANSLATED ELEMENT's own box, not its
                    parent — `27.5%` of this small text block's own height
                    is nowhere near enough to clear the card, `cqw` resolves
                    against the `@container` card instead, correctly. */}
                <div className="absolute inset-x-0 bottom-0 translate-y-[27.5cqw] px-[10%] pb-[5.3%] transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <p className="line-clamp-2 text-[4cqw] leading-[1.1] text-[#606060]">
                    {t(cat.descKey)}
                  </p>
                  <div className="mt-[2%] flex items-center gap-[1.5%]">
                    {/* Anek Devanagari reserves an asymmetric descender
                        allowance for Indic matras, so a bare text node next
                        to a flex-centered icon renders visibly high —
                        `text-box-trim` on the label's own span (not the
                        row) is the sitewide fix for this (see button.tsx /
                        BRAND_IDENTITY.md); this span had `leading-none` but
                        was missing the trim itself. */}
                    <span className="text-[4.5cqw] font-medium leading-none tracking-[0.09cqw] text-[#171796] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      VIEW PRODUCTS
                    </span>
                    <ArrowRight className="h-[3.5cqw] w-[3.5cqw] shrink-0 text-[#171796] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </RevealOnScroll>

          {/* Figma: solid brand-orange fill + navy text (node 810:1157),
              not the previous outlined blue-border/blue-text button — the
              same spec Hero's primary CTA already uses (`accent-ink`
              variant), reused as-is rather than duplicated. Text color
              override to Figma's literal `#0B0B52` (not the variant's own
              `ink` token, `#14134F` — a different, distinct navy, same
              reasoning as the tagchips/legacy-section fidelity passes)
              applied locally via className, not by editing the shared
              `accent-ink` variant itself (Hero also uses that variant and
              is locked — this stays scoped to just this one button). */}
          <RevealOnScroll>
            <Button
              asChild
              variant="accent-ink"
              size="lg"
              className="h-auto px-6 pb-3 pt-4 text-lg font-semibold tracking-[0.36px] text-[#0B0B52] uppercase hover:text-[#0B0B52]"
            >
              <Link href="/products">{t("categoriesCta")}</Link>
            </Button>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
