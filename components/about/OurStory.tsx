import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";

export async function AboutHero() {
  const t = await getTranslations("about");
  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section id="story" className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
      </section>
    </>
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
