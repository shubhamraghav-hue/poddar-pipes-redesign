"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Phone } from "lucide-react";
import { scrollToElement } from "@/hooks/useLenis";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { Honeypot } from "@/components/shared/Honeypot";
import { cn } from "@/lib/utils";
import {
  ENQUIRY_TYPES,
  INDIAN_STATES,
  PARTNER_BUSINESS_TYPES,
  PARTNER_COUNTRIES,
  PARTNER_YEARS,
} from "@/lib/forms/shared";
import {
  OFFICE_CONTACT,
  honeypotValue,
  submitForm,
  useRenderedAt,
  type SubmitResult,
} from "@/lib/forms/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/**
 * The site's contact form — Name / Email / Mobile / Company / City / Pincode /
 * Message. ONE field set, two places:
 *
 *   variant="page"    the form on /contact (node 1606:11568), styled exactly as
 *                     it was when it lived inside `SendMessage`
 *   variant="dialog"  the global enquiry pop-up (node 1605:11496): 16px
 *                     uppercase labels at 1px tracking, 48px fields at radius
 *                     10 with a `#c0c0c0` stroke, and the pop-up's own vertical
 *                     rhythm — 40 between groups, 32 above Submit
 *
 * NO enquiry-type field (client, 2026-10-09): every submission is recorded as
 * "General" in the sheet. `preset` pre-fills the message (the estimator sends
 * its material list). The caller remounts the form with a new `key` per open,
 * so a preset never leaks into the next enquiry.
 *
 * Submission posts to /api/enquiry (`kind: "enquiry"`), for BOTH surfaces.
 * The success panel shows ONLY on the server's `ok: true`; anything else —
 * network down, a field the server rejected, rate limit, email not
 * configured — keeps the form (and everything typed into it) on screen with
 * an inline error.
 */

export { ENQUIRY_TYPES };

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
export type EnquiryPreset = { message?: string };

type Status = "idle" | "submitting" | "success";
type SubmitError = Extract<SubmitResult, { ok: false }>;
type SentSummary = { firstName: string; email: string; enquiryType: string };
type Variant = "page" | "dialog";

const STYLES: Record<
  Variant,
  {
    form: string;
    grid: string;
    label: string;
    control: string;
    select: string;
    submit: string;
    textarea: string;
  }
> = {
  // /contact form, node 1606:11573. Same controls as the pop-up (node
  // 1605:11496 — the two mocks share labels, fields and Submit); what differs
  // is the card around them and a slightly different vertical rhythm.
  page: {
    // 621 wide, radius 20, `#c0c0c0` over a 35% `#f5f5f5` tint. Padding is
    // Figma's offsets minus the 1px border: content at 35, Submit ending 40
    // above the bottom edge.
    form: "flex flex-col gap-[35px] rounded-[20px] border border-[#c0c0c0] bg-[#f5f5f5]/35 p-6 md:px-[34px] md:pb-[39px] md:pt-[34px]",
    // 40 under the two-up grid (the select label sits at 377, not 373).
    grid: "gap-y-10 mb-[5px]",
    label: "text-[16px] font-medium uppercase leading-4 tracking-[1px] text-[#606060]",
    control:
      "rounded-[10px] border-[#c0c0c0] text-[16px] text-[#4a4a4a] focus-visible:border-[#171796]",
    // 50 tall here (the pop-up's is 45).
    select:
      "h-[50px] rounded-[10px] border-[#c0c0c0] pl-[18px] pr-[30px] text-[16px] text-[#4a4a4a] focus:border-[#171796] data-[placeholder]:text-[#6b6b6b]",
    // Submit at 651: 27 under the message box.
    submit: "-mt-2",
    textarea: "h-[110px] resize-y",
  },
  dialog: {
    // No frame of its own — the dialog panel is the card.
    form: "flex flex-col gap-10",
    grid: "gap-y-10",
    label: "text-[16px] font-medium uppercase leading-4 tracking-[1px] text-[#606060]",
    control:
      "rounded-[10px] border-[#c0c0c0] text-[16px] text-[#4a4a4a] focus-visible:border-[#171796]",
    select:
      "h-[45px] rounded-[10px] border-[#c0c0c0] pl-[18px] pr-[30px] text-[16px] text-[#4a4a4a] focus:border-[#171796] data-[placeholder]:text-[#6b6b6b]",
    // Figma: 32px between the message box and Submit, not the 40 used above.
    submit: "-mt-2",
    // Fixed at Figma's 110 — `rows={4}` alone rendered 123 and pushed Submit
    // and the panel 24px past the mock. Still user-resizable vertically.
    textarea: "h-[110px] resize-y",
  },
};

