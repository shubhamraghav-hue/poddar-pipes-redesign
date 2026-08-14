import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

const PERK_ICONS = [TrendingUp, Heart, Users];

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  const perks = PERK_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`perk${i}Title` as never),
    description: t(`perk${i}Desc` as never),
  }));

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
      </section>

      <section className="container-edge py-24 md:py-28">
        <SectionHeading eyebrow={t("perksEyebrow")} title={t("perksH1")} titleAccent={t("perksH2")} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {perks.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-7">
                <p.icon className="h-6 w-6 text-[#171796]" strokeWidth={1.7} />
                <h3 className="mt-5 font-display text-lg font-medium text-slate-900">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading eyebrow={t("rolesEyebrow")} title={t("rolesH1")} titleAccent={t("rolesH2")} />
          <div className="mt-14 flex flex-col gap-4">
            {jobOpenings.map((job, i) => (
              <RevealOnScroll key={job.id} delay={i * 0.06}>
                <div className="flex flex-col gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                      <Briefcase className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-medium text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                        {job.location}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                        {job.type}
                      </span>
                    </span>
                    <a
                      href="#apply"
                      className="rounded-full border-[1.5px] border-amber-600 px-4 py-1.5 text-xs font-medium text-ocean-700 transition-colors hover:bg-amber-600 hover:text-white"
                    >
                      {t("apply")}
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
              {t("noRoleTitle")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-600">
              {t("noRoleDesc")}
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
