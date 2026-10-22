import type { ShowcaseCategory } from "@/lib/data/productShowcase";

/**
 * Per-range detail sections on /products, under the range card — Figma
 * "products pages - 2nd draft" (section 1859:12796, one 1512 frame per range:
 * CPVC 1858:10809, uPVC 1858:11020, UGD 1858:11226, SWR 1858:11432, AGRI
 * 1858:11638, TANK 1858:11843). "What is <range>?" (navy band, a render on the
 * right) and "Why <range>?" (a row of 400x480 photo cards).
 *
 * Images were exported from the frames at their FULL source resolution (webp
 * q90, nothing upscaled) — public/products/<range>/. Each card photo is placed
 * exactly as the mock places it inside its 400x480 card (`crop`, in px of that
 * card) — the mock does not centre-crop them, so `object-cover` alone would
 * frame them differently.
 */

export type WhyCard = {
  title: string;
  /** Omitted when the mock has no photo for the card (the navy card shows). */
  image?: string;
  /** The photo's box inside the 400x480 card, as Figma positions it. */
  crop?: { left: number; top: number; width: number; height: number };
  /** Mirrored left-right in the mock (SWR's soil/waste/rain card). */
  flipX?: boolean;
};

export type ProductDetail = {
  whatIs: {
    /** The light first line of the heading — "What is" unless set. */
    lead?: string;
    /** The bold second line. Case is kept as written ("uPVC?"). */
    name: string;
    body: string;
    /** Body column width at 1512 (Figma 551; TANK 505). */
    bodyW?: number;
    /** The full render (backdrop, floor reflection) and the subject cut out. */
    scene: string;
    cutout: string;
    alt: string;
    /**
     * The render box at 1512, flush right: Figma's width x height, and how far
     * its centre sits from the 780px band's middle (+ is lower). The band
     * crops it, and below `lg` the SAME band-height crop is shown (see
     * ProductDetailSections), so these also set the phone/tablet framing.
     * `washW`: the navy wash's width as a share of the box (AGRI 605/813).
     */
    art: { w: number; h: number; centerY: number; washW?: number };
    /** Below `lg`: the client's flattened square "section 2" art (2334x2340). */
    mobileArt: string;
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
      mobileArt: "/products/cpvc/what-is-mobile.webp",
      alt: "Ball-and-stick model of a CPVC polymer chain",
      art: { w: 778, h: 1160, centerY: 40 },
    },
    why: {
      name: "CPVC?",
      cards: [
        {
          title: "Safe for Drinking Water Lines",
          image: "/products/cpvc/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "No Rust, Scale or Pitting",
          image: "/products/cpvc/why-v2-2.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Built for Hot & Cold Water",
          image: "/products/cpvc/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Fire Retardant",
          image: "/products/cpvc/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Quick Cold-Weld Installation",
          image: "/products/cpvc/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
      ],
    },
  },
  "upvc-pipes": {
    whatIs: {
      name: "uPVC?",
      body: "Unplasticised polyvinyl chloride (uPVC) is a thermoplastic used for cold water plumbing, water supply and underground drainage. It resists rust, corrosion and decay, with a lead-free solvent-weld system for homes and commercial buildings.",
      scene: "/products/upvc/molecule-scene.webp",
      cutout: "/products/upvc/molecule.webp",
      mobileArt: "/products/upvc/what-is-mobile.webp",
      alt: "Ball-and-stick model of a PVC polymer chain",
      art: { w: 778, h: 1160, centerY: 40 },
    },
    why: {
      name: "uPVC?",
      cards: [
        {
          title: "Lead-Free for Safe Drinking Water",
          image: "/products/upvc/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Resistant to Chemicals",
          image: "/products/upvc/why-v2-2.webp",
          // Figma draws this 626x470 — 10px short of the card, which leaves a
          // strip of bare card under the footer. Scaled to 480 tall about the
          // same centre instead.
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Built for Cold Water & Drainage",
          image: "/products/upvc/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Maintenance-Free",
          image: "/products/upvc/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Quick Solvent-Weld Installation",
          image: "/products/upvc/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
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
      mobileArt: "/products/ugd/what-is-mobile.webp",
      alt: "Poddar UGD pipe fittings — bends, a Y-junction and couplers",
      art: { w: 757, h: 1129, centerY: 100.5 },
    },
    why: {
      name: "UGD?",
      cards: [
        {
          title: "Smooth Bore for High Flow",
          image: "/products/ugd/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Leak-Proof Joints",
          // Figma flips this photo and rotates it 160.6deg inside the card;
          // that is BAKED into the file (at the source's own scale, nothing
          // upscaled) rather than done with CSS transforms.
          image: "/products/ugd/why-v2-2.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Lightweight Yet Load-Bearing",
          image: "/products/ugd/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Corrosion Resistant",
          image: "/products/ugd/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Quick Installation",
          image: "/products/ugd/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
      ],
    },
  },
  "swr-pipes": {
    whatIs: {
      name: "SWR?",
      body: "Soil, Waste and Rainwater (SWR) systems are uPVC pipes and fittings that carry soil, waste and rainwater in residential, commercial and industrial applications. Poddar offers them in both Ring Joint and Solvent Joint options.",
      // 1767x2633 — the largest this exists in the Figma file.
      scene: "/products/swr/pipes-scene.webp",
      cutout: "/products/swr/pipes.webp",
      mobileArt: "/products/swr/what-is-mobile.webp",
      alt: "Poddar SWR pipes and fittings",
      art: { w: 758, h: 1129, centerY: -20.5 },
    },
    why: {
      name: "SWR?",
      cards: [
        {
          title: "Smooth Bore for High Flow Rates",
          image: "/products/swr/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Leak-Proof Ring & Solvent Joints",
          image: "/products/swr/why-v2-2.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Corrosion & Abrasion Resistant",
          image: "/products/swr/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Built for Soil, Waste & Rainwater",
          image: "/products/swr/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Quick & Easy Installation",
          image: "/products/swr/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
      ],
    },
  },
  "agricultural-pipes": {
    whatIs: {
      name: "AGRI?",
      body: "Agri is a lead-free uPVC solvent-weld system, purpose-built for agricultural water supply. Poddar Agri pipes are made to IS 4985:2021 and come in sizes from 20 to 315mm across different pressure classes.",
      scene: "/products/agri/pipes-scene.webp",
      cutout: "/products/agri/pipes.webp",
      mobileArt: "/products/agri/what-is-mobile.webp",
      alt: "Poddar Agri pipes stacked on a farm field",
      art: { w: 813, h: 1212, centerY: -216, washW: 605 / 813 },
    },
    why: {
      name: "AGRI?",
      cards: [
        {
          title: "UV Resistant",
          image: "/products/agri/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Zero Toxicity, Odour & Taste",
          image: "/products/agri/why-v2-2.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "100% Leak-Proof Jointing",
          image: "/products/agri/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Withstands High Pressure",
          image: "/products/agri/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Cost-Efficient",
          image: "/products/agri/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
      ],
    },
  },
  tanks: {
    whatIs: {
      // The TANK frame titles this band "Poddar / Tank"; set to the same
      // "What is / <name>?" pattern as the other five for consistency
      // (client, 2026-10-16), keeping the mock's "Poddar Tank" naming — which
      // also matches this range's "Why Poddar Tank?" band.
      name: "PODDAR TANK?",
      body: "Poddar Tank Gold is a range of three- and four-layer water storage tanks, built to protect stored water. Each layer guards against contamination, heat and everyday wear, and every tank carries a 10-year warranty.",
      bodyW: 505,
      scene: "/products/tank/tanks-scene.webp",
      cutout: "/products/tank/tanks.webp",
      mobileArt: "/products/tank/what-is-mobile.webp",
      alt: "Two Poddar water storage tanks",
      art: { w: 811, h: 1086, centerY: 0 },
    },
    why: {
      name: "PODDAR TANK?",
      cards: [
        {
          title: "Safe for Drinking Water",
          image: "/products/tank/why-v2-1.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "100% Virgin Plastic",
          image: "/products/tank/why-v2-2.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Anti-Bacterial Protection",
          image: "/products/tank/why-v2-3.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Anti-Algae Protection",
          image: "/products/tank/why-v2-4.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
        {
          title: "Anti-Fungal Protection",
          image: "/products/tank/why-v2-5.webp",
          crop: { left: 0, top: 0, width: 400, height: 480 },
        },
      ],
    },
  },
};
