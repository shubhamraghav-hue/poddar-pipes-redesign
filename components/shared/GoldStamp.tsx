import { cn } from "@/lib/utils";

/**
 * GoldStamp — medal-inspired badge from the Brand Playbook's "Stamps"
 * section, used sparingly to reinforce quality, certification, or
 * category-tier claims. Not for repeated/decorative use.
 */
export function GoldStamp({
  label,
  sublabel,
  className,
}: {
  label: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-2 text-center",
        className
      )}
      style={{ borderColor: "var(--color-gold-500)" }}
    >
      <div
        className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full border"
        style={{ borderColor: "var(--color-gold-300)" }}
      >
        <span
          className="font-display text-[12px] font-semibold uppercase leading-tight tracking-wide"
          // #8a6420, not gold-600 (#b0812e): that was ~3.1:1 on the paper
          // background, under the 4.5:1 this 12px label needs.
          style={{ color: "#8a6420" }}
        >
          {label}
        </span>
        {sublabel && (
          <span className="mt-0.5 max-w-[80px] text-[12px] leading-tight text-slate-600">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
