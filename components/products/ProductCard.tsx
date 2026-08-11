"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Pipette, Flame, Waves, Cylinder, Network, Sprout } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/shared/TiltCard";
import type { Product } from "@/types";

const iconMap = {
  pipette: Pipette,
  flame: Flame,
  waves: Waves,
  cylinder: Cylinder,
  network: Network,
  sprout: Sprout,
} as const;

export function ProductCard({ product }: { product: Product }) {
  const Icon = iconMap[product.icon] ?? Pipette;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <TiltCard className="h-full rounded-2xl">
        <Link
          href={`/products/${product.slug}`}
          className="flex h-full flex-col items-start rounded-2xl border border-slate-200/70 bg-white p-7 text-left transition-colors duration-300 hover:border-ocean-500/40 hover:shadow-xl hover:shadow-ocean-900/5"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700 transition-colors group-hover:bg-ocean-600 group-hover:text-white"
            style={{ transform: "translateZ(40px)" }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <span className="mt-5 font-mono text-xs uppercase tracking-wide text-ocean-700">
            {product.categoryLabel}
          </span>

          <h3
            className="mt-2 font-display text-lg font-medium text-slate-900"
            style={{ transform: "translateZ(24px)" }}
          >
            {product.name}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
            {product.shortDescription}
          </p>

          <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ocean-700">
            <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
              View specifications
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </TiltCard>
    </motion.div>
  );
}