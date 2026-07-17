export interface HeroSlide {
  id: string;
  /** Path under /public — drop your 5 video files here */
  video: string;
  /**
   * Poster frame shown before the video loads. No real photography exists
   * yet (see CONTENT_TODOS.md) — leave unset to fall back to a generic
   * on-brand gradient placeholder (Hero.tsx), or set a real still frame
   * once one is available.
   */
  poster?: string;
  headingLines: string[];
  /** Last heading line is rendered bold/emphasized, matching the mockups */
  headingBoldLine: string;
  description: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "growth",
    video: "/hero/slide-1.webm",
    headingLines: ["Engineered for", "every drop of"],
    headingBoldLine: "India's growth",
    description:
      "Poddar Pipes designs and manufactures uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems for households, farms, industries, and infrastructure projects across India.",
  },
  {
    id: "decades",
    video: "/hero/slide-2.webm",
    headingLines: ["Trusted to build", "India's pipes for"],
    headingBoldLine: "50 years",
    description:
      "Founded in 1975 by the Poddar family, every product we ship is engineered to Indian Standards, rigorously tested in-house, and quality-checked at every stage before it ever reaches a dealer's shelf.",
  },
  {
    id: "infrastructure",
    video: "/hero/slide-3.webm",
    headingLines: ["Large-diameter", "systems for civic"],
    headingBoldLine: "Infrastructure",
    description:
      "Our pipe systems are engineered for India's water transport and drainage infrastructure, built to withstand large-scale civic demands and perform reliably for decades of continuous use.",
  },
  {
    id: "trust",
    video: "/hero/slide-4.webm",
    headingLines: ["Behind every", "tap, a standard"],
    headingBoldLine: "You can trust",
    description:
      "Our labs run continuous pressure, impact, and thermal testing against Indian Standards, so every batch leaving our facility meets the same benchmark, without exception, always.",
  },
  {
    id: "irrigation",
    video: "/hero/slide-5.webm",
    headingLines: ["Irrigation systems", "built for Indian"],
    headingBoldLine: "Farming conditions",
    description:
      "Drip, sprinkler, and lift irrigation piping engineered for Indian farming conditions, helping farmers move water efficiently across fields, orchards, and plantations through every growing season.",
  },
];