import { cn } from "@/lib/utils";
import { WordReveal } from "@/components/shared/WordReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Second part of heading rendered in gold (#E0AF40). When provided, animation is skipped and each part gets its own color. */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  /** Set false to render a plain (non-animated) heading. */
  animate?: boolean;
  /** Optional engineering-drawing index shown as a bracketed mono tag, e.g. "01". */
  index?: string;
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
}: SectionHeadingProps) {
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
      <h2
        className={cn(
          "max-w-2xl font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl",
          animate ? "text-pretty" : "text-balance",
          !titleAccent && (dark ? "text-white" : "text-ocean-950")
        )}
      >
        {titleAccent ? (
          <>
            <span className={dark ? "text-white" : "text-[#0B0B52]"}>{title}</span>{" "}
            <span className="text-[#E0AF40]">{titleAccent}</span>
          </>
        ) : animate ? (
          <WordReveal text={title} />
        ) : title}
      </h2>
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
