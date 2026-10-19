import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = { [key: string]: string | Messages };

/** Locale strings over the English ones, so a key a locale has not translated
 * yet shows the English text instead of its raw key ("home.overviewDesc2"). */
function withFallback(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = base[k];
    out[k] = typeof v === "object" && typeof b === "object" ? withFallback(b, v) : v;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default as Messages;
  if (locale === routing.defaultLocale) return { locale, messages };

  const english = (await import(`../messages/${routing.defaultLocale}.json`)).default as Messages;
  return { locale, messages: withFallback(english, messages) };
});
