import type { Product } from "@/types";

/**
 * The /products category showcase — Figma "product pages" (node 1530:7102),
 * one 1512 frame per category. Pill order, labels, taglines and both assets
 * per category are taken from those six frames.
 *
 * Assets were exported straight from Figma:
 *   photo     the client's portrait product shots from the 4K originals
 *             ("<RANGE> - website card (w logo).png", 2747x4096, 2026-10-12;
 *             spotlight top-left, product bottom-right), webp q90 at full
 *             size; next/image serves resized copies at quality 90 (see
 *             ShowcaseCard). One image per range, cropped per breakpoint by
 *             `photoY`
 *   wordmark  the "<cat>" component instance as SVG, reduced to the instance's
 *             own group (Figma's export carries every ancestor's background).
 *             SVG rather than PNG because the type is Torque, which the site
 *             does not load — the export outlines it — and because the PNG
 *             export rendered the instance's white frame fill UNDER the white
 *             lettering.
 */
export type ShowcaseCategory = {
  id: Exclude<Product["category"], never>;
  /** The pill label, as the mock sets it. */
  label: string;
  tagline: string;
  photo: string;
  photoAlt: string;
  wordmark: string;
  /** The wordmark's exported size, at 1x (Figma's 90.56 height rounds to 91). */
  wordmarkWidth: number;
  /** Figma insets AGRI and TANK 4px further in (x64, not x60). */
  wordmarkInset: number;
  /**
   * Vertical focus of the portrait photo (2747x4096, product bottom-right)
   * when the card crops it: `sm` is the 4:3 tablet card, `lg` the 1212:650
   * desktop card. 100 = bottom edge. Pipes sit at y≈63–98% (keep the
   * bottom); the tanks are taller and start at y≈50%, so they sit higher.
   */
  photoY: { sm: number; lg: number };
  /**
   * A landscape shot used INSTEAD of `photo` on the desktop card (`lg`+),
   * where the card is 1212:650. TANK only (Figma 1858:11864, 4096x2286).
   */
  photoWide?: string;
};

export const showcaseCategories: ShowcaseCategory[] = [
  {
    id: "cpvc-pipes",
    label: "CPVC",
    tagline: "Corrosion-free piping for hot and cold water.",
    photo: "/products/showcase/cpvc-hero.webp",
    photoAlt: "Three Poddar CPVC pipes on a dark studio backdrop",
    wordmark: "/products/showcase/cpvc-wordmark.svg",
    wordmarkWidth: 275,
    wordmarkInset: 60,
    photoY: { sm: 100, lg: 98 },
  },
  {
    id: "upvc-pipes",
    label: "uPVC",
    tagline: "Durable pipes for everyday water supply.",
    photo: "/products/showcase/upvc-hero.webp",
    photoAlt: "Three Poddar uPVC pipes on a dark studio backdrop",
    wordmark: "/products/showcase/upvc-wordmark.svg",
    wordmarkWidth: 283,
    wordmarkInset: 60,
    photoY: { sm: 100, lg: 98 },
  },
  {
    id: "agricultural-pipes",
    label: "AGRI",
    tagline: "Efficient water delivery for agriculture.",
    photo: "/products/showcase/agri-hero.webp",
    photoAlt: "Poddar agricultural pipes on a dark studio backdrop",
    wordmark: "/products/showcase/agri-wordmark.svg",
    wordmarkWidth: 268,
    wordmarkInset: 64,
    photoY: { sm: 100, lg: 98 },
  },
  {
    id: "swr-pipes",
    label: "SWR",
    tagline: "Smooth drainage for soil, waste and rainwater.",
    photo: "/products/showcase/swr-hero.webp",
    photoAlt: "Poddar SWR drainage pipes on a dark studio backdrop",
    wordmark: "/products/showcase/swr-wordmark.svg",
    wordmarkWidth: 264,
    wordmarkInset: 60,
    photoY: { sm: 100, lg: 98 },
  },
  {
    id: "ugd-pipes",
    label: "UGD",
    tagline: "Built for efficient underground drainage.",
    photo: "/products/showcase/ugd-hero.webp",
    photoAlt: "Poddar underground drainage pipes on a dark studio backdrop",
    wordmark: "/products/showcase/ugd-wordmark.svg",
    wordmarkWidth: 246,
    wordmarkInset: 60,
    photoY: { sm: 100, lg: 98 },
  },
  {
    id: "tanks",
    label: "TANK",
    tagline: "Safe, durable storage for every drop.",
    photo: "/products/showcase/tank-hero.webp",
    photoAlt: "Two white Poddar water storage tanks on a dark studio backdrop",
    wordmark: "/products/showcase/tank-wordmark.svg",
    wordmarkWidth: 288,
    wordmarkInset: 64,
    photoY: { sm: 86, lg: 78 },
    photoWide: "/products/showcase/tank-wide.webp",
  },
];
