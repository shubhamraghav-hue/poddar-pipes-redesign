import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import Image from "next/image";

const CATEGORIES = [
  {
    id: "upvc",
    title: "UPVC",
    href: "/products/category/upvc-pipes",
    descKey: "categoriesUpvcDesc" as const,
    logo: "/products/upvc-logo.svg",
    logoW: 298,
    logoH: 116,
  },
  {
    id: "cpvc",
    title: "CPVC",
    href: "/products/category/cpvc-pipes",
    descKey: "categoriesCpvcDesc" as const,
    logo: "/products/cpvc-logo.svg",
    logoW: 212,
    logoH: 60,
  },
  {
    id: "swr",
    title: "SWR",
    href: "/products/category/swr-pipes",
    descKey: "categoriesSwrDesc" as const,
    logo: "/products/swr-logo.svg",
    logoW: 205,
    logoH: 60,
  },
  {
    id: "tanks",
    title: "TANKS",
    href: "/products/category/tanks",
    descKey: "categoriesTanksDesc" as const,
    logo: "/products/tanks-logo.svg",
    logoW: 294,
    logoH: 116,
  },
  {
    id: "ugd",
    title: "UGD",
    href: "/products/category/ugd-pipes",
    descKey: "categoriesUgdDesc" as const,
    logo: "/products/ugd-logo.svg",
    logoW: 298,
    logoH: 118,
  },
  {
    id: "agri",
    title: "AGRI",
    href: "/products/category/agricultural-pipes",
    descKey: "categoriesAgriDesc" as const,
    logo: "/products/agri-logo.svg",
    logoW: 298,
    logoH: 116,
  },
] as const;

export async function ProductCategories() {
  const t = await getTranslations("home");
  const rows = [CATEGORIES.slice(0, 3), CATEGORIES.slice(3)] as const;

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-[150px] px-6 md:px-[100px]">
      <div className="mx-auto max-w-[1312px] flex flex-col gap-10">

        {/* Section heading */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002"
                stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              {t("categoriesEyebrow")}
            </span>
          </div>
          <h2 className="font-display text-[40px] font-extrabold uppercase leading-tight tracking-tight md:text-[48px]">
            <span className="text-[#0B0B52]">{t("categoriesH1")}</span>{" "}
            <span className="text-[#E0AF40]">{t("categoriesH2")}</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[#5C585A]">
            {t("categoriesDesc")}
          </p>
        </div>

        {/* Grid + View All */}
        <div className="flex flex-col items-center gap-10">
          <div className="self-stretch flex flex-col gap-5">
            {rows.map((row, ri) => (
              <RevealOnScroll key={ri} delay={ri * 0.05}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  {row.map((cat, ci) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      className="group flex flex-1 flex-col items-start bg-white rounded-[25px] pt-[60px] pb-5 pl-10 pr-6 transition-shadow hover:shadow-lg hover:shadow-black/5"
                    >
                      {/* Product wordmark */}
                      <div className="flex flex-1 flex-col items-start gap-5 pr-2 mb-8">
                        <Image
                          src={cat.logo}
                          alt={cat.title}
                          width={cat.logoW}
                          height={cat.logoH}
                          className="h-auto w-auto max-w-full"
                        />
                        {/* Description */}
                        <span className="text-[#606060] text-base leading-relaxed max-w-[265px]">
                          {t(cat.descKey)}
                        </span>
                      </div>

                      {/* VIEW PRODUCTS */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[#171796] text-[18px] font-bold">
                          VIEW PRODUCTS
                        </span>
                        <ArrowRight className="h-[14px] w-[14px] text-[#171796] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* View All button */}
          <RevealOnScroll>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#171796] px-8 py-3 text-[#171796] font-bold text-base transition-colors hover:bg-[#171796] hover:text-white"
            >
              {t("categoriesCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}
