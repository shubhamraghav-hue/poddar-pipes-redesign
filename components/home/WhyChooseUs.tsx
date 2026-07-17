"use client";

import { ShieldCheck, Gauge, Users, Recycle, Wrench, Clock, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard } from "@/components/shared/TiltCard";
import { Counter } from "@/components/shared/Counter";
import { Coverflow } from "@/components/shared/Coverflow";
import { cn } from "@/lib/utils";

/**
 * "Why Poddar Pipes" — a premium, Apple-Cover-Flow-style carousel. The card
 * components below are unchanged; only the layout + interaction changed, from a
 * bento grid to an infinitely-looping coverflow (see components/shared/Coverflow).
 */
export function WhyChooseUs() {
  const slides = [
    <FeatureCard
      key="bis"
      icon={ShieldCheck}
      title="BIS-compliant manufacturing"
      description="Our uPVC, CPVC, SWR, and UGD ranges are manufactured to relevant Indian Standards, with in-house batch testing for pressure, impact, and thermal performance before every dispatch."
    />,
    <IconCard
      key="wall"
      icon={Gauge}
      title="Consistent wall thickness"
      description="Precision extrusion holds tolerance across every diameter we manufacture."
    />,
    <StatCard
      key="dealers"
      icon={Users}
      value={500}
      suffix="+"
      label="Dealer network"
      description="Spanning every major state in India."
    />,
    <IconCard
      key="support"
      icon={Wrench}
      title="Site installation support"
      description="Technical guidance for large plumbing and infrastructure projects."
    />,
    <StatCard
      key="response"
      icon={Clock}
      value={24}
      suffix="h"
      label="Inquiry response"
      description="Every dealer or technical inquiry, answered within a business day."
    />,
    <BannerCard
      key="sustainability"
      icon={Recycle}
      title="Responsible manufacturing"
      description="Reclaimed material streams reduce virgin resin use across our extrusion lines — without compromising pressure ratings."
    />,
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-ocean-50/40 to-white py-24 md:py-32">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Why Poddar Pipes"
          title="Built on compliance, not just capacity."
          description="We treat every product line as an engineering problem first — that discipline shows up in how our systems perform years after installation."
        />
      </div>

      <div className="mt-10">
        <Coverflow
          slides={slides}
          ariaLabel="Why choose Poddar Pipes"
          slideClassName="h-[320px] w-[280px] sm:h-[340px] sm:w-[300px]"
        />
      </div>
    </section>
  );
}

/* ---- Cards ----
 * All four cards share one layout: white background, identical size (set by the
 * carousel slide), an icon badge at top, then the content block. Titles are
 * all-caps. StatCard is the only variation — it leads its content block with an
 * animated Counter above the (all-caps) label. */

const cardBase =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 transition-colors duration-300 hover:border-flow-400/50 hover:shadow-lg hover:shadow-ocean-900/5";
const iconBadge =
  "flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700";
const cardTitle = "font-display font-semibold uppercase tracking-wide text-slate-900";
const cardDesc = "mt-2 text-sm leading-relaxed text-slate-600";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
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

function IconCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
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

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  description,
}: {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  description: string;
}) {
  return (
    <TiltCard max={4} className="h-full rounded-2xl">
      <div className={cardBase}>
        <div className={iconBadge} style={{ transform: "translateZ(35px)" }}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <Counter
            value={value}
            suffix={suffix}
            className="font-display text-4xl font-semibold text-ocean-700"
          />
          <h3 className={cn(cardTitle, "mt-1 text-base")}>{label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function BannerCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
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
