"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { products } from "@/lib/data/products";
import { showcaseCategories, type ShowcaseCategory } from "@/lib/data/productShowcase";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { cn } from "@/lib/utils";

/**
 * /products — Figma "product pages" (node 1530:7102), frame "Frame 132" of
 * each of the six category variants. Measurements below are the mock's, at
 * 1512, from the section top (which sits under the 80px navbar):
 *
 *   heading   y120, 60px Light `#606060` / Bold `#171796`, leading 1.02
 *   copy      y270, 16px `#606060`, 398 wide
 *   pills     y429, h44, 8px apart; active navy fill, rest `#b0b0b0` ring
 *   search    right-aligned, 360x44, `#b0b0b0` ring
 *   card      y500, 1212x650, radius 25
 *   banner    y1190, 1212x120, radius 25, `#b0b0b0` ring
 *   bottom    120 under the banner
 *
 * One card per category, not a product grid. The card does not link anywhere
 * for now: the category detail pages are switched off (see the redirects in
 * next.config.ts). Search (the mock's box, no extra results UI) selects the
 * category that best matches what is typed.
 */

type CategoryId = ShowcaseCategory["id"];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Which category a query points at. Matching is by WORDS, every word in any
 * order — "hot water" finds CPVC's "hot and cold water", which a whole-phrase
 * `includes` missed. A hit on the category itself (pill label, id, tagline)
 * outranks hits on its products' names, descriptions and applications; ties
 * keep the current category so the card does not flicker while someone types.
 */
function matchCategory(query: string, current: CategoryId): CategoryId | null {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return current;
  const hits = (...texts: string[]) => {
    const hay = texts.join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  };
  let best: { id: CategoryId; score: number } | null = null;
  for (const cat of showcaseCategories) {
    let score = hits(cat.label, cat.id, cat.tagline) ? 3 : 0;
    for (const p of products) {
      if (p.category === cat.id && hits(p.name, p.shortDescription, ...p.applications)) score += 1;
    }
    if (score === 0) continue;
    if (!best || score > best.score || (score === best.score && cat.id === current)) {
      best = { id: cat.id, score };
    }
  }
  return best?.id ?? null;
}

