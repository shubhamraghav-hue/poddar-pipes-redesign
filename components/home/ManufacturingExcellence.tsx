import { FlaskConical, Factory, PackageCheck, Truck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const steps = [
  {
    icon: FlaskConical,
    title: "Resin compounding",
    description: "PVC, CPVC, and PE compounds are formulated and batch-tested before extrusion.",
  },
  {
    icon: Factory,
    title: "Precision extrusion",
    description: "Automated lines hold wall-thickness tolerance across every diameter we make.",
  },
  {
    icon: PackageCheck,
    title: "In-house testing",
    description: "Every batch is pressure and impact tested against IS standards before release.",
  },
  {
    icon: Truck,
    title: "Regional distribution",
    description: "A 500+ dealer network keeps lead times short across every major state.",
  },
];

export function ManufacturingExcellence() {
  return (
    <section className="container-edge py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Manufacturing excellence"
          title="From resin to certified, dealer-ready product."
          description="Our facilities run a single production standard, so a pipe manufactured this year performs identically to the batch before it."
        />
        <Link
          href="/manufacturing"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
        >
          Explore our facilities <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Process flow: a single production line. The rail runs horizontally on
          desktop (behind the step nodes) and vertically down the left on
          mobile, so the four stages always read as one connected sequence. */}
      <ol className="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Desktop rail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-gradient-to-r from-ocean-500/40 via-flow-400/50 to-ocean-500/40 lg:block"
        />
        {/* Mobile rail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-ocean-500/40 via-flow-400/50 to-transparent sm:hidden"
        />

        {steps.map((step, i) => (
          <RevealOnScroll key={step.title} delay={i * 0.1}>
            <li className="relative flex gap-5 sm:block">
              {/* Node: valve tap with the stage number */}
              <div className="relative z-10 flex shrink-0 items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ocean-600/25 bg-white text-ocean-700 shadow-sm transition-colors">
                  <step.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="tech-label text-flow-500 sm:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="sm:mt-6">
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="tech-label text-flow-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-6 bg-ocean-500/30" />
                </div>
                <h3 className="mt-0 font-display text-lg font-semibold text-slate-900 sm:mt-3">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </section>
  );
}
