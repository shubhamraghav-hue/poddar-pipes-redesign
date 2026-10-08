import {
  Validator,
  clientIp,
  deliver,
  fail,
  json,
  rateLimit,
  rateLimited,
  readBody,
  spamCheck,
} from "@/lib/forms/server";

/**
 * POST /api/newsletter — the footer's email signup, on every page.
 *
 * Body: { email } plus the anti-spam fields (see lib/forms/shared.ts).
 *
 * There is no mailing-list provider yet, so a signup is delivered as a
 * "Newsletter signup" notification to the same inbox as enquiries
 * (ENQUIRY_TO_EMAIL); someone adds the address to the list by hand. Swap
 * `deliver` for the provider's API here when one is chosen.
 *
 * Responses match /api/enquiry: 200 { ok: true } (or `simulated` in dev),
 * 400 / 413 / 429 / 502 / 503 with `{ ok: false, error, fields? }`.
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readBody(req);
  if (!body.ok) return body.res;
  const data = body.data;

  const spam = spamCheck(data);
  if (spam === "honeypot") return json({ ok: true });

  const ip = clientIp(req);
  const wait = rateLimit("newsletter", ip, false);
  if (wait) return rateLimited(wait);

  if (spam === "too_fast") return fail("too_fast", 400);

  const v = new Validator(data);
  const email = v.email("email");
  if (!v.valid) return fail("validation", 400, { fields: v.fields });

  const waitNow = rateLimit("newsletter", ip);
  if (waitNow) return rateLimited(waitNow);

  return deliver({
    subject: "Newsletter signup",
    replyTo: email,
    rows: [
      ["Email", email],
      ["Page", (req.headers.get("referer") ?? "").slice(0, 300)],
    ],
  });
}