export function EnquiryForm({
  variant = "page",
  preset,
  onDone,
}: {
  variant?: Variant;
  preset?: EnquiryPreset;
  /** Shown in the success state as a "Close" action (the dialog passes one). */
  onDone?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState<SentSummary | null>(null);
  // Server-side field messages, keyed by field name, and the form-level error
  // shown above Submit. Both clear as the visitor edits / resubmits.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<SubmitError | null>(null);
  const renderedAt = useRenderedAt();
  // The form's height at submit, handed to the success panel as a floor so
  // neither the dialog nor the /contact column jumps when the form swaps out.
  const formRef = useRef<HTMLFormElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number | undefined>();
  const s = STYLES[variant];
  // Prefixed ids: /contact renders the page form AND can open the dialog form,
  // and two `id="name"`s would point both labels at the first field.
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const str = (k: string) => String(data.get(k) ?? "");
    setStatus("submitting");
    setFormError(null);
    setFieldErrors({});
    const result = await submitForm(
      "/api/enquiry",
      {
        kind: "enquiry",
        name: str("name"),
        email: str("email"),
        mobile: str("mobile"),
        company: str("company"),
        city: str("city"),
        pincode: str("pincode"),
        message: str("message"),
      },
      { honeypot: honeypotValue(form), renderedAt: renderedAt.current }
    );
    if (!result.ok) {
      setStatus("idle");
      setFormError(result);
      const fields = result.fields ?? {};
      setFieldErrors(fields);
      // Focus the first field the server rejected, else leave focus on Submit
      // — the alert above it is announced either way.
      const first = Object.keys(fields)[0];
      if (first) document.getElementById(fid(first))?.focus();
      return;
    }
    // Lock only where the form is two-up (sm+, ~734–791px): there the swap
    // would otherwise jump. On a phone the one-column form is ~1060px, and a
    // success card held at that height is mostly empty — with the reader,
    // who just pressed Submit at the bottom, looking at the blank half.
    setLockedHeight(
      window.matchMedia("(min-width: 640px)").matches ? formRef.current?.offsetHeight : undefined
    );
    setSent({
      firstName: String(data.get("name") ?? "").trim().split(/\s+/)[0] ?? "",
      email: String(data.get("email") ?? "").trim(),
      enquiryType: "General",
    });
    setStatus("success");
  }

  if (status === "success" && sent) {
    return (
      <EnquirySuccess
        variant={variant}
        sent={sent}
        minHeight={lockedHeight}
        onDone={onDone}
        onAgain={() => {
          setSent(null);
          setStatus("idle");
        }}
      />
    );
  }

  // `aria-invalid` + `aria-describedby` for a control the server rejected, and
  // the matching message for its `Field`.
  const invalid = (name: string) =>
    fieldErrors[name]
      ? { "aria-invalid": true as const, "aria-describedby": fid(`${name}-error`) }
      : {};
  const fieldError = (name: string) =>
    fieldErrors[name] ? { error: fieldErrors[name], errorId: fid(`${name}-error`) } : {};

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      // A field's server error clears as soon as that field is edited.
      onChange={(e) => {
        const name = (e.target as HTMLInputElement).name;
        if (name && fieldErrors[name]) {
          setFieldErrors(({ [name]: _cleared, ...rest }) => rest);
        }
      }}
      className={cn("relative", s.form)}
    >
      <Honeypot />
      {/* Figma pairs these two-up at 266px each inside a 621px card; the grid
          collapses to one column below `sm` where 266px would be narrower than
          a thumb. */}
      <div className={cn("grid grid-cols-1 gap-x-[18px] sm:grid-cols-2", s.grid)}>
        <Field id={fid("name")} label="Name" required labelClass={s.label} {...fieldError("name")}>
          <Input
            id={fid("name")}
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className={s.control}
            {...invalid("name")}
          />
        </Field>
        <Field id={fid("email")} label="Email" required labelClass={s.label} {...fieldError("email")}>
          <Input
            id={fid("email")}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            className={s.control}
            {...invalid("email")}
          />
        </Field>
        <Field id={fid("mobile")} label="Mobile Number" required labelClass={s.label} {...fieldError("mobile")}>
          {/* 10 digits, optionally after +91 or 0, spaces/dashes allowed
              between them — the same rule the server applies. */}
          <Input
            id={fid("mobile")}
            name="mobile"
            type="tel"
            required
            pattern="(\+91|0)?[ \-]*[0-9](?:[ \-]*[0-9]){9}"
            title="A 10-digit mobile number, optionally starting with +91 or 0, e.g. 98888 22333"
            maxLength={20}
            autoComplete="tel"
            inputMode="tel"
            enterKeyHint="next"
            className={s.control}
            {...invalid("mobile")}
          />
        </Field>
        <Field id={fid("company")} label="Company Name" labelClass={s.label} {...fieldError("company")}>
          <Input
            id={fid("company")}
            name="company"
            maxLength={120}
            autoComplete="organization"
            className={s.control}
            {...invalid("company")}
          />
        </Field>
        <Field id={fid("city")} label="City" required labelClass={s.label} {...fieldError("city")}>
          <Input
            id={fid("city")}
            name="city"
            required
            maxLength={80}
            autoComplete="address-level2"
            className={s.control}
            {...invalid("city")}
          />
        </Field>
        <Field id={fid("pincode")} label="Pincode" labelClass={s.label} {...fieldError("pincode")}>
          {/* `inputMode="numeric"` rather than `type="number"`: a pincode is a
              6-digit identifier, not a quantity, and `number` brings spinners
              and strips a leading zero. */}
          <Input
            id={fid("pincode")}
            name="pincode"
            inputMode="numeric"
            pattern="[0-9]{6}"
            title="A 6-digit pincode, e.g. 700001"
            maxLength={6}
            autoComplete="postal-code"
            enterKeyHint="next"
            className={s.control}
            {...invalid("pincode")}
          />
        </Field>
      </div>

      <Field id={fid("message")} label="Message" labelClass={s.label} {...fieldError("message")}>
        <Textarea
          id={fid("message")}
          name="message"
          rows={4}
          maxLength={5000}
          {...invalid("message")}
          enterKeyHint="done"
          defaultValue={preset?.message}
          className={cn("min-h-[110px]", s.control, s.textarea)}
        />
      </Field>

      {/* Why the send failed. `role="alert"` announces it; `#b42318` on this
          pale tint is ~6:1. When the fault is ours (server down, email not
          configured) the office line and inbox are offered, so the enquiry
          is never a dead end. */}
      {formError && (
        <div
          role="alert"
          className="-mt-3 rounded-[10px] border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-[14px] leading-[1.45] text-[#b42318]"
        >
          <p>{formError.message}</p>
          {formError.offerDirect && (
            <p className="mt-1">
              <a href={OFFICE_CONTACT.phone.href} className="font-semibold underline underline-offset-2">
                {OFFICE_CONTACT.phone.display}
              </a>
              {" · "}
              <a
                href={`mailto:${OFFICE_CONTACT.email}`}
                className="font-semibold underline underline-offset-2 [overflow-wrap:anywhere]"
              >
                {OFFICE_CONTACT.email}
              </a>
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        // `h-11` (44px, the touch-target floor) set outright with `py-0`.
        // `Button` cap-trims a string label, so the old pt16/pb12 pair sat
        // "Submit" 2.25px LOW; symmetric centring on the caps fixes it.
        className={cn(
          "h-11 w-full touch-manipulation select-none self-start rounded-full bg-[#f28000] px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] transition-[filter,transform,translate,scale] duration-100 ease-out hover:brightness-95 active:scale-[0.98] active:brightness-90 sm:w-auto",
          // Navy-on-orange, 46 tall, on both surfaces (nodes 1605:11493 and
          // 1606:11612) — the page's was white text at 44 until the audit.
          "h-[46px] text-[#0b0b52]",
          s.submit
        )}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {/* Inside a fragment, so `Button` does not trim it for us. */}
            <span className={CAP_TRIM}>Sending</span>
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}

/**
 * "Become a Partner" — the Dealers & Distributors enquiry (client brief "PP
 * Forms", 2026-10-09). Opened by every `PartnerLink` (navbar CTA, product
 * pages, the /products strip, CTA bands); lives in the global pop-up.
 *
 * Three groups, as the brief orders them: contact & company, location &
 * business profile, the enquiry itself. Country defaults to India, which turns
 * State into a dropdown of states/UTs (the brief asks for one); any other
 * country gets a free-text State / Region, and "Other" reveals a country
 * field. Same controls, styles, error handling and success screen as the
 * contact form, posted to /api/enquiry as `kind: "partner"` → the sheet's
 * "Partners" tab.
 *
 * The website field is `companyWebsite`, NOT `website` — that name is the
 * honeypot, and a real partner who filled it would be dropped as a bot.
 */
export function PartnerForm({
  preset,
  onDone,
  intro,
}: {
  preset?: EnquiryPreset;
  onDone?: () => void;
  /** Title + intro shown above the form; hidden once it has been sent. */
  intro?: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState<SentSummary | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<SubmitError | null>(null);
  const [country, setCountry] = useState<string>("India");
  const [state, setState] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const renderedAt = useRenderedAt();
  const s = STYLES.dialog;
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const india = country === "India";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Radix's hidden <select> reports VALID while empty, so the required
    // dropdowns are checked by hand (as the contact form's type field was).
    const missing: Record<string, string> = {};
    if (india && !state) missing.state = "Please choose your state.";
    if (!businessType) missing.businessType = "Please choose your business type.";
    if (Object.keys(missing).length) {
      setFieldErrors((f) => ({ ...f, ...missing }));
      document.getElementById(fid(Object.keys(missing)[0]))?.focus();
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const str = (k: string) => String(data.get(k) ?? "");
    setStatus("submitting");
    setFormError(null);
    setFieldErrors({});
    const result = await submitForm(
      "/api/enquiry",
      {
        kind: "partner",
        name: str("name"),
        company: str("company"),
        email: str("email"),
        phone: str("phone"),
        companyWebsite: str("companyWebsite"),
        country,
        countryOther: str("countryOther"),
        state: india ? state : str("state"),
        city: str("city"),
        businessType,
        yearsInBusiness: years,
        coverage: str("coverage"),
        message: str("message"),
      },
      { honeypot: honeypotValue(form), renderedAt: renderedAt.current }
    );
    if (!result.ok) {
      setStatus("idle");
      setFormError(result);
      const fields = result.fields ?? {};
      setFieldErrors(fields);
      const first = Object.keys(fields)[0];
      if (first) document.getElementById(fid(first))?.focus();
      return;
    }
    setSent({
      firstName: str("name").trim().split(/\s+/)[0] ?? "",
      email: str("email").trim(),
      enquiryType: "Partnership",
    });
    setStatus("success");
  }

  if (status === "success" && sent) {
    return (
      <EnquirySuccess
        variant="dialog"
        sent={sent}
        onDone={onDone}
        onAgain={() => {
          setSent(null);
          setStatus("idle");
        }}
      />
    );
  }

  const invalid = (name: string) =>
    fieldErrors[name] ? { "aria-invalid": true as const, "aria-describedby": fid(`${name}-error`) } : {};
  const fieldError = (name: string) =>
    fieldErrors[name] ? { error: fieldErrors[name], errorId: fid(`${name}-error`) } : {};
  const clear = (name: string) => setFieldErrors(({ [name]: _cleared, ...rest }) => rest);
  const groupTitle = "text-[13px] font-semibold uppercase tracking-[0.14em] text-[#171796]";

  const pick = (
    name: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: readonly string[],
    required = true
  ) => (
    <Field id={fid(name)} label={label} required={required} labelClass={s.label} {...fieldError(name)}>
      <Select
        value={value}
        onValueChange={(v) => {
          onChange(v);
          clear(name);
        }}
        name={name}
      >
        <SelectTrigger
          id={fid(name)}
          aria-invalid={!!fieldErrors[name] || undefined}
          aria-describedby={fieldErrors[name] ? fid(`${name}-error`) : undefined}
          className={cn(s.select, fieldErrors[name] && "border-[#d92d20]")}
        >
          <SelectValue placeholder={<span className={`block ${CAP_TRIM}`}>Choose</span>} />
        </SelectTrigger>
        {/* `z-[70]`: above the dialog's z-60 overlay (see the contact form). */}
        <SelectContent className="z-[70] max-h-[min(320px,var(--radix-select-content-available-height))]">
          {options.map((o) => (
            <SelectItem key={o} value={o} className="min-h-9">
              <span className={`block ${CAP_TRIM}`}>{o}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );

  return (
    <>
    {intro}
    <form
      onSubmit={handleSubmit}
      onChange={(e) => {
        const name = (e.target as HTMLInputElement).name;
        if (name && fieldErrors[name]) clear(name);
      }}
      className={cn("relative", s.form)}
    >
      <Honeypot />

      {/* ------------------------------------------- contact & company */}
      <fieldset className="flex flex-col gap-6">
        <legend className={cn(groupTitle, "mb-6")}>Contact &amp; company details</legend>
        <div className={cn("grid grid-cols-1 gap-x-[18px] gap-y-6 sm:grid-cols-2")}>
          <Field id={fid("name")} label="Contact Name" required labelClass={s.label} {...fieldError("name")}>
            <Input id={fid("name")} name="name" required maxLength={100} autoComplete="name" className={s.control} {...invalid("name")} />
          </Field>
          <Field id={fid("company")} label="Business / Company Name" required labelClass={s.label} {...fieldError("company")}>
            <Input id={fid("company")} name="company" required maxLength={120} autoComplete="organization" className={s.control} {...invalid("company")} />
          </Field>
          <Field id={fid("email")} label="Business Email" required labelClass={s.label} {...fieldError("email")}>
            <Input
              id={fid("email")}
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={s.control}
              {...invalid("email")}
            />
          </Field>
          <Field id={fid("phone")} label="Phone / WhatsApp" required labelClass={s.label} {...fieldError("phone")}>
            <Input
              id={fid("phone")}
              name="phone"
              type="tel"
              required
              // India: the 10-digit rule. Elsewhere: 7–15 digits with country code.
              pattern={india ? "(\\+91|0)?[ \\-]*[0-9](?:[ \\-]*[0-9]){9}" : "\\+?[0-9 \\-()]{7,20}"}
              title={india ? "A 10-digit mobile number, optionally starting with +91 or 0" : "Phone number with country code, e.g. +971 50 123 4567"}
              maxLength={24}
              autoComplete="tel"
              inputMode="tel"
              className={s.control}
              {...invalid("phone")}
            />
          </Field>
        </div>
        <Field id={fid("companyWebsite")} label="Company Website / Social Page" labelClass={s.label} {...fieldError("companyWebsite")}>
          <Input
            id={fid("companyWebsite")}
            name="companyWebsite"
            inputMode="url"
            maxLength={200}
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="e.g. yourbusiness.com or instagram.com/yourstore"
            className={s.control}
            {...invalid("companyWebsite")}
          />
        </Field>
      </fieldset>

      {/* ------------------------------------- location & business profile */}
      <fieldset className="flex flex-col gap-6">
        <legend className={cn(groupTitle, "mb-6")}>Location &amp; business profile</legend>
        <div className="grid grid-cols-1 gap-x-[18px] gap-y-6 sm:grid-cols-2">
          {pick("country", "Country / Region", country, (v) => {
            setCountry(v);
            setState("");
          }, PARTNER_COUNTRIES)}
          {country === "Other" ? (
            <Field id={fid("countryOther")} label="Your Country" required labelClass={s.label} {...fieldError("countryOther")}>
              <Input id={fid("countryOther")} name="countryOther" required maxLength={60} autoComplete="country-name" className={s.control} {...invalid("countryOther")} />
            </Field>
          ) : india ? (
            pick("state", "State", state, setState, INDIAN_STATES)
          ) : (
            <Field id={fid("state")} label="State / Region" required labelClass={s.label} {...fieldError("state")}>
              <Input id={fid("state")} name="state" required maxLength={80} autoComplete="address-level1" className={s.control} {...invalid("state")} />
            </Field>
          )}
          {country === "Other" && (
            <Field id={fid("state")} label="State / Region" required labelClass={s.label} {...fieldError("state")}>
              <Input id={fid("state")} name="state" required maxLength={80} autoComplete="address-level1" className={s.control} {...invalid("state")} />
            </Field>
          )}
          <Field id={fid("city")} label="City" required labelClass={s.label} {...fieldError("city")}>
            <Input id={fid("city")} name="city" required maxLength={80} autoComplete="address-level2" className={s.control} {...invalid("city")} />
          </Field>
          {pick("businessType", "Primary Business Type", businessType, setBusinessType, PARTNER_BUSINESS_TYPES)}
          {pick("yearsInBusiness", "Years in Business", years, setYears, PARTNER_YEARS, false)}
        </div>
        <Field id={fid("coverage")} label="Distribution Network / Coverage Area" labelClass={s.label} {...fieldError("coverage")}>
          <Input id={fid("coverage")} name="coverage" maxLength={120} placeholder="e.g. Local, Regional, National" className={s.control} {...invalid("coverage")} />
        </Field>
      </fieldset>

      {/* ------------------------------------------------- inquiry details */}
      <fieldset className="flex flex-col gap-6">
        <legend className={cn(groupTitle, "mb-6")}>Inquiry details</legend>
        <Field id={fid("message")} label="Additional Information / Message" labelClass={s.label} {...fieldError("message")}>
          <Textarea
            id={fid("message")}
            name="message"
            rows={4}
            maxLength={5000}
            defaultValue={preset?.message}
            placeholder="Tell us a bit about your business, current product lines, or estimated initial order volume."
            className={cn("min-h-[110px]", s.control, s.textarea)}
            {...invalid("message")}
          />
        </Field>
      </fieldset>

      {formError && (
        <div
          role="alert"
          className="-mt-3 rounded-[10px] border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-[14px] leading-[1.45] text-[#b42318]"
        >
          <p>{formError.message}</p>
          {formError.offerDirect && (
            <p className="mt-1">
              <a href={OFFICE_CONTACT.phone.href} className="font-semibold underline underline-offset-2">
                {OFFICE_CONTACT.phone.display}
              </a>
              {" · "}
              <a href={`mailto:${OFFICE_CONTACT.email}`} className="font-semibold underline underline-offset-2 [overflow-wrap:anywhere]">
                {OFFICE_CONTACT.email}
              </a>
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className={cn(
          "h-[46px] w-full touch-manipulation select-none self-start rounded-full bg-[#f28000] px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] text-[#0b0b52] transition-[filter,transform,translate,scale] duration-100 ease-out hover:brightness-95 active:scale-[0.98] active:brightness-90 sm:w-auto",
          s.submit
        )}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            <span className={CAP_TRIM}>Sending</span>
          </>
        ) : (
          "Send Partnership Inquiry"
        )}
      </Button>
    </form>
    </>
  );
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** The office line, as printed in the footer and on the /contact call card. */
const OFFICE_PHONE = OFFICE_CONTACT.phone;

const NEXT_STEPS = [
  { title: "Received", body: "Your message is with our office team." },
  { title: "Routed", body: "Passed to the right sales or technical lead." },
  { title: "Reply", body: "Within one business day, by email or phone." },
];

/**
 * The confirmation that replaces the form after a successful submit, on both
 * surfaces. No Figma frame exists for it; it is built from the system around it
 * — the site's light/bold two-line uppercase heading, the orange accent, navy
 * for "done", `#c0c0c0` hairlines.
 *
 * WHAT IT SAYS, in priority order: it worked (the drawn check + heading), what
 * was sent and where the reply goes (their name, enquiry type and email echoed
 * back — proof it was read correctly), what happens next (three steps, the
 * first already done), and a way to escalate (the office phone).
 *
 * NO REFERENCE NUMBER, deliberately: /api/enquiry only emails the office and
 * issues none, so any number shown would be invented, and a customer quoting
 * it to sales would find no record. Add one if the endpoint ever issues it.
 *
 * Focus moves to the heading on mount (and `role="status"` announces it): the
 * Submit button the user pressed no longer exists, so without this focus would
 * fall to <body> — out of the dialog's focus trap, or to the top of /contact.
 */
function EnquirySuccess({
  variant,
  sent,
  minHeight,
  onDone,
  onAgain,
}: {
  variant: Variant;
  sent: SentSummary;
  minHeight?: number;
  onDone?: () => void;
  onAgain: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    // Bring the confirmation into view when it is not — the common case on a
    // phone, where the card collapsed from the form's height to its own.
    const root = rootRef.current;
    if (!root) return;
    const panel = root.closest<HTMLElement>("[data-lenis-prevent]");
    if (panel) {
      // In the dialog: the panel is its own (native) scroller.
      panel.scrollTo({ top: 0 });
      return;
    }
    const top = root.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.4) scrollToElement(root);
  }, []);

  const item = {
    hidden: { opacity: 0, y: 10 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } },
  };

  return (
    <motion.div
      ref={rootRef}
      role="status"
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { delayChildren: 0.35, staggerChildren: 0.07 } } }}
      style={{ minHeight }}
      className={cn(
        // `scroll-mt-24` clears the fixed navbar when it is scrolled to.
        "flex scroll-mt-24 flex-col items-center justify-center text-center",
        variant === "page" &&
          "rounded-[20px] border border-[#c0c0c0] bg-[#f5f5f5]/35 px-6 py-12 md:px-[35px]"
      )}
    >
      {/* The mark: a navy ring that draws itself, then a navy check — one
          hue (client's pick, "option A"; orange + navy inside the mark read
          as clashing). Stroke drawing (`pathLength`) rather than a scale-pop,
          so it reads as "completed" not "appeared". Static under reduced
          motion. */}
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="34" fill="#171796" fillOpacity="0.08" />
        <motion.circle
          cx="36"
          cy="36"
          r="34"
          stroke="#171796"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
        <motion.path
          d="M24 37.5l8 8 16-17"
          stroke="#171796"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: reduce ? 0 : 0.35, ease: EASE_OUT }}
        />
      </svg>

      <motion.p
        variants={item}
        className="mt-6 text-[13px] font-semibold uppercase leading-none tracking-[0.14em] text-[#171796]"
      >
        Message sent
      </motion.p>

      <motion.h3
        ref={headingRef}
        tabIndex={-1}
        variants={item}
        className="mt-3 font-display text-[28px] uppercase leading-[1.08] text-[#4a4a4a] outline-none md:text-[36px]"
      >
        <span className="block font-light">
          Thank you
          {sent.firstName ? (
            <>
              ,{" "}
              {/* The visitor's name in bold brand orange — the one warm
                  accent on an otherwise navy screen. */}
              <span className="font-bold text-[#f28000]">{sent.firstName}</span>
            </>
          ) : null}
        </span>
        <span className="block font-bold">We&rsquo;ll be in touch</span>
      </motion.h3>

      <motion.p
        variants={item}
        className="mt-4 max-w-[420px] text-balance text-[14px] leading-[1.5] text-[#606060] md:text-[15px]"
      >
        Your <span className="font-semibold text-[#4a4a4a]">{sent.enquiryType}</span> enquiry has
        reached our office team. Expect a reply
        {sent.email ? (
          <>
            {" "}
            at {/* `overflow-wrap: anywhere`, not `break-all`: the line wraps BEFORE
                the address when it can, and only splits it if it is wider than
                the column — `break-all` was cutting "priya.shar|ma@…". */}
            <span className="font-semibold text-[#4a4a4a] [overflow-wrap:anywhere]">{sent.email}</span>
          </>
        ) : null}{" "}
        within one business day.
      </motion.p>

      {/* What happens next — step 1 already done (navy, checked), 2 and 3
          pending (hairline). A row from `sm`, stacked below it. */}
      <motion.ol
        variants={item}
        className="mt-8 grid w-full max-w-[520px] grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-0"
      >
        {NEXT_STEPS.map((step, i) => {
          const done = i === 0;
          return (
            <li
              key={step.title}
              className="relative flex gap-3 sm:flex-col sm:items-center sm:gap-2 sm:px-2 sm:text-center"
            >
              {/* Connector to the next step, disc edge to disc edge (sm+). */}
              {i < NEXT_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[13px] hidden h-px bg-[#c0c0c0] sm:block"
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-[26px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                  done
                    ? "bg-[#171796] text-white"
                    : "border border-[#c0c0c0] bg-white text-[#606060]"
                )}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2l2.3 2.3 4.7-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className={CAP_TRIM}>{i + 1}</span>
                )}
              </span>
              <span>
                <span className="block text-[13px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#4a4a4a]">
                  {step.title}
                  {done && <span className="sr-only"> (done)</span>}
                </span>
                <span className="mt-1 block text-[13px] leading-[1.4] text-[#86868c]">
                  {step.body}
                </span>
              </span>
            </li>
          );
        })}
      </motion.ol>

      <motion.div variants={item} className="mt-9 flex flex-col items-center gap-4">
        {onDone ? (
          <Button
            onClick={onDone}
            className="h-[46px] rounded-full bg-[#171796] px-8 py-0 text-lg font-semibold uppercase tracking-[0.36px] text-white transition-[background-color,transform,translate,scale] duration-150 ease-out hover:bg-[#0b0b52] active:scale-[0.98]"
          >
            Done
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onAgain}
            className="h-11 rounded-full px-6 py-0 text-[15px] font-semibold uppercase tracking-[0.3px]"
          >
            Send another message
          </Button>
        )}
        {/* One flex row, both halves cap-trimmed: an inline-flex link inside
            running text sat ~2px above "Need it sooner?". */}
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[13px] text-[#86868c]">
          <span className={CAP_TRIM}>Need it sooner?</span>
          <a
            href={OFFICE_PHONE.href}
            className="flex items-center gap-1 font-semibold text-[#171796] underline-offset-4 transition-colors hover:text-[#f28000] hover:underline"
          >
            <Phone aria-hidden="true" className="size-3.5" />
            <span className={CAP_TRIM}>{OFFICE_PHONE.display}</span>
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Figma's Container > Label + Input pair: the label 10px above its control. */
function Field({
  id,
  label,
  required,
  labelClass,
  error,
  errorId,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  labelClass: string;
  /** A server-side validation message for this field. */
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <Label htmlFor={id} className={labelClass}>
        {label}
        {/* The asterisk is decoration — `required` on the control is what
            actually announces the constraint, so this is hidden from AT to
            avoid "Name star required". */}
        {required && (
          <span aria-hidden="true" className="ml-1 text-[#f28000]">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={errorId} className="text-[13px] leading-4 text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}
