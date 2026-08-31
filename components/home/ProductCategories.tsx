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
    // `-wide` is the studio shot PADDED horizontally (1029 -> 1441,
    // edge-replicated), not the raw export. With `object-cover` the visible
    // slice is always `imageWidth / boxAspect`, so widening the canvas is the
    // only way to shrink the tank within the frame — at the original width
    // the slice was 656px against an 828px tank, forcing the lid or base to
    // be cut. At 1441 the slice is 919px and the whole tank fits. Do not
    // "optimise" the padding away, and do not rename this back to
    // `tank-card.png`: Next's optimiser caches by source path, so reusing the
    // old name silently serves the old, narrower crop.
    photo: "/products/category-cards/tank-card-wide.png",
    photoPos: "50% 86%",
  },
] as const;

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
                {/* GOLD badge — Figma: 70.08×26.4 at a 400px-wide card,
                    top-right, unaffected by hover. */}
                {/*<div className="absolute right-[3.48%] top-[3.47%] z-20 flex h-[7.04%] w-[17.52%] items-center justify-center rounded-full bg-[#e0af40]">
                  <img src={GOLD_BADGE} alt="" className="h-[55%] w-auto" />
                </div>*/}

                {/* Photo stops at 68%, short of the wordmark's 74.67% top,
                    to leave Figma's gap. Shares the wordmark's hover
                    translate so the two move in lockstep. */}
                <div className="absolute inset-x-0 top-0 h-[68%] overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-[22.5cqw]">
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
