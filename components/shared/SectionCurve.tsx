"use client";

import { type ReactNode, useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getCurveRx } from "@/lib/motion";

interface SectionCurveProps {
  children: ReactNode;
}

export function SectionCurve({ children }: SectionCurveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Responsive rx — wider on smaller screens for a shallower curve.
  const [rx, setRx] = useState(155);
  useEffect(() => {
    const update = () => setRx(getCurveRx(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const ry = useTransform(
    scrollYProgress,
    [0, 0.2],
    [200, 100]
  );
  const clipPath = useTransform(ry, (r) => `ellipse(${rx}% ${r}% at 50% 0%)`);

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { clipPath }}
    >
      {children}
    </motion.div>
  );
}
