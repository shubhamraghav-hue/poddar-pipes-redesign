"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Search, UserRound, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/shared/TiltCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getUniquePincodes, findPlumbersByPincode } from "@/lib/data/plumbers";
import { cn } from "@/lib/utils";
import type { Plumber } from "@/types";

const PINCODE_PATTERN = /^\d{6}$/;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PlumberCard({ plumber, index }: { plumber: Plumber; index: number }) {
  const telHref = `tel:${plumber.phone.replace(/[^\d+]/g, "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard max={5} className="h-full">
        <div className="flex h-full flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 font-display text-sm font-semibold text-ocean-700">
                {initials(plumber.name)}
              </div>
              <div>
                <p className="font-display text-base font-medium text-slate-900">{plumber.name}</p>
                <span className="tech-label mt-1 inline-flex items-center gap-1 text-slate-500">
                  <Wrench className="h-3 w-3" strokeWidth={2} />
                  <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    Plumber
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
            <MapPin className="h-4 w-4 shrink-0 text-ocean-500" strokeWidth={1.8} />
            <Badge variant="brand-pill">{plumber.pincode}</Badge>
          </div>

          <Button asChild variant="secondary" className="mt-auto w-full">
            <a href={telHref}>
              <Phone className="h-4 w-4" />
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {plumber.phone}
              </span>
            </a>
          </Button>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function PlumberFinder() {
  const t = useTranslations("findPlumber");
  const inputId = useId();
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availablePincodes = getUniquePincodes();
  const results = submitted ? findPlumbersByPincode(submitted) : [];

  function runSearch(value: string) {
    const trimmed = value.trim();
    if (!PINCODE_PATTERN.test(trimmed)) {
      setError(t("errorInvalid"));
      setSubmitted(null);
      return;
    }
    setError(null);
    setSubmitted(trimmed);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(pincode);
  }

  function handleChipClick(code: string) {
    setPincode(code);
    runSearch(code);
  }

  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. The navbar is transparent with light text until
          the page scrolls ~20px, so it needs *some* dark backdrop behind it
          at rest; this is the smallest one that still does that job, with no
          content of its own. Everything the visitor actually reads sits on
          plain white immediately below. */}
      <div className="h-20 bg-ink" aria-hidden="true" />

      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("eyebrow")}
          title={t("pageH1")}
          titleAccent={t("pageH2")}
          description={t("pageDesc")}
        />

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
            <Label htmlFor={inputId}>{t("inputLabel")}</Label>
            <Input
              id={inputId}
              inputMode="numeric"
              maxLength={6}
              placeholder={t("inputPlaceholder")}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
                if (error) setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${inputId}-error` : undefined}
            />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4" />
            {t("searchButton")}
          </Button>
        </form>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm font-medium text-amber-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="tech-label text-slate-500">{t("tryPincode")}</span>
          {availablePincodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => handleChipClick(code)}
              className={cn(
                "rounded-full border-[1.5px] px-3 py-1 text-xs font-medium transition-colors",
                submitted === code
                  ? "border-ocean-600 bg-ocean-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-ocean-500 hover:text-ocean-700"
              )}
            >
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {code}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="container-edge pb-14 md:pb-16">
        <AnimatePresence mode="wait">
          {submitted === null ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-paper-2 px-6 py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-600">
                <UserRound className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <p className="max-w-sm text-sm text-slate-600">{t("idleMessage")}</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-6 text-sm font-medium text-slate-600">
                {t("resultsCount", { count: results.length, pincode: submitted } as never)}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((plumber, i) => (
                  <PlumberCard key={plumber.id} plumber={plumber} index={i} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-paper-2 px-6 py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600/10 text-amber-600">
                <Search className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <p className="font-display text-lg font-medium text-slate-900">
                {t("emptyTitle", { pincode: submitted } as never)}
              </p>
              <p className="max-w-sm text-sm text-slate-600">{t("emptyDesc")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
