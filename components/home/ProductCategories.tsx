import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Display order is the brand team's, NOT Figma's layout order — deliberate.
//
// `logo` files are exported from each card's wordmark sub-frame only. The
// older hand-built `*-logo.svg`s each had an extra "GOLD" pill baked in,
// invisible at ~40px but obvious once scaled up and duplicating the separate
// badge. `logoW`/`logoH` are the PNGs' real pixel dimensions.
const CATEGORIES = [
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/category/cpvc-pipes",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/category-cards/cpvc-wordmark.png",
    logoW: 645,
    logoH: 213,
    photo: "/products/category-cards/cpvc-card.png",
    photoPos: "50% 100%",
  },
  {
    id: "upvc",
    title: "UPVC",
    href: "/products/category/upvc-pipes",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/category-cards/upvc-wordmark.png",
    logoW: 663,
    logoH: 213,
    photo: "/products/category-cards/upvc-card.png",
    photoPos: "50% 100%",
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/category/swr-pipes",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/category-cards/swr-wordmark.png",
    logoW: 618,
    logoH: 213,
    photo: "/products/category-cards/swr-card.png",
    photoPos: "50% 100%",
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/category/agricultural-pipes",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/category-cards/agri-wordmark.png",
    logoW: 627,
    logoH: 213,
    photo: "/products/category-cards/agri-card.png",
    photoPos: "50% 100%",
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/category/ugd-pipes",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/category-cards/ugd-wordmark.png",
    logoW: 576,
    logoH: 213,
    photo: "/products/category-cards/ugd-card.png",
    photoPos: "50% 100%",
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/category/tanks",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/category-cards/tank-wordmark.png",
    logoW: 675,
    logoH: 213,
    // A closer pair-of-tanks studio shot (Sep 2026), cropped to zoom in.
    //
    // Size is governed by the HOVER state, not the resting one: hover lifts
    // the photo a FIXED 22.5cqw, hiding the top of the box, so the product
    // has to fit in what SURVIVES that — not just in the resting frame. How
    // much survives depends on the box height (see PHOTO_BOX_HEIGHT below):
    // 64.7% of it at Figma's 68%, 66.7% at the 72% this card now uses.
    //
    // The source frames the tanks small — 323x324 in a 1549x1460 field, just
    // 21% of the width — so dropped in whole they would fill barely a third
    // of the box. This file is therefore a measured crop.
    //
    // ---- TANK SIZE AND PLACEMENT ---------------------------------------
    // Only the live crop is committed. Regenerate with:
    //   node scripts/crop-tank-card.mjs "<Tanks v3 (1).png>" 660 --box 72     //        --right 0.92 --floor 10 --tag g2-b72
    //
    //   660        zoom = crop WIDTH. Smaller = bigger tanks, fuller card.
    //   --box 72   MUST equal PHOTO_BOX_HEIGHT.tanks below. It sets the box's
    //              aspect ratio, and the crop is cut to match so object-cover
    //              has nothing to trim. Mismatch it and the card silently
    //              crops the sides off the framing.
    //   --right    slides the tanks across (0.92 = right corner, 0.75 = mid).
    //   --floor    UPLIFT: px of floor under the bases. Higher = tanks ride
    //              higher in the frame, at the cost of headroom above the
    //              lids, which is exactly what the hover lift eats.
    //   --tag      changes the output FILENAME. Always pass a new one when
    //              the source photo or --box changes: Next's optimiser caches
    //              by path, so reusing a name serves the old bytes.
    //
    // `photoPos` is INERT for this card — the crop matches the box aspect, so
    // object-cover has no overflow to slide. Reframe by re-cropping.
    //
    // "clip" is how much of the lids the hover lift cuts off. Hover hides a
    // FIXED 22.5cqw, so the taller box (72%) hides proportionally less of it
    // than Figma's 68% did — which is what bought the clip down from 37px to
    // 22px at this same tank size. At --box 72:
    //
    //   z820  58.3% of box · 39.5% wide · no clip
    //   z780  61.3% · 41.5% · no clip
    //   z750  63.8% · 43.2% · no clip   <- largest that survives hover
    //   z720  66.5% · 45.0% ·  5px
    //   z700  68.4% · 46.3% · 10px
    //   z660  72.6% · 49.1% · 22px      <- LIVE, kept large so the card
    //   z620  77.3% · 52.3% · 35px         does not read empty
    // ---------------------------------------------------------------------
    photo: "/products/category-cards/tank-card-g2-b72-z660.png",
    photoPos: "50% 50%",
  },
] as const;

