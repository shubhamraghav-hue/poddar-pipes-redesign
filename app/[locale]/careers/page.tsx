import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMPANY } from "@/lib/data/offices";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // English title/description are the page's own copy. There are no
  // per-page meta keys in messages/*.json yet, so other locales reuse the
  // page's translated nav label as the title; the description stays English.
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/careers",
    title: locale === "en" ? "Careers" : t("nav.navCareers"),
    description: "Interested in working at Poddar Pipes? Write to our HR team.",
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
      </section>

      {/* CLIENT DECISION (2026-10-08): no job listings on the site. Anyone
          interested writes to HR. This replaced a list of four unverified
          openings ("Plant Location"), an application form, and a perks grid
          (health insurance etc.) that nobody had confirmed. */}
      <section className="container-edge pb-24 pt-6 md:pb-28">
        <RevealOnScroll>
          <div className="flex flex-col gap-8 rounded-[25px] bg-[#0b0b52] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f28000]">
                {t("hrEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-[28px] uppercase leading-[1.08] text-white sm:text-4xl">
                <span className="block font-light">{t("hrH1")}</span>
                <span className="block font-bold">{t("hrH2")}</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#c0c0c0] sm:text-base">
                {t("hrDesc")}
              </p>
            </div>
            <div className="flex min-w-0 flex-col gap-3 lg:items-end">
              <a
                href={`mailto:${COMPANY.hrEmail}?subject=${encodeURIComponent("Career enquiry")}`}
                className="inline-flex h-[46px] items-center justify-center gap-2 self-start rounded-full bg-[#f28000] px-6 text-lg font-semibold uppercase tracking-[0.36px] text-[#0b0b52] transition-[filter] hover:brightness-95 lg:self-end"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {t("hrCta")}
                </span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${COMPANY.hrEmail}`}
                className="break-all py-2 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {COMPANY.hrEmail}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
