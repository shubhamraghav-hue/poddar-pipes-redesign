import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { pressArticles } from "@/lib/data/articles";
import type { PressArticle } from "@/types";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // No translation key exists for this page's title/description yet, so
  // every locale keeps the English copy (canonical/hreflang are per-locale).
  return buildPageMetadata({
    locale,
    path: "/articles",
    title: "News & Media — Press Coverage",
    description: "Press coverage of Poddar Plumbing's ₹758 crore Vemgal, Karnataka expansion — the investment, the jobs, and the timeline, as reported by the press.",
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
          <h1 className="font-display text-[36px] uppercase leading-[1.02] tracking-[0.2088px] sm:text-5xl md:text-[60px] md:tracking-[0.32px]">
            <span className="block font-light text-[#606060]">{t("pageH1")}</span>
            <span className="block font-bold text-[#171796]">{t("pageH2")}</span>
          </h1>
        </RevealOnScroll>

        {/* 1 → 2 → 3 columns. At `lg` the three 28px-gapped columns are the
            mock's 385.33px each only at a 1512 viewport; narrower, they share
            the column and the card height floor keeps every row level. */}
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {pressArticles.map((article, i) => (
            <li key={article.id} className="flex">
              <RevealOnScroll delay={Math.min(i * 0.06, 0.3)} className="flex w-full">
                <MediaCard article={article} readLabel={t("readLabel")} />
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Figma "News & Media Card" (1653:9078 and siblings): 385x460, radius 24,
 * 1px `#dedede` over `rgba(245,245,245,0.35)`, content inset 32px.
 *
 *   chip      outlet, 12px SemiBold uppercase navy on `#f0f0fa`, radius 30
 *   headline  24px SemiBold uppercase `#4a4a4a`, leading 1.2, 34px under chip
 *   summary   16px Regular `#626262`, leading 1.2
 *   button    46px pill, 1.5px navy ring, 18px SemiBold navy + the mock's
 *             arrow-up-right; pinned to the card bottom (32px pad) so every
 *             button in a row lines up whatever the copy length
 *   insets    40 top, 32 sides/bottom from the outer edge (the 1px border
 *             included — hence 39/31 padding)
 *
 * `min-h` rather than Figma's fixed 460: at 1024–1280 the cards are narrower
 * than 385 and the longer headlines take a fourth line, which a fixed height
 * would clip.
 */
function MediaCard({ article, readLabel }: { article: PressArticle; readLabel: string }) {
  return (
    <article className="flex min-h-[400px] w-full flex-col rounded-[24px] border border-[#dedede] bg-[#f5f5f5]/35 p-6 transition-[border-color,background-color] duration-200 ease-out hover:border-[#c0c0c0] hover:bg-[#f5f5f5]/60 md:min-h-[460px] md:px-[31px] md:pb-[31px] md:pt-[39px]">
      <span className="flex h-[33px] w-fit max-w-full items-center rounded-[30px] bg-[#f0f0fa] px-[14px] text-[12px] font-semibold uppercase text-[#171796]">
        <span className={`truncate py-1.5 -my-1.5 ${CAP_TRIM}`}>{article.outlet}</span>
      </span>

      {/* `max-w-[313px]`: the mock's headline box, narrower than the
          323px content width — without it the lines broke differently from
          the design ("…TARGETS / ₹3,000 CRORE…" vs "…PROJECT / TARGETS…"). */}
      <h2 className="mt-[34px] max-w-[313px] font-display text-[20px] font-semibold uppercase leading-[1.2] text-[#4a4a4a] md:text-[24px]">
        {article.headline}
      </h2>

      {/* The summary is CENTRED in the space between headline and button,
          which is how the mock places it — every card's summary sits around
          y280 whether it runs three lines or five, rather than a fixed gap
          under the headline. `flex-1` takes the slack (so the button sits on
          the card floor and rows line up); `py-5` keeps at least 20px either
          side when the copy is long. */}
      <div className="flex flex-1 items-center py-5">
        <p className="text-[15px] leading-[1.35] text-[#626262] md:text-[16px] md:leading-[1.2]">
          {article.summary}
        </p>
      </div>

      {/* The ring is an inset shadow, not a border — a 1.5px CSS border sits
          outside the padding and would make the pill 49 tall, not Figma's 46
          (the same fix as the hero CTAs). Hover fills it navy. */}
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${readLabel}: ${article.headline} (${article.outlet}, opens in a new tab)`}
        className="group/read flex h-[46px] w-fit touch-manipulation select-none items-center gap-[10px] rounded-full px-6 text-[18px] font-semibold uppercase tracking-[0.36px] text-[#171796] shadow-[inset_0_0_0_1.5px_#171796] transition-[background-color,color,scale] duration-200 ease-out hover:bg-[#171796] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171796]/40 focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        <span className={CAP_TRIM}>{readLabel}</span>
        {/* Figma's arrow-up-right (1653:9085), path verbatim, stroke →
            currentColor for the hover inversion. Nudges up-right on hover. */}
        <svg
          width="9.5"
          height="9.5"
          viewBox="0 0 9.5 9.5"
          fill="none"
          aria-hidden="true"
          className="shrink-0 transition-[translate] duration-200 ease-out group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5"
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
