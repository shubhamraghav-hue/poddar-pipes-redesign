import { Link } from "@/i18n/navigation";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { GoldStamp } from "@/components/shared/GoldStamp";
import { Marquee } from "@/components/shared/Marquee";
import { certifications } from "@/lib/data/certifications";

export function QualityCertifications() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-flow-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Quality assurance"
            title="Every batch tested before it reaches a dealer."
            description="Our labs run continuous pressure, impact, and thermal testing against Indian Standards — not spot checks."
            dark
          />
          <Link
            href="/quality"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-200 transition-colors hover:text-flow-300"
          >
            Our quality process <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Seal wall — the marks, front and centre on the vault. */}
        <RevealOnScroll className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:justify-start">
          <GoldStamp label="ISI Marked" sublabel="IS 15778 / 13592 / 16098" />
          <GoldStamp label="ISO 9001" sublabel="Quality Management" />
          <GoldStamp label="ISO 14001" sublabel="Environmental Mgmt." />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            <span className="tech-label text-flow-300">100% batch-tested</span>
            <span className="mt-1.5 block">
              Independent conformance to Indian Standards, verified before every dispatch.
            </span>
          </p>
        </RevealOnScroll>

        {/* Every certification, flowing past — a credentials ticker. */}
        <div className="mt-12">
          <Marquee speed={40} direction="right" className="py-2">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-flow-300" strokeWidth={1.7} />
                <div>
                  <p className="tech-label whitespace-nowrap text-flow-300">{c.code}</p>
                  <p className="mt-1 whitespace-nowrap text-sm text-slate-300">{c.name}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
