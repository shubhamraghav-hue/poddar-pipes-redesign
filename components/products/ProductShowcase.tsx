"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { products } from "@/lib/data/products";
import { showcaseCategories, type ShowcaseCategory } from "@/lib/data/productShowcase";
import { PartnerLink } from "@/components/enquiry/EnquiryProvider";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/hooks/useLenis";
import { PRODUCT_FOCUS_EVENT, PRODUCT_FOCUS_HASH } from "@/lib/productFocus";
import { productDetails } from "@/lib/data/productDetails";
import { ProductDetailSections } from "@/components/products/ProductDetailSections";

/**
 * /products — Figma "CPVC Products Page - 2nd draft" (node 1731:7511),
 * section "product" (1731:7512). The heading moved up into the dark hero
 * (ProductsHero). Measurements are the mock's, at 1512, from the section top:
 *
 *   pills     y180, h46, 12px apart; active navy fill, rest a 1.2px navy
 *             ring with navy SemiBold type
 *   search    right-aligned, 360x46, `#b0b0b0` ring
 *   card      y286 (60 under the pills), 1212x650, radius 25
 *   banner    y976 (40 under the card), 1212x120, radius 25, `#b0b0b0` ring
 *   bottom    180 under the banner
 *
 * Then, for a range that has them (lib/data/productDetails.ts — only CPVC so
 * far), the "What is" / "Why" sections follow the selected range.
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

  // Arriving from a menu / footer / home-card link (`…?category=x#range`, see
  // lib/productFocus.ts): bring the category pills up under the navbar with
  // the range already selected. Runs on mount (from another page), whenever
  // the category changes in the URL (already on /products), and on the focus
  // event (a link to the range that is already showing).
  const rangeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let timer: number | undefined;
    const focusRange = () => {
      window.clearTimeout(timer);
      // A beat for the mobile menu to close and release its scroll lock —
      // Lenis ignores scrollTo while stopped.
      timer = window.setTimeout(() => {
        if (rangeRef.current) scrollToElement(rangeRef.current);
        // Drop the hash (so a reload or a shared link doesn't jump again) only
        // AFTER scrolling: stripping it on mount lost it to StrictMode's
        // mount → unmount → mount in development, and a same-URL click can
        // leave "#range#range" behind.
        if (window.location.hash.startsWith(PRODUCT_FOCUS_HASH)) {
          window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        }
      }, 120);
    };
    if (window.location.hash.startsWith(PRODUCT_FOCUS_HASH)) focusRange();
    window.addEventListener(PRODUCT_FOCUS_EVENT, focusRange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PRODUCT_FOCUS_EVENT, focusRange);
    };
  }, [initialCategory]);

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

  const detail = productDetails[active];

  return (
    <>
    <section className="bg-[#f5f5f5] py-16 md:py-[120px] lg:py-[180px]">
      {/* No small-screen frames exist for this page, so the mock's 1512
          spacing (180 top/bottom) is held only from `lg`; tablets get a
          stepped-down scale, not desktop-sized gaps. */}
      <div className="container-figma">
        {/* Pills left, search right from `lg`; stacked below it. */}
        {/* `rangeRef` + `scroll-mt-24`: where menu links land (pills just
            under the 80px navbar). */}
        <div
          ref={rangeRef}
          className="flex scroll-mt-24 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* `px-6`: Figma's pills are 24px padding inside a 1.2px border;
              the ring here is an inset shadow that takes no space. */}
          {/* Phones: an even 3x2 grid — free-wrapping gave rows of uneven
              pill widths with a ragged right edge. One row from `sm`. */}
          <div role="group" aria-label="Product category" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {showcaseCategories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => selectCategory(c.id)}
                  className={cn(
                    "flex h-[46px] touch-manipulation select-none items-center justify-center rounded-full px-3 text-[18px] font-semibold tracking-[0.36px] sm:px-6 transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.97]",
                    on
                      ? "bg-[#171796] text-white shadow-[inset_0_0_0_1.2px_#171796]"
                      : "text-[#171796] shadow-[inset_0_0_0_1.2px_#171796] hover:bg-[#171796]/[0.06]"
                  )}
                >
                  <span className={CAP_TRIM}>{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[360px]">
            <label className="flex h-[46px] w-full items-center gap-3 rounded-full px-[14px] shadow-[inset_0_0_0_1px_#b0b0b0] transition-shadow duration-200 focus-within:shadow-[inset_0_0_0_1.5px_#171796]">
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
    {detail && <ProductDetailSections key={active} detail={detail} />}
    </>
  );
}

