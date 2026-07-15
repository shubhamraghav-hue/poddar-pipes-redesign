import Image from "next/image";
import { ShieldCheck, Gauge, Users, Recycle, Wrench, Clock, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { TiltCard } from "@/components/shared/TiltCard";
import { Counter } from "@/components/shared/Counter";
import { cn } from "@/lib/utils";

/**
 * Bento tiles to exactly 12 cells on lg (4 cols × 3 rows) with no gaps:
 *   feature (2×2) + four cards (2×2 block) + full-width banner (1×4).
 * At sm it collapses to 2 columns and at base to a single column, each of
 * which also tiles cleanly. This replaces an earlier 4×2 layout that left two
 * empty cells at the bottom-right on desktop.
 */
export function WhyChooseUs() {
  return (
    <section className="container-edge py-24 md:py-32">
      <SectionHeading
        eyebrow="Why Poddar Pipes"
        title="Built on compliance, not just capacity."
        description="We treat every product line as an engineering problem first — that discipline shows up in how our systems perform years after installation."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <RevealOnScroll className="sm:col-span-2 lg:row-span-2">
          <FeatureCard
            icon={ShieldCheck}
            title="BIS-compliant manufacturing"
            description="Our uPVC, CPVC, SWR, and UGD ranges are manufactured to relevant Indian Standards, with in-house batch testing for pressure, impact, and thermal performance before every dispatch."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.05}>
          <IconCard
            icon={Gauge}
            title="Consistent wall thickness"
            description="Precision extrusion holds tolerance across every diameter we manufacture."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <StatCard
            icon={Users}
            value={500}
            suffix="+"
            label="Dealer network"
            description="Spanning every major state in India."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <IconCard
            icon={Wrench}
            title="Site installation support"
            description="Technical guidance for large plumbing and infrastructure projects."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <StatCard
            icon={Clock}
            value={24}
            suffix="h"
            label="Inquiry response"
            description="Every dealer or technical inquiry, answered within a business day."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="sm:col-span-2 lg:col-span-4">
          <BannerCard
            icon={Recycle}
            title="Responsible manufacturing"
            description="Reclaimed material streams reduce virgin resin use across our extrusion lines — without compromising pressure ratings."
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---- Cards ---- */

const cardBase =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-colors duration-300";
const lightCard =
  "border-slate-200/70 bg-white hover:border-flow-400/50 hover:shadow-lg hover:shadow-ocean-900/5";

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
      <div className={cn(cardBase, "justify-between border-white/10 bg-ink text-white")}>
        {/* Humanising backdrop — a real QC inspection on the plant floor */}
        <Image
          src="https://images.pexels.com/photos/4440143/pexels-photo-4440143.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-25"
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/70"
          aria-hidden="true"
        />
        <span className="bg-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <span
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-flow-500/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div
          className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-flow-500/15 text-flow-300"
          style={{ transform: "translateZ(40px)" }}
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <div className="relative mt-8" style={{ transform: "translateZ(22px)" }}>
          <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-300">{description}</p>
          {/* Flowing water line — the feature card's signature accent */}
          <div className="relative mt-7 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-0 animate-pipe-flow opacity-80 motion-reduce:animate-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--color-flow-400) 0 6px, transparent 6px 28px)",
              }}
            />
          </div>
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
    <TiltCard max={7} className="h-full rounded-2xl">
      <div className={cn(cardBase, lightCard, "justify-between")}>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700"
          style={{ transform: "translateZ(35px)" }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
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
    <TiltCard max={7} className="h-full rounded-2xl">
      <div className={cn(cardBase, lightCard, "justify-between")}>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-flow-500/10 text-flow-500"
          style={{ transform: "translateZ(35px)" }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
          <Counter
            value={value}
            suffix={suffix}
            className="font-display text-4xl font-semibold text-ocean-700"
          />
          <h3 className="mt-1 font-display text-base font-semibold text-slate-900">{label}</h3>
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
    <TiltCard max={3} className="h-full rounded-2xl">
      <div
        className={cn(
          cardBase,
          "flex-row items-center gap-6 border-slate-200/70 bg-gradient-to-r from-ocean-50/60 to-white hover:border-flow-400/50"
        )}
      >
        <span
          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-flow-500/[0.06] blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean-600/10 text-ocean-700">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <div className="relative">
          <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}
