"use client";

import { type ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface SectionCurveProps {
  children: ReactNode;
}

export function SectionCurve({ children }: SectionCurveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Curve becomes fully visible at 70 % scroll progress through the section —
  // consistent with the hero. Invisible at rest (ry 200 → no clip).
  const ry = useTransform(scrollYProgress, [0.3, 0.7], [200, 100]);
  const clipPath = useTransform(ry, (r) => `ellipse(155% ${r}% at 50% 0%)`);

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { clipPath }}
    >
      {children}
    </motion.div>
  );
}
