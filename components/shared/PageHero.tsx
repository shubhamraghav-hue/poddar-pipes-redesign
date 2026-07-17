import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional breadcrumb trail shown above the title. */
  breadcrumb?: Crumb[];
  align?: "left" | "center";
  /** CTAs or other content rendered below the description. */
  children?: ReactNode;
}

/**
 * PageHero — the shared inner-page hero for the rebrand. One consistent,
 * premium header across every route: ink + blueprint backdrop, a flow-cyan
 * ambient glow, a monospace technical eyebrow, and a large Anek display title.
 * Replaces the per-page bespoke heroes (which still used the pre-rebrand
 * bg-grid-dark + font-mono treatment).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  align = "left",
  children,
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
      <div className="bg-blue absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-flow-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow pointer-events-none absolute right-[8%] top-1/4 h-52 w-52 rounded-full bg-ocean-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className={cn("container-edge relative", centered && "flex flex-col items-center text-center")}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="tech-label mb-6 flex items-center gap-2 text-ocean-300" aria-label="Breadcrumb">
            {breadcrumb.map((c, i) => (
              <span key={c.label} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-flow-300">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-flow-300">{c.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-ocean-300/50">/</span>}
              </span>
            ))}
          </nav>
        )}

        <RevealOnScroll className={cn(centered && "flex flex-col items-center")}>
          {!breadcrumb && (
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500" />
              <span className="tech-label text-flow-300">{eyebrow}</span>
            </div>
          )}
          <h1
            className={cn(
              "text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl",
              centered ? "max-w-4xl" : "max-w-3xl"
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-6 text-balance text-lg leading-relaxed text-slate-300",
                centered ? "max-w-2xl" : "max-w-xl"
              )}
            >
              {description}
            </p>
          )}
          {children && (
            <div className={cn("mt-8 flex flex-wrap gap-4", centered && "justify-center")}>{children}</div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
