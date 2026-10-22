import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      // `pt-[0.375em]`: an <input> ignores text-box-trim, and Anek's tall
      // Devanagari line box puts Latin caps 0.1875em ABOVE centre (16px:
      // ascent 16 / descent 11 / cap 11 → 3px). Top padding of twice that
      // centres the text at ANY font size — the old fixed 5px left 16px
      // fields 0.5px high (client 2026-10-22).
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pt-[0.375em] text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:border-ocean-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
