"use client";

import Image from "next/image";
import { ArrowRight, Pipette, Flame, Waves, Cylinder, Network, Sprout } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { BRAND_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Icons are keyed by string so nodes can be defined in a Server Component and
// passed across the client boundary (function props aren't serializable in RSC).
const iconMap = {
  pipette: Pipette,
  flame: Flame,
  waves: Waves,
  cylinder: Cylinder,
  network: Network,
  sprout: Sprout,
} as const;

export interface SchematicNode {
  title: string;
  /** Short engineering annotation shown in mono, e.g. "SCH 40/80" or "IS 4985". */
  spec: string;
  description: string;
  href: string;
  icon: keyof typeof iconMap;
  /** Product/application photo for the card header. */
  image: string;
}

/**
 * PipeSchematicNav — the rebrand's signature device (see BRAND_IDENTITY.md and
 * the `pipe-design-inspirations` skill, pattern #1). Product categories are
 * rendered as valve taps on a single distribution rail: a horizontal pipe with
 * water flowing through it, each category dropping off the rail as a node.
 * Hovering a node lights its valve and lifts the card. Designed for a dark
 * (ink + blueprint) band so it reads as an engineering schematic.
 *
 * Accessibility: every node is a real <Link> with visible text — the rail and
 * valves are decorative (aria-hidden). Reduced-motion users get the static
 * schematic with no flowing water and no reveal offset.
 */
export function PipeSchematicNav({ nodes }: { nodes: SchematicNode[] }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative">
      {/* Distribution rail — a pipe with flowing water, threaded behind the
          valve dots. Desktop only; on smaller screens the nodes stack as a
          plain grid and the rail is hidden. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8.333%] top-[13px] hidden h-[3px] rounded-full bg-ocean-400/25 lg:block"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-70",
            !prefersReduced && "animate-pipe-flow"
          )}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-flow-400) 0 6px, transparent 6px 28px)",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
        {nodes.map((node, i) => (
          <motion.div
            key={node.title}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: BRAND_EASE }}
          >
            <Link
              href={node.href}
              className="group flex h-full flex-col items-center text-center focus:outline-none"
            >
              {/* Valve tap sitting on the rail */}
              <span
                aria-hidden="true"
                className="relative z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-ocean-300/50 bg-ink transition-colors duration-300 group-hover:border-flow-400 group-focus-visible:border-flow-400"
              >
                <span className="h-2 w-2 rounded-full bg-ocean-300/60 transition-all duration-300 group-hover:scale-150 group-hover:bg-flow-400 group-hover:shadow-[0_0_10px_var(--color-flow-400)]" />
              </span>

              {/* Drop connector from rail to card */}
              <span
                aria-hidden="true"
                className="hidden h-6 w-px bg-gradient-to-b from-ocean-300/40 to-transparent transition-colors duration-300 group-hover:from-flow-400/70 lg:block"
              />

              {/* Node card */}
              <div className="mt-2 flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-flow-400/40 group-hover:bg-white/[0.06] lg:mt-0">
                {/* Image header with icon badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={node.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ink/70 text-flow-300 backdrop-blur-sm ring-1 ring-white/10">
                    {(() => {
                      const Icon = iconMap[node.icon];
                      return <Icon className="h-4 w-4" strokeWidth={1.8} />;
                    })()}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{node.title}</h3>
                  <span className="tech-label mt-1 text-flow-300/80">{node.spec}</span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                    {node.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ocean-200 transition-colors group-hover:text-flow-300">
                    <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      Explore
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
