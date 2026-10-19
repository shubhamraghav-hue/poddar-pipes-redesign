import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The sitewide `type-*` scale (styles/globals.css) sets font-size, so it must
// replace a component default like Button's `text-sm`, not sit beside it
// (Tailwind emits its own `text-*` sizes after custom utilities, so they win).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ type: ["hero", "heading", "sub", "body", "label", "small", "eyebrow", "button"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
