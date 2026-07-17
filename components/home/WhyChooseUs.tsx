"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Gauge, Users, Recycle, Wrench, Clock, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard } from "@/components/shared/TiltCard";
import { Counter } from "@/components/shared/Counter";
import { Coverflow } from "@/components/shared/Coverflow";
import { cn } from "@/lib/utils";

export function WhyChooseUs() {
  const t = useTranslations("home");

  const slides = [
    <FeatureCard
      key="bis"
      icon={ShieldCheck}
      title={t("whyBisTitle")}
      description={t("whyBisDesc")}
    />,
    <IconCard
      key="wall"
      icon={Gauge}
      title={t("whyWallTitle")}
      description={t("whyWallDesc")}
    />,
    <StatCard
      key="dealers"
      icon={Users}
      value={500}
      suffix="+"
      label={t("whyDealersLabel")}
      description={t("whyDealersDesc")}
    />,
    <IconCard
      key="support"
      icon={Wrench}
      title={t("whySupportTitle")}
      description={t("whySupportDesc")}
    />,
    <StatCard
      key="response"
      icon={Clock}
      value={24}
      suffix="h"
      label={t("whyResponseLabel")}
      description={t("whyResponseDesc")}
    />,
    <BannerCard
      key="sustainability"
      icon={Recycle}
      title={t("whySustainTitle")}
      description={t("whySustainDesc")}
    />,
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-ocean-50/40 to-white py-24 md:py-32">
      <div className="container-edge">
        <SectionHeading
          eyebrow={t("whyChooseEyebrow")}
          title={t("whyH1")}
          titleAccent={t("whyH2")}
          description={t("whyDesc")}
        />
      </div>

      <div className="mt-10">
        <Coverflow
          slides={slides}
          ariaLabel={t("whyAriaLabel")}
          slideClassName="h-[320px] w-[280px] sm:h-[340px] sm:w-[300px]"
        />
      </div>
    </section>
  );
}

const cardBase =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 transition-colors duration-300 hover:border-flow-400/50 hover:shadow-lg hover:shadow-ocean-900/5";
const iconBadge =
  "flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700";
const cardTitle = "font-display font-semibold uppercase tracking-wide text-slate-900";
const cardDesc = "mt-2 text-sm leading-relaxed text-slate-600";

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <TiltCard max={4} className="h-full rounded-2xl">
      <div className={cardBase}>
        <div className={iconBadge} style={{ transform: "translateZ(35px)" }}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <h3 className={cn(cardTitle, "text-lg")}>{title}</h3>
          <p className={cardDesc}>{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function IconCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <TiltCard max={4} className="h-full rounded-2xl">
      <div className={cardBase}>
        <div className={iconBadge} style={{ transform: "translateZ(35px)" }}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <h3 className={cn(cardTitle, "text-lg")}>{title}</h3>
          <p className={cardDesc}>{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function StatCard({ icon: Icon, value, suffix, label, description }: { icon: LucideIcon; value: number; suffix?: string; label: string; description: string }) {
  return (
    <TiltCard max={4} className="h-full rounded-2xl">
      <div className={cardBase}>
        <div className={iconBadge} style={{ transform: "translateZ(35px)" }}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <Counter value={value} suffix={suffix} className="font-display text-4xl font-semibold text-ocean-700" />
          <h3 className={cn(cardTitle, "mt-1 text-base")}>{label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function BannerCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <TiltCard max={4} className="h-full rounded-2xl">
      <div className={cardBase}>
        <div className={iconBadge} style={{ transform: "translateZ(35px)" }}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <h3 className={cn(cardTitle, "text-lg")}>{title}</h3>
          <p className={cardDesc}>{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}
