"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * SectionReveal — entrance animation for the first section after the hero.
 *
 * Uses whileInView so the animation runs at a fixed duration with an
 * expo-out ease regardless of scroll speed, which feels far smoother than
 * a raw scroll-position-driven transform.  `once: true` means it plays
 * once and stays visible — no re-entry flicker on scroll back.
 *
 * To remove this effect entirely, unwrap <CompanyOverview> in page.tsx
 * and delete the <SectionReveal> import.
 */
export function SectionReveal({ children, className }: SectionRevealProps) {
  // Movement only — NO opacity fade. Starting at `opacity: 0` put the
  // section into the server HTML invisible, so with JS slow/blocked, for
  // crawlers, or when IntersectionObserver never fired (the iPhone Safari
  // bug that got RevealOnScroll switched off) the second home section was
  // simply blank. A 24px settle still reads as an entrance, and the content
  // is readable from the first paint whatever happens.
  return (
    <motion.div
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
