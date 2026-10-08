import { Factory } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { COMPANY } from "@/lib/data/offices";

/**
 * Kept in `components/about/` for its import path only — /manufacturing is
 * its single consumer.
 *
 * ONE PLANT. This used to list four placeholder plant cards with a
 * product focus each; the client has a single manufacturing unit (Vemagal,
 * KIADB, Kolar District), so it is now one wide card with the real address
 * from `COMPANY.plant` (lib/data/offices.ts).
 */
export async function Facilities() {
  const t = await getTranslations("about");
  const plant = COMPANY.plant;
  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading
        eyebrow={t("facilitiesEyebrow")}
        title={t("facilitiesH1")}
        titleAccent={t("facilitiesH2")}
        description={t("facilitiesDesc")}
      />
      <RevealOnScroll>
        <div className="mt-14 flex flex-col gap-5 rounded-[25px] border border-slate-200/70 bg-white p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#171796]/10 text-[#171796]">
            <Factory className="h-6 w-6" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#171796]">
              {t("facility0Focus")}
            </p>
            <h3 className="mt-2 font-display text-xl font-medium text-slate-900 sm:text-2xl">
              {plant.locality}, {plant.region}
            </h3>
            <address className="mt-2 not-italic text-sm leading-relaxed text-slate-600 sm:text-base">
              {plant.oneLine}
            </address>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
