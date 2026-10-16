"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProductDetail, WhyCard } from "@/lib/data/productDetails";

/**
 * The per-range sections under the /products range card — Figma "<range>
 * Products Page - 2nd draft" (CPVC 1731:7511, uPVC 1809:9139, UGD 1809:9345),
 * "details" and "product details". Content comes from
 * lib/data/productDetails.ts; ProductShowcase renders these only for a range
 * that has an entry.
 */
export function ProductDetailSections({ detail }: { detail: ProductDetail }) {
  return (
    <>
      <WhatIs detail={detail.whatIs} />
      <Why name={detail.why.name} cards={detail.why.cards} />
    </>
  );
}

/**
 * "What is <range>?" — navy, 780 tall at 1512. Copy at x150/y150: 48px
 * heading (the "Why" heading's size; Figma 60) ("What is" / name; TANK's frame says "Poddar" / "Tank" — `lead`),
 * 24px body 551 wide (TANK 505 — `bodyW`), 20 under it.
 *
 * The render is three layers on the right, exactly as the mock stacks them:
 * the full render (backdrop + floor reflection), a navy wash in from the left
 * that melts its edge into the band (AGRI's covers only 74% of the box —
 * `washW`), then the subject alone on top so the wash never dims it. The box
 * is the image's own ratio, flush right; its size and vertical centre come
 * from the data (`art`) and the band crops it. Below 1512 the width scales
 * with the viewport (`w / 15.12` vw) but never so far that the box stops
 * covering the band's full height, and its top is clamped to keep it covering.
 *
 * BELOW `lg` the render drops under the copy and shows the SAME crop the
 * desktop band does: the art box cut to the band's 780px height (box ratio
 * w:780), with the image positioned where the band sits on it. Every range is
 * framed exactly as in its mock, and the subject is never cut — CPVC/uPVC
 * show 13-80% of the image height (molecule 20.5-75%), UGD 7-76% (30-68%),
 * AGRI 36-100% (55-85%), TANK 14-86% (25-79.5%); SWR's pipes run past the
 * frame in the mock too. Capped at 600 wide and centred, its side edges faded
 * out so the photo's backdrop never ends in a hard seam.
 */
