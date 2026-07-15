import { cn } from "@/lib/utils";
import { Boomerang } from "@/components/shared/Boomerang";
import { WordReveal } from "@/components/shared/WordReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
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
        <div className="flex items-center gap-3">
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
          <span className="h-px w-8 bg-amber-500" />
          <span className={cn("tech-label", dark ? "text-ocean-300" : "text-ocean-700")}>
            {eyebrow}
          </span>
        </div>
      )}
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        <Boomerang className={cn("mb-1", align === "center" && "self-center")} />
        <h2
          className={cn(
            "max-w-2xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl",
            animate ? "text-pretty" : "text-balance",
            dark ? "text-white" : "text-slate-900"
          )}
        >
          {animate ? <WordReveal text={title} /> : title}
        </h2>
      </div>
      {description && (
        <p
          className={cn(
            "max-w-xl text-balance text-base leading-relaxed",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
