import { cn } from "@/lib/utils";

/**
 * Boomerang — the Brand Playbook's signature shape, derived from the
 * Poddar logo's "P" form. Per spec: gold, paired only with primary
 * headings, positioned at the top-left of the heading text block, never
 * rotated/mirrored/recoloured, never duplicated within one layout.
 */
export function Boomerang({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={cn("h-6 w-10", className)}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M4 34C4 34 10 8 34 5C50 3 60 12 60 12"
        stroke="url(#boomerangGradient)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="boomerangGradient" x1="4" y1="34" x2="60" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-gold-600)" />
          <stop offset="50%" stopColor="var(--color-gold-500)" />
          <stop offset="100%" stopColor="var(--color-gold-300)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
