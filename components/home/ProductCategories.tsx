import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import Image from "next/image";

// Display order per brand team request: CPVC, UPVC, SWR, AGRI, UGD, TANKS.
const CATEGORIES = [
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/category/cpvc-pipes",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/cpvc-logo.svg",
    logoW: 430,
    logoH: 142,
  },
  {
    id: "upvc",
    title: "UPVC",
    href: "/products/category/upvc-pipes",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/upvc-logo.svg",
    logoW: 442,
    logoH: 142,
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/category/swr-pipes",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/swr-logo.svg",
    logoW: 412,
    logoH: 142,
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/category/agricultural-pipes",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/agri-logo.svg",
    logoW: 418,
    logoH: 142,
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/category/ugd-pipes",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/ugd-logo.svg",
    logoW: 384,
    logoH: 142,
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/category/tanks",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/tanks-logo.svg",
    logoW: 450,
    logoH: 142,
  },
] as const;

export async function ProductCategories() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-12 md:py-16 px-6 md:px-16">
      <div className="mx-auto max-w-[1312px] flex flex-col gap-6">

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
                className="group flex aspect-square w-full max-w-[260px] mx-auto sm:max-w-none flex-col items-center justify-between overflow-hidden bg-white rounded-[14px] p-5 text-center transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                {/* Logo box grows to fill the space above the description,
                    centering wordmarks of any width/aspect ratio instead of
                    pinning them to the top-left — this also spreads logo /
                    description / CTA across the full card height so the
                    square doesn't end in dead space below the CTA. Card is
                    capped at 260px even in the single-column mobile layout
                    (rather than stretching to the full row width), keeping
                    it the same proportions as the 3-up desktop card instead
                    of ballooning into an oversized square. */}
                <div className="flex w-full flex-1 items-center justify-center">
                  <Image
                    src={cat.logo}
                    alt={cat.title}
                    width={cat.logoW}
                    height={cat.logoH}
                    className="h-14 w-auto max-w-full object-contain"
                  />
                </div>

                {/* Description — clamped to 2 lines with a matching
                    min-height so every card reserves the same space here
                    whether its text wraps to 1 line or 2. */}
                <span className="line-clamp-2 min-h-[38px] text-sm leading-snug text-[#606060]">
                  {t(cat.descKey)}
                </span>

                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs font-bold text-[#171796] leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    VIEW PRODUCTS
                  </span>
                  <ArrowRight className="h-3 w-3 text-[#171796] transition-transform group-hover:translate-x-0.5" />
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
