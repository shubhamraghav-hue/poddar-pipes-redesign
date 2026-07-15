"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

// Starts at the real target value — not 0 — so SSR output, pre-hydration
// paint, and non-JS/crawler requests never show a bare "0". The count-up
// from 0 only ever happens once, client-side, the first time it scrolls
// into view; it's a progressive-enhancement animation, not the source of
// the displayed number.
export function useCounter(target: number, duration = 2) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  return { ref, value };
}
