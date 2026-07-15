"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * ScrollWaterRail — an ambient scroll-progress indicator: water rising in a
 * hairline column pinned to the extreme right edge of the viewport. The "flow"
 * identity made literal, with zero footprint on content — it sits in the
 * gutter, full height, ~3px wide, no labels or numbers.
 *
 * Decorative (aria-hidden) — the real scrollbar remains the affordance.
 * Reduced-motion users get the level without the surface shimmer or spring.
 */
export function ScrollWaterRail() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const smooth = prefersReduced ? scrollYProgress : progress;
  const fillHeight = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-[3px] bg-slate-500/10 md:block"
    >
      {/* Rising water */}
      <motion.div
        style={{ height: fillHeight }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ocean-600 via-ocean-500 to-flow-400"
      >
        {/* Waterline glow at the surface */}
        <span className="absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-flow-200 shadow-[0_0_10px_2px_var(--color-flow-400)]" />
        {!prefersReduced && (
          <motion.span
            className="absolute inset-x-0 top-0 h-3 -translate-y-1/2 bg-flow-200/40 blur-[3px]"
            animate={{ opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
}
