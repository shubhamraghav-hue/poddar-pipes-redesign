"use client";

import { useEffect, useRef, useState } from "react";
import { Handshake } from "lucide-react";
import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { products } from "@/lib/data/products";
import { showcaseCategories, type ShowcaseCategory } from "@/lib/data/productShowcase";
import { PartnerLink } from "@/components/enquiry/EnquiryProvider";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { cn } from "@/lib/utils";
import { keepScrollOnNextNavigation, scrollToElement } from "@/hooks/useLenis";
import { PRODUCT_FOCUS_EVENT, PRODUCT_FOCUS_HASH } from "@/lib/productFocus";
import { productDetails } from "@/lib/data/productDetails";
import { ProductDetailSections } from "@/components/products/ProductDetailSections";
import { hasOverlays, localizeList, type Overlay } from "@/lib/i18n/localize";
import { productShowcaseHi } from "@/lib/data/hi/productShowcase";
import { productDetailsHi } from "@/lib/data/hi/productDetails";

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
 * One card per category, not a product grid. Each category has its own URL,
 * /products/<id> (SEO-003): the pills are links to it and the URL follows the
 * selection; /products?category=<id> 308s there. Search (the mock's box, no extra results UI) selects the
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
function matchCategory(
  query: string,
  current: CategoryId,
  overlay?: Overlay<ShowcaseCategory>
): CategoryId | null {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return current;
  const hits = (...texts: string[]) => {
    const hay = texts.join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  };
  let best: { id: CategoryId; score: number } | null = null;
  for (const cat of showcaseCategories) {
    // On a translated page the translated tagline and H1 match too (English
    // still does), so a Hindi query finds its range.
    const o = overlay?.[cat.id];
    const local = o ? [o.tagline ?? "", o.h1 ?? ""] : [];
    let score = hits(cat.label, cat.id, cat.tagline, ...local) ? 3 : 0;
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
  const locale = useLocale();
  const showcaseOverlay = hasOverlays(locale) ? productShowcaseHi : undefined;

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
    const hit = matchCategory(initialQuery, active, showcaseOverlay);
    if (hit) setActive(hit);
    else setNoMatch(true);
    // Mount only: later changes go through the handlers below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each range has its own URL, /products/<id> (SEO-003); `?q=` rides along
  // while searching. Client navigation with `scroll: false`, so switching
  // feels as instant as the old in-page state change.
  function syncUrl(category: CategoryId, q: string, mode: "push" | "replace") {
    const path = `/products/${category}`;
    keepRangeScroll(category);
    router[mode](q.trim() ? `${path}?q=${encodeURIComponent(q.trim())}` : path, { scroll: false });
  }

  // Switching range must never move the page (client deck 2026-10-22, slide
  // 2216:15199). Whenever the URL is about to change path — INCLUDING the
  // already-selected pill on /products, which still navigates to
  // /products/<default> — tell the route-change reset to keep the position.
  function keepRangeScroll(category: CategoryId) {
    if (!window.location.pathname.endsWith(`/products/${category}`)) keepScrollOnNextNavigation();
  }

  // The pills are real links (crawlable, open-in-new-tab); this only updates
  // the card immediately while the link navigates.
  function selectCategory(id: CategoryId) {
    setActive(id);
    setQuery("");
    setNoMatch(false);
  }

  function onQuery(next: string) {
    setQuery(next);
    const hit = matchCategory(next, active, showcaseOverlay);
    setNoMatch(hit === null);
    const nextActive = hit ?? active;
    if (hit) setActive(hit);
    // `replace`, not `push`: one history entry per keystroke made Back
    // useless.
    syncUrl(nextActive, next, "replace");
  }

  const cat = localizeList(showcaseCategories, showcaseOverlay, "id").find((c) => c.id === active)!;

  const enDetail = productDetails[active];
  const detail = enDetail && hasOverlays(locale) ? { ...enDetail, ...productDetailsHi[active] } : enDetail;

  return (
    <>
    <section className="bg-[#f5f5f5] py-16 md:py-[120px] lg:py-[180px]">
      {/* No small-screen frames exist for this page, so the mock's 1512
          spacing (180 top/bottom) is held only from `lg`; tablets get a
          stepped-down scale, not desktop-sized gaps. */}
      <div className="container-figma">
        {/* The page's H1: the selected range's name (SEO-003). Screen-reader
            only — the visible name is the range card's wordmark image. */}
        <h1 className="sr-only">{cat.h1}</h1>
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
          <div role="group" aria-label={t("categoryGroupAria")} className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {showcaseCategories.map((c) => {
              const on = c.id === active;
              return (
                // Switching ranges here does NOT scroll: the reader is already
                // at the pills (client deck 2026-10-22, slide 2216:15199 — the
                // landing scroll is only for links from the menu, footer and
                // home cards). Plain range URL, no `#range`, and the
                // route-change reset is told to keep the position.
                <Link
                  key={c.id}
                  href={`/products/${c.id}`}
                  scroll={false}
                  aria-current={on ? "page" : undefined}
                  onClick={() => {
                    keepRangeScroll(c.id);
                    selectCategory(c.id);
                  }}
                  className={cn(
                    "flex h-[46px] touch-manipulation select-none items-center justify-center rounded-full px-3 type-button font-semibold sm:px-6 transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.97]",
                    on
                      ? "bg-[#171796] text-white shadow-[inset_0_0_0_1.2px_#171796]"
                      : "text-[#171796] shadow-[inset_0_0_0_1.2px_#171796] hover:bg-[#171796]/[0.06]"
                  )}
                >
                  <span className={CAP_TRIM}>{c.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Phones / tablets: search ABOVE the pills (client deck slide
              2246:16567); beside them, on the right, from `lg`. */}
          <div className="order-first w-full lg:order-none lg:w-[360px]">
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
const PHOTO_SIZES = "(min-width: 1512px) 1212px, (min-width: 640px) 92vw, 100vw";
const PHOTO_CLASS =
  "absolute inset-0 size-full max-sm:hidden object-cover object-[50%_100%] sm:object-[50%_var(--py-sm)] lg:object-[50%_var(--py-lg)]";

/**
 * A range with its own landscape shot for the desktop card (TANK — Figma
 * 1858:11864, 4096x2286, centred in the 1212x650 card). ART DIRECTION with
 * <picture>: the browser picks ONE source by width and downloads only that —
 * two next/images with one hidden by CSS made phones fetch the 351KB wide
 * shot too. From `lg` the wide source wins and is centred (--py-lg: 50%).
 */
function ArtDirectedPhoto({ cat }: { cat: ShowcaseCategory }) {
  const common = { alt: cat.photoAlt, fill: true, quality: 90 } as const;
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ ...common, src: cat.photoWide!, sizes: "(min-width: 1512px) 1212px, 92vw" });
  const { props: rest } = getImageProps({ ...common, src: cat.photo, sizes: PHOTO_SIZES });
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={wideSrcSet} sizes="(min-width: 1512px) 1212px, 92vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps supplies src/srcSet/alt */}
      <img {...rest} className={PHOTO_CLASS} style={{ ...rest.style, ["--py-lg" as string]: "50%" }} />
    </picture>
  );
}

function ShowcaseCard({ cat }: { cat: ShowcaseCategory }) {
  return (
    <div
      aria-live="polite"
      className="@container relative -mx-6 mt-6 aspect-[402/580] w-[calc(100%+3rem)] overflow-hidden bg-[#0b0b52] sm:mx-0 sm:aspect-[4/3] sm:w-full sm:rounded-[25px] sm:bg-[#0b1150] md:mt-10 lg:mt-[60px] lg:aspect-[1212/650]"
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
          {cat.photoWide ? <ArtDirectedPhoto cat={cat} /> : (
            <Image
              src={cat.photo}
              alt={cat.photoAlt}
              fill
              // No `priority`: since ProductsHero went in above it, this card
              // sits below the fold, and preloading it competed with the hero's
              // own images for first paint.
              quality={90}
              sizes={PHOTO_SIZES}
              className={PHOTO_CLASS}
            />
          )}
          {/* PHONES — Figma "product card/mobile" (2246:15817, client deck
              2026-10-22 slide 2246:15511): a full-bleed 402x580 navy panel,
              square-cornered, with the landscape "full card" shot 496x265 at
              (-94, 250) and a 38px navy fade on its top and bottom edges. */}
          <div aria-hidden="true" className="absolute left-[-23.38%] top-[43.1%] h-[45.69%] w-[123.38%] sm:hidden">
            <Image src={cat.photoWide ?? cat.photo} alt="" fill quality={90} sizes="124vw" className="object-cover" />
            <div className="absolute inset-x-0 top-0 h-[14.34%] bg-gradient-to-b from-[#0b0b52] to-[#0b0b52]/0" />
            <div className="absolute inset-x-0 bottom-0 h-[14.34%] bg-gradient-to-t from-[#0b0b52] to-[#0b0b52]/0" />
          </div>
          {/* Tablets: navy from the top, over the spotlight. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[55%] max-sm:hidden lg:hidden"
            style={{ background: "linear-gradient(to bottom, rgba(9,14,66,0.82) 0%, rgba(9,14,66,0.45) 45%, rgba(9,14,66,0) 100%)" }}
          />
          {/* Desktop: no overlay. The Figma "full card" export (1979:32767
              and siblings) already carries its navy wash. */}

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
            className="absolute left-[7.46%] right-6 top-[60px] sm:left-6 sm:top-7 md:left-[var(--inset)] md:right-auto md:top-[60px] lg:left-[var(--inset-cq)] lg:top-[4.95cqw]"
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
              className="h-[68px] w-auto sm:h-[60px] md:h-[76px] lg:h-[7.51cqw]"
            />
            {/* Tablet (640–1023): a narrow 240px column — the tanks rise into the
                top-right of the 4:3 crop and a wider tagline ran over them. */}
            <p className="mt-3 max-w-[173px] type-sub font-semibold uppercase text-[#a4a4a4] sm:max-w-[240px] md:mt-4 lg:mt-[1.57cqw] lg:max-w-[20.96cqw] lg:text-[length:1.65cqw]">
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
          <h2 className="type-sub font-semibold uppercase text-[#606060]">
            {t("partnerHeading", { name: t("partnerRangeName", { label: cat.label }) })}
          </h2>
          <p className="mt-1.5 type-body text-[#606060] md:mt-2">
            {t("partnerDesc")}
          </p>
        </div>
      </div>
      <PartnerLink
        preset={{ message: t("partnerPresetMessage", { label: cat.label }) }}
        className="group flex h-12 shrink-0 touch-manipulation select-none items-center justify-center gap-[5px] whitespace-nowrap rounded-full bg-[#171796] px-[21px] text-[17px] font-medium text-[#fbfbfb] transition-[background-color,scale] duration-[120ms] ease-out hover:bg-[#121278] active:scale-[0.98] sm:self-start lg:self-auto"
      >
        {/* Figma "header button 4": 25px handshake, 16.95px Medium label, not caps. */}
        <Handshake aria-hidden="true" strokeWidth={1.5} className="size-[25px] shrink-0 transition-transform duration-200 ease-out group-hover:-rotate-12" />
        <span className={CAP_TRIM}>{t("becomePartner")}</span>
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


