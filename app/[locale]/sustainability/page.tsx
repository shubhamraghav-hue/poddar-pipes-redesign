import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Droplet, Recycle, Leaf, Zap, HeartHandshake, GraduationCap } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Counter } from "@/components/shared/Counter";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Sustainability & CSR",
  description:
    "Poddar Pipes' approach to water conservation, green manufacturing, recycling, carbon reduction, energy efficiency, and community programs.",
  alternates: { canonical: "/sustainability" },
};

const pillars = [
  { icon: Droplet, title: "Water Conservation", description: "Our drip and sprinkler irrigation systems help farms reduce water consumption versus flood irrigation methods." },
  { icon: Recycle, title: "Material Recovery", description: "Reclaimed PVC streams are integrated into select non-pressure product lines, reducing virgin resin demand." },
  { icon: Leaf, title: "Green Manufacturing", description: "We evaluate lower-impact resin formulations and production processes as they become viable at scale." },
  { icon: Zap, title: "Energy Efficiency", description: "Ongoing investment in more energy-efficient extrusion equipment across our manufacturing lines." },
];

const csr = [
  { icon: HeartHandshake, title: "Rural water access programs", description: "Supporting piping infrastructure for underserved rural water access initiatives." },
  { icon: GraduationCap, title: "Vocational training partnerships", description: "Partnering with local technical institutes on plumbing and installation skill-building programs." },
];

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              Sustainability
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Durability is our sustainability strategy.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              Pipes engineered for decades of service need replacing less often — that&apos;s the
              foundation of how we think about environmental impact, alongside water-efficient
              product design and responsible manufacturing.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow="Our approach" title="Four areas we focus our efforts on." />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-7">
                <p.icon className="h-6 w-6 text-ocean-700" strokeWidth={1.7} />
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading
            eyebrow="Water impact"
            title="Irrigation efficiency, at field scale."
            description="Our Poddar Agri Gold and Hariyali product ranges are engineered specifically to reduce water waste in agricultural applications."
          />
          <RevealOnScroll className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: 40, suffix: "%", label: "Typical water savings, drip vs. flood irrigation" },
              { value: 5, suffix: "-7 yrs", label: "Typical dripline service life" },
              { value: 120, suffix: " mesh", label: "Recommended filtration standard" },
              { value: 50, suffix: "+ yrs", label: "Design life of uPVC agricultural mains" },
            ].map((stat) => (
              <div key={stat.label}>
                <Counter value={stat.value} suffix={stat.suffix} className="font-display text-3xl font-medium text-slate-900" />
                <p className="mt-1.5 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow="Community" title="CSR programs we support." />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {csr.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700">
                  <c.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-slate-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Partner with us"
        title="Working on a water-access or infrastructure development project?"
        description="We support select rural water access and infrastructure development initiatives — get in touch to discuss partnership."
      />
    </>
  );
}
