import { Target, Telescope, BadgeCheck, ShieldCheck, Compass, Lightbulb, Users, Leaf, Award } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";

export async function MissionVision() {
  const t = await getTranslations("about");
  return (
    <section id="mission" className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge grid gap-6 md:grid-cols-2">
        <RevealOnScroll>
          <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-9">
            <Target className="h-8 w-8 text-[#171796]" strokeWidth={1.6} />
            <h3 className="mt-6 font-display text-2xl font-medium text-slate-900">{t("missionTitle")}</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              {t("missionDesc")}
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-9">
            <Telescope className="h-8 w-8 text-amber-600" strokeWidth={1.6} />
            <h3 className="mt-6 font-display text-2xl font-medium text-slate-900">{t("visionTitle")}</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              {t("visionDesc")}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

const VALUE_ICONS = [BadgeCheck, ShieldCheck, Compass, Lightbulb, Users, Leaf, Award];
const VALUE_COUNT = 7;

export async function CoreValues() {
  const t = await getTranslations("about");
  const values = VALUE_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`value${i}Title` as never),
    description: t(`value${i}Desc` as never),
  }));

  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading
        eyebrow={t("valuesEyebrow")}
        title={t("valuesH1")}
        titleAccent={t("valuesH2")}
      />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <RevealOnScroll key={i} delay={i * 0.08}>
            <div className="h-full rounded-[25px] border border-slate-200/70 bg-white p-7">
              <v.icon className="h-6 w-6 text-[#171796]" strokeWidth={1.7} />
              <h4 className="mt-5 font-display text-base font-medium text-slate-900">{v.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
