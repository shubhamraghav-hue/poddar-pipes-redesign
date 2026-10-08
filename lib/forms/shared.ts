/**
 * Form contract shared by the browser and the route handlers under app/api/.
 *
 * Kept free of React, `"use client"` and server-only code on purpose: the
 * route handlers import the allowed-value lists from here, and importing them
 * from a `"use client"` component module would hand the server a client
 * reference instead of the array.
 */

/** Enquiry types offered by the site-wide enquiry form (pop-up + /contact). */
export const ENQUIRY_TYPES = [
  "General",
  "Sales & Pricing",
  "Technical Support",
  "Dealer / Distributor",
  "Careers",
] as const;

/** Enquiry types offered by the older `InquiryForm` (/careers, product pages). */
export const INQUIRY_TYPES = ["General", "Sales", "Technical", "Business", "Career"] as const;

/**
 * The honeypot field. A plausible name ("website") so form-filling bots fill
 * it; people never see it. Any value in it and the server answers with a fake
 * success and sends nothing.
 */
export const HONEYPOT_FIELD = "website";

/**
 * Below this many ms between the form rendering and its submit, the submit is
 * treated as a bot. Generous enough that autofill + Enter rarely trips it, and
 * when it does the person gets a "press submit again" message, never a fake
 * success.
 */
export const MIN_FILL_MS = 3000;

/**
 * Anti-spam metadata every form sends alongside its fields. Both timestamps
 * come from the BROWSER's clock, so the server compares them with each other
 * rather than with its own clock — a visitor whose device clock is a minute off
 * would otherwise be rejected (or waved through) on skew alone.
 */
export type SpamMeta = {
  /** Honeypot value — must be empty. */
  [HONEYPOT_FIELD]?: string;
  /** Epoch ms when the form mounted. */
  renderedAt?: number;
  /** Epoch ms when the form was submitted. */
  submittedAt?: number;
};

/** What every endpoint answers with. `fields` maps a field name to a message. */
export type FormResponse =
  | { ok: true; simulated?: boolean }
  | { ok: false; error: FormErrorCode; fields?: Record<string, string> };

export type FormErrorCode =
  | "invalid_json"
  | "payload_too_large"
  | "validation"
  | "too_fast"
  | "rate_limited"
  | "not_configured"
  | "delivery_failed";
