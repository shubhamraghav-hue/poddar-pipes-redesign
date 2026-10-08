import type { Product } from "@/types";

/**
 * The /products category showcase — Figma "product pages" (node 1530:7102),
 * one 1512 frame per category. Pill order, labels, taglines and both assets
 * per category are taken from those six frames.
 *
 * Assets were exported straight from Figma:
 *   photo     the "<cat>-card 1" layer, exported at 2x already clipped to the
 *             card's visible 1212x650 band, re-encoded as webp
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
};

export const showcaseCategories: ShowcaseCategory[] = [
  {
    id: "cpvc-pipes",
    label: "CPVC",
    tagline: "Reliable performance for hot and cold water.",
    photo: "/products/showcase/cpvc-card.webp",
    photoAlt: "Three Poddar CPVC pipes on a dark studio backdrop",
    wordmark: "/products/showcase/cpvc-wordmark.svg",
    wordmarkWidth: 275,
    wordmarkInset: 60,
  },
  {
    id: "upvc-pipes",
    label: "uPVC",
    tagline: "Durable pipes for everyday water supply.",
    photo: "/products/showcase/upvc-card.webp",
    photoAlt: "Three Poddar uPVC pipes on a dark studio backdrop",
    wordmark: "/products/showcase/upvc-wordmark.svg",
    wordmarkWidth: 283,
    wordmarkInset: 60,
  },
  {
    id: "agricultural-pipes",
    label: "AGRI",
    tagline: "Efficient water delivery for agriculture.",
    photo: "/products/showcase/agri-card.webp",
    photoAlt: "Poddar agricultural pipes on a dark studio backdrop",
    wordmark: "/products/showcase/agri-wordmark.svg",
    wordmarkWidth: 268,
    wordmarkInset: 64,
  },
  {
    id: "swr-pipes",
    label: "SWR",
    tagline: "Smooth drainage for soil, waste and rainwater.",
    photo: "/products/showcase/swr-card.webp",
    photoAlt: "Poddar SWR drainage pipes on a dark studio backdrop",
    wordmark: "/products/showcase/swr-wordmark.svg",
    wordmarkWidth: 264,
    wordmarkInset: 60,
  },
  {
    id: "ugd-pipes",
    label: "UGD",
    tagline: "Built for efficient underground drainage.",
    photo: "/products/showcase/ugd-card.webp",
    photoAlt: "Poddar underground drainage pipes on a dark studio backdrop",
    wordmark: "/products/showcase/ugd-wordmark.svg",
    wordmarkWidth: 246,
    wordmarkInset: 60,
  },
  {
    id: "tanks",
    label: "TANK",
    tagline: "Safe, durable storage for every drop.",
    photo: "/products/showcase/tank-card.webp",
    photoAlt: "Two white Poddar water storage tanks on a dark studio backdrop",
    wordmark: "/products/showcase/tank-wordmark.svg",
    wordmarkWidth: 288,
    wordmarkInset: 64,
  },
];
