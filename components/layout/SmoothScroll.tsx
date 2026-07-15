"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useLenis();
  // reducedMotion="user" makes every Framer Motion animation site-wide
  // (RevealOnScroll, StaggerGroup/Item, hover/tap effects, the mega-menu
  // panel, etc.) automatically honour prefers-reduced-motion — animated
  // properties are set instantly instead of transitioning, without each
  // component needing its own useReducedMotion() check.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
