"use client";

import { useState } from "react";
import { Scissors, Wand2, Droplets, Beaker, Link2, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Scissors, Wand2, Droplets, Beaker, Link2, CheckCircle2];
const STEP_COUNT = 6;

export function InstallationStepper() {
  const t = useTranslations("installation");
  const [active, setActive] = useState(0);
  const Icon = STEP_ICONS[active];

  const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
    step: i + 1,
    title: t(`step${i}Title` as never),
    description: t(`step${i}Desc` as never),
  }));

  const step = steps[active];

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 md:p-10">
      <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Installation steps">
        {steps.map((s, i) => (
          <button
            key={s.step}
            role="tab"
            aria-selected={i === active}
            aria-controls={`install-step-panel`}
            onClick={() => setActive(i)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium transition-colors",
              i === active
                ? "bg-ocean-600 text-white"
                : i < active
                  ? "bg-ocean-600/15 text-ocean-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {s.step}
          </button>
        ))}
      </div>

      <div id="install-step-panel" role="tabpanel" aria-live="polite" className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-600/10 text-ocean-700">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ocean-700">
          {t("stepOf", { step: step.step, total: STEP_COUNT } as never)}
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium text-slate-900">{step.title}</h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">{step.description}</p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
          disabled={active === 0}
        >
          <ArrowLeft className="h-4 w-4" /> {t("previous")}
        </Button>
        <Button
          onClick={() => setActive((i) => Math.min(STEP_COUNT - 1, i + 1))}
          disabled={active === STEP_COUNT - 1}
        >
          {t("next")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
