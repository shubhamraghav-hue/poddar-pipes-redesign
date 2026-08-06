import { cn } from "@/lib/utils";
import { WordReveal } from "@/components/shared/WordReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Second part of heading, always rendered bold on its own line in brand orange (amber-500). When provided, animation is skipped and each part gets its own color/weight. */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  /** Set false to render a plain (non-animated) heading. */
  animate?: boolean;
  /** Optional engineering-drawing index shown as a bracketed mono tag, e.g. "01". */
  index?: string;
  /** Heading element to render — "h2" (default, for in-page sections) or "h1" for pages that use this as the page's own top heading (no separate hero above it). */
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  align = "left",
  dark = false,
  className,
  animate = true,
  index,
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-2">
          {index && (
            <span
              className={cn(
                "tech-label rounded-sm border px-1.5 py-0.5",
                dark
                  ? "border-flow-300/40 text-flow-300"
                  : "border-ocean-600/30 text-ocean-700"
              )}
            >
              {index}
            </span>
          )}
          {/* Corner bracket — brand accent, replaces the old dash + Boomerang pair */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002"
              stroke="#F28000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-widest",
               "text-amber-600"
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <Heading
        className={cn(
          "max-w-2xl font-display text-3xl uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl",
          animate ? "text-pretty" : "text-balance",
          !titleAccent && (dark ? "font-bold text-white" : "font-bold text-ocean-950")
        )}
      >
        {titleAccent ? (
          <>
            {/* Designer spec: lead line is thin weight in brand blue; accent
                line is always brand orange amber-500 (#f5951f) — a designer
                override of an earlier amber-700 AA-contrast fix. amber-500
                measures ~2.28:1 on white/paper-2 (below the 3:1 AA floor for
                large text) but ~7.45:1 on ink — flagged as a known
                accessibility tradeoff on light backgrounds, kept because the
                designer explicitly asked for this exact shade everywhere.
                `block` forces the accent onto its own line always, rather
                than depending on the string being long enough to wrap. */}
            <span className={cn("block font-medium", dark ? "text-white" : "text-ocean-600")}>
              {title}
            </span>
            <span className="block font-bold text-amber-500">{titleAccent}</span>
          </>
        ) : animate ? (
          <WordReveal text={title} />
        ) : title}
      </Heading>
      {description && (
        <p
          className={cn(
            "max-w-xl text-balance text-base leading-relaxed",
            dark ? "text-slate-300" : "text-[#5C585A]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
