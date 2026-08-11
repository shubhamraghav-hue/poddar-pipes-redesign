import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { industries, type Industry } from "@/lib/data/industries";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const widthBySize: Record<Size, string> = {
  sm: "xl:w-[184px]",
  md: "xl:w-[232px]",
  lg: "xl:w-[292px]",
};

// Desktop-only heights — used purely for the xl+ masonry layout.
// (The 5 fixed column widths total ~1204px including gaps, which doesn't
// fit at the lg breakpoint (1024px) once container padding is subtracted —
// hence xl (1280px) as the switch-over point, not lg.)
const desktopHeightBySize: Record<Size, string> = {
  sm: "xl:h-[236px]",
  md: "xl:h-[300px]",
  lg: "xl:h-[372px]",
};

const titleBySize: Record<Size, string> = {
  sm: "text-sm sm:text-base",
  md: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
};

const COLUMN_SIZES: Size[] = ["sm", "md", "lg", "md", "sm"];

const ORDER = [
  "agriculture", "infrastructure", "residential", "construction", "irrigation",
  "water-supply", "government", "commercial", "industrial", "hospitality",
];

const cardShell =
  "group/card relative block overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-500 ease-out " +
  "hover:-translate-y-2 hover:scale-[1.04] hover:shadow-2xl hover:shadow-ocean-900/25 hover:ring-2 hover:ring-flow-400 " +
  "focus-visible:-translate-y-2 focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flow-400 " +
  "xl:group-hover/grid:opacity-55 hover:!opacity-100 focus-visible:!opacity-100";

const revealDesc =
  "mt-0 max-h-0 translate-y-1 overflow-hidden text-sm leading-relaxed text-slate-200/90 opacity-0 " +
  "transition-all duration-500 ease-out [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] " +
  "group-hover/card:mt-2 group-hover/card:max-h-24 group-hover/card:translate-y-0 group-hover/card:opacity-100 " +
  "group-focus-visible/card:mt-2 group-focus-visible/card:max-h-24 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100";

/** Map hyphenated industry ID to the camelCase key used in translations. */
function industryTKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function IndustryCard({
  industry,
  size,
  name,
  description,
  className,
}: {
  industry: Industry;
  size: Size;
  name: string;
  description: string;
  /** Extra classes, primarily used to control height per-breakpoint from the caller. */
  className?: string;
}) {
  return (
    <Link
      href="/industries"
      aria-label={name}
      className={cn(cardShell, className, "w-full")}
    >
      <Image
        src={industry.image}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-colors duration-500 group-hover/card:from-ink/95 group-hover/card:via-ink/55"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className={cn("font-display font-semibold uppercase tracking-wide text-white drop-shadow", titleBySize[size])}>
          {name}
        </h3>
        <p className={revealDesc}>{description}</p>
      </div>
    </Link>
  );
}

export async function IndustriesServed() {
  const t = await getTranslations("home");
  const tInd = await getTranslations("industries");

  const byId = new Map(industries.map((i) => [i.id, i]));
  const ordered = ORDER.map((id) => byId.get(id)).filter(Boolean) as Industry[];

  const columns = COLUMN_SIZES.map((size, c) => ({
    size,
    cards: [ordered[c], ordered[c + 5]].filter(Boolean) as Industry[],
  }));

  return (
    <section className="bg-paper-2 py-24 md:py-32">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("industriesEyebrow")}
            title={t("industriesH1")}
            titleAccent={t("industriesH2")}
            description={t("industriesDesc")}
          />
          <Link
            href="/industries"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
          >
            <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
              {t("industriesCta")}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile & tablet: uniform grid — 1 column on phones, 2 columns from sm up.
            Natural reading order, equal card heights, no masonry.
            Stays active through laptop sizes (up to xl) since the fixed-width
            desktop masonry needs ~1204px of pure card width to lay out without overflowing. */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:hidden">
          {ordered.map((industry) => {
            const key = industryTKey(industry.id);
            return (
              <IndustryCard
                key={industry.id}
                industry={industry}
                size="md"
                className="h-[260px] sm:h-[240px]"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={tInd(`${key}_name` as any)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                description={tInd(`${key}_desc` as any)}
              />
            );
          })}
        </div>

        {/* Desktop (xl+, i.e. ≥1280px): original 5-column masonry with varied widths/heights.
            Needs xl rather than lg because the five fixed column widths + gaps
            total ~1204px, which doesn't fit at the 1024px lg breakpoint. */}
        <div className="group/grid mt-16 hidden items-center justify-center gap-5 xl:flex">
          {columns.map((col, c) => (
            <div key={c} className={cn("flex flex-col gap-6", widthBySize[col.size])}>
              {col.cards.map((industry) => {
                const key = industryTKey(industry.id);
                return (
                  <IndustryCard
                    key={industry.id}
                    industry={industry}
                    size={col.size}
                    className={cn(widthBySize[col.size], desktopHeightBySize[col.size])}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={tInd(`${key}_name` as any)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    description={tInd(`${key}_desc` as any)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}