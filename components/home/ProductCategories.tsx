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
    // A pair-of-tanks studio shot (Sep 2026). The frame is the shared
    // `h-[68%]` box, same for all six cards, and nothing below touches it.
    //
    // PLACEMENT lives in PHOTO_PAN below (see its note): x and y, both
    // editable here with no regeneration, both axes free. `photoPos` is
    // IGNORED for this card — the pan layer replaces it, because
    // `object-position` can only ever move along one axis.
    //
    // SIZE comes from the crop, and needs regenerating:
    //   node scripts/crop-tank-card.mjs "<Tanks v3 (1).png>" 820
    //        --right 0.82 --floor 61 --slack 0 --tag g4
    //
    //   820        crop width. SMALLER = bigger tanks. Note the pan `zoom`
    //              multiplies this, so at zoom 125 a crop of 820 renders the
    //              tanks the same size a 660 crop did with no pan.
    //   --slack 0  REQUIRED for panning: it cuts the crop to the frame's own
    //              aspect, so the pan layer is the only thing moving.
    //   --right    where the tanks sit in the CROP. Keep them inside the
    //              pannable band — at zoom 125 only the middle 80% of the
    //              crop is ever visible, so 0.82 rather than 0.92.
    //   --floor    floor under the bases in the crop. 61 rather than 10,
    //              because the zoom would otherwise push the bases out of the
    //              bottom of the frame before x/y could pull them back.
    //   --tag      always a NEW one when the source or these numbers change:
    //              Next's optimiser caches by path.
    photo: "/products/category-cards/tank-card-g4-z820.png",
    // No `photoPos` on purpose. It is inert once a card pans, and leaving a
    // dead value sitting here invites editing it and seeing nothing happen.
    // Placement for this card is PHOTO_PAN.tanks, immediately below.
  },
] as const;

/**
 * Two-axis placement inside the photo frame, for cards that opt in.
 *
 * WHY THIS EXISTS: `object-position` can only ever move a `object-cover` image
 * along ONE axis — whichever dimension is proportionally larger overflows the
 * frame, and the other fits exactly with nothing to slide. That is why the
 * tank card's `photoPos` Y worked while its X did nothing at all. No amount of
 * tuning `photoPos` can give you both.
 *
 * So instead the photo goes in a LAYER that is `zoom`% of the frame in BOTH
 * axes, and that layer is slid around inside it. The frame is untouched — the
 * card's geometry, the hover lift and the other five cards are all unaffected.
 *
 *   zoom  how much bigger than the frame the photo layer is. This is the
 *         travel budget: at 125 you get 25% of the frame's width and height to
 *         move through. More zoom = more room to pan, but more of the photo
 *         falls outside the frame and the image is upscaled further.
 *   x, y  0-100, and they read exactly like `object-position`: 0 shows the
 *         photo's left/top edge (content sits right/low), 100 shows its
 *         right/bottom edge (content sits left/high), 50 is centred.
 *
 * The photo file must be cropped to the FRAME's aspect ratio (1.5686) for this
 * to behave predictably — then the layer's aspect matches too, `object-cover`
 * has nothing of its own to crop, and x/y are the only things moving.
 * `scripts/crop-tank-card.mjs --slack 0` produces that.
 *
 * Measured for the tank card at zoom 125 on a 400px card: 100px of horizontal
 * travel and 64px of vertical. Useful ranges are x 11-100 (below 11 the tanks
 * push out of the right edge) and y 43-100 (below 43 their bases drop out of
 * the bottom). Raising y lifts the tanks and costs lid on hover: roughly
 * 6.5 + 0.64y px clipped, so 34px at y=43, 38px at y=50, 70px at y=100.
 */
const PHOTO_PAN: Partial<
  Record<(typeof CATEGORIES)[number]["id"], { zoom: number; x: number; y: number }>
> = {
  tanks: { zoom: 125, x: 50, y: 50 },
};

/** Turns a pan into the layer's size and offset. */
function panStyle({ zoom, x, y }: { zoom: number; x: number; y: number }) {
  const slack = 100 - zoom; // negative: how far the layer may travel
  return {
    width: `${zoom}%`,
    height: `${zoom}%`,
    left: `${(slack * x) / 100}%`,
    top: `${(slack * y) / 100}%`,
  };
}

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
                <div className="absolute inset-x-0 top-0 h-[68%] overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]">
                  {PHOTO_PAN[cat.id] ? (
                    // Pan layer: bigger than the frame in BOTH axes, then slid
                    // within it. This is the only way to get two-axis freedom
                    // — see the note on PHOTO_PAN. The frame itself is
                    // untouched, so the card's geometry is unaffected.
                    <div className="absolute" style={panStyle(PHOTO_PAN[cat.id]!)}>
                      <Image
                        src={cat.photo}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 42vw, 125vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    // `photoPos` per card, not a blanket `object-center`.
                    // These are tall studio shots with the product sitting in
                    // the bottom third; centring the crop would frame empty
                    // backdrop and hide the product at rest. Values are
                    // measured from each file, not eyeballed. Set via `style`
                    // because Tailwind cannot generate classes from data.
                    <Image
                      src={cat.photo}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      // Guarded read: the panning card deliberately has no
                      // `photoPos`, so this union member may not carry one.
                      style={{
                        objectPosition: "photoPos" in cat ? cat.photoPos : undefined,
                      }}
                      className="object-cover"
                    />
                  )}
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
