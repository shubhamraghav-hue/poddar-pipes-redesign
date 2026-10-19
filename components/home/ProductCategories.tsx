import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { RangeLink } from "@/components/shared/RangeLink";
import { CAP_TRIM } from "@/components/shared/capTrim";

/**
 * Homepage product cards — Figma "prooducts cards/homepage" (section
 * 2011:5061, 2026-10-19): one 400x375 component per range, two states.
 *
 *   REST   photo frame 400x274 at the top; the "PODDAR <range>" logo at
 *          x40 / y294. The VIEW button (y376) and the description (y395) sit
 *          below the card edge, clipped.
 *   HOVER  photo frame and logo up 50px; VIEW button up 122px to y254, its
 *          centre at x306; description up 66px, its first line at y310.
 *
 * Everything is a % of the card (positions) or `cqw` of it (sizes, and the
 * hover travel — translate % would resolve against each element's own box),
 * so the composition holds at any card width. Elements are placed at their
 * HOVER positions and pushed back to rest with a translate.
 *
 * Touch screens have no hover, so `(hover: none)` shows the hover state as
 * the resting one: the button and description are always visible there.
 *
 * Photos are the same 4K studio shots the /products range card uses
 * (lib/data/productShowcase.ts). Pipes: the portrait shot drawn 480x716,
 * anchored bottom-right in the frame (so 80px is cropped off its left).
 * TANK: the landscape tank shot, 492x275 at x-92, its bottom 1px below the
 * frame. Logos: Figma's own "pipe logos/blue" variants exported as SVG
 * (public/products/category-cards/*-logo.svg). Each is the full Wx56 logo box
 * Figma places at x40 / y294, so the width alone sets the size.
 */

// Display order is the brand team's, NOT Figma's layout order — deliberate.
const CATEGORIES = [
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/cpvc-pipes#range",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/category-cards/cpvc-logo.svg",
    logoPx: { w: 284, h: 142 },
    logoW: 112.396,
    descW: 180,
    photo: "/products/showcase/cpvc-hero.png",
  },
  {
    id: "upvc",
    // Lowercase "u" — the brand's own spelling, matching the artwork.
    title: "uPVC",
    href: "/products/upvc-pipes#range",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/category-cards/upvc-logo.svg",
    logoPx: { w: 287, h: 142 },
    logoW: 113.583,
    descW: 180,
    photo: "/products/showcase/upvc-hero.webp",
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/swr-pipes#range",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/category-cards/swr-logo.svg",
    logoPx: { w: 266, h: 142 },
    logoW: 105.272,
    descW: 180,
    photo: "/products/showcase/swr-hero.png",
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/agricultural-pipes#range",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/category-cards/agri-logo.svg",
    logoPx: { w: 272, h: 142 },
    logoW: 107.647,
    descW: 167,
    photo: "/products/showcase/agri-hero.png",
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/ugd-pipes#range",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/category-cards/ugd-logo.svg",
    logoPx: { w: 238, h: 142 },
    logoW: 94.191,
    descW: 180,
    photo: "/products/showcase/ugd-hero.png",
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/tanks#range",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/category-cards/tank-logo.svg",
    logoPx: { w: 304, h: 142 },
    logoW: 120.311,
    descW: 157,
    photo: "/products/showcase/tank-wide.webp",
    wide: true,
  },
] as const;

/** The photo's box inside the 400x274 frame, as % of the frame. */
const PIPE_BOX = { left: -20, top: ((274 - 716) / 274) * 100, w: 120, h: (716 / 274) * 100 };
const TANK_BOX = { left: (-92 / 400) * 100, top: ((274 + 1 - 275) / 274) * 100, w: (492 / 400) * 100, h: (275 / 274) * 100 };

// Hover travel, in cqw of the 400px card: 50px, 122px, 66px.
const LIFT = "group-hover:-translate-y-[12.5cqw] group-focus-visible:-translate-y-[12.5cqw] [@media(hover:none)]:-translate-y-[12.5cqw]";
const MOTION = "transition-transform duration-500 ease-out";

/**
 * Phone card (below `sm`) — Figma mobile home 2015:5548: a 342x200 white card,
 * 25px radius, 4px soft shadow. Photo strip 136px tall across the top; logo
 * at x20, 11.55 off the bottom, drawn at 34.66/45.72 of the desktop logo (so
 * the same SVG box is 42.45 tall); a 32px #171796 circle with a 20px white
 * arrow at x290 / 13 off the bottom. No hover state on touch, no tagline.
 * All values are % or cqw of the 342px card so narrower phones keep it.
 */
const PHONE_PIPE = { top: (-353 / 136) * 100, h: (510 / 136) * 100 };
const PHONE_TANK = { top: (((136 - 218) / 2 + 2) / 136) * 100, h: (218 / 136) * 100 };

