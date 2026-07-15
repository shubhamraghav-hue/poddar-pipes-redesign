import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Factory, Cog, ScanLine, FlaskConical, Warehouse, Truck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Counter } from "@/components/shared/Counter";
import { Facilities } from "@/components/about/Facilities";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Manufacturing Excellence",
  description:
    "Explore Poddar Pipes' manufacturing facilities, automation, testing labs, warehousing, and logistics network across India.",
  alternates: { canonical: "/manufacturing" },
};

const capabilities = [
  { icon: Cog, title: "Automated extrusion lines", description: "Computer-controlled extrusion holds wall-thickness tolerance across every diameter we produce." },
  { icon: ScanLine, title: "In-line quality scanning", description: "Continuous diameter and wall-thickness monitoring flags deviations in real time during production." },
  { icon: FlaskConical, title: "In-house testing labs", description: "Every batch is tested for pressure rating, impact resistance, and material composition before release." },
  { icon: Warehouse, title: "Regional warehousing", description: "Distribution warehouses keep stock close to dealer networks for faster restocking." },
  { icon: Truck, title: "Logistics network", description: "A dedicated fleet and third-party logistics partners keep delivery timelines predictable." },
  { icon: Factory, title: "Continuous capacity expansion", description: "Ongoing investment in new lines keeps pace with growing demand across product categories." },
];

export default async function ManufacturingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              Manufacturing
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              From resin to certified, dealer-ready pipe.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              Every facility in our network runs the same production standard — precision
              extrusion, continuous quality scanning, and in-house testing before dispatch.
            </p>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            {[
              { value: 50000, suffix: "+", label: "Tonnes annual capacity" },
              { value: 4, suffix: "+", label: "Manufacturing plants" },
              { value: 11, suffix: "", label: "Product categories" },
              { value: 300, suffix: "+", label: "Plant & engineering staff" },
            ].map((stat) => (
              <div key={stat.label}>
                <Counter value={stat.value} suffix={stat.suffix} className="font-display text-3xl font-medium text-white md:text-4xl" />
                <p className="mt-1.5 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading
          eyebrow="Capabilities"
          title="Automation and testing at every production stage."
          description="From resin intake to final packaging, each stage is monitored and documented before product moves to the next station."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
                  <c.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <Facilities />

      <CTASection
        eyebrow="Project inquiries"
        title="Planning a large-volume order or infrastructure project?"
        description="Our regional sales and engineering teams can walk through capacity, lead times, and technical specifications for your project."
      />
    </>
  );
}
