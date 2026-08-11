import { Factory, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Counter } from "@/components/shared/Counter";

const FACILITY_CITIES = [
  { city: "[Plant City 1]", state: "[State]" },
  { city: "[Plant City 2]", state: "[State]" },
  { city: "[Plant City 3]", state: "[State]" },
  { city: "[Plant City 4]", state: "[State]" },
];

const PRESENCE_STATS = [
  { value: 28, suffix: "" },
  { value: 4, suffix: "+" },
  { value: 22, suffix: "" },
  { value: 500, suffix: "+" },
];

export async function Facilities() {
  const t = await getTranslations("about");
  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading
        eyebrow={t("facilitiesEyebrow")}
        title={t("facilitiesH1")}
        titleAccent={t("facilitiesH2")}
        description={t("facilitiesDesc")}
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FACILITY_CITIES.map((f, i) => (
          <RevealOnScroll key={f.city} delay={i * 0.06}>
            <div className="flex items-start gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                <Factory className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-slate-900">{f.city}</h4>
                <p className="text-xs text-slate-500">{f.state}</p>
                <p className="mt-2 text-sm text-slate-600">{t(`facility${i}Focus` as never)}</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

export async function GlobalPresence() {
  const t = await getTranslations("about");
  return (
    <section className="bg-ink py-24 text-white md:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow={t("presenceEyebrow")}
          title={t("presenceH1")}
          dark
        />
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {PRESENCE_STATS.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 border-l border-white/15 pl-5">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-3xl font-medium text-white md:text-4xl"
              />
              <p className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-ocean-300" />
                <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {t(`presenceStat${i}Label` as never)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
