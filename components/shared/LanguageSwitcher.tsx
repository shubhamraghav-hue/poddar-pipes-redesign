"use client";

import { useEffect, useState, useTransition } from "react";
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
    // Carry the query string across — switching language on
    // /products?category=swr-pipes used to land on the default category.
    // Read at click time from `location` rather than `useSearchParams`, which
    // would force a Suspense boundary around the whole header.
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    startTransition(() => {
      router.replace({ pathname, query }, { locale: nextLocale });
    });
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-expanded={open}
        disabled={isPending}
        className={cn(
          // 44px tall on touch layouts — the tap-target minimum (was ~32); the
          // desktop bar keeps Figma's 38px pill (node 1530:7406).
          "flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm lg:h-[38px] font-medium [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] transition-colors",
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
          {/* `data-lenis-prevent`: without it Lenis swallowed the wheel and
              the page scrolled instead of the list. */}
          <div
            data-lenis-prevent
            className="absolute right-0 z-50 mt-2 max-h-80 w-48 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => handleSelect(l)}
                lang={l}
                aria-current={l === locale ? "true" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-ocean-50",
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
