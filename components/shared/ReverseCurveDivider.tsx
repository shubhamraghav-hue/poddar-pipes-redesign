"use client";

import { motion, useTransform, motionValue, type MotionValue } from "framer-motion";

interface ReverseCurveDividerProps {
  /** Fill colour matching the next section's background. */
  fill?: string;
  /** 0–1 scroll progress from the hero's useScroll. */
  scrollProgress?: MotionValue<number>;
}

// Constant fallback — keeps hook call count stable when no scrollProgress given.
const STATIC_ZERO = motionValue(0);

/**
 * ReverseCurveDivider — scroll-driven upward arch at the hero's bottom edge.
 *
 * At rest (scroll = 0) the shape is fully transparent and flat so it is
 * invisible when the user hasn't scrolled.  As they scroll, the container
 * fades in and the arch peak simultaneously rises from the baseline to its
 * full height, giving the visual of the next section "cutting up" into the
 * hero only as the page is explored.
 *
 * Timeline (mapped to hero scrollYProgress 0 → 1):
 *   0.10 → 0.45  container opacity   0 → 1
 *   0.10 → 0.45  arch peak y         52 → 0   (flat baseline → full arch)
 */
export function ReverseCurveDivider({
  fill = "#ffffff",
  scrollProgress,
}: ReverseCurveDividerProps) {
  const progress = scrollProgress ?? STATIC_ZERO;

  // Fade the whole divider in as the user starts scrolling.
  const containerOpacity = useTransform(progress, [0.1, 0.45], [0, 1]);

  // Arch peak rises from the shoulder baseline (y=52, flat) to the top (y=0).
  // This makes the arch "grow" in sync with the fade.
  const peakY = useTransform(progress, [0.1, 0.45], [52, 0]);

  // Build the SVG path from the animated peak position.
  // viewBox: 1440 × 80.  Shoulders fixed at y=52; peak at centre x=720.
  const pathD = useTransform(
    peakY,
    (py) =>
      `M0,80 L0,52 C360,52 360,${py} 720,${py} C1080,${py} 1080,52 1440,52 L1440,80 Z`,
  );

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
      style={{ opacity: containerOpacity }}
      aria-hidden="true"
    >
      {/*
        preserveAspectRatio="none" stretches the SVG to fill any viewport width
        while the intrinsic height scales responsively via CSS clamp.
      */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
        style={{ height: "clamp(40px, 5.5vw, 80px)" }}
      >
        <motion.path d={pathD} fill={fill} />
      </svg>
    </motion.div>
  );
}
