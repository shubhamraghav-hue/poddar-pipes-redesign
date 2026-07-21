import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { team } from "@/lib/data/team";

export async function Leadership() {
  const t = await getTranslations("about");
  return (
    <section id="leadership" className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow={t("leadershipEyebrow")}
          title={t("leadershipH1")}
          titleAccent={t("leadershipH2")}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <RevealOnScroll key={member.id} delay={i * 0.08}>
              <div className="group rounded-[25px] border border-slate-200/70 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ocean-900/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-ocean-600 to-ocean-800 font-display text-lg font-medium text-white">
                  {member.initials}
                </div>
                <h4 className="mt-6 font-display text-lg font-medium text-slate-900">{member.name}</h4>
                <p className="mt-1 text-sm font-medium text-[#171796]">{t(`member${i}Role` as never)}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(`member${i}Bio` as never)}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
