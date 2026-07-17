"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  motion,
  motionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Coverflow — an Apple-Cover-Flow-style, infinitely looping carousel built on
 * Embla (drag/touch/loop mechanics) with per-slide transforms driven by Framer
 * Motion springs. The slide nearest the centre is the active one (scale 1,
 * face-on, sharp); slides fan out to the sides — scaling down, rotating on the
 * Y axis, drifting toward centre to overlap, and fading + blurring the further
 * they get. Edges fade under a gradient mask.
 *
 * Per-slide distance is read from Embla's own scroll engine (loop-aware) rather
 * than measured from the DOM, so the transforms never feed back into layout.
 * Interaction: drag, touch, mouse wheel, arrow keys, on-screen prev/next, dots.
 * Reduced-motion users get a plain, still, horizontally-scrollable strip.
 */

const SPRING = { stiffness: 210, damping: 30, mass: 0.6 } as const;

interface CoverflowProps {
  slides: ReactNode[];
  /** Tailwind sizing for each slide (width + height). */
  slideClassName?: string;
  ariaLabel?: string;
  className?: string;
}

function CoverflowSlide({
  diff,
  reduced,
  slideClassName,
  children,
}: {
  diff: MotionValue<number>;
  reduced: boolean;
  slideClassName?: string;
  children: ReactNode;
}) {
  const spring = useSpring(diff, SPRING);

  const scale = useTransform(spring, [-2, -1, 0, 1, 2], [0.7, 0.85, 1, 0.85, 0.7]);
  const opacity = useTransform(spring, [-2.4, -1, 0, 1, 2.4], [0.15, 0.68, 1, 0.68, 0.15]);
  const rotateY = useTransform(spring, [-2, -1, 0, 1, 2], [45, 28, 0, -28, -45]);
  const x = useTransform(spring, [-2, -1, 0, 1, 2], [120, 60, 0, -60, -120]);
  const zIndex = useTransform(spring, (v) => Math.round(50 - Math.abs(v) * 12));
  const filter = useTransform(spring, (v) => `blur(${Math.min(Math.abs(v) * 2.4, 6)}px)`);

  if (reduced) {
    return (
      <div className={cn("relative shrink-0 snap-center px-2", slideClassName)}>{children}</div>
    );
  }

  return (
    // Flex child: holds perspective + z-index (layout-neutral, so Embla's
    // measurements stay stable). No transform here.
    <motion.div
      className={cn("relative shrink-0 [perspective:1200px]", slideClassName)}
      style={{ zIndex }}
    >
      {/* Inner layer carries the 3D transform — perspective comes from the parent. */}
      <motion.div
        className="h-full w-full [transform-style:preserve-3d]"
        style={{ scale, opacity, rotateY, x, filter }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Coverflow({ slides, slideClassName, ariaLabel, className }: CoverflowProps) {
  const reduced = useReducedMotion() ?? false;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    dragFree: false,
    skipSnaps: false,
    duration: 26,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  // One imperative motion value per slide = signed distance (in slide-widths)
  // from centre. Built once, outside the render loop → no hook-count issues.
  const diffsRef = useRef<MotionValue<number>[] | null>(null);
  if (!diffsRef.current || diffsRef.current.length !== slides.length) {
    diffsRef.current = slides.map(() => motionValue(0));
  }
  const diffs = diffsRef.current;

  const updateDiffs = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const progress = emblaApi.scrollProgress();
    const snapList = emblaApi.scrollSnapList();
    const spacing = snapList.length > 1 ? Math.abs(snapList[1] - snapList[0]) : 1;

    snapList.forEach((snap, snapIndex) => {
      const slidesInSnap = engine.slideRegistry[snapIndex] ?? [];
      slidesInSnap.forEach((slideIndex: number) => {
        let diffToTarget = snap - progress;
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = snap - (1 + progress);
              if (sign === 1) diffToTarget = snap + (1 - progress);
            }
          });
        }
        diffs[slideIndex]?.set(diffToTarget / spacing);
      });
    });
  }, [emblaApi, diffs]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
      updateDiffs();
    };
    onReInit();
    emblaApi.on("scroll", updateDiffs);
    emblaApi.on("reInit", onReInit);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("scroll", updateDiffs);
      emblaApi.off("reInit", onReInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, updateDiffs]);

  // Mouse wheel → step the carousel (throttled), so a wheel/trackpad gesture
  // over the carousel browses it rather than scrolling the page past it.
  useEffect(() => {
    if (!emblaApi) return;
    const node = emblaApi.rootNode();
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;
      e.preventDefault();
      const now = Date.now();
      if (now - last < 280) return;
      last = now;
      if (delta > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    },
    [emblaApi],
  );

  return (
    <div className={cn("relative", className)}>
      <div
        ref={emblaRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={cn(
          "overflow-hidden py-12 outline-none focus-visible:ring-2 focus-visible:ring-flow-400/60",
          "[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]",
        )}
      >
        <div className={cn("flex items-center", reduced && "gap-6 overflow-x-auto")}>
          {slides.map((slide, i) => (
            <CoverflowSlide
              key={i}
              diff={diffs[i]}
              reduced={reduced}
              slideClassName={slideClassName}
            >
              {slide}
            </CoverflowSlide>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous"
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur transition-colors hover:border-flow-400/60 hover:text-ocean-700 sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur transition-colors hover:border-flow-400/60 hover:text-ocean-700 sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {snaps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              selected === i ? "w-6 bg-ocean-600" : "w-2 bg-slate-300 hover:bg-slate-400",
            )}
          />
        ))}
      </div>
    </div>
  );
}