/**
 * Height of the photo area, as a % of card height.
 *
 * 68% is Figma's and is shared by every card. Anything in PHOTO_BOX_HEIGHT
 * overrides it FOR THAT CARD ONLY — the five pipe cards are untouched by
 * whatever you put here.
 *
 * Two things bound how far you can raise it:
 *
 *  - The wordmark starts at `top-[74.67%]`. At 68% there is Figma's 6.67% gap
 *    beneath the photo; at 74% that gap is gone. Past ~74% the photo runs
 *    under the wordmark.
 *  - A TALLER box is hidden LESS by the hover lift, which is good: the lift is
 *    a fixed 22.5cqw, so it hides 22.5 / (height% x 93.75) of the box. At 68%
 *    that is 35.3%; at 72% it is 33.3%. So raising this buys back headroom and
 *    the tanks can be taller before the lids clip — re-run the crop script
 *    after changing it, because its printed "lid clip" column assumes 68%.
 */
const PHOTO_BOX_HEIGHT_DEFAULT = "68%";
const PHOTO_BOX_HEIGHT: Partial<Record<(typeof CATEGORIES)[number]["id"], string>> = {
  tanks: "72%",
};

const GOLD_BADGE = "/products/category-cards/gold-badge.svg";

export async function ProductCategories() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-32">
      <div className="container-edge flex flex-col gap-10">
        {/* No `titleColorClassName` here any more: the `#4a4a4a` grey this
            section pioneered is now `SectionHeading`'s sitewide default, so
            the override became a no-op. */}
        <SectionHeading
          eyebrow={t("categoriesEyebrow")}
          title={t("categoriesH1")}
          titleAccent={t("categoriesH2")}
          description={t("categoriesDesc")}
        />

        <div className="flex flex-col items-center gap-10">
          {/* Figma's card is 400×375 (not square) at a ~26px gap. Expressed
              as a ratio + `gap-6` so it holds at any container width, not
              just Figma's 1512px reference. */}
          <RevealOnScroll className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                // `cqw` is only for what does not natively scale with the
                // box (font-size, tracking, radius); plain percentages
                // already resolve against the card. `min(25px,6.25cqw)`
                // because Figma's radius is a fixed 25px — a flat `6.25cqw`
                // would overshoot on any card wider than 400px.
                className="group @container relative block aspect-[400/375] w-full overflow-hidden rounded-[min(25px,6.25cqw)] bg-white"
              >

                {/* Photo stops at 68%, short of the wordmark's 74.67% top,
                    to leave Figma's gap. Shares the wordmark's hover
                    translate so the two move in lockstep. */}
                <div
                  className="absolute inset-x-0 top-0 overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]"
                  style={{ height: PHOTO_BOX_HEIGHT[cat.id] ?? PHOTO_BOX_HEIGHT_DEFAULT }}
                >
                  {/* `photoPos` per card, not a blanket `object-center`.
                      These are tall studio shots with the product sitting in
                      the bottom third; centring the crop would frame empty
                      backdrop and hide the product at rest. Values are
                      measured from each file, not eyeballed. Set via `style`
                      because Tailwind cannot generate classes from data. */}
                  <Image
                    src={cat.photo}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    style={{ objectPosition: cat.photoPos }}
                    className="object-cover"
                  />
                </div>

                {/* Wordmark box is Figma's exact numbers as percentages of
                    the card. Kept absolutely positioned rather than nested
                    in a wrapper with the photo, so these stay a direct read
                    of Figma rather than needing re-derivation against a
                    wrapper's own box. `max-w` is a ceiling — the PNG's
                    aspect ratio is what actually sets the width. */}
                <Image
                  src={cat.logo}
                  alt={cat.title}
                  width={cat.logoW}
                  height={cat.logoH}
                  className="absolute left-[10.53%] top-[74.67%] h-[18.87%] w-auto max-w-[58.11%] object-contain object-left transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]"
                />

                {/* Description + CTA sit below the card at rest and slide up
                    on hover. Modelled inverted from the group above: the
                    untransformed position is the VISIBLE state, and the
                    translate pushes it out of view at rest.

                    `cqw`, not `%`: translate percentages resolve against the
                    translated element's own box, so `27.5%` of this small
                    block would not clear the card. */}
                <div className="absolute inset-x-0 bottom-0 translate-y-[27.5cqw] px-[10%] pb-[5.3%] transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <p className="line-clamp-2 text-[4cqw] leading-[1.1] text-[#606060]">
                    {t(cat.descKey)}
                  </p>
                  <div className="mt-[2%] flex items-center gap-[1.5%]">
                    {/* Anek reserves an asymmetric descender allowance for
                        Indic matras, so text beside a flex-centred icon sits
                        visibly high. `text-box-trim` on the span itself (not
                        the row) is the sitewide fix. */}
                    <span className="text-[4.5cqw] font-medium leading-none tracking-[0.09cqw] text-[#171796] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      VIEW PRODUCTS
                    </span>
                    <ArrowRight className="h-[3.5cqw] w-[3.5cqw] shrink-0 text-[#171796] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </RevealOnScroll>

          {/* Text colour overridden to Figma's literal `#0B0B52`, which is a
              different navy from the variant's `ink` token. Applied locally
              rather than by editing the shared `accent-ink` variant, which
              Hero also uses. */}
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
