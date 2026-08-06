"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/data/heroSlides";
import { getCurveRx } from "@/lib/motion";

const SLIDE_DURATION = 7000;

export function Hero() {
  const t = useTranslations("home");
  const tDyn = t as (key: string) => string;
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(!!prefersReducedMotion);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Responsive curve rx — wider on smaller screens for a shallower curve.
  const [rx, setRx] = useState(155);
  useEffect(() => {
    const update = () => setRx(getCurveRx(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll-scrubbed parallax: as the hero scrolls out of view the video bed
  // drifts down and scales while the text lifts and fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Downward ellipse curve at the hero's bottom — matches Ashirvad's clip-path technique.
  // ellipse(rx ry at cx cy): centre at top-centre, ry drives the curve depth.
  // ry=200 → barely perceptible; ry=100 → sides clip at ~94.6 %, centre stays full height.
  // Result: the hero bottom edge dips DOWN in the centre, exposing the white section below.
  const heroRy = useTransform(scrollYProgress, [0, 0.2], [200, 100]);
  const heroClipPath = useTransform(heroRy, (r) => `ellipse(${rx}% ${r}% at 50% 0%)`);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const goTo = useCallback((index: number) => {
    setActive(((index % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(active + 1), SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, goTo]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && !paused) video.play().catch(() => {});
      else video.pause();
    });
  }, [active, paused]);

  const nextIndex = (active + 1) % heroSlides.length;
  const slide = heroSlides[active];

  return (
    <motion.section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
      style={prefersReducedMotion ? undefined : { clipPath: heroClipPath }}
    >
      {/* ── Video parallax layer — always fills the full section ──────────
          overflow-hidden on the section clips the 1.12× scaled/shifted video. */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { y: videoY, scale: videoScale }}
      >
        {heroSlides.map((s, i) => (
          <motion.video
            key={s.id}
            ref={(el) => { videoRefs.current[i] = el; }}
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

      {/* ── Legibility overlays — direct section children, always edge-to-edge */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30"
        aria-hidden="true"
      />

      {/* ── Content layer ────────────────────────────────────────────────── */}
      <motion.div
        className="container-edge relative z-10 pt-28 pb-20 sm:pb-0"
        style={prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-balance font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              <span className="block">{tDyn(`heroSlide_${slide.id}_line1`)}</span>
              <span className="block text-amber-500">{tDyn(`heroSlide_${slide.id}_line2`)}</span>
              <span className="block font-bold">{tDyn(`heroSlide_${slide.id}_bold`)}</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:mt-7 sm:text-lg">
              {tDyn(`heroSlide_${slide.id}_desc`)}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
            <Link href="/products">{t("heroPrimaryCta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline-white" className="w-full sm:w-auto">
            <Link href="/contact">{t("heroSecondaryCta")}</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Slide indicator dots + pause/play (WCAG 2.2.2) ──────────────── */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 sm:bottom-16 sm:left-auto sm:right-10 sm:translate-x-0">
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

    </motion.section>
  );
}
