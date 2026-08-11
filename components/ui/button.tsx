import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Optical vertical centering: Anek Devanagari reserves a tall descender area
  // for Indic matras, so Latin label glyphs sit above the line-box centre and
  // look high next to a perfectly-centred icon. `text-box: trim-both cap
  // alphabetic` trims that asymmetric leading so the glyph block itself is what
  // flex centres — aligning text with icons. Progressive enhancement: browsers
  // without text-box support fall back to today's (slightly-high) rendering.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ocean-600 text-white shadow-sm hover:bg-ocean-700 hover:shadow-md",
        "primary-on-dark": "bg-white text-ocean-700 shadow-sm hover:bg-paper-2 hover:shadow-md",
        accent: "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md",
        // Brand Playbook CTA spec: secondary = orange outline + BLUE text (never
        // orange text on a light surface — orange-on-white fails AA, ~2.7:1).
        secondary:
          "border-2 border-amber-500 bg-transparent text-ocean-700 hover:bg-amber-500 hover:text-white",
        outline:
          "border border-slate-200 bg-transparent text-slate-900 hover:border-ocean-500 hover:text-ocean-700",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-50",
        // Used on dark (bg-ink) sections — orange outline still reads as an accent
        // there since it sits on white text at rest, not as unsupported body copy.
        "outline-light":
          "border-2 border-amber-500 bg-transparent text-amber-300 hover:bg-amber-500 hover:text-white",
        "outline-white":
          "border-2 border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10",
        link: "text-ocean-600 underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Bare text children of a flex container don't respect line-height/
    // text-box-trim in Anek Devanagari (its ascent/descent are asymmetric
    // enough that the label renders visibly high vs. an adjacent icon) — see
    // the Search-button investigation. Wrapping just the string children in
    // a real element lets text-box-trim actually do its job. Only strings
    // are wrapped — icon elements, and the single element child Slot expects
    // for `asChild`, pass through untouched.
    const content = React.Children.map(children, (child) =>
      typeof child === "string" ? (
        <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
          {child}
        </span>
      ) : (
        child
      )
    );
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
