/**
 * Locale overlays for the English data files in lib/data (2026-10-19).
 *
 * The data files stay the English source of truth. A translation lives next
 * to them in lib/data/<locale>/<file>.ts as an OVERLAY: an object keyed by the
 * item's id (or slug) holding only the translated fields. Merging is shallow —
 * a translated array (features, FAQs, cards…) replaces the English one
 * wholesale, so it must be complete and in the same order.
 *
 * English, and any id the overlay does not cover, falls through unchanged, so
 * a missing translation shows English rather than nothing.
 */
export type Overlay<T> = Partial<Record<string, Partial<T>>>;

/** Merge a per-id overlay onto a list. `key` is the item's id field. */
export function localizeList<T extends object>(
  items: readonly T[],
  overlay: Overlay<T> | undefined,
  key: keyof T
): T[] {
  if (!overlay) return items as T[];
  return items.map((item) => {
    const o = overlay[String(item[key])];
    return o ? { ...item, ...o } : item;
  });
}

/** Merge a per-key overlay onto a record (e.g. productDetails by range id). */
export function localizeRecord<T extends object>(
  record: Partial<Record<string, T>>,
  overlay: Partial<Record<string, Partial<T>>> | undefined
): Partial<Record<string, T>> {
  if (!overlay) return record;
  const out: Partial<Record<string, T>> = {};
  for (const [k, v] of Object.entries(record)) {
    if (!v) continue;
    const o = overlay[k];
    out[k] = o ? { ...v, ...o } : v;
  }
  return out;
}

/** True for locales that have overlays. Only Hindi today. */
export const hasOverlays = (locale: string) => locale === "hi";
