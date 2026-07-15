import { Link } from "@/i18n/navigation";
import { Recycle, Droplet, Zap, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const pillars = [
  { icon: Recycle, title: "Material recovery", description: "Reclaimed PVC streams reduce virgin resin use in select product lines." },
  { icon: Droplet, title: "Water-efficient irrigation", description: "Our drip systems help farms cut water consumption significantly." },
  { icon: Zap, title: "Energy-efficient extrusion", description: "Ongoing investment in lower-energy manufacturing processes." },
];

export function Sustainability() {
  return (
    <section className="container-edge py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Sustainability"
          title="Durability is our sustainability strategy."
          description="Pipes that last decades need replacing less often — that's the core of how we think about environmental impact."
        />
        <Link
          href="/sustainability"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
        >
          Our sustainability approach <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {pillars.map((p, i) => (
          <RevealOnScroll key={p.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-7">
              <p.icon className="h-6 w-6 text-ocean-700" strokeWidth={1.7} />
              <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.description}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
