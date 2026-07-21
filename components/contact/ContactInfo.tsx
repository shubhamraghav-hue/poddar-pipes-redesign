import { Mail, Phone, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export async function ContactInfo() {
  const t = await getTranslations("contact");
  const info = [
    { icon: Mail, label: t("infoEmail"), value: "poddarpipes@gmail.com" },
    { icon: Phone, label: t("infoPhone"), value: "+91 [XXXXX XXXXX]" },
    { icon: Clock, label: t("infoResponseTime"), value: t("infoResponseValue") },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {info.map((item, i) => (
        <RevealOnScroll key={item.label} delay={i * 0.06}>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-500/15 text-ocean-300">
              <item.icon className="h-5 w-5" strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-0.5 text-sm font-medium text-white">{item.value}</p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
