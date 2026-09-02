import { Factory } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Kept in `components/about/` for its import path only — the About page no
 * longer renders it, and /manufacturing is now its single consumer. The
 * companion `GlobalPresence` section was removed with the old About page.
 */
const FACILITY_CITIES = [
  { city: "[Plant City 1]", state: "[State]" },
  { city: "[Plant City 2]", state: "[State]" },
  { city: "[Plant City 3]", state: "[State]" },
  { city: "[Plant City 4]", state: "[State]" },
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
