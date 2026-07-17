import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { industries, type Industry } from "@/lib/data/industries";
import { cn } from "@/lib/utils";

/**
 * "Industries Served" — a premium editorial gallery. Two rows of five following
 * a Small → Medium → Large → Medium → Small hierarchy: the Large centre column
 * is the focal point, cards grow toward the centre and taper to the edges for a
 * symmetric, architecture-portfolio composition.
 *
 * Layout is built as five vertical COLUMNS (each a stacked pair), centred on the
 * cross axis — because each column is internally symmetric (card · gap · card),
 * every column's gap lands on the same centreline, so the space between the two
 * rows is a single constant band regardless of card height.
 *
 * Interaction is hover/focus only — lift, scale, image zoom, accent ring,
 * gradient darken, and a description that fades + slides up (clamped to 3
 * lines); non-hovered cards dim. No carousel, scroll effects, autoplay, or
 * parallax.
 */

type Size = "sm" | "md" | "lg";

// Small below lg (uniform, stackable); the pyramid sizing kicks in at lg.
const widthBySize: Record<Size, string> = {
  sm: "w-full sm:w-[calc(50%-0.625rem)] lg:w-[184px]",
  md: "w-full sm:w-[calc(50%-0.625rem)] lg:w-[232px]",
  lg: "w-full sm:w-[calc(50%-0.625rem)] lg:w-[292px]",
};
const heightBySize: Record<Size, string> = {
  sm: "h-[240px] lg:h-[236px]",
  md: "h-[240px] lg:h-[300px]",
  lg: "h-[260px] lg:h-[372px]",
};
const titleBySize: Record<Size, string> = {
  sm: "text-sm sm:text-base",
  md: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
};

// Small → Medium → Large → Medium → Small, per column (left to right).
const COLUMN_SIZES: Size[] = ["sm", "md", "lg", "md", "sm"];

// Display order (10 industries). Indices 2 and 7 land in the Large focal column,
// so the two strongest images anchor each row's centre.
const ORDER = [
  "agriculture",
  "infrastructure",
  "residential",
  "construction",
  "irrigation",
  "water-supply",
  "government",
  "commercial",
  "industrial",
  "hospitality",
];

const cardShell =
  "group/card relative block overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-500 ease-out " +
  "hover:-translate-y-2 hover:scale-[1.04] hover:shadow-2xl hover:shadow-ocean-900/25 hover:ring-2 hover:ring-flow-400 " +
  "focus-visible:-translate-y-2 focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flow-400 " +
  "group-hover/grid:opacity-55 hover:!opacity-100 focus-visible:!opacity-100";

const revealDesc =
  "mt-0 max-h-0 translate-y-1 overflow-hidden text-sm leading-relaxed text-slate-200/90 opacity-0 " +
  "transition-all duration-500 ease-out [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] " +
  "group-hover/card:mt-2 group-hover/card:max-h-24 group-hover/card:translate-y-0 group-hover/card:opacity-100 " +
  "group-focus-visible/card:mt-2 group-focus-visible/card:max-h-24 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100";

function IndustryCard({ industry, size }: { industry: Industry; size: Size }) {
  return (
    <Link
      href="/industries"
      aria-label={industry.name}
      className={cn(cardShell, heightBySize[size], "w-full")}
    >
      <Image
        src={industry.image}
        alt={industry.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-colors duration-500 group-hover/card:from-ink/95 group-hover/card:via-ink/55"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3
          className={cn(
            "font-display font-semibold uppercase tracking-wide text-white drop-shadow",
            titleBySize[size],
          )}
        >
          {industry.name}
        </h3>
        <p className={revealDesc}>{industry.description}</p>
      </div>
    </Link>
  );
}

export function IndustriesServed() {
  const byId = new Map(industries.map((i) => [i.id, i]));
  const ordered = ORDER.map((id) => byId.get(id)).filter(Boolean) as Industry[];

  // Five columns, each a top/bottom pair (row 1 + row 2).
  const columns = COLUMN_SIZES.map((size, c) => ({
    size,
    cards: [ordered[c], ordered[c + 5]].filter(Boolean) as Industry[],
  }));

  return (
    <section className="bg-paper-2 py-24 md:py-32">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Industries served"
            title="Built into the infrastructure of everyday life."
            description="From city water mains to greenhouse irrigation blocks, our systems operate quietly behind the industries that depend on reliable water movement."
          />
          <Link
            href="/industries"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
          >
            View all industries <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Five vertically-centred columns → constant gap band between the rows. */}
        <div className="group/grid mt-16 flex flex-wrap items-center justify-center gap-5 lg:flex-nowrap">
          {columns.map((col, c) => (
            <div key={c} className={cn("flex flex-col gap-6", widthBySize[col.size])}>
              {col.cards.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} size={col.size} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
