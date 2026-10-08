import { ENQUIRY_TYPES, INQUIRY_TYPES } from "@/lib/forms/shared";
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
 * POST /api/enquiry — both enquiry forms on the site.
 *
 *   kind: "enquiry"  `components/enquiry/EnquiryForm` (the global pop-up and
 *                    the /contact form): name, email, mobile, company, city,
 *                    pincode, enquiryType (ENQUIRY_TYPES), message
 *   kind: "inquiry"  `components/contact/InquiryForm` (/careers application,
 *                    product-page enquiry): name, company, email, phone,
 *                    enquiryType (INQUIRY_TYPES), interest, product, message
 *
 * Plus the anti-spam fields every form sends (see lib/forms/shared.ts).
 *
 * Responses: 200 { ok: true } · 200 { ok: true, simulated: true } (dev, no
 * email config) · 400 invalid_json | validation (+ fields) | too_fast ·
 * 413 payload_too_large · 429 rate_limited (+ Retry-After) · 502
 * delivery_failed · 503 not_configured (production, no email config).
 */

// Uses in-memory state (rate limit) and secrets — never prerender or cache.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readBody(req);
  if (!body.ok) return body.res;
  const data = body.data;

  const spam = spamCheck(data);
  // A bot that filled the honeypot gets the same answer a person would.
  if (spam === "honeypot") return json({ ok: true });

  const ip = clientIp(req);
  const wait = rateLimit("enquiry", ip, false);
  if (wait) return rateLimited(wait);

  if (spam === "too_fast") return fail("too_fast", 400);

  const v = new Validator(data);
  const kind = data.kind === "inquiry" ? "inquiry" : data.kind === "enquiry" ? "enquiry" : null;
  if (!kind) return fail("validation", 400, { fields: { kind: "Unknown form." } });

  let mail: Parameters<typeof deliver>[0];

  if (kind === "enquiry") {
    const name = v.text("name", { required: true, max: 100, label: "Name" });
    const email = v.email("email");
    const mobile = v.mobile("mobile", "Mobile number");
    const company = v.text("company", { max: 120, label: "Company name" });
    const city = v.text("city", { required: true, max: 80, label: "City" });
    const pincode = v.pincode("pincode");
    const enquiryType = v.oneOf("enquiryType", ENQUIRY_TYPES, "Enquiry type");
    const message = v.text("message", { max: 5000, label: "Message" });
    if (!v.valid) return fail("validation", 400, { fields: v.fields });
    mail = {
      subject: `Website enquiry: ${enquiryType} — ${name}${city ? `, ${city}` : ""}`,
      replyTo: email,
      rows: [
        ["Enquiry type", enquiryType],
        ["Name", name],
        ["Email", email],
        ["Mobile", mobile],
        ["Company", company],
        ["City", city],
        ["Pincode", pincode],
        ["Message", message],
        ["Page", pageOf(req)],
      ],
    };
  } else {
    const name = v.text("name", { required: true, max: 100, label: "Full name" });
    const company = v.text("company", { max: 120, label: "Company name" });
    const email = v.email("email");
    const phone = v.mobile("phone", "Phone number");
    const enquiryType = v.oneOf("enquiryType", INQUIRY_TYPES, "Enquiry type");
    const interest = v.text("interest", { max: 60, label: "Product of interest" });
    const product = v.text("product", { max: 200, label: "Product" });
    const message = v.text("message", { required: true, max: 5000, label: "Message" });
    if (!v.valid) return fail("validation", 400, { fields: v.fields });
    mail = {
      subject: `${enquiryType === "Career" ? "Job application" : `Website enquiry: ${enquiryType}`} — ${name}${product ? ` (${product})` : ""}`,
      replyTo: email,
      rows: [
        ["Enquiry type", enquiryType],
        ["Regarding", product],
        ["Product of interest", interest],
        ["Name", name],
        ["Company", company],
        ["Email", email],
        ["Phone", phone],
        ["Message", message],
        ["Page", pageOf(req)],
      ],
    };
  }

  // Counted only once a submission is valid, so a person fixing typos does
  // not burn through their allowance.
  const waitNow = rateLimit("enquiry", ip);
  if (waitNow) return rateLimited(waitNow);

  return deliver(mail);
}

/** The page the form was sent from, for context in the inbox. */
function pageOf(req: Request) {
  return (req.headers.get("referer") ?? "").slice(0, 300);
}
