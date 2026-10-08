/**
 * Optical vertical centring for Anek Devanagari labels inside fixed-height
 * controls (pills, steppers, radios, tabs).
 *
 * The face reserves a deep descender zone for Devanagari matras, so its line
 * box is bottom-heavy and Latin glyphs centred by flexbox sit visibly HIGH —
 * measured on /tools/calculator at 3–5.5px across every control. Trimming the
 * label's box to cap-height-over-baseline makes the thing flex centres the
 * glyphs themselves.
 *
 * Same declarations `Button` puts on its string children (components/ui/
 * button.tsx). Put it on a SPAN wrapping the text, never on the control:
 * `text-box-trim` is not inherited and does nothing to a bare text node in a
 * flex container — which is why `Button asChild` labels were still high.
 *
 * If the span also clips (`truncate`), give it vertical slack with
 * `py-1.5 -my-1.5`: the trimmed box ends at cap height, so `overflow: hidden`
 * would otherwise shave parentheses, descenders and the `&` overshoot.
 *
 * Browsers without `text-box` support fall back to the untrimmed (high) look.
 */
export const CAP_TRIM = "leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]";
