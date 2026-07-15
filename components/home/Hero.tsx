"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/data/heroSlides";

const SLIDE_DURATION = 7000;

export function Hero() {
  const t = useTranslations("home");
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  // Auto-advance/autoplay is off by default for reduced-motion users — they
  // can still step through slides manually via the dots or this control.
  const [paused, setPaused] = useState(!!prefersReducedMotion);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed parallax: as the hero scrolls out of view, the video bed
  // drifts down and scales while the text lifts and fades — a cinematic exit
  // that hands off to the page below with depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Every slide starts at preload="none" in the initial (server-rendered)
  // HTML, so the browser's first paint isn't competing with a video fetch —
  // only after mount (i.e. after first paint) does the active slide switch
  // to eager loading. The poster (real or placeholder) is what's visible
  // during that window and on slow connections.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(((index % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(active + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, goTo]);

  // Only the active slide's video ever plays — the rest stay paused (and
  // unloaded via `preload="none"`) so the browser isn't fetching/decoding
  // five full-length videos concurrently just for a crossfade.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && !paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, paused]);

  const nextIndex = (active + 1) % heroSlides.length;
  const slide = heroSlides[active];

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Stacked, crossfading video layers. Only the active (and next) slide
          is preloaded/playing — the rest sit paused with preload="none" so
          the browser isn't fetching and decoding all five videos at once. */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { y: videoY, scale: videoScale }}
      >
        {heroSlides.map((s, i) => (
          <motion.video
            key={s.id}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={s.video}
            poster={s.poster ?? "/hero/poster-placeholder.svg"}
            autoPlay={mounted && i === active && !paused}
            muted
            loop
            playsInline
            preload={mounted && (i === active || i === nextIndex) ? "auto" : "none"}
            aria-hidden="true"
            tabIndex={-1}
            {...(i === active ? { fetchPriority: "high" as const } : {})}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </motion.div>

      {/* Legibility overlay — dark on the left where text sits, easing toward
          the video on the right, plus a bottom grounding gradient. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30"
        aria-hidden="true"
      />

      <motion.div
        className="container-edge relative z-10 pt-28 pb-20 sm:pb-0"
        style={prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            {t("heroEyebrow")}
          </span>
        </motion.div> */}

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-balance font-display text-4xl font-light leading-[1.08] text-white sm:text-6xl sm:leading-[1.05]">
              {slide.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block font-bold">{slide.headingBoldLine}</span>
            </h1>

            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:mt-7 sm:text-lg">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Button asChild size="lg" variant="accent" className="relative w-full sm:w-auto">
            <Link href="/products">
              {t("heroPrimaryCta")}
              {/* Absolute on the full-width mobile button so the label stays
                  perfectly centered; inline again from sm up (auto-width). */}
              <ArrowUpRight className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 sm:static sm:translate-y-0" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-white" className="w-full sm:w-auto">
            <Link href="/contact">{t("heroSecondaryCta")}</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Slide indicator dots + pause/play control (WCAG 2.2.2 — auto-advancing
          content past 5s must be pausable) */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 sm:bottom-10 sm:left-auto sm:right-10 sm:translate-x-0">
        <div className="flex items-center gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                className={
                  i === active
                    ? "h-2.5 w-2.5 rounded-full bg-white transition-all duration-300"
                    : "h-2 w-2 rounded-full bg-white/35 transition-all duration-300 group-hover:bg-white/60"
                }
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="flex h-6 w-6 items-center justify-center text-white/70 transition-colors hover:text-white"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      </div>
    </section>
  );
}