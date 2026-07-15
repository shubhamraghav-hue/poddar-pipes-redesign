"use client";

import { Children, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  direction?: "left" | "right";
  /** Fade the left/right edges into the background. */
  fade?: boolean;
}

/**
 * Marquee — a seamless, infinitely looping horizontal track, for certification
 * badges and the product-category ticker. The children are rendered twice
 * back-to-back and the track translates by exactly half its width via a CSS
 * keyframe (`--animate-marquee` / `-reverse`), so the loop is seamless and
 * `animation-play-state: paused` can stop it on hover for readability.
 *
 * Reduced-motion users get a static, horizontally scrollable row instead of
 * autonomous movement.
 */
export function Marquee({
  children,
  className,
  speed = 32,
  direction = "left",
  fade = true,
}: MarqueeProps) {
  const prefersReduced = useReducedMotion();
  const items = Children.toArray(children);

  if (prefersReduced) {
    return (
      <div className={cn("flex gap-10 overflow-x-auto", className)}>
        {items.map((child, i) => (
          <div key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{
          animation: `${direction === "left" ? "marquee" : "marquee-reverse"} ${speed}s linear infinite`,
        }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 gap-10" aria-hidden={dup === 1}>
            {items.map((child, i) => (
              <div key={i} className="shrink-0">
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
