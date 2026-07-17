import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Counter } from "@/components/shared/Counter";

const statValues = [
  { value: 50, suffix: "+" },
  { value: 6, suffix: "" },
  { value: 500, suffix: "+" },
  { value: 50000, suffix: "+" },
];

export async function CompanyOverview() {
  const t = await getTranslations("home");

  const stats = statValues.map((s, i) => ({
    ...s,
    label: t(`overviewStat${i}` as "overviewStat0"),
  }));

  return (
    <section className="container-edge py-24 md:py-32">
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("overviewEyebrow")}
            title={t("overviewH1")}
            titleAccent={t("overviewH2")}
            description={t("overviewDesc")}
          />
        </RevealOnScroll>
        <div className="grid grid-cols-2 gap-8">
          {stats.map((stat, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="border-l-2 border-ocean-600/30 pl-5">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-4xl font-medium text-slate-900 md:text-5xl"
                />
                <p className="mt-2 text-sm leading-snug text-slate-600">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <RevealOnScroll className="mt-16">
        <div className="group relative aspect-[21/10] w-full overflow-hidden rounded-3xl sm:aspect-[21/8]">
          <Image
            src="https://images.pexels.com/photos/27102106/pexels-photo-27102106.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="An engineer inspecting large-diameter pipe on the manufacturing floor"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-md p-7 md:p-10">
            <span className="tech-label text-flow-300">{t("overviewFacilityLabel")}</span>
            <p className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">
              {t("overviewFacilityCaption")}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
