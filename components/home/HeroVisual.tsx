"use client";

import { motion } from "framer-motion";

/**
 * HeroVisual — an original, on-brand animated illustration standing in for
 * real product photography or a product video (e.g. a plumber installing
 * pipe, water flowing through a fitting). Built entirely from SVG/CSS so it
 * ships with zero licensing risk. Swap this component out for a
 * <video>/<Image> once real photography/video assets are available —
 * see the comment block at the bottom of this file for how to do that.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full bg-ocean-500/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Orange ring — echoes the logo's circular container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-6 rounded-full border-2 border-amber-500/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-16 rounded-full border border-white/10"
      />

      {/* Core illustration: pipe cross-section with flowing water */}
      <svg viewBox="0 0 400 400" className="relative h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="pipeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3e3dc4" />
            <stop offset="100%" stopColor="#171796" />
          </linearGradient>
          <linearGradient id="waterFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-amber-300)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-amber-500)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-amber-300)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="capShine" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Diagonal pipe barrel */}
        <g transform="rotate(-18 200 200)">
          <rect x="60" y="160" width="280" height="80" rx="40" fill="url(#pipeBody)" />
          <rect x="60" y="160" width="280" height="80" rx="40" fill="url(#capShine)" />
          {/* End cap rings */}
          <ellipse cx="80" cy="200" rx="20" ry="40" fill="#0c0b3f" />
          <ellipse cx="80" cy="200" rx="20" ry="40" fill="none" stroke="var(--color-amber-500)" strokeWidth="3" />
          <ellipse cx="320" cy="200" rx="20" ry="40" fill="#100f5c" />

          {/* Animated flowing water inside the barrel */}
          <clipPath id="barrelClip">
            <rect x="80" y="170" width="240" height="60" rx="30" />
          </clipPath>
          <g clipPath="url(#barrelClip)">
            <motion.rect
              x="80"
              y="170"
              width="240"
              height="60"
              fill="url(#waterFlow)"
              initial={{ x: -240 }}
              animate={{ x: 240 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
          </g>
        </g>

        {/* Floating valve fitting, top right */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="305" cy="95" r="30" fill="#ffffff" stroke="var(--color-amber-500)" strokeWidth="3" />
          <circle cx="305" cy="95" r="10" fill="var(--color-ocean-600)" />
          <rect x="299" y="55" width="12" height="20" rx="3" fill="var(--color-ocean-600)" />
        </motion.g>

        {/* Floating water droplet, bottom left */}
        <motion.g
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <path
            d="M95 300c0 12-9.5 21-21 21s-21-9-21-21c0-12 21-38 21-38s21 26 21 38Z"
            fill="var(--color-amber-500)"
          />
        </motion.g>

        {/* Small orbiting ring accent */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="var(--color-gold-500)"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />
      </svg>
    </div>
  );
}

/*
 * TO USE REAL PHOTOGRAPHY OR VIDEO INSTEAD:
 *
 * Image:
 *   import Image from "next/image";
 *   <Image
 *     src="/hero/plumbing-installation.jpg"
 *     alt="Poddar Pipes installation in progress"
 *     fill
 *     priority
 *     className="rounded-3xl object-cover"
 *   />
 *
 * Video (muted, autoplaying, like Ashirvad's hero):
 *   <video
 *     autoPlay muted loop playsInline
 *     poster="/hero/poster.jpg"
 *     className="h-full w-full rounded-3xl object-cover"
 *   >
 *     <source src="/hero/plumbing-loop.mp4" type="video/mp4" />
 *   </video>
 *
 * Either way, drop the asset in /public/hero/ and swap the markup in Hero.tsx
 * where <HeroVisual /> is currently rendered.
 */