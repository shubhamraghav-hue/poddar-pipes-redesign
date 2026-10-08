import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD, type FormErrorCode, type FormResponse } from "@/lib/forms/shared";
import { COMPANY } from "@/lib/data/offices";

/**
 * Browser half of the form contract: POST a payload, turn every outcome —
 * network failure, validation, rate limit, server down — into one result the
 * forms can render. Success is ONLY ever `ok: true` from the server.
 */

/** The office line and inbox, as printed in the footer and on /contact. */
export const OFFICE_CONTACT = {
  phone: COMPANY.phone,
  email: COMPANY.email,
} as const;

export type SubmitResult =
  | { ok: true; simulated?: boolean }
  | {
      ok: false;
      error: FormErrorCode | "network";
      /** Shown above the submit button. */
      message: string;
      /** Per-field messages from server validation, keyed by field name. */
      fields?: Record<string, string>;
      /** True when the visitor should be pointed at the phone/email instead. */
      offerDirect: boolean;
    };

const MESSAGES: Record<FormErrorCode | "network", string> = {
  network: "We couldn't reach our server. Check your connection and try again.",
  invalid_json: "Something went wrong sending the form. Please try again.",
  payload_too_large: "Your message is too long. Please shorten it and try again.",
  validation: "Please check the highlighted fields.",
  too_fast: "That was quick! Please check your details and press submit again.",
  rate_limited: "Too many attempts. Please try again in a few minutes.",
  not_configured: "We couldn't send your message. Please call us or email us directly.",
  delivery_failed: "We couldn't send your message. Please call us or email us directly.",
};

/**
 * The form's mount time, for the server's time-to-submit check. Set in an
 * effect rather than during render: a value rendered on the server would be
 * the SERVER's clock, and would not match on hydration.
 */
export function useRenderedAt() {
  const ref = useRef(0);
  useEffect(() => {
    ref.current = Date.now();
  }, []);
  return ref;
}

/** Read the honeypot off a submitted form. */
export function honeypotValue(form: HTMLFormElement) {
  return String(new FormData(form).get(HONEYPOT_FIELD) ?? "");
}

export async function submitForm(
  url: string,
  fields: Record<string, string>,
  meta: { honeypot: string; renderedAt: number }
): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fields,
        [HONEYPOT_FIELD]: meta.honeypot,
        renderedAt: meta.renderedAt,
        submittedAt: Date.now(),
      }),
    });
  } catch {
    return { ok: false, error: "network", message: MESSAGES.network, offerDirect: true };
  }

  let body: FormResponse | null = null;
  try {
    body = (await res.json()) as FormResponse;
  } catch {
    // A proxy's HTML error page, an empty 502 … fall through on the status.
  }

  if (res.ok && body?.ok) return { ok: true, simulated: body.simulated };

  const error: FormErrorCode =
    body && !body.ok
      ? body.error
      : res.status === 429
        ? "rate_limited"
        : res.status === 413
          ? "payload_too_large"
          : "delivery_failed";
  return {
    ok: false,
    error,
    message: MESSAGES[error] ?? MESSAGES.delivery_failed,
    fields: body && !body.ok ? body.fields : undefined,
    offerDirect: res.status >= 500 || error === "not_configured" || error === "delivery_failed",
  };
}
