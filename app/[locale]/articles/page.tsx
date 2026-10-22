import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { pressArticles } from "@/lib/data/articles";
import { pressArticlesHi } from "@/lib/data/hi/articles";
import { hasOverlays, localizeList } from "@/lib/i18n/localize";
import type { PressArticle } from "@/types";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/articles",
    title: (await getTranslations({ locale: "en" }))("seo.articlesTitle"),
    description: t("seo.articlesDescription"),
  });
}

/**
 * Figma "News & Media Page" (node 1653:9258), content frame 1653:9076.
 *
 *   heading  "IN THE" Light / "NEWS & MEDIA" Bold navy, 60px, leading 1.02,
 *            120px under the navbar
 *   grid     three 385.33px cards with 28px gaps — exactly the 1212 Figma
 *            column (`container-figma`), 40px under the heading, 120px above
 *            the footer
 *
 * The mock goes straight from the grid into the footer, so the closing
 * `CTASection` the old timeline page carried is gone.
 */
export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");

  return (
    <section className="mt-20 bg-white pb-20 pt-16 md:pb-[120px] md:pt-[120px]">
      <div className="container-figma">
        <RevealOnScroll>
          <h1 className="font-display type-heading uppercase">
            <span className="block font-light text-[#606060]">{t("pageH1")}</span>
            <span className="block font-bold text-[#171796]">{t("pageH2")}</span>
          </h1>
        </RevealOnScroll>

        {/* 1 → 2 → 3 columns. At `lg` the three 28px-gapped columns are the
            mock's 385.33px each only at a 1512 viewport; narrower, they share
            the column and the card height floor keeps every row level. */}
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {localizeList(pressArticles, hasOverlays(locale) ? pressArticlesHi : undefined, "id").map((article, i) => (
            <li key={article.id} className="flex">
              <RevealOnScroll delay={Math.min(i * 0.06, 0.3)} className="flex w-full">
                <MediaCard article={article} readLabel={t("readLabel")} newTabLabel={t("opensNewTab")} />
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Figma "News & Media Card" component set 1938:23508 (2026-10-22 deck,
 * slides 2216:15240 and 2246:15476). Default / hover variants:
 *
 *   card      #fbfbfb, 1px #c0c0c0, radius 24; padding 40 top, 32 sides,
 *             60 bottom (the 1px border included — hence 39/31/59). Hover
 *             goes white with a 0 0 12px rgba(0,0,0,0.1) shadow, 120ms.
 *   chip      outlet, 12px SemiBold caps #171796 on #171796 @ 10%, radius 30,
 *             padding 10 / 14 / 6
 *   headline  20px SemiBold caps #4a4a4a, leading 1.2; 77px under the chip
 *   summary   16px Regular #606060, leading 1.2, 8px under the headline,
 *             left-aligned straight under it (it used to float centred in
 *             the slack, which read as a big title-to-summary gap)
 *   button    Figma "Icon(R) Button" BLUE: 46px #171796 pill, 24 / 16 side
 *             padding, 6px gap, 18px SemiBold white caps + 20px
 *             arrow-up-right; hover #121278 (black 20% over the blue). At
 *             least 50px under the summary and pinned to the card floor, so
 *             a row's buttons line up.
 *
 * Phones ("cards look too long"): no minimum height, 30px chip-to-headline,
 * 24px sides, and a 40px button with the label at the label size.
 */
function MediaCard({ article, readLabel, newTabLabel }: { article: PressArticle; readLabel: string; newTabLabel: string }) {
  return (
    <article className="group/card flex w-full flex-col rounded-[24px] border border-[#c0c0c0] bg-[#fbfbfb] px-[23px] pb-[39px] pt-[31px] transition-[background-color,box-shadow] duration-[120ms] ease-out hover:bg-white hover:shadow-[0_0_12px_0_rgba(0,0,0,0.1)] md:px-[31px] md:pb-[59px] md:pt-[39px]">
      <span className="flex w-fit max-w-full items-center rounded-[30px] bg-[#171796]/10 px-[14px] pb-1.5 pt-2.5 type-small font-semibold uppercase leading-[1.35] text-[#171796]">
        <span className="truncate">{article.outlet}</span>
      </span>

      <h2 className="mt-[30px] font-display type-sub font-semibold uppercase text-[#4a4a4a] md:mt-[77px]">
        {article.headline}
      </h2>

      <p className="mt-2 type-body text-[#606060]">
        {article.summary}
      </p>

      {/* Takes the slack so the button sits on the card floor; never under
          Figma's 50px (40 on phones) above it. */}
      <div aria-hidden="true" className="min-h-10 flex-1 md:min-h-[50px]" />

      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${readLabel}: ${article.headline} (${article.outlet}, ${newTabLabel})`}
        className="group/read flex h-10 w-fit touch-manipulation select-none items-center gap-1.5 rounded-full bg-[#171796] pl-5 pr-4 type-label font-semibold uppercase text-white transition-[background-color,scale] duration-[120ms] ease-out hover:bg-[#121278] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171796]/40 focus-visible:ring-offset-2 active:scale-[0.98] md:h-[46px] md:pl-6 md:type-button"
      >
        <span className={CAP_TRIM}>{readLabel}</span>
        {/* Figma's 20px arrow-up-right: the 9.5px glyph inside a 20px box
            (5.25px inset). Nudges up-right on hover. */}
        <svg
          width="20"
          height="20"
          viewBox="-5.25 -5.25 20 20"
          fill="none"
          aria-hidden="true"
          className="size-4 shrink-0 transition-[translate] duration-200 ease-out group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 md:size-5"
        >
          <path
            d="M0.75 8.75L8.75 0.75M8.75 8.75V0.75H0.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </article>
  );
}
