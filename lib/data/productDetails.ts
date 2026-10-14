import type { ShowcaseCategory } from "@/lib/data/productShowcase";

/**
 * Per-range detail sections on /products, under the range card — Figma "<range>
 * Products Page - 2nd draft": CPVC (node 1731:7511), uPVC (1809:9139), UGD
 * (1809:9345). "What is <range>?" (navy band, a render on the right) and
 * "Why <range>?" (a row of 400x480 photo cards).
 *
 * AGRI, SWR and TANK are not finalised by the client yet, so a range with no
 * entry here simply shows no detail sections. Add an entry to switch them on.
 *
 * Images were exported from the frames at their FULL source resolution (webp
 * q90, nothing upscaled) — public/products/<range>/. Each card photo is placed
 * exactly as the mock places it inside its 400x480 card (`crop`, in px of that
 * card) — the mock does not centre-crop them, so `object-cover` alone would
 * frame them differently.
 */

export type WhyCard = {
  title: string;
  /**
   * Omitted when the mock has no photo for the card yet (UGD's "Corrosion
   * Resistant & Rodent Proof", 2026-10-14) — the card then shows its navy
   * ground under the usual darkening footer.
   */
  image?: string;
  /** The photo's box inside the 400x480 card, as Figma positions it. */
  crop?: { left: number; top: number; width: number; height: number };
};

export type ProductDetail = {
  whatIs: {
    /** "What is" + this, set in bold. Case is kept as written ("uPVC?"). */
    name: string;
    body: string;
    /** The full render (backdrop, floor reflection) and the subject cut out. */
    scene: string;
    cutout: string;
    alt: string;
    /**
     * The render box at 1512, flush right: Figma's width x height, and how far
     * its centre sits below the 780px band's middle (CPVC/uPVC 778x1160 at
     * +40; UGD 757x1129 at +100.5, i.e. top -74).
     */
    art: { w: number; h: number; centerY: number };
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
      art: { w: 778, h: 1160, centerY: 40 },
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
  "upvc-pipes": {
    whatIs: {
      name: "uPVC?",
      body: "Unplasticised polyvinyl chloride (uPVC) is a thermoplastic used for cold water plumbing, water supply and underground drainage. It resists rust, corrosion and decay, with a lead-free solvent weld system for homes and commercial buildings.",
      scene: "/products/upvc/molecule-scene.webp",
      cutout: "/products/upvc/molecule.webp",
      alt: "Ball-and-stick model of a PVC polymer chain",
      art: { w: 778, h: 1160, centerY: 40 },
    },
    why: {
      name: "uPVC?",
      cards: [
        {
          title: "Lead-Free for Safe Drinking Water",
          image: "/products/upvc/why-lead-free.webp",
          crop: { left: -64, top: -20, width: 463, height: 579 },
        },
        {
          title: "Resistant to Chemicals & Salt Water",
          image: "/products/upvc/why-chemical-resistant.webp",
          // Figma draws this 626x470 — 10px short of the card, which leaves a
          // strip of bare card under the footer. Scaled to 480 tall about the
          // same centre instead.
          crop: { left: -160, top: 0, width: 639, height: 480 },
        },
        {
          title: "Built for Cold Water & Drainage",
          image: "/products/upvc/why-cold-water-drainage.webp",
          crop: { left: -1, top: 0, width: 402, height: 536 },
        },
        {
          title: "Maintenance-Free & Long-Lasting",
          image: "/products/upvc/why-maintenance-free.webp",
          crop: { left: -20, top: 0, width: 447, height: 558 },
        },
        {
          title: "Quick Solvent-Weld Installation",
          image: "/products/upvc/why-solvent-weld.webp",
          crop: { left: -18, top: -61, width: 437, height: 582 },
        },
      ],
    },
  },
  "ugd-pipes": {
    whatIs: {
      name: "UGD?",
      body: "Underground drainage (UGD) is a system of pipes and fittings that carries household sewage, rainwater and industrial effluents. Poddar’s three-layer foam-core uPVC pipes are built for non-pressure drainage between buildings and municipal sewer networks.",
      // 848x1264 / 687x1024 — the largest these exist in the Figma file.
      scene: "/products/ugd/fittings-scene.webp",
      cutout: "/products/ugd/fittings.webp",
      alt: "Poddar UGD pipe fittings — bends, a Y-junction and couplers",
      art: { w: 757, h: 1129, centerY: 100.5 },
    },
    why: {
      name: "UGD?",
      cards: [
        {
          title: "Smooth Bore for High Flow",
          image: "/products/ugd/why-smooth-bore.webp",
          crop: { left: -210, top: -33, width: 680, height: 513 },
        },
        {
          title: "Leak-Proof Joints",
          // Figma flips this photo and rotates it 159.15deg inside the card;
          // that is BAKED into the file (at the source's own scale, nothing
          // upscaled) rather than done with CSS transforms, so the card just
          // shows it whole.
          image: "/products/ugd/why-leak-proof.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Lightweight Yet Load-Bearing",
          image: "/products/ugd/why-lightweight.webp",
          crop: { left: -195, top: -225, width: 608, height: 887 },
        },
        // No photo in the mock yet (needs one from the client).
        { title: "Corrosion Resistant & Rodent Proof" },
        {
          title: "Quick Installation",
          image: "/products/ugd/why-quick-install.webp",
          crop: { left: -18, top: -40, width: 417, height: 520 },
        },
      ],
    },
  },
};
