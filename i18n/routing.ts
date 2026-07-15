import { defineRouting } from "next-intl/routing";

// NOTE: reduced to English + Hindi for now (see CONTENT_TODOS.md). The other
// 9 locale message files still exist on disk but are unrouted — restoring a
// locale is a one-line addition here once its content is properly translated
// (most were English placeholder copy under the right keys, not real
// translations, so re-adding them as-is would ship untranslated pages).
export const locales = ["en", "hi"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed", // "/" stays English, other locales get "/hi", "/gu", etc.
  localeCookie: {
    name: "PP_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 year — preserves selection across sessions
  },
});
