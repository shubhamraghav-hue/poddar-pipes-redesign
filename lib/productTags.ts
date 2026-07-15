import type { Product } from "@/types";

/**
 * Short FeaturePill tags, derived (never fabricated) from a product's own
 * features/benefits/materials copy. A tag only appears if the underlying
 * claim already exists in that product's real catalogue-sourced data —
 * this never asserts a claim the product data doesn't already make.
 */
const TAG_RULES: { pattern: RegExp; label: string }[] = [
  { pattern: /lead-free/i, label: "Lead-Free" },
  { pattern: /uv-stabili[sz]ed|uv resistant/i, label: "UV-Resistant" },
  { pattern: /corrosion/i, label: "Corrosion-Resistant" },
  { pattern: /leak-proof/i, label: "Leak-Proof" },
  { pattern: /fire-retardant|self-extinguishing|limiting oxygen index/i, label: "Fire-Resistant" },
  { pattern: /low maintenance|maintenance-free|minimal maintenance/i, label: "Low-Maintenance" },
  { pattern: /food-safe|food-grade/i, label: "Food-Safe" },
  { pattern: /isi certified/i, label: "ISI Certified" },
  { pattern: /anti-bacterial|nano-silver/i, label: "Anti-Bacterial" },
  { pattern: /rodent-proof/i, label: "Rodent-Proof" },
];

export function getFeatureTags(product: Product, max = 5): string[] {
  const haystack = [...product.features, ...product.benefits, ...product.materials]
    .join(" ")
    .toLowerCase();

  const tags: string[] = [];
  for (const rule of TAG_RULES) {
    if (rule.pattern.test(haystack) && !tags.includes(rule.label)) {
      tags.push(rule.label);
    }
    if (tags.length >= max) break;
  }
  return tags;
}
