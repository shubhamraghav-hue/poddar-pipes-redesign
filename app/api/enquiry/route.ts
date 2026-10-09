import {
  ENQUIRY_TYPES,
  INDIAN_STATES,
  PARTNER_BUSINESS_TYPES,
  PARTNER_COUNTRIES,
  PARTNER_YEARS,
} from "@/lib/forms/shared";
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
 * POST /api/enquiry — the site's two lead forms.
 *
 *   kind: "enquiry"  `EnquiryForm` (the /contact form and its pop-up): name,
 *                    email, mobile, company, city, pincode, message. No type
 *                    field any more (client, 2026-10-09) — the sheet records
 *                    "General".
 *   kind: "partner"  `PartnerForm` ("Become a Partner" pop-up, the Dealers &
 *                    Distributors brief): contact name, company, business
 *                    email, phone/WhatsApp, website, country, state, city,
 *                    business type, years in business, coverage, message.
 *
 * Plus the anti-spam fields every form sends (see lib/forms/shared.ts).
 *
 * Responses: 200 { ok: true } · 200 { ok: true, simulated: true } (dev, no
 * delivery channel) · 400 invalid_json | validation (+ fields) | too_fast ·
 * 413 payload_too_large · 429 rate_limited (+ Retry-After) · 502
 * delivery_failed · 503 not_configured (production, no delivery channel).
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
  const kind = data.kind === "partner" ? "partner" : data.kind === "enquiry" ? "enquiry" : null;
  if (!kind) return fail("validation", 400, { fields: { kind: "Unknown form." } });

  let mail: Parameters<typeof deliver>[0];

  if (kind === "enquiry") {
    const name = v.text("name", { required: true, max: 100, label: "Name" });
    const email = v.email("email");
    const mobile = v.mobile("mobile", "Mobile number");
    const company = v.text("company", { max: 120, label: "Company name" });
    const city = v.text("city", { required: true, max: 80, label: "City" });
    const pincode = v.pincode("pincode");
    const message = v.text("message", { max: 5000, label: "Message" });
    if (!v.valid) return fail("validation", 400, { fields: v.fields });
    // The form no longer asks; an older cached page might still send one.
    const enquiryType = (ENQUIRY_TYPES as readonly string[]).includes(String(data.enquiryType))
      ? String(data.enquiryType)
      : "General";
    mail = {
      form: "Enquiries",
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
    const name = v.text("name", { required: true, max: 100, label: "Contact name" });
    const company = v.text("company", { required: true, max: 120, label: "Business / company name" });
    const email = v.email("email", "Business email");
    const country = v.oneOf("country", PARTNER_COUNTRIES, "Country");
    const countryOther =
      country === "Other" ? v.text("countryOther", { required: true, max: 60, label: "Country" }) : "";
    const phone = country === "India" ? v.mobile("phone", "Phone / WhatsApp number") : v.phoneIntl("phone", "Phone / WhatsApp number");
    const website = v.url("companyWebsite", "Company website / social page");
    const state =
      country === "India"
        ? v.oneOf("state", INDIAN_STATES, "State")
        : v.text("state", { required: true, max: 80, label: "State / region" });
    const city = v.text("city", { required: true, max: 80, label: "City" });
    const businessType = v.oneOf("businessType", PARTNER_BUSINESS_TYPES, "Business type");
    const yearsRaw = v.text("yearsInBusiness", { max: 20, label: "Years in business" });
    if (yearsRaw && !(PARTNER_YEARS as readonly string[]).includes(yearsRaw)) {
      v.fields.yearsInBusiness = "Please choose a valid option.";
    }
    const coverage = v.text("coverage", { max: 120, label: "Distribution network / coverage area" });
    const message = v.text("message", { max: 5000, label: "Message" });
    if (!v.valid) return fail("validation", 400, { fields: v.fields });
    const countryName = country === "Other" ? countryOther : country;
    mail = {
      form: "Partners",
      subject: `Partnership enquiry: ${company} — ${businessType}, ${city}`,
      replyTo: email,
      rows: [
        ["Contact name", name],
        ["Company", company],
        ["Business email", email],
        ["Phone / WhatsApp", phone],
        ["Website / social", website],
        ["Country", countryName],
        ["State", state],
        ["City", city],
        ["Business type", businessType],
        ["Years in business", yearsRaw],
        ["Coverage area", coverage],
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
