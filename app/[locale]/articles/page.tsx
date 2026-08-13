import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTASection } from "@/components/home/CTASection";
import { pressArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Press Coverage — Articles & News",
  description:
    "Independent press coverage of Poddar Plumbing's ₹758 crore Vemgal, Karnataka expansion — the investment, the jobs, and the timeline, as reported by the press.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");

  return (
    <>
      {/* Compact header, not a full hero — see /faq for the same pattern. */}
      <section className="relative overflow-hidden bg-ink bg-blueprint pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="container-edge relative">
          <RevealOnScroll>
            <SectionHeading
              as="h1"
              dark
              eyebrow={t("pageEyebrow")}
              title={t("pageH1")}
              description={t("pageDesc")}
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-20 md:py-24">
        {/* A dated timeline rather than a generic card grid — these 8 pieces
            are genuinely one story (the Vemgal investment) unfolding across
            a single news cycle, so publication order is real information,
            not decoration. Rail column (dot + connecting line) sits beside
            the content column via CSS grid, so the line's length is driven
            by the content's own height instead of hand-measured absolute
            positioning. */}
        <div className="mx-auto max-w-3xl">
          {pressArticles.map((article, i) => (
            <div key={article.id} className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-6">
              <div className="flex flex-col items-center">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-600 ring-4 ring-amber-600/15" />
                {i < pressArticles.length - 1 && (
                  <span className="w-px flex-1 bg-ocean-600/15" aria-hidden="true" />
                )}
              </div>
              <RevealOnScroll delay={Math.min(i * 0.05, 0.3)} className="pb-10 last:pb-0">
                <div className="rounded-[25px] border border-slate-200/70 bg-white p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="tech-label text-ocean-700">{article.date}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
                      {article.outlet}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-medium leading-snug text-slate-900 sm:text-xl">
                    {article.headline}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                    {article.summary}
                  </p>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
                  >
                    <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      {t("readLabel")}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
