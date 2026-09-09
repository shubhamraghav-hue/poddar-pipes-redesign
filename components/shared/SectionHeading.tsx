import { cn } from "@/lib/utils";
import { WordReveal } from "@/components/shared/WordReveal";

interface SectionHeadingProps {
  /** @deprecated Eyebrows were removed sitewide (see BRAND_IDENTITY.md) —
      this prop is now inert. Left in the interface so existing call sites
      don't need editing; safe to delete next time this component is touched. */
  eyebrow?: string;
  title: string;
  /** Second part of the heading, rendered on its own line. Same color/size
      as `title` but always bold (700 vs `title`'s 300) — no accent COLOR,
      per the global heading spec; weight is the one deliberate difference. */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  /** Set false to render a plain (non-animated) heading. */
  animate?: boolean;
  /** @deprecated Rendered alongside the now-removed eyebrow — inert on its own. */
  index?: string;
  /** Heading element to render — "h2" (default, for in-page sections) or "h1" for pages that use this as the page's own top heading (no separate hero above it). */
  as?: "h1" | "h2";
  /** Override the light-background title/titleAccent color (a `text-*`
      class). Defaults to the sitewide grey (`text-[#4a4a4a]`) — only pass
      this to deviate for a specific section confirmed against its own Figma
      frame, not as a general styling knob. No effect when `dark` is true
      (dark sections always use white). */
  titleColorClassName?: string;
}

export function SectionHeading({
  title,
  titleAccent,
  description,
  align = "left",
  dark = false,
  className,
  animate = true,
  as = "h2",
  titleColorClassName,
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
      {/* Global heading spec: weight 300 / line-height 108% / letter-spacing
          0.32px / uppercase, 48px at `md` and up — the existing 30/36/48px
          scale already tops out exactly there, so it's kept rather than
          flattened to a single non-responsive size. `titleAccent`'s one
          deliberate difference from `title`: always weight 700 (bold), same
          color/size/spacing — no accent COLOR, just heavier weight,
          confirmed explicitly.

          COLOR: `#4a4a4a` grey sitewide. This was previously the navy
          `#0B0B52`, with grey applied as a per-section override on
          Categories and Legacy only; the grey was then adopted as the global
          default on request, and those two overrides removed as redundant.
          Changing this one line restyles every light-background heading on
          the site (21 call sites) — `dark` sections are untouched and stay
          white. */}
      <Heading
        className={cn(
          // 28px at base is the MOBILE frame's heading size (home node
          // 1311:11088, which uses it for every section heading); the
          // 36/48px steps above it are the desktop scale and are unchanged.
          // It was `text-3xl` (30px), so mobile headings across the site come
          // down 2px — this component is the single place the global heading
          // spec lives, so the alternative was per-section overrides that
          // would leave the home page 2px off every other page on a phone.
          "max-w-2xl font-display text-[28px] uppercase leading-[1.08] tracking-[0.32px] sm:text-4xl md:text-5xl",
          animate ? "text-pretty" : "text-balance",
          dark ? "text-white" : titleColorClassName ?? "text-[#4a4a4a]"
        )}
      >
        {titleAccent ? (
          <>
            <span className="block font-light">{title}</span>
            <span className="block font-bold">{titleAccent}</span>
          </>
        ) : animate ? (
          <span className="font-light">
            <WordReveal text={title} />
          </span>
        ) : (
          <span className="font-light">{title}</span>
        )}
      </Heading>
      {description && (
        <p
          className={cn(
            // 13px at base, 16px from `sm`. The mobile frame sets all body
            // copy at 13px — it is the dominant size in that node, 18 of its
            // uses — against our 16px. Same reasoning as the title above for
            // changing it here rather than per section.
            "max-w-xl text-balance text-[13px] leading-relaxed sm:text-base",
            dark ? "text-slate-300" : "text-[#5C585A]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
