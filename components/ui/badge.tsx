import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-ocean-600/10 text-ocean-700",
        // Orange as a background tint (not text) stays within the accessible
        // orange usage — text is always blue per the Playbook's contrast rule.
        amber: "bg-amber-600/10 text-ocean-700",
        outline: "border border-slate-200 text-slate-600",
        dark: "bg-white/10 text-white border border-white/15",
        // Brand Playbook "Orange Elements" — 1-2px orange outline, never filled,
        // text always blue (orange-on-white fails AA at ~2.7:1).
        "brand-pill": "border-[1.5px] border-amber-600 text-ocean-700 bg-transparent",
        "brand-pill-dark": "border-[1.5px] border-amber-500 text-white bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
