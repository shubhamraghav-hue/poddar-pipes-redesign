"use client";

import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

// DISABLED, not dead: these render as plain passthroughs on purpose.
// The scroll-reveal depended on IntersectionObserver via Framer Motion's
// `whileInView`, and content could get stuck permanently invisible when it
// never fired — reproduced on real iPhone Safari and in an embedded browser.
// A 1.2s timeout fallback was tried first; the decision was to drop the
// observer dependency entirely until the cause is understood.
//
// `delay`/`y`/`once`/`stagger` stay in the signatures so the many call sites
// need no edits. The animated implementations are in git history — see
// BRAND_IDENTITY.md, "RevealOnScroll content stuck permanently invisible".
export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerGroup({ children, className }: StaggerGroupProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
