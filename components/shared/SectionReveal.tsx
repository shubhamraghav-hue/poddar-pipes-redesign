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
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
