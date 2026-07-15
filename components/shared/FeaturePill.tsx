import { cn } from "@/lib/utils";

/**
 * FeaturePill — Brand Playbook "Orange Elements" pill for short feature tags
 * (Lead-Free, UV-Resistant, Corrosion-Resistant, Leak-Proof, Fire-Resistant,
 * Maintenance-Free, etc.). 1-2px orange outline, never filled, centred
 * title-case text. Text is always blue, never orange — orange-on-white text
 * fails AA contrast (~2.7:1) — the outline alone carries the orange accent.
 */
export function FeaturePill({
  children,
  dark = false,
  className,
}: {
  children: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-[1.5px] px-3.5 py-1 text-center text-xs font-medium capitalize",
        dark ? "border-amber-500 text-white" : "border-amber-600 text-ocean-700",
        className
      )}
    >
      {children}
    </span>
  );
}
