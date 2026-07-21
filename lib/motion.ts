/**
 * Brand motion tokens — the single easing curve and duration scale used
 * across the site's Framer Motion transitions, so every reveal/hover/stagger
 * animation reads as one consistent system rather than per-component tuning.
 */
export const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

export const BRAND_DURATION = {
  fast: 0.3,
  base: 0.4,
  reveal: 0.7,
} as const;

/**
 * Spring presets for pointer-driven and layout motion (tilt, magnetic hover).
 * Springs — not tweens — for anything that tracks a live input, so it settles
 * naturally instead of snapping at the end of a fixed duration.
 */
export const BRAND_SPRING = {
  /** Snappy but soft — pointer tilt / magnetic follow. */
  tilt: { type: "spring", stiffness: 220, damping: 22, mass: 0.6 },
  /** Heavier, for larger elements that should feel weighty. */
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
} as const;

/**
 * Shared viewport config for scroll-reveal `whileInView` — one margin so
 * every section triggers at the same point in the scroll.
 */
export const BRAND_VIEWPORT = { once: true, margin: "0px" } as const;
