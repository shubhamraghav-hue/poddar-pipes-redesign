"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PulseLine — Poddar Pipes' original signature motif (NOT Ashirvad's boomerang): a schematic pipeline path with
 * valve-node junctions, echoing the piping/flow-network diagrams used in
 * real engineering schematics. Draws itself in on scroll, then carries a
 * subtle animated "flow" pulse along the line.
 */
interface FlowLineProps {
  className?: string;
  variant?: "hero" | "divider";
}

export function FlowLine({ className, variant = "divider" }: FlowLineProps) {
  if (variant === "hero") {
    return (
      <svg
        viewBox="0 0 1200 500"
        fill="none"
        className={cn("h-full w-full", className)}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M -40 420 C 180 420, 220 260, 380 260 S 560 90, 720 90 S 900 300, 1060 300 S 1180 180, 1260 180"
          stroke="url(#flowGradientHero)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
        <motion.path
          d="M -40 420 C 180 420, 220 260, 380 260 S 560 90, 720 90 S 900 300, 1060 300 S 1180 180, 1260 180"
          stroke="url(#flowGradientHero)"
          strokeWidth="2"
          strokeDasharray="6 14"
          className="animate-flow opacity-70"
        />
        {[
          [380, 260],
          [720, 90],
          [1060, 300],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <motion.circle
              cx={cx}
              cy={cy}
              r="14"
              fill="none"
              stroke="var(--color-amber-500)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 + i * 0.2 }}
            />
            <motion.circle
              cx={cx}
              cy={cy}
              r="5"
              fill="var(--color-amber-500)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.2 }}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="flowGradientHero" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-ocean-400)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--color-ocean-400)" stopOpacity="0.9" />
            <stop offset="80%" stopColor="var(--color-ocean-300)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-ocean-300)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1200 80"
      fill="none"
      className={cn("h-20 w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 40 L 300 40 L 340 10 L 900 10 L 940 40 L 1200 40"
        stroke="var(--color-ocean-600)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle cx="320" cy="25" r="4" fill="var(--color-amber-500)" />
      <circle cx="920" cy="25" r="4" fill="var(--color-amber-500)" />
    </svg>
  );
}
