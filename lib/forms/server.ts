import { NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  type FormErrorCode,
  type FormResponse,
} from "@/lib/forms/shared";

/**
 * Server half of the form contract, shared by every route under app/api/:
 * body parsing, spam checks, validation helpers, a per-IP rate limit, and
 * DELIVERY to one or both channels (plain `fetch`, no SDKs):
 *
 *   Google Sheet  every submission becomes a row (one tab per form) and the
 *                 sheet's Apps Script emails it on — see
 *                 integrations/google-sheets/ (Code.gs + README.md).
 *                   SHEETS_WEBHOOK_URL     the Apps Script web-app /exec URL
 *                   SHEETS_WEBHOOK_SECRET  shared secret (Script Property SECRET)
 *   Resend email  optional second channel.
 *                   RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL
 *
 * A submission succeeds when AT LEAST ONE configured channel accepts it (the
 * other's failure is logged). With no channel configured, development logs
 * the submission and answers `{ ok: true, simulated: true }`; production
 * answers 503 `not_configured`. Production NEVER reports a success that was
 * not stored or sent anywhere.
 */

/** Hard cap on a request body. The longest legitimate form is well under 8 KB. */
const MAX_BODY_BYTES = 16 * 1024;

export function json(body: FormResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export function fail(
  error: FormErrorCode,
  status: number,
  extra?: { fields?: Record<string, string>; headers?: HeadersInit }
) {
  return json({ ok: false, error, ...(extra?.fields ? { fields: extra.fields } : {}) }, status, extra?.headers);
}

/** Parse a JSON object body, capped at MAX_BODY_BYTES. */
export async function readBody(
  req: Request
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; res: NextResponse }> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return { ok: false, res: fail("payload_too_large", 413) };
  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, res: fail("invalid_json", 400) };
  }
  // Checked again on the real body: Content-Length is optional (chunked) and
  // can lie.
  if (text.length > MAX_BODY_BYTES) return { ok: false, res: fail("payload_too_large", 413) };
  try {
    const data: unknown = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("not an object");
    return { ok: true, data: data as Record<string, unknown> };
  } catch {
    return { ok: false, res: fail("invalid_json", 400) };
  }
}

/* ------------------------------------------------------------------ spam */

/**
 * Honeypot + time-to-submit.
 *
 *   "honeypot"  the hidden field was filled — answer with a FAKE success so
 *               the bot has nothing to learn from, and send nothing
 *   "too_fast"  submitted under MIN_FILL_MS after render, or without the
 *               timestamps at all (a scripted POST). Answered with a real
 *               400 — a fast human sees "press submit again" and the retry
 *               passes, so nobody is ever shown a fake success
 */
export function spamCheck(data: Record<string, unknown>): "honeypot" | "too_fast" | null {
  const hp = data[HONEYPOT_FIELD];
  if (typeof hp === "string" && hp.trim() !== "") return "honeypot";
  const renderedAt = Number(data.renderedAt);
  const submittedAt = Number(data.submittedAt);
  if (!Number.isFinite(renderedAt) || !Number.isFinite(submittedAt) || renderedAt <= 0) return "too_fast";
  // Both stamps come from the browser's clock, so skew between the visitor's
  // device and this server cannot trip the check.
  if (submittedAt - renderedAt < MIN_FILL_MS) return "too_fast";
  return null;
}

/* ------------------------------------------------------------- rate limit */

/**
 * Sliding-window limit per client IP and bucket (enquiry / newsletter).
 *
 * BEST-EFFORT ONLY: this lives in the memory of one server instance. On
 * serverless (Vercel) every cold start begins empty and concurrent instances
 * each keep their own count, so a determined sender gets more than LIMIT. It
 * stops the casual repeat-submitter and a naive script; anything stronger
 * needs a shared store (Upstash/Vercel KV) or the platform's firewall rules.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

export function clientIp(req: Request) {
  // Vercel and most proxies put the client first in X-Forwarded-For.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Returns the seconds until a slot frees up when the caller is over the limit,
 * otherwise null. Pass `record: false` to peek without counting this request.
 */
export function rateLimit(bucket: string, ip: string, record = true): number | null {
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return Math.max(1, Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000));
  }
  if (record) recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) {
    for (const [k, ts] of hits) if (!ts.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return null;
}

export function rateLimited(retryAfter: number) {
  return fail("rate_limited", 429, { headers: { "Retry-After": String(retryAfter) } });
}

/* ------------------------------------------------------------- validation */

/** Collects per-field messages; `text()` trims, caps and checks a string field. */
export class Validator {
  readonly fields: Record<string, string> = {};
  constructor(private data: Record<string, unknown>) {}

  text(name: string, opts: { required?: boolean; max: number; label: string }): string {
    const raw = this.data[name];
    const value = typeof raw === "string" ? raw.trim() : raw == null ? "" : null;
    if (value === null) {
      this.fields[name] = `${opts.label} is invalid.`;
      return "";
    }
    if (!value) {
      if (opts.required) this.fields[name] = `${opts.label} is required.`;
      return "";
    }
    if (value.length > opts.max) {
      this.fields[name] = `${opts.label} must be ${opts.max} characters or fewer.`;
      return "";
    }
    return value;
  }

  email(name: string, label = "Email") {
    const v = this.text(name, { required: true, max: 254, label });
    // Deliberately loose — the real check is the reply arriving. Rejects the
    // usual typos: no @, spaces, no dot in the domain.
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) this.fields[name] = "Please enter a valid email address.";
    return v;
  }

  /** Indian mobile: 10 digits, optionally prefixed +91 / 91 / 0. Spaces, dashes and brackets ignored. */
  mobile(name: string, label: string) {
    const v = this.text(name, { required: true, max: 20, label });
    if (!v) return v;
    const digits = v.replace(/[\s\-().]/g, "");
    if (!/^(?:\+?91|0)?\d{10}$/.test(digits)) {
      this.fields[name] = "Please enter a 10-digit mobile number (optionally with +91 or 0).";
      return "";
    }
    return digits;
  }

  /** Optional website / social page: "example.com", "https://…", "instagram.com/x". */
  url(name: string, label: string) {
    const v = this.text(name, { max: 200, label });
    if (v && !/^(https?:\/\/)?[^\s.\/]+\.[^\s]{2,}$/i.test(v)) {
      this.fields[name] = "Please enter a website or social page address, e.g. example.com.";
      return "";
    }
    return v;
  }

  /**
   * Phone / WhatsApp for any country: 7–15 digits, optional leading +.
   * (Indian numbers go through `mobile` for the stricter 10-digit rule.)
   */
  phoneIntl(name: string, label: string) {
    const v = this.text(name, { required: true, max: 24, label });
    if (!v) return v;
    const digits = v.replace(/[\s\-().]/g, "");
    if (!/^\+?\d{7,15}$/.test(digits)) {
      this.fields[name] = "Please enter a valid phone / WhatsApp number with country code.";
      return "";
    }
    return digits;
  }

  pincode(name: string) {
    const v = this.text(name, { max: 6, label: "Pincode" });
    if (v && !/^\d{6}$/.test(v)) this.fields[name] = "Pincode must be 6 digits.";
    return v;
  }

  oneOf<T extends readonly string[]>(name: string, allowed: T, label: string): T[number] | "" {
    const v = this.text(name, { required: true, max: 60, label });
    if (v && !(allowed as readonly string[]).includes(v)) {
      this.fields[name] = `Please choose a valid ${label.toLowerCase()}.`;
      return "";
    }
    return v as T[number] | "";
  }

  get valid() {
    return Object.keys(this.fields).length === 0;
  }
}

/* ---------------------------------------------------------------- delivery */

/** The sheet tab a submission lands in (the Apps Script accepts only these). */
export type FormTab = "Enquiries" | "Partners" | "Newsletter";

export type Mail = {
  /** Which form — the Google Sheet tab, and context in the email. */
  form: FormTab;
  subject: string;
  /** Rows of the email body, in order. Empty values are shown as "—". */
  rows: [label: string, value: string][];
  replyTo?: string;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render(mail: Mail) {
  const text = mail.rows.map(([k, v]) => `${k}:\n${v || "—"}\n`).join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;font-size:14px;line-height:1.5">
<h2 style="font-size:18px;margin:0 0 16px;color:#171796">${escapeHtml(mail.subject)}</h2>
<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;max-width:640px;width:100%">
${mail.rows
  .map(
    ([k, v]) =>
      `<tr><th align="left" valign="top" style="border-bottom:1px solid #e5e5e5;width:160px;color:#606060;font-weight:600">${escapeHtml(k)}</th><td style="border-bottom:1px solid #e5e5e5;white-space:pre-wrap">${v ? escapeHtml(v) : "&mdash;"}</td></tr>`
  )
  .join("\n")}
</table>
<p style="color:#888;font-size:12px;margin-top:16px">Sent from the poddarpipes.com website form. Reply to this email to answer the sender.</p>
</body></html>`;
  return { text, html };
}

type ChannelResult = { channel: "sheet" | "email"; ok: boolean };

/** POST the submission to the Google Sheet's Apps Script web app. */
async function toSheet(mail: Mail, url: string, secret: string): Promise<ChannelResult> {
  try {
    // Apps Script answers the POST with a 302 to a googleusercontent.com URL
    // that serves the JSON reply; `fetch` follows it (as a GET, which is what
    // Google expects). The row is written during the POST itself.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        form: mail.form,
        subject: mail.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        replyTo: mail.replyTo ?? "",
        rows: mail.rows,
      }),
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const body = (await res.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      mailError?: string | null;
    } | null;
    if (!res.ok || !body?.ok) {
      console.error("[forms] Google Sheet rejected the submission:", res.status, body?.error ?? "(no JSON reply)");
      return { channel: "sheet", ok: false };
    }
    if (body.mailError) console.error("[forms] Row saved, but the sheet's notification email failed:", body.mailError);
    return { channel: "sheet", ok: true };
  } catch (err) {
    console.error("[forms] Google Sheet request failed:", err);
    return { channel: "sheet", ok: false };
  }
}

/** Send the submission as an email through Resend. */
async function toEmail(mail: Mail, apiKey: string, to: string[], from: string): Promise<ChannelResult> {
  const { text, html } = render(mail);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        // Header injection guard: a subject built from user input must stay on one line.
        subject: mail.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        text,
        html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[forms] Resend rejected the email:", res.status, await res.text().catch(() => ""));
      return { channel: "email", ok: false };
    }
    return { channel: "email", ok: true };
  } catch (err) {
    console.error("[forms] Resend request failed:", err);
    return { channel: "email", ok: false };
  }
}

/**
 * Deliver to every configured channel in parallel, or simulate in
 * development. Returns the response the route should give.
 */
export async function deliver(mail: Mail): Promise<NextResponse> {
  const sheetUrl = process.env.SHEETS_WEBHOOK_URL?.trim();
  const sheetSecret = process.env.SHEETS_WEBHOOK_SECRET?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = (process.env.ENQUIRY_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim();

  const jobs: Promise<ChannelResult>[] = [];
  if (sheetUrl && sheetSecret) jobs.push(toSheet(mail, sheetUrl, sheetSecret));
  if (apiKey && to.length > 0 && from) jobs.push(toEmail(mail, apiKey, to, from));

  if (jobs.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[forms] No delivery channel configured — simulated delivery:\n", JSON.stringify(mail, null, 2));
      return json({ ok: true, simulated: true });
    }
    console.error(
      "[forms] No delivery channel configured (SHEETS_WEBHOOK_URL + SHEETS_WEBHOOK_SECRET, or RESEND_API_KEY + ENQUIRY_TO_EMAIL + ENQUIRY_FROM_EMAIL) — submission NOT delivered."
    );
    return fail("not_configured", 503);
  }

  const results = await Promise.all(jobs);
  if (results.some((r) => r.ok)) return json({ ok: true });
  return fail("delivery_failed", 502);
}
