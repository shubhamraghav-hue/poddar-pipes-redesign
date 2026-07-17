import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import { industries } from "@/lib/data/industries";
import { products } from "@/lib/data/products";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Poddar Pipes serves residential, commercial, industrial, agricultural, infrastructure, irrigation, water supply, construction, and government projects.",
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage({
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
              Industries
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Built into the infrastructure of everyday India.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              From city water mains to greenhouse irrigation blocks, our systems operate quietly
              behind the sectors that depend on reliable water movement.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <RevealOnScroll key={industry.id} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
                  <industry.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">
                  {industry.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {industry.description}
                </p>
                <Link
                  href="/products"
                  className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
                >
                  Relevant products <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading eyebrow="Product coverage" title="Every product category, mapped to real applications." />
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-5 py-4">
                <span className="text-sm font-medium text-slate-800">{p.name}</span>
                <span className="text-xs text-slate-500">{p.applications[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Not sure which system fits?"
        title="Tell us about your sector and we'll recommend a product line."
        description="Share your industry and project type — our team will point you to the right category and specification."
      />
    </>
  );
}
