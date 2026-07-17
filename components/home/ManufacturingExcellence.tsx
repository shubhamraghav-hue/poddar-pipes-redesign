import { getTranslations } from "next-intl/server";
import { FlaskConical, Factory, PackageCheck, Truck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const stepIcons = [FlaskConical, Factory, PackageCheck, Truck];

export async function ManufacturingExcellence() {
  const t = await getTranslations("home");

  const steps = stepIcons.map((Icon, i) => ({
    Icon,
    title: t(`mfgStep${i}Title` as "mfgStep0Title"),
    description: t(`mfgStep${i}Desc` as "mfgStep0Desc"),
  }));

  return (
    <section className="container-edge py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("manufacturingEyebrow")}
          title={t("mfgH1")}
          titleAccent={t("mfgH2")}
          description={t("mfgDesc")}
        />
        <Link
          href="/manufacturing"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
        >
          {t("mfgCta")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ol className="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Desktop rail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-gradient-to-r from-ocean-500/40 via-flow-400/50 to-ocean-500/40 lg:block"
        />
        {/* Mobile rail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-ocean-500/40 via-flow-400/50 to-transparent sm:hidden"
        />

        {steps.map((step, i) => (
          <RevealOnScroll key={i} delay={i * 0.1}>
            <li className="relative flex gap-5 sm:block">
              <div className="relative z-10 flex shrink-0 items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ocean-600/25 bg-white text-ocean-700 shadow-sm transition-colors">
                  <step.Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="tech-label text-flow-500 sm:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="sm:mt-6">
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="tech-label text-flow-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-6 bg-ocean-500/30" />
                </div>
                <h3 className="mt-0 font-display text-lg font-semibold text-slate-900 sm:mt-3">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </section>
  );
}