function PhoneCard({ cat }: { cat: (typeof CATEGORIES)[number] }) {
  const box = "wide" in cat ? PHONE_TANK : PHONE_PIPE;
  return (
    <RangeLink
      href={cat.href}
      className="@container relative block aspect-[342/200] w-full overflow-hidden rounded-[25px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.1)] sm:hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[68%] overflow-hidden">
        <div className="absolute inset-x-0" style={{ top: `${box.top}%`, height: `${box.h}%` }}>
          <Image src={cat.photo} alt="" fill quality={90} sizes="100vw" className="object-cover" />
        </div>
      </div>
      <Image
        src={cat.logo}
        unoptimized
        alt={cat.title}
        width={cat.logoPx.w}
        height={cat.logoPx.h}
        className="absolute bottom-[3.38cqw] left-[5.85%] h-[12.41cqw] w-auto"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[3.8cqw] right-[5.85%] flex size-[9.36cqw] items-center justify-center rounded-full bg-[#171796]"
      >
        <ArrowRight strokeWidth={1.75} className="size-[5.85cqw] text-white" />
      </span>
    </RangeLink>
  );
}

export async function ProductCategories() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-32">
      <div className="container-figma flex flex-col gap-10">
        <SectionHeading
          eyebrow={t("categoriesEyebrow")}
          title={t("categoriesH1")}
          titleAccent={t("categoriesH2")}
          description={t("categoriesDesc")}
        />

        <div className="flex flex-col items-center gap-10">
          <RevealOnScroll className="grid w-full grid-cols-1 gap-[18px] sm:grid-cols-3 sm:gap-6">
            {CATEGORIES.map((cat) => {
              const box = "wide" in cat ? TANK_BOX : PIPE_BOX;
              return (
                <Fragment key={cat.id}>
                <PhoneCard cat={cat} />
                <RangeLink
                  href={cat.href}
                  // `min(25px,6.25cqw)`: Figma's radius is a fixed 25px, which
                  // a flat 6.25cqw would overshoot on cards wider than 400.
                  className="group @container relative hidden aspect-[400/375] w-full overflow-hidden rounded-[min(25px,6.25cqw)] bg-white sm:block"
                >
                  {/* Photo frame: 400x274 (73.07%) at the top. */}
                  <div className={`absolute inset-x-0 top-0 h-[73.0667%] overflow-hidden ${MOTION} ${LIFT}`}>
                    <div
                      className="absolute"
                      style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.w}%`, height: `${box.h}%` }}
                    >
                      <Image
                        src={cat.photo}
                        alt=""
                        fill
                        quality={90}
                        sizes="(min-width: 640px) 40vw, 120vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Logo at x40 / y294 (10% / 78.4%), Figma's width per range. */}
                  <Image
                    src={cat.logo}
                    unoptimized
                    alt={cat.title}
                    width={cat.logoPx.w}
                    height={cat.logoPx.h}
                    className={`absolute left-[10%] top-[78.4%] h-auto ${MOTION} ${LIFT}`}
                    style={{ width: `${(cat.logoW / 400) * 100}%` }}
                  />

                  {/* VIEW button — Figma's orange "Icon-R" pill: 24/16px side
                      padding, 6px gap, 18px SemiBold #0b0b52 label, 20px
                      arrow; centred at x306 (76.5%), top y254 (67.73%) on
                      hover. A <span>: the whole card is the link. `w-max`: an absolute
                      box at left 76.5% is otherwise capped to the 23.5% to its
                      right (94px) and squeezed below its 108px. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[76.5%] top-[67.7333%] flex h-[11.5cqw] w-max -translate-x-1/2 translate-y-[30.5cqw] items-center gap-[1.5cqw] whitespace-nowrap rounded-full bg-[#f28000] pl-[6cqw] pr-[4cqw] ${MOTION} group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0`}
                  >
                    <span className={`text-[4.5cqw] font-semibold uppercase leading-none tracking-[0.09cqw] text-[#0b0b52] ${CAP_TRIM}`}>
                      {tCommon("view")}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Figma's 20px arrow-up-right */}
                    <img src="/brand/arrow-up-right.svg" alt="" width={20} height={20} className="size-[5cqw]" />
                  </span>

                  {/* Description: x40, first line y310 (82.61%) on hover. */}
                  <p
                    className={`absolute left-[10%] top-[82.6133%] translate-y-[16.5cqw] text-[4cqw] leading-[1.2] text-[#606060] ${MOTION} group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0`}
                    style={{ width: `${(cat.descW / 400) * 100}%` }}
                  >
                    {t(cat.descKey)}
                  </p>
                </RangeLink>
                </Fragment>
              );
            })}
          </RevealOnScroll>

          {/* Text colour overridden to Figma's literal `#0B0B52`, which is a
              different navy from the variant's `ink` token. Applied locally
              rather than by editing the shared `accent-ink` variant, which
              Hero also uses. */}
          <RevealOnScroll className="flex w-full justify-center">
            <Button
              asChild
              variant="accent-ink"
              size="lg"
              className="h-auto w-full max-w-[307px] px-6 pb-3 pt-4 type-button font-semibold text-[#0B0B52] uppercase hover:text-[#0B0B52] sm:w-auto sm:max-w-none"
            >
              <Link href="/products">{t("categoriesCta")}</Link>
            </Button>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
