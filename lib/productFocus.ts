/**
 * "Take me to that range": links to /products/<id> from the navbar's
 * Products menu, the footer and the home category cards land with the range
 * PRE-SELECTED and the page SCROLLED to the category pills (client request,
 * 2026-10-12), rather than at the top of the page above the heading.
 *
 * How:
 *   - those links carry `PRODUCT_FOCUS_HASH` and `scroll={false}`, so Next
 *     does not run its own top-of-page / hash scroll;
 *   - `ProductShowcase` sees the hash when it mounts (arriving from another
 *     page) or when the category changes (already on /products), scrolls the
 *     pills under the navbar through Lenis, and strips the hash from the URL;
 *   - when the link points at the category already showing, nothing re-renders,
 *     so the click also fires `PRODUCT_FOCUS_EVENT`, which a mounted showcase
 *     answers the same way.
 *
 * The hash deliberately matches NO element id — an id would let the browser /
 * Next jump natively, which fights Lenis (see hooks/useLenis.ts).
 */
export const PRODUCT_FOCUS_HASH = "#range";
export const PRODUCT_FOCUS_EVENT = "poddar:focus-product-range";

/** `/products/<id>#range` (the range's own URL since SEO-003) */
export function productRangeHref(categoryId: string) {
  return `/products/${categoryId}${PRODUCT_FOCUS_HASH}`;
}

/** Call from the link's onClick. */
export function requestProductFocus() {
  window.dispatchEvent(new Event(PRODUCT_FOCUS_EVENT));
}

/**
 * Props for a <Link> that might point at a range: no Next scroll, and the
 * focus event on click. Pass-through for every other href.
 */
export function rangeLinkProps(href: string, onClick?: () => void) {
  if (!href.endsWith(PRODUCT_FOCUS_HASH)) return onClick ? { onClick } : {};
  return {
    scroll: false,
    onClick: () => {
      onClick?.();
      requestProductFocus();
    },
  };
}
