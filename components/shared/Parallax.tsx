"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Total travel in pixels across the element's full scroll pass. Positive =
   * element drifts up relative to the page (moves slower than scroll);
   * negative = drifts down. Keep modest (30–120) so it reads as depth, not
   * detachment.
   */
  speed?: number;
  axis?: "x" | "y";
}

/**
 * Parallax — translates its children as the element scrolls through the
 * viewport, driven by scroll progress (scrubbed, not time-based). Used for
 * background layers, oversized numerals, and imagery so foreground and
 * background move at different rates, giving sections physical depth.
 *
 * Reduced-motion users get a static, untransformed element.
 */
export function Parallax({ children, className, speed = 60, axis = "y" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Element enters from +speed and leaves at -speed as it crosses the viewport.
  const translate = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={prefersReduced ? undefined : axis === "y" ? { y: translate } : { x: translate }}
    >
      {children}
    </motion.div>
  );
}
