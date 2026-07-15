"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { BRAND_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the corners. */
  max?: number;
  /** Show a soft light glare that tracks the pointer. */
  glare?: boolean;
}

/**
 * TiltCard — a 3D pointer-tracking tilt with an optional light glare, for the
 * product/category showcase cards. The card leans toward the cursor and lifts
 * on the z-axis, so a grid of products feels tactile and physical rather than
 * flat. Springs keep it from snapping.
 *
 * Reduced-motion users get a plain, static wrapper (the underlying card keeps
 * its own CSS hover states).
 */
export function TiltCard({ children, className, max = 8, glare = true }: TiltCardProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), BRAND_SPRING.tilt);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), BRAND_SPRING.tilt);

  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  // Built once at the top level (never inside conditional JSX) so the hook
  // call order stays stable regardless of the `glare` prop.
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), transparent 60%)`;

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      whileHover={{ z: 30 }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
