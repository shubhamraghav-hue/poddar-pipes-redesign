import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AlertTriangle, Sun, PackageCheck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InstallationStepper } from "@/components/resources/InstallationStepper";
import { CTASection } from "@/components/home/CTASection";
import { handlingStorage, hotWeatherTips, installationWarnings } from "@/lib/data/installationGuide";

export const metadata: Metadata = {
  title: "Solvent-Weld Installation Guide",
  description:
    "Step-by-step solvent-weld installation guide for Poddar uPVC/CPVC pipe and fittings — cutting, deburring, solvent cement application, assembly, handling, storage, and site warnings.",
  alternates: { canonical: "/resources/installation" },
};

export default async function InstallationGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-40 text-white md:pb-20 md:pt-48">
        <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              Installation
            </span>
            <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Easy, 100% leak-proof installation.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              The same 6-step solvent-weld process used across Poddar&apos;s uPVC, CPVC, SWR, UGD, and
              Agri Gold catalogues — step through it below, or jump to handling, storage, and
              site-condition guidance.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
        <SectionHeading eyebrow="Step-by-step" title="The solvent-weld process." />
        <div className="mt-10">
          <InstallationStepper />
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="container-edge">
          <SectionHeading eyebrow="Before you start" title="Handling & storage." />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {handlingStorage.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
                    <PackageCheck className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-1 font-display text-sm font-medium text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
        <SectionHeading eyebrow="Site conditions" title="Hot-weather installation tips." />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hotWeatherTips.map((tip, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-5">
                <Sun className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
                <p className="text-sm leading-relaxed text-slate-600">{tip}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="container-edge">
          <SectionHeading eyebrow="Read before installing" title="Installation warnings." />
          <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {installationWarnings.map((warning, i) => (
              <RevealOnScroll key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ocean-700" strokeWidth={1.75} />
                  <p className="text-sm leading-relaxed text-slate-600">{warning}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Need sizing help too?"
        title="Check wall thickness and cure times for your exact pipe size."
        description="Our pipe & solvent-cement calculator looks up IS 4985 specs by size, class, and site temperature."
        primaryLabel="Open the Calculator"
        primaryHref="/tools/calculator"
        secondaryLabel="Talk to Our Team"
        secondaryHref="/contact"
      />
    </>
  );
}
