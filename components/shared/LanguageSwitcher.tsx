"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale() as Locale;
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(nextLocale: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-expanded={open}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] transition-colors",
          dark
            ? "border-white/20 text-white/85 hover:border-white/40"
            : "border-slate-200 text-slate-700 hover:border-ocean-500/50"
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] sm:inline">
          {localeLabels[locale]}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 max-h-80 w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => handleSelect(l)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-ocean-50",
                  l === locale ? "text-ocean-700" : "text-slate-700"
                )}
              >
                <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {localeLabels[l]}
                </span>
                {l === locale && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