function WhatIs({ detail }: { detail: ProductDetail["whatIs"] }) {
  const { w, h, centerY, washW = 1 } = detail.art;
  // Where the 780px band sits on the image, as an object-position: the band's
  // top in image space over the image's spare height.
  const bandTop = (h / 2 - 390 - centerY) / h;
  const posY = h > 780 ? (bandTop / (1 - 780 / h)) * 100 : 50;
  return (
    <section className="relative overflow-hidden bg-[#0b0b52] lg:h-[780px]">
      <div className="container-figma relative z-10 pt-20 md:pt-[120px] lg:pt-[150px]">
        {/* ONE size for every section heading on the product page (client,
            2026-10-16): this, "Why" below and the closing CTASection all run
            28 / 36 (sm) / 48px (md+) — CTASection's ramp, since it is shared
            site-wide. Figma set this one at 60px. */}
        <h2 className="font-display text-[28px] uppercase leading-[1.08] tracking-[0.32px] text-white sm:text-4xl md:text-[48px]">
          <span className="block font-light">{detail.lead ?? "What is"}</span>
          {/* `normal-case`: the range name keeps its own case — "uPVC", as
              the mocks set it, not "UPVC". */}
          <span className="block font-bold normal-case">{detail.name}</span>
        </h2>
        <p
          className="mt-5 text-[18px] leading-[1.3] text-white md:text-[24px] md:leading-[1.2]"
          style={{ maxWidth: detail.bodyW ?? 551 }}
        >
          {detail.body}
        </p>
      </div>

      <div
        className="relative mx-auto mt-6 aspect-[var(--art-m-ratio)] w-full max-w-[600px] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] lg:absolute lg:right-0 lg:top-[var(--art-top)] lg:mx-0 lg:mt-0 lg:aspect-[var(--art-ratio)] lg:h-auto lg:w-[var(--art-w)] lg:max-w-none lg:[mask-image:none]"
        style={
          {
            // Scales with the viewport below 1512, but never below the width
            // whose height still covers the 780 band (w * 780 / h) — at 1024
            // a plainly scaled box ended 37-108px short of the band's top or
            // bottom and showed the photo's edge.
            "--art-w": `clamp(${Math.ceil((w * 780) / h)}px, ${(w / 15.12).toFixed(4)}vw, ${w}px)`,
            "--art-h": `calc(var(--art-w) * ${(h / w).toFixed(5)})`,
            // Figma's centre (band middle + centerY), clamped so the box always
            // spans the band top to bottom. At 1512 this IS Figma's top.
            "--art-top": `clamp(calc(780px - var(--art-h)), calc(390px + ${centerY}px - var(--art-h) / 2), 0px)`,
            "--art-ratio": `${w} / ${h}`,
            "--art-m-ratio": `${w} / 780`,
            "--art-py": `${posY.toFixed(2)}%`,
          } as React.CSSProperties
        }
      >
        <Image
          src={detail.scene}
          alt=""
          fill
          quality={90}
          sizes="(min-width: 1024px) 54vw, (min-width: 600px) 600px, 100vw"
          className="object-cover object-[50%_var(--art-py)] lg:object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-[#0b0b52] to-[rgba(11,11,82,0)] lg:hidden"
        />
        <div
          aria-hidden="true"
          // 1px past the box's left edge: the box lands on fractional pixels,
          // and with the photo and this wash both anti-aliased on the SAME
          // edge, a hairline of photo showed through as a vertical seam.
          className="absolute inset-y-0 -left-px hidden bg-gradient-to-r from-[#0b0b52] to-[rgba(11,11,82,0)] lg:block"
          style={{ width: `calc(${(washW * 100).toFixed(3)}% + 1px)` }}
        />
        <Image
          src={detail.cutout}
          alt={detail.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 54vw, (min-width: 600px) 600px, 100vw"
          className="object-cover object-[50%_var(--art-py)] lg:object-center"
        />
      </div>
    </section>
  );
}

/**
 * "Why <range>?" — `#f5f5f5`, 150 top and bottom at 1512; 48px heading, the
 * cards 80 under it. 400x480 cards, 30 apart, radius 25, more of them than
 * the 1212 column holds, so the row bleeds off the right edge and scrolls
 * sideways — starting on the column's left edge (the padding below is the
 * container's gutter, or the centred 1212 column's offset on wide screens).
 *
 * Touch and trackpads scroll it natively (snap per card); a mouse can drag it,
 * since a plain mouse wheel has no sideways axis.
 */
function Why({ name, cards }: { name: string; cards: WhyCard[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0 || !rowRef.current) return;
    drag.current = { x: e.clientX, left: rowRef.current.scrollLeft, moved: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!drag.current || !row) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > 4) {
      drag.current.moved = true;
      row.setPointerCapture(e.pointerId);
      // Snap fights a dragged scrollLeft; it comes back on release and
      // settles the row on the nearest card.
      row.style.scrollSnapType = "none";
    }
    if (drag.current.moved) row.scrollLeft = drag.current.left - dx;
  }
  function endDrag() {
    if (rowRef.current) rowRef.current.style.scrollSnapType = "";
    drag.current = null;
  }

  return (
    <section className="bg-[#f5f5f5] py-20 md:py-[120px] lg:py-[150px]">
      <div className="container-figma">
        <h2 className="font-display text-[28px] uppercase leading-[1.08] tracking-[0.32px] text-[#606060] sm:text-4xl md:text-[48px]">
          <span className="block font-light">Why</span>
          <span className="block font-bold normal-case">{name}</span>
        </h2>
      </div>

      <div
        ref={rowRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [--g:24px] [scrollbar-width:none] md:mt-[60px] md:gap-[30px] md:[--g:40px] lg:mt-20 lg:cursor-grab lg:active:cursor-grabbing xl:[--g:150px] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: "max(var(--g), calc((100% - 1212px) / 2))",
          scrollPaddingInline: "max(var(--g), calc((100% - 1212px) / 2))",
        }}
      >
        {cards.map((card) => (
          <article
            key={card.title}
            className="@container relative aspect-[400/480] w-[min(400px,78vw)] shrink-0 snap-start overflow-hidden rounded-[25px] bg-[#0b0b52] select-none"
          >
            {card.image && card.crop && (
              <Image
                src={card.image}
                alt=""
                width={card.crop.width * 2}
                height={card.crop.height * 2}
                draggable={false}
                quality={90}
                // The photo is often WIDER than the card (up to 705/400), so
                // its size hint is the crop's own width — a flat card-width
                // hint served wide crops soft.
                sizes={`(min-width: 640px) ${card.crop.width}px, ${((card.crop.width / 400) * 78).toFixed(1)}vw`}
                className={`absolute max-w-none object-cover ${card.flipX ? "-scale-x-100" : ""}`}
                style={{
                  left: `${(card.crop.left / 400) * 100}%`,
                  top: `${(card.crop.top / 480) * 100}%`,
                  width: `${(card.crop.width / 400) * 100}%`,
                  height: `${(card.crop.height / 480) * 100}%`,
                }}
              />
            )}
            {/* The mock's 200px blurred, darkening footer (the uPVC/UGD
                frames; CPVC's was 280 at 10px blur — all ranges now share the
                newer one). The blur is faded in with a mask — at full strength
                from its top edge it cut a visible seam across the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[41.67%] backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[41.67%] bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.75)]"
            />
            {/* ONE LINE, as the uPVC/UGD frames set it: 21px Medium (5.25cqw
                of the 400px card) at x30 (7.5%), baseline box 28px off the
                bottom (7cqw). The longest title across all ranges, CPVC's
                "Self-Extinguishing and Fire Retardant", measures 15.16x its
                size = 318px at 21px, inside the 340px between the insets. In
                cqw so the narrower phone cards keep the same fit; a longer
                future title would need this size revisited. */}
            <h3 className="absolute bottom-[7cqw] left-[7.5%] right-[7.5%] whitespace-nowrap text-[5.25cqw] font-medium leading-[1.2] text-white [text-shadow:0_0_32px_rgba(0,0,0,0.35)]">
              {card.title}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
