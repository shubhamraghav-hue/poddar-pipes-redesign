import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";

export async function AboutHero() {
  const t = await getTranslations("about");
  return (
    <section id="story" className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-28 md:pt-48">
      <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="animate-float-slow absolute right-[10%] top-1/3 h-52 w-52 rounded-full bg-ocean-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <RevealOnScroll>
          <div className="mb-5 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002" stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">{t("heroEyebrow")}</span>
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
            <span className="block">{t("heroLine1")}</span>
            <span className="block text-[#E0AF40]">{t("heroLine2")}</span>
            <span className="block font-bold">{t("heroBold")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
            {t("heroDesc")}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export async function OurStory() {
  const t = await getTranslations("about");
  return (
    <section className="container-edge py-24 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("storyEyebrow")}
            title={t("storyH1")}
            titleAccent={t("storyH2")}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="flex flex-col gap-5 text-slate-600">
          {([0, 1, 2, 3] as const).map((i) => (
            <p key={i} className="leading-relaxed">
              {t(`storyPara${i}` as never)}
            </p>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
