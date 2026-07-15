import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Briefcase, MapPin, Clock, Heart, TrendingUp, Users } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { jobOpenings } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities at Poddar Pipes across manufacturing, quality, sales, and R&D roles.",
  alternates: { canonical: "/careers" },
};

const perks = [
  { icon: TrendingUp, title: "Growth track", description: "Structured career paths across manufacturing, quality, sales, and engineering." },
  { icon: Heart, title: "Health benefits", description: "Health insurance coverage for employees and dependents." },
  { icon: Users, title: "On-the-job training", description: "Hands-on training programs for production and quality roles." },
];

export default async function CareersPage({
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
              Careers
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Build the pipes that build India.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              From plant floor to R&D lab, we&apos;re looking for people who care about doing
              engineering work right.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow="Why join us" title="What it's like working here." />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {perks.map((p, i) => (
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

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading eyebrow="Open roles" title="Current openings." />
          <div className="mt-14 flex flex-col gap-4">
            {jobOpenings.map((job, i) => (
              <RevealOnScroll key={job.id} delay={i * 0.06}>
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
                      <Briefcase className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-medium text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {job.type}
                    </span>
                    <a
                      href="#apply"
                      className="rounded-full border-[1.5px] border-amber-600 px-4 py-1.5 text-xs font-medium text-ocean-700 transition-colors hover:bg-amber-600 hover:text-white"
                    >
                      Apply
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="container-edge scroll-mt-24 py-24 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <RevealOnScroll>
            <h2 className="font-display text-3xl font-medium text-slate-900">
              Don&apos;t see the right role?
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-600">
              Send us your details anyway. We keep applications on file and reach out when a
              matching role opens up.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <InquiryForm presetProduct="Career Application" presetEnquiryType="Career" />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
