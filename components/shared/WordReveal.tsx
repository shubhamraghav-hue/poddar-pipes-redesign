"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BRAND_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
  delay?: number;
  /** Animate on scroll into view (default) or immediately on mount. */
  trigger?: "inView" | "mount";
  /** Highlight class applied to words wrapped in *asterisks* in the text. */
  emphasisClassName?: string;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: BRAND_EASE } },
};

/**
 * WordReveal — a headline that reveals word-by-word, each word rising from
 * behind a clipping mask. This is the site's signature type moment: on the
 * bold pass, primary section headings assemble on scroll rather than simply
 * fading in. Wrap a word in *asterisks* to give it the emphasis class (e.g.
 * the accent color).
 *
 * Reduced-motion users get the fully-formed heading with no masking.
 */
export function WordReveal({
  text,
  className,
  stagger = 0.06,
  delay = 0,
  trigger = "inView",
  emphasisClassName,
}: WordRevealProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return (
      <span className={className}>
        {words.map((w, i) => {
          const emph = w.startsWith("*") && w.endsWith("*");
          const clean = emph ? w.slice(1, -1) : w;
          return (
            <Fragment key={i}>
              <span className={emph ? emphasisClassName : undefined}>{clean}</span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          );
        })}
      </span>
    );
  }

  const inView = trigger === "inView";

  return (
    <motion.span
      className={cn("inline", className)}
      variants={container(stagger, delay)}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, margin: "-60px" } }
        : { animate: "visible" })}
    >
      {words.map((w, i) => {
        const emph = w.startsWith("*") && w.endsWith("*");
        const clean = emph ? w.slice(1, -1) : w;
        return (
          <span key={i} className="inline-flex overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={word} className={cn("inline-block", emph && emphasisClassName)}>
              {clean}
            </motion.span>
            {i < words.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        );
      })}
    </motion.span>
  );
}
