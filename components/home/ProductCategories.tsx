import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import Image from "next/image";

// Display order per brand team request: CPVC, UPVC, SWR, AGRI, UGD, TANKS.
// `photo` + the gold badge are the exact assets exported from Figma (node
// 13:83 and siblings) — every category card there has a tilted product
// photo behind the wordmark and a "GOLD" ribbon badge in the top corner.
const CATEGORIES = [
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/category/cpvc-pipes",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/cpvc-logo.svg",
    logoW: 430,
    logoH: 142,
    photo: "/products/category-cards/cpvc.png",
  },
  {
    id: "upvc",
    title: "UPVC",
    href: "/products/category/upvc-pipes",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/upvc-logo.svg",
    logoW: 442,
    logoH: 142,
    photo: "/products/category-cards/upvc.png",
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/category/swr-pipes",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/swr-logo.svg",
    logoW: 412,
    logoH: 142,
    photo: "/products/category-cards/swr.png",
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/category/agricultural-pipes",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/agri-logo.svg",
    logoW: 418,
    logoH: 142,
    photo: "/products/category-cards/agri.png",
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/category/ugd-pipes",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/ugd-logo.svg",
    logoW: 384,
    logoH: 142,
    photo: "/products/category-cards/ugd.png",
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/category/tanks",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/tanks-logo.svg",
    logoW: 450,
    logoH: 142,
    photo: "/products/category-cards/tank.png",
  },
] as const;

const GOLD_BADGE = "/products/category-cards/gold-badge.svg";

export async function ProductCategories() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-32">
      <div className="container-edge flex flex-col gap-6">

        <SectionHeading
          eyebrow={t("categoriesEyebrow")}
          title={t("categoriesH1")}
          titleAccent={t("categoriesH2")}
          description={t("categoriesDesc")}
        />

        {/* Grid + View All */}
        <div className="flex flex-col items-center gap-6">
          <RevealOnScroll className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative flex aspect-square w-full max-w-[260px] mx-auto sm:max-w-none flex-col overflow-hidden bg-white rounded-[14px] text-center transition-shadow hover:shadow-lg hover:shadow-black/10"
              >
                {/* "GOLD" ribbon badge — exact Figma asset (node 13:90 and
                    siblings), present on every category card. */}
                <div className="absolute right-3 top-3 z-10 flex h-[18px] items-center rounded-full bg-[#e0af40] px-2.5">
                  <img src={GOLD_BADGE} alt="" className="h-[9px] w-auto" />
                </div>

                {/* Product photo peeking from the top of the card — the
                    exact Figma photo asset for this category, cropped to a
                    band rather than Figma's per-card absolute
                    size/rotation, since this card is a responsive square
                    and each Figma photo is a differently-sized one-off. */}
                <div className="relative h-[44%] w-full shrink-0 overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src={cat.photo}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 260px"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>

                {/* Figma's own Default/Hover card variants (node 13:317 and
                    siblings) keep "VIEW PRODUCTS" parked below the card on
                    Default (bottom:-90px) and slide it up to bottom:20px on
                    Hover, with the logo/description shifting up ~90px to
                    make room. Reproduced here as a reveal-on-hover rather
                    than literal absolute offsets, since this card's layout
                    is flex/responsive rather than Figma's fixed 375px box —
                    the content block eases up via `-translate-y` and the CTA
                    fades + slides in from just below its resting spot. */}
                <div className="flex w-full flex-1 flex-col items-center p-4">
                  <div className="flex w-full flex-1 flex-col items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-2">
                    <Image
                      src={cat.logo}
                      alt={cat.title}
                      width={cat.logoW}
                      height={cat.logoH}
                      className="h-10 w-auto max-w-full object-contain sm:h-12"
                    />
                  </div>

                  {/* Description — clamped to 2 lines with a matching
                      min-height so every card reserves the same space here
                      whether its text wraps to 1 line or 2. */}
                  <span className="line-clamp-2 min-h-[34px] text-xs leading-snug text-[#606060] transition-transform duration-300 ease-out group-hover:-translate-y-2 sm:text-sm">
                    {t(cat.descKey)}
                  </span>

                  <div className="mt-1.5 flex h-4 items-center gap-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 translate-y-1.5">
                    <span className="text-xs font-bold text-[#171796] leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      VIEW PRODUCTS
                    </span>
                    <ArrowRight className="h-3 w-3 text-[#171796] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </RevealOnScroll>

          {/* View All button */}
          <RevealOnScroll>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#171796] px-8 py-3 text-[#171796] font-bold text-base transition-colors hover:bg-[#171796] hover:text-white"
            >
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("categoriesCta")}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}