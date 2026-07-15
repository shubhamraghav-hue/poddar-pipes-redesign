// components/home/IndustriesServed.tsx
"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { industries } from "@/lib/data/industries";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Industry = (typeof industries)[number];

const EASE = [0.22, 1, 0.36, 1] as const;

const SPAN: Record<number, string> = {
  0: "sm:col-span-2 sm:row-span-2", // residential — featured
  1: "sm:col-span-1 sm:row-span-1",
  2: "sm:col-span-1 sm:row-span-1",
  3: "sm:col-span-1 sm:row-span-1",
  4: "sm:col-span-1 sm:row-span-2", // infrastructure — featured
  5: "sm:col-span-1 sm:row-span-1",
  6: "sm:col-span-2 sm:row-span-1", // water supply — featured
  7: "sm:col-span-1 sm:row-span-1",
  8: "sm:col-span-1 sm:row-span-1",
};

const FEATURED_IDS = new Set(["residential", "infrastructure", "water-supply"]);

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px) and (hover: hover)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

const cardVariants: Variants = {
  rest: { transition: { staggerChildren: 0.035 } },
  active: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};

const imageVariants: Variants = {
  rest: { scale: 1 },
  active: { scale: 1.03, transition: { duration: 0.7, ease: EASE } },
};

const overlayVariants: Variants = {
  rest: { opacity: 0.55 },
  active: { opacity: 0.82, transition: { duration: 0.5, ease: EASE } },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0, filter: "brightness(1)" },
  active: {
    scale: 1.12,
    rotate: 4,
    filter: "brightness(1.25)",
    transition: { duration: 0.4, ease: EASE },
  },
};

const titleVariants: Variants = {
  rest: { y: 0 },
  active: { y: -3, transition: { duration: 0.35, ease: EASE } },
};

const accentVariants: Variants = {
  rest: { width: 0, opacity: 0 },
  active: { width: 56, opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

const descriptionVariants: Variants = {
  rest: { opacity: 0, y: 8 },
  active: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const ctaVariants: Variants = {
  rest: { opacity: 0, y: 6 },
  active: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const ctaArrowVariants: Variants = {
  rest: { x: 0 },
  active: { x: 4, transition: { duration: 0.3, ease: EASE } },
};

interface IndustryTileProps {
  industry: Industry;
  span: string;
  index: number;
  isFeatured: boolean;
  isDesktop: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function IndustryTile({
  industry,
  span,
  index,
  isFeatured,
  isDesktop,
  isExpanded,
  onToggle,
}: IndustryTileProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const active = isDesktop ? isHovered : isExpanded;
  const Icon = industry.icon as ComponentType<{ className?: string; strokeWidth?: number }>;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDesktop || !spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    spotlightRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    spotlightRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      variants={cardVariants}
      animate={active ? "active" : "rest"}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
      onClick={() => !isDesktop && onToggle()}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 ${span} ${
        isDesktop ? "min-h-0" : "min-h-[220px]"
      }`}
      role={!isDesktop ? "button" : undefined}
      aria-expanded={!isDesktop ? isExpanded : undefined}
      tabIndex={!isDesktop ? 0 : undefined}
    >
      <motion.div variants={imageVariants} className="absolute inset-0">
        <Image
          src={industry.image}
          alt={industry.name}
          fill
          className="object-cover"
          sizes="(min-width: 640px) 33vw, 100vw"
        />
      </motion.div>

      {/* Base scrim, deepens on active */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10"
      />

      {/* Radial spotlight — desktop only, driven by CSS var, no rerenders */}
      {isDesktop && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(122,199,222,0.14), transparent 70%)",
          }}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <motion.div variants={iconVariants} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
          <Icon
            className={isFeatured ? "h-5 w-5 text-ocean-300" : "h-4 w-4 text-ocean-300"}
            strokeWidth={1.6}
          />
        </motion.div>

        <motion.h3
          variants={titleVariants}
          className={`mt-3 font-display font-medium text-white ${
            isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {industry.name}
        </motion.h3>

        <motion.span
          variants={accentVariants}
          className="mt-2 block h-px bg-ocean-300"
        />

        <motion.p
          variants={descriptionVariants}
          className={`mt-3 leading-relaxed text-slate-300 ${
            isFeatured ? "text-sm sm:text-base" : "text-sm"
          }`}
        >
          {industry.description}
        </motion.p>

        <motion.span
          variants={ctaVariants}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ocean-300"
        >
          Explore industry
          <motion.span variants={ctaArrowVariants}>→</motion.span>
        </motion.span>
      </div>
    </motion.div>
  );
}

function BlueprintBackdrop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const paths = [
    "M0 120 H340 V300 H620 V80 H1200",
    "M0 420 H180 V560 H520 V620 H900 V500 H1200",
    "M260 300 V800",
    "M620 80 V0",
    "M900 500 V320 H1200",
    "M180 420 V240 H420",
  ];
  const nodes: [number, number][] = [
    [340, 120],
    [620, 300],
    [180, 420],
    [520, 560],
    [900, 500],
    [420, 240],
  ];

  return (
    <div
      ref={sectionRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)",
      }}
    >
      <motion.svg
        style={{ y }}
        className="h-full w-full opacity-[0.045]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="text-ocean-300">
          {paths.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: i * 0.12, ease: EASE }}
            />
          ))}
          {nodes.map(([cx, cy], i) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={5}
              fill="currentColor"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 + i * 0.12, duration: 0.3, ease: EASE }}
            />
          ))}
        </g>
      </motion.svg>
    </div>
  );
}

export function IndustriesServed() {
  const isDesktop = useIsDesktop();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <BlueprintBackdrop />

      <div className="container-edge relative">
        <SectionHeading
          eyebrow="Industries served"
          title="Built into the infrastructure of everyday life."
          description="From city water mains to greenhouse irrigation blocks, our systems operate quietly behind the industries that depend on reliable water movement."
          dark
        />

        <RevealOnScroll className="mt-16">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:[grid-auto-flow:dense] sm:[grid-auto-rows:180px]">
            {industries.map((industry, i) => (
              <IndustryTile
                key={industry.id}
                industry={industry}
                span={SPAN[i] ?? "sm:col-span-1 sm:row-span-1"}
                index={i}
                isFeatured={FEATURED_IDS.has(industry.id)}
                isDesktop={isDesktop}
                isExpanded={expandedId === industry.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === industry.id ? null : industry.id))
                }
              />
            ))}
            <Link href="/industries" className="group">
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: industries.length * 0.05, ease: EASE }}
    whileHover={{ borderColor: "rgba(122,199,222,0.4)" }}
    className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 sm:min-h-0"
  >
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
      <ArrowUpRight className="h-4 w-4 text-ocean-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.6} />
    </span>
    <div>
      <h3 className="font-display text-base font-medium text-white sm:text-lg">
        View all industries
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        See every sector we engineer for, in full detail.
      </p>
    </div>
  </motion.div>
</Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}