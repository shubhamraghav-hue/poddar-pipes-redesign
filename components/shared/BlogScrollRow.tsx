"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/types";

function BlogCard({ post }: { post: BlogPost }) {
  const locale = useLocale();
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", { month: "short", year: "numeric" });

  return (
    <Link
      href="/resources#blogs"
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-flow-400/50 hover:shadow-lg hover:shadow-ocean-900/5"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100">
        {post.image && (
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(max-width: 640px) 260px, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="tech-label text-ocean-700">{post.category}</span>
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-ocean-800">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
              {fmtDate(post.date)}
            </span>
          </span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogScrollRow({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("common");
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-blog-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="relative mt-14">
      <div
        ref={trackRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {posts.map((post, i) => (
          <div
            key={post.id}
            data-blog-card
            className="h-full w-[260px] shrink-0 snap-start sm:w-[300px]"
          >
            <RevealOnScroll delay={Math.min(i, 6) * 0.07} className="h-full">
              <BlogCard post={post} />
            </RevealOnScroll>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          disabled={!canScrollLeft}
          aria-label={t("scrollPrev")}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200",
            canScrollLeft
              ? "border-slate-300 text-slate-700 hover:border-ocean-700 hover:bg-ocean-700 hover:text-white"
              : "cursor-not-allowed border-slate-200 text-slate-300"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          disabled={!canScrollRight}
          aria-label={t("scrollNext")}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200",
            canScrollRight
              ? "border-slate-300 text-slate-700 hover:border-ocean-700 hover:bg-ocean-700 hover:text-white"
              : "cursor-not-allowed border-slate-200 text-slate-300"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
