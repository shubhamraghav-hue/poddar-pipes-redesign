import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ShieldCheck, TestTube2, BookMarked, Lightbulb } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GoldStamp } from "@/components/shared/GoldStamp";
// import { CertDownloadButton } from "@/components/shared/CertDownloadButton";
import { certifications } from "@/lib/data/certifications";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Quality Assurance & Certifications",
  description:
    "Poddar Pipes' quality policy, testing procedures, Indian Standards compliance, R&D approach, and product certifications.",
  alternates: { canonical: "/quality" },
};

const pillars = [
  { icon: ShieldCheck, title: "Quality Policy", description: "Every product is manufactured to meet or exceed the relevant Indian Standard before it's classified as sellable stock." },
  { icon: TestTube2, title: "Testing Procedures", description: "Pressure, impact, and thermal-cycling tests run on every production batch, not periodic samples." },
  { icon: BookMarked, title: "Standards Compliance", description: "IS 15778, IS 13592, IS 14735, and IS 16098 form the baseline for our respective product lines." },
  { icon: Lightbulb, title: "R&D & Innovation", description: "Our R&D team evaluates new resin compounds and jointing systems as Indian construction practices evolve." },
];

import { CertDownloadButton } from "@/components/shared/CertDownloadButton";

export default async function QualityPage({
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
              Quality
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Quality tested in, not inspected after.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              Our testing labs run pressure, impact, and thermal-cycling checks on every batch —
              because a pipe that fails on-site costs far more than the test that could have
              caught it.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow="Our approach" title="Four pillars of our quality system." />
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
            eyebrow="Certifications"
            title="Independently verified, batch by batch."
            description="Certification documents are available on request for project specification and tender submissions."
          />

          <RevealOnScroll className="mt-14 flex flex-wrap gap-8">
            <GoldStamp label="ISI Marked" sublabel="IS 15778 / 13592 / 16098" />
            <GoldStamp label="ISO 9001" sublabel="Quality Management" />
            <GoldStamp label="ISO 14001" sublabel="Environmental Mgmt." />
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <RevealOnScroll key={c.id} delay={i * 0.06}>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ocean-700">{c.code}</p>
                    <h4 className="mt-1 font-display text-base font-medium text-slate-900">{c.name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
                  </div>
                  <CertDownloadButton code={c.code} name={c.name} />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Tender & project documentation"
        title="Need certification documents for a tender submission?"
        description="Our sales team can provide certified copies of relevant product and quality certifications for project bids."
      />
    </>
  );
}
