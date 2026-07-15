import { Factory, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Counter } from "@/components/shared/Counter";

// NOTE: Placeholder facility locations — replace with your verified plant
// cities and specializations before publishing.
const facilities = [
  { city: "[Plant City 1]", state: "[State]", focus: "uPVC & agricultural pipe extrusion" },
  { city: "[Plant City 2]", state: "[State]", focus: "CPVC plumbing systems" },
  { city: "[Plant City 3]", state: "[State]", focus: "UGD underground drainage & TANKS rotomoulding" },
  { city: "[Plant City 4]", state: "[State]", focus: "SWR drainage & fittings" },
];

export function Facilities() {
  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading
        eyebrow="Manufacturing facilities"
        title="Multiple plants. One shared engineering standard."
        description="Every facility runs the same quality management system and testing protocol, certified under ISO 9001 and audited on a shared schedule."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facilities.map((f, i) => (
          <RevealOnScroll key={f.city} delay={i * 0.06}>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
                <Factory className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-slate-900">{f.city}</h4>
                <p className="text-xs text-slate-500">{f.state}</p>
                <p className="mt-2 text-sm text-slate-600">{f.focus}</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

export function GlobalPresence() {
  return (
    <section className="bg-ink py-24 text-white md:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Pan-India presence"
          title="A footprint built for fast regional restocking."
          dark
        />
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: 28, suffix: "", label: "States with dealer coverage" },
            { value: 4, suffix: "+", label: "Manufacturing plants" },
            { value: 22, suffix: "", label: "Regional distribution hubs" },
            { value: 500, suffix: "+", label: "Dealers & distributors" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 border-l border-white/15 pl-5">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-3xl font-medium text-white md:text-4xl"
              />
              <p className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-ocean-300" /> {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