export function ProductShowcase({
  initialCategory,
  initialQuery = "",
}: {
  initialCategory?: string;
  initialQuery?: string;
}) {
  const t = useTranslations("products");
  const router = useRouter();
  const pathname = usePathname();

  const fallback = showcaseCategories[0].id;
  const valid = (id?: string) => showcaseCategories.some((c) => c.id === id);
  const [active, setActive] = useState<CategoryId>(
    valid(initialCategory) ? (initialCategory as CategoryId) : fallback
  );
  const [query, setQuery] = useState(initialQuery);
  const [noMatch, setNoMatch] = useState(false);

  // Follow the URL when it changes underneath us — a footer or homepage link
  // to `/products?category=…` while already on /products is a same-route
  // navigation, so this component stays mounted and `useState`'s initial value
  // is never re-read. Without this the URL said SWR and the card stayed CPVC.
  // (React's "adjust state when a prop changes" pattern: set during render,
  // no effect, no extra paint with the stale card.)
  const [seenCategory, setSeenCategory] = useState(initialCategory);
  if (initialCategory !== seenCategory) {
    setSeenCategory(initialCategory);
    if (valid(initialCategory)) {
      setActive(initialCategory as CategoryId);
      setQuery(initialQuery);
      setNoMatch(false);
    }
  }

  // `?q=` arriving from the WebSite SearchAction (see the locale layout)
  // should land on the matching category, as typing would.
  useEffect(() => {
    if (!initialQuery) return;
    const hit = matchCategory(initialQuery, active);
    if (hit) setActive(hit);
    else setNoMatch(true);
    // Mount only: later changes go through the handlers below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncUrl(category: CategoryId, q: string, mode: "push" | "replace") {
    const params = new URLSearchParams();
    params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    router[mode](`${pathname}?${params.toString()}`, { scroll: false });
  }

  function selectCategory(id: CategoryId) {
    setActive(id);
    setQuery("");
    setNoMatch(false);
    syncUrl(id, "", "push");
  }

  function onQuery(next: string) {
    setQuery(next);
    const hit = matchCategory(next, active);
    setNoMatch(hit === null);
    const nextActive = hit ?? active;
    if (hit) setActive(hit);
    // `replace`, not `push`: one history entry per keystroke made Back
    // useless.
    syncUrl(nextActive, next, "replace");
  }

  const cat = showcaseCategories.find((c) => c.id === active)!;

  return (
    <section className="mt-20 bg-[#f5f5f5] pb-20 pt-16 md:pb-24 md:pt-24 lg:pb-[120px] lg:pt-[120px]">
      {/* No small-screen frames exist for this page, so the mock's 1512
          spacing (120 top/bottom, 121 above the pills) is held only from
          `lg`; tablets get a stepped-down scale, not desktop-sized gaps. */}
      <div className="container-figma">
        <h1 className="font-display text-[min(36px,9.4vw)] uppercase leading-[1.02] tracking-[0.2088px] sm:text-5xl md:text-[60px] md:tracking-[0.32px]">
          <span className="block font-light text-[#606060]">{t("heroLine1")}</span>
          <span className="block font-bold text-[#171796]">{t("heroBold")}</span>
        </h1>
        <p className="mt-5 max-w-[398px] text-[15px] leading-[1.3] text-[#606060] md:mt-7 md:text-[16px] md:leading-[1.2]">
          {t("heroDesc")}
        </p>

        {/* Pills left, search right from `lg`; stacked below it. */}
        <div className="mt-10 flex flex-col gap-5 md:mt-16 lg:mt-[121px] lg:flex-row lg:items-center lg:justify-between">
          {/* `px-5`: Figma's pills are 19px padding + a 1px border; the ring
              here is an inset shadow that takes no space, so the padding
              carries the 20 (otherwise each pill was 2px narrow and the row
              drifted 10px short by TANK). */}
          {/* Phones: an even 3x2 grid — free-wrapping gave rows of uneven
              pill widths with a ragged right edge. One row from `sm`. */}
          <div role="group" aria-label="Product category" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {showcaseCategories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => selectCategory(c.id)}
                  className={cn(
                    "flex h-11 touch-manipulation select-none items-center justify-center rounded-full px-3 text-[18px] sm:px-5 transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.97]",
                    on
                      ? "bg-[#171796] font-semibold text-white"
                      : "font-normal text-[#606060] shadow-[inset_0_0_0_1px_#b0b0b0] hover:text-[#171796] hover:shadow-[inset_0_0_0_1px_#171796]"
                  )}
                >
                  <span className={CAP_TRIM}>{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[360px]">
            <label className="flex h-11 w-full items-center gap-3 rounded-full px-[14px] shadow-[inset_0_0_0_1px_#b0b0b0] transition-shadow duration-200 focus-within:shadow-[inset_0_0_0_1.5px_#171796]">
              <SearchIcon className="shrink-0 text-[#606060]" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchAria")}
                aria-describedby={noMatch ? "showcase-nomatch" : undefined}
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-[#4a4a4a] placeholder:text-[#606060] focus:outline-none"
              />
            </label>
            {noMatch && (
              <p id="showcase-nomatch" role="status" className="mt-2 px-[14px] text-[13px] text-[#606060]">
                {t("noResults")}
              </p>
            )}
          </div>
        </div>

        {/* With no match the last card stays (nothing to swap to) but is
            dimmed, so it doesn't read as the search result. */}
        <div className={cn("transition-opacity duration-200", noMatch && "opacity-40")}>
          <ShowcaseCard cat={cat} />
        </div>
        <QuoteBanner cat={cat} />
      </div>
    </section>
  );
}

/**
 * The category card (Figma "Frame 140").
 *
 * FROM `lg` it is the mock: the photo carries the whole card at 1212/650, a
 * navy wash over its left 600px (35% at the edge, clear at 600) holds the
 * wordmark and tagline over the dark backdrop.
 *
 * BELOW `lg` the copy gets its own band. The mock has no small-screen frame,
 * and at 375 the card shows a portrait slice of a landscape photo — the
 * tagline ran straight across the bright pipes ("Reliable performance for hot
 * and cold water" over cream CPVC, unreadable). At 768 the same thing happens
 * at full type size. So the copy sits in a band of `#141b28` — the photos'
 * own backdrop colour, sampled from all six (#121926–#1c2335) — and the photo
 * fills the rest, fading up into the band so the seam disappears.
 *
 * Not a link while the category pages are off — so no hover zoom either,
 * which would promise a click that goes nowhere. Swapping category
 * cross-fades the whole layer, so it reads as the same card showing a
 * different range.
 */
function ShowcaseCard({ cat }: { cat: ShowcaseCategory }) {
  return (
    <div
      aria-live="polite"
      className="@container relative mt-6 h-[440px] overflow-hidden rounded-[25px] bg-[#141b28] md:mt-[27px] md:h-[590px] lg:h-auto lg:aspect-[1212/650] lg:bg-[#0b0b52]"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={cat.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {/* Photo: under the band below `lg` (top 150 phone / 230 tablet — just past
              the tagline's last line), the whole card
              from `lg`. */}
          {/* Below `lg` the photo is MASKED to transparent at its top edge
              rather than covered by a band-coloured overlay: the overlay left
              a visible 1px seam where the composited photo layer met the
              card's rounded clip. */}
          <div className="absolute inset-x-0 bottom-0 top-[150px] [mask-image:linear-gradient(to_bottom,transparent,#000_96px)] md:top-[230px] lg:top-0 lg:[mask-image:none]">
            <Image
              src={cat.photo}
              alt={cat.photoAlt}
              fill
              priority
              sizes="(min-width: 1512px) 1212px, 100vw"
              className="object-cover object-[65%_50%] lg:object-center"
            />
            {/* From `lg`: Figma "Rectangle 26", 600px wide, navy 35% → clear. */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-[49.5%] lg:block"
              style={{ background: "linear-gradient(to right, rgba(11,11,82,0.35), rgba(11,11,82,0))" }}
            />
          </div>

          {/* Wordmark at Figma's x60 (x64 for AGRI/TANK), y60; tagline 16
              under it, 24px `#d9d9d9`, 254 wide.

              From `lg` every one of those is a FRACTION OF THE CARD WIDTH
              (`cqw`, the card is the container): 60/1212 = 4.95cqw, the 91px
              wordmark 7.51cqw, 24px type 1.98cqw, 254 wide 20.96cqw. Fixed px
              kept the copy full-size while the card shrank to 929 at 1024, so
              it claimed more of the photo than the mock — SWR's "soil" ran
              into the top pipe. In cqw the composition is the mock's at every
              width, and at 1212 the values come out as Figma's px. */}
          <div
            className="absolute left-6 right-6 top-7 md:left-[var(--inset)] md:right-auto md:top-[60px] lg:left-[var(--inset-cq)] lg:top-[4.95cqw]"
            style={{
              ["--inset" as string]: `${cat.wordmarkInset}px`,
              ["--inset-cq" as string]: `${((cat.wordmarkInset / 1212) * 100).toFixed(2)}cqw`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an SVG
                wordmark at its exported size; next/image adds nothing here */}
            <img
              src={cat.wordmark}
              alt=""
              width={cat.wordmarkWidth}
              height={91}
              className="h-[60px] w-auto md:h-[91px] lg:h-[7.51cqw]"
            />
            <p className="mt-3 text-[19px] leading-[1.15] text-[#d9d9d9] md:mt-4 md:max-w-[340px] md:text-[24px] md:leading-[1.1] lg:mt-[1.32cqw] lg:max-w-[20.96cqw] lg:text-[length:1.98cqw]">
              {cat.tagline}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* The product name for assistive tech — the wordmark is an image.
          `aria-live` on the card announces it when a pill or search swaps it. */}
      <span className="sr-only">{cat.label}</span>
    </div>
  );
}

/**
 * Figma "Frame 141"'s strip — icon tile, title and copy left, navy pill right
 * — repurposed as a QUOTE for the selected category (the mock's Download
 * Catalogue was dropped: the CTA band right under it already offers the
 * catalogue). It opens the global enquiry pop-up pre-filled with the range, so
 * it is the specific ask next to that band's general "Start a Conversation".
 * Copy reuses the product pages' translated `quoteHeading`/`quoteDesc`.
 *
 * The strip layout holds from `lg`; below it the button drops under the copy
 * (full width on phones, its own width from `sm`) — at 768 the side-by-side
 * row squeezed the title into a 170px column.
 */
function QuoteBanner({ cat }: { cat: ShowcaseCategory }) {
  const t = useTranslations("products");
  return (
    <div className="mt-8 flex flex-col gap-5 rounded-[25px] p-4 shadow-[inset_0_0_0_1px_#b0b0b0] sm:p-6 md:mt-10 lg:min-h-[120px] lg:flex-row lg:items-center lg:justify-between lg:py-0 lg:pl-[19px] lg:pr-10">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#171796]/10 text-[#14137e] sm:size-16 sm:rounded-[20px] md:size-20"
        >
          <QuoteIcon />
        </span>
        <div>
          <h2 className="text-[17px] font-medium leading-tight text-[#606060] sm:text-[19px] md:text-[24px] md:leading-none">
            {t("quoteHeading", { name: cat.label })}
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.3] text-[#606060] md:mt-2 md:text-[16px] md:leading-[1.2]">
            {t("quoteDesc")}
          </p>
        </div>
      </div>
      <EnquiryLink
        preset={{
          enquiryType: "Sales & Pricing",
          message: `I'd like a quote for Poddar ${cat.label} — sizes and quantities below.`,
        }}
        className="group flex h-12 shrink-0 touch-manipulation select-none items-center justify-center gap-[10px] whitespace-nowrap rounded-full bg-[#171796] px-4 text-[16px] font-semibold uppercase tracking-[0.36px] text-white transition-[background-color,scale] duration-200 ease-out hover:bg-[#0b0b52] active:scale-[0.98] sm:self-start sm:px-6 sm:text-[18px] lg:self-auto"
      >
        <span className={CAP_TRIM}>{t("requestQuote")}</span>
        <ArrowIcon className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      </EnquiryLink>
    </div>
  );
}

/* SearchIcon is exported from the mock (1530:7110); path verbatim, stroke →
   currentColor. ArrowIcon/QuoteIcon are drawn to match its stroke style. */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333V7.33333" />
        <path d="M14 14L11.1333 11.1333" />
      </g>
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.33333 8H12.6667" />
        <path d="M8.66667 4L12.6667 8L8.66667 12" />
      </g>
    </svg>
  );
}

/* Speech bubble with three lines — drawn to sit beside the mock's document
   icon (24px tall, 1.5 stroke, round caps). */
function QuoteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.25 3.75H3.75C2.92157 3.75 2.25 4.42157 2.25 5.25V16.5C2.25 17.3284 2.92157 18 3.75 18H7.5V21.75L12 18H20.25C21.0784 18 21.75 17.3284 21.75 16.5V5.25C21.75 4.42157 21.0784 3.75 20.25 3.75Z" />
        <path d="M6.75 8.25H17.25" />
        <path d="M6.75 11.25H17.25" />
        <path d="M6.75 14.25H12.75" />
      </g>
    </svg>
  );
}
