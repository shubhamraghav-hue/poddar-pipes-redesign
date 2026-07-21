import { Building2, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { offices } from "@/lib/data/offices";

export async function OfficeLocations() {
  const t = await getTranslations("contact");
  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading eyebrow={t("officesEyebrow")} title={t("officesHeading")} />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {offices.map((office, i) => (
          <RevealOnScroll key={office.id} delay={i * 0.07}>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6">
              <Building2 className="h-6 w-6 text-ocean-700" strokeWidth={1.7} />
              <h4 className="mt-5 font-display text-lg font-medium text-slate-900">{office.city}</h4>
              <p className="text-xs text-slate-500">{office.country}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ocean-700">
                {office.type}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{office.address}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> {office.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {office.email}
                </span>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
