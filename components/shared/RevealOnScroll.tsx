"use client";

import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

// TEMPORARILY DISABLED (Aug 2026, explicit request) — the scroll-reveal
// animation below relied entirely on the browser's IntersectionObserver
// firing via Framer Motion's `whileInView`; confirmed on a real iPhone
// Safari session and a separate embedded-browser test that content could
// get stuck permanently invisible when it didn't (suspected browser
// permissions/settings blocking it, unconfirmed). A same-day fix added a
// 1.2s timeout fallback (see git history / BRAND_IDENTITY.md "Sitewide
// bug: RevealOnScroll content stuck permanently invisible"), but the
// request here is to remove the dependency on the observer entirely for
// now, not just add a delayed fallback to it. `delay`/`y`/`once` are kept
// as accepted-but-unused props so none of this component's many call
// sites sitewide need to change — restore the block below (and drop the
// plain passthrough) to bring the animation back once the underlying
// cause is understood.
export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  return <div className={className}>{children}</div>;
}

/*
import { motion, useAnimationControls, useInView, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { BRAND_EASE, BRAND_DURATION } from "@/lib/motion";

export function RevealOnScroll({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "0px" });
  const controls = useAnimationControls();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      return;
    }
    const timeout = setTimeout(() => controls.start("visible"), 1200);
    return () => clearTimeout(timeout);
  }, [isInView, controls]);

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: BRAND_DURATION.reveal, delay, ease: BRAND_EASE } },
  };

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  );
}
*/

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

// Also disabled alongside `RevealOnScroll` above — same `whileInView`/
// IntersectionObserver dependency, same suspected cause. `stagger` kept
// as an accepted-but-unused prop for the same call-site-compatibility
// reason.
export function StaggerGroup({ children, className }: StaggerGroupProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/*
import { motion, type Variants } from "framer-motion";
import { BRAND_EASE, BRAND_DURATION } from "@/lib/motion";

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function StaggerGroup({ children, className, stagger = 0.1 }: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItemVariants} transition={{ duration: BRAND_DURATION.base, ease: BRAND_EASE }}>
      {children}
    </motion.div>
  );
}
*/
