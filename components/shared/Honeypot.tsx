import { HONEYPOT_FIELD } from "@/lib/forms/shared";

/**
 * The anti-spam trap every site form carries (see lib/forms/shared.ts). A real
 * text input that form-filling bots find and fill; people never see or reach
 * it — moved off-screen (not `display:none`, which smarter bots skip), hidden
 * from assistive tech, out of the tab order, and with autofill off so a
 * browser never fills it on a person's behalf.
 *
 * Inline styles rather than utility classes: this is the only place they
 * appear, and the rule is load-bearing — it must not depend on a stylesheet
 * having picked the class up.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
