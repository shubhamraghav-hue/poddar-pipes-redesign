import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { industries } from "@/lib/data/industries";

export function IndustriesGrid() {
  return (
    <section className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Industries served"
          title="Solutions specified by sector."
          description="Every product line is engineered with a specific set of industry requirements in mind — from potable water compliance to agricultural durability."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <RevealOnScroll key={industry.id} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-7">
                <industry.icon className="h-6 w-6 text-ocean-700" strokeWidth={1.7} />
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">
                  {industry.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {industry.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
