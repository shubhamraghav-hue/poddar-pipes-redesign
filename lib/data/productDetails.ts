import type { ShowcaseCategory } from "@/lib/data/productShowcase";

/**
 * Per-range detail sections on /products, under the range card — Figma
 * "CPVC Products Page - 2nd draft" (node 1731:7511): "What is <range>?"
 * (navy band, molecule render on the right) and "Why <range>?" (a row of
 * 400x480 photo cards).
 *
 * Only CPVC is written so far; the other ranges' details are not finalised by
 * the client (2026-10-12), so a range with no entry here simply shows no
 * detail sections. Add an entry to switch them on.
 *
 * Images were exported from the frame. Each card photo is placed exactly as
 * the mock places it inside its 400x480 card (`crop`, in px of that card) —
 * the mock does not centre-crop them, so `object-cover` would frame them
 * differently.
 */

export type WhyCard = {
  title: string;
  image: string;
  /** The photo's box inside the 400x480 card, as Figma positions it. */
  crop: { left: number; top: number; width: number; height: number };
};

export type ProductDetail = {
  whatIs: {
    /** "What is" + this, set in bold. */
    name: string;
    body: string;
    /** The full render (backdrop, floor reflection) and the molecule cut out. */
    scene: string;
    cutout: string;
    alt: string;
  };
  why: { name: string; cards: WhyCard[] };
};

export const productDetails: Partial<Record<ShowcaseCategory["id"], ProductDetail>> = {
  "cpvc-pipes": {
    whatIs: {
      name: "CPVC?",
      body: "Chlorinated polyvinyl chloride (CPVC) is a thermoplastic made by chlorinating PVC resin, used for hot and cold water distribution. It has been a preferred material for potable water supply worldwide for over 50 years.",
      scene: "/products/cpvc/molecule-scene.webp",
      cutout: "/products/cpvc/molecule.webp",
      alt: "Ball-and-stick model of a CPVC polymer chain",
    },
    why: {
      name: "CPVC?",
      cards: [
        {
          title: "Safe for Drinking Water Lines",
          image: "/products/cpvc/why-drinking-water.webp",
          crop: { left: 0, top: 0, width: 399, height: 533 },
        },
        {
          title: "No Rust, Scale or Pitting",
          image: "/products/cpvc/why-no-rust.webp",
          crop: { left: -182, top: 0, width: 705, height: 529 },
        },
        {
          title: "Built for Hot and Cold Water",
          image: "/products/cpvc/why-hot-cold.webp",
          crop: { left: 0, top: 0, width: 439, height: 659 },
        },
        {
          title: "Self-Extinguishing and Fire Retardant",
          image: "/products/cpvc/why-fire.webp",
          crop: { left: -259, top: 0, width: 679, height: 510 },
        },
        {
          title: "Quick, Clean Cold-Weld Installation",
          image: "/products/cpvc/why-cold-weld.webp",
          crop: { left: -18, top: -61, width: 437, height: 582 },
        },
      ],
    },
  },
};
