"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProductDetail, WhyCard } from "@/lib/data/productDetails";

/**
 * The per-range sections under the /products range card — Figma "CPVC
 * Products Page - 2nd draft" (node 1731:7511), "details" (1731:7632) and
 * "product details" (1731:7639). Content comes from lib/data/productDetails.ts;
 * ProductShowcase renders these only for a range that has an entry.
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
 * "What is <range>?" — navy, 780 tall at 1512. Copy at x150/y150: 60px
 * heading, 24px body 551 wide, 20 under it.
 *
 * The molecule is three layers on the right, exactly as the mock stacks them:
 * the full render (backdrop + floor reflection), a navy wash in from the left
 * that melts its edge into the band, then the molecule alone on top so the
 * wash never dims it. The render box is 778x1160 (the image's own ratio),
 * flush right and centred 40px below the band's middle, so the band crops it.
 * Below `lg` the render drops under the copy as a 420px strip, washed from the
 * top instead.
 */
function WhatIs({ detail }: { detail: ProductDetail["whatIs"] }) {
  return (
    <section className="relative overflow-hidden bg-[#0b0b52] lg:h-[780px]">
      <div className="container-figma relative z-10 pt-20 md:pt-[120px] lg:pt-[150px]">
        <h2 className="font-display text-[min(36px,9.4vw)] uppercase leading-[1.02] tracking-[0.2088px] text-white sm:text-5xl md:text-[60px] md:tracking-[0.32px]">
          <span className="block font-light">What is</span>
          <span className="block font-bold">{detail.name}</span>
        </h2>
        <p className="mt-5 max-w-[551px] text-[18px] leading-[1.3] text-white md:text-[24px] md:leading-[1.2]">
          {detail.body}
        </p>
      </div>

      <div className="relative mt-6 h-[420px] w-full sm:h-[520px] lg:absolute lg:right-[-1px] lg:top-[calc(50%+40px)] lg:mt-0 lg:h-auto lg:w-[min(778px,51.45vw)] lg:-translate-y-1/2 lg:aspect-[778/1160]">
        <Image
          src={detail.scene}
          alt=""
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#0b0b52] to-[rgba(11,11,82,0)] lg:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-full bg-gradient-to-r from-[#0b0b52] to-[rgba(11,11,82,0)] lg:block"
        />
        <Image
          src={detail.cutout}
          alt={detail.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
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
        <h2 className="font-display text-[min(32px,8.4vw)] uppercase leading-[1.08] tracking-[0.32px] text-[#606060] md:text-[48px]">
          <span className="block font-light">Why</span>
          <span className="block font-bold">{name}</span>
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
            className="relative aspect-[400/480] w-[min(400px,78vw)] shrink-0 snap-start overflow-hidden rounded-[25px] bg-[#0b0b52] select-none"
          >
            <Image
              src={card.image}
              alt=""
              width={800}
              height={960}
              draggable={false}
              sizes="(min-width: 640px) 440px, 86vw"
              className="absolute max-w-none object-cover"
              style={{
                left: `${(card.crop.left / 400) * 100}%`,
                top: `${(card.crop.top / 480) * 100}%`,
                width: `${(card.crop.width / 400) * 100}%`,
                height: `${(card.crop.height / 480) * 100}%`,
              }}
            />
            {/* The mock's 280px blurred, darkening footer. The blur is faded
                in with a mask — at full strength from its top edge it cut a
                visible seam across the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[58.33%] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[58.33%] bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.75)]"
            />
            <h3 className="absolute bottom-6 left-6 right-6 text-[24px] font-medium leading-[1.2] text-white [text-shadow:0_0_32px_rgba(0,0,0,0.35)] sm:bottom-8 sm:left-10 sm:right-auto sm:w-[77.75%] sm:text-[32px]">
              {card.title}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