/**
 * The category card (Figma "Frame 140"), with the client's portrait product
 * photography (2026-10-12): navy studio, spotlight from the top-left, the
 * product at the bottom-right. One image per range, three crops:
 *
 *   < 640    the WHOLE portrait (2:3), capped at 620px tall on large phones
 *            with the bottom (the product) kept — the shot is made for this.
 *   640–1023 4:3, focused on the product (`photoY.sm`).
 *   ≥ 1024   Figma's 1212:650, focused on the product (`photoY.lg`); pipes
 *            sit right of centre, so the left of the card stays open for the
 *            wordmark and tagline, as in the mock.
 *
 * The copy sits top-left, over the spotlight — the brightest part of the shot
 * — so a navy wash runs down from the top (phones/tablets) or in from the
 * left (desktop, Figma "Rectangle 26") to keep the white type readable.
 *
 * Not a link while the category pages are off — so no hover zoom either.
 * Swapping category cross-fades the whole layer.
 */
function ShowcaseCard({ cat }: { cat: ShowcaseCategory }) {
  return (
    <div
      aria-live="polite"
      className="@container relative mt-6 aspect-[1341/2000] max-h-[620px] w-full overflow-hidden rounded-[25px] bg-[#0b1150] sm:aspect-[4/3] sm:max-h-none md:mt-10 lg:mt-[60px] lg:aspect-[1212/650]"
      style={{
        ["--py-sm" as string]: `${cat.photoY.sm}%`,
        ["--py-lg" as string]: `${cat.photoY.lg}%`,
      }}
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
          <Image
            src={cat.photo}
            alt={cat.photoAlt}
            fill
            // No `priority`: since ProductsHero went in above it, this card
            // sits below the fold, and preloading it competed with the hero's
            // own images for first paint.
            quality={90}
            sizes="(min-width: 1512px) 1212px, (min-width: 640px) 92vw, 100vw"
            className="object-cover object-[50%_100%] sm:object-[50%_var(--py-sm)] lg:object-[50%_var(--py-lg)]"
          />
          {/* Phones/tablets: navy from the top, over the spotlight. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[55%] lg:hidden"
            style={{ background: "linear-gradient(to bottom, rgba(9,14,66,0.82) 0%, rgba(9,14,66,0.45) 45%, rgba(9,14,66,0) 100%)" }}
          />
          {/* Desktop: Figma "Rectangle 26" — navy in from the left, deepened
              a little for the brighter spotlight in these shots. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-[55%] lg:block"
            style={{ background: "linear-gradient(to right, rgba(9,14,66,0.7) 0%, rgba(9,14,66,0.35) 55%, rgba(9,14,66,0) 100%)" }}
          />

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
              className="h-[60px] w-auto md:h-[76px] lg:h-[7.51cqw]"
            />
            {/* Tablet (640–1023): a narrow 240px column — the tanks rise into the
                top-right of the 4:3 crop and a wider tagline ran over them. */}
            <p className="mt-3 text-[19px] leading-[1.15] text-[#d9d9d9] sm:max-w-[240px] md:mt-4 md:text-[22px] md:leading-[1.1] lg:mt-[1.32cqw] lg:max-w-[20.96cqw] lg:text-[length:1.98cqw]">
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
 * Partner copy (client 2026-10-09: "Request a Quote" → "Become a Partner"),
 * opening the dealers & distributors form with the range named.
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
          className="relative size-12 shrink-0 rounded-[16px] bg-[#171796]/10 sm:size-16 sm:rounded-[20px] md:size-20"
        >
          {/* Figma's chatbox (39px at 20,23 of the 80px tile) and its three
              lines, flipped vertically as the mock draws them. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- exported SVG icon */}
          <img src="/products/icons/chatbox.svg" alt="" width={39} height={39} className="absolute left-[25%] top-[28.75%] size-[48.75%]" />
          {/* eslint-disable-next-line @next/next/no-img-element -- exported SVG icon */}
          <img src="/products/icons/chatbox-lines.svg" alt="" width={19.5} height={10.5} className="absolute left-[35.94%] top-[41.09%] h-[13.125%] w-[24.375%] -scale-y-100" />
        </span>
        <div>
          <h2 className="text-[17px] font-medium leading-tight text-[#606060] sm:text-[19px] md:text-[24px] md:leading-none">
            {t("partnerHeading", { name: `Poddar ${cat.label}` })}
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.3] text-[#606060] md:mt-2 md:text-[16px] md:leading-[1.2]">
            {t("partnerDesc")}
          </p>
        </div>
      </div>
      <PartnerLink
        preset={{ message: `Interested in stocking Poddar ${cat.label}.` }}
        className="group flex h-12 shrink-0 touch-manipulation select-none items-center justify-center gap-[10px] whitespace-nowrap rounded-full bg-[#171796] px-4 text-[16px] font-semibold uppercase tracking-[0.36px] text-white transition-[background-color,scale] duration-200 ease-out hover:bg-[#0b0b52] active:scale-[0.98] sm:self-start sm:px-6 sm:text-[18px] lg:self-auto"
      >
        <span className={CAP_TRIM}>{t("becomePartner")}</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- exported SVG icon */}
        <img src="/products/icons/arrow.svg" alt="" width={16} height={16} className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      </PartnerLink>
    </div>
  );
}

/* SearchIcon is exported from the mock (1530:7110); path verbatim, stroke →
   currentColor. */

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


