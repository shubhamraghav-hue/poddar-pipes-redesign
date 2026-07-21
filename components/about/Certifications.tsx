import { BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { certifications } from "@/lib/data/certifications";

export async function Certifications() {
  const t = await getTranslations("quality");
  return (
    <section id="certifications" className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow={t("certEyebrow")}
          title={t("certH1")}
          titleAccent={t("certH2")}
          description={t("certDesc")}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <RevealOnScroll key={c.id} delay={i * 0.06}>
              <div className="flex h-full items-start gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-ocean-700" strokeWidth={1.7} />
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-wide text-ocean-700">
                    {c.code}
                  </p>
                  <h4 className="mt-1 font-display text-base font-medium text-slate-900">
                    {t(`cert${i}Name` as never)}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t(`cert${i}Desc` as never)}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
