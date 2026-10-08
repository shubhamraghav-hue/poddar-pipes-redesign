"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Honeypot } from "@/components/shared/Honeypot";
import { productCategories } from "@/lib/data/products";
import { INQUIRY_TYPES } from "@/lib/forms/shared";
import {
  OFFICE_CONTACT,
  honeypotValue,
  submitForm,
  useRenderedAt,
  type SubmitResult,
} from "@/lib/forms/client";

type Status = "idle" | "submitting" | "success";

/**
 * The older enquiry form — the /careers job application and the enquiry box on
 * product detail pages. Posts to /api/enquiry with `kind: "inquiry"`; the
 * success card shows ONLY on the server's `ok: true`, and any failure keeps
 * the form (and what was typed) on screen with an inline error.
 */

const ENQUIRY_TYPES = INQUIRY_TYPES;
type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type SubmitError = Extract<SubmitResult, { ok: false }>;

interface InquiryFormProps {
  presetProduct?: string;
  presetEnquiryType?: EnquiryType;
  compact?: boolean;
}

export function InquiryForm({ presetProduct, presetEnquiryType, compact = false }: InquiryFormProps) {
  const t = useTranslations("form");
  const [status, setStatus] = useState<Status>("idle");
  const [interest, setInterest] = useState("");
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(presetEnquiryType ?? "General");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<SubmitError | null>(null);
  const renderedAt = useRenderedAt();

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
        kind: "inquiry",
        name: str("name"),
        company: str("company"),
        email: str("email"),
        phone: str("phone"),
        enquiryType,
        interest,
        product: presetProduct ?? "",
        message: str("message"),
      },
      { honeypot: honeypotValue(form), renderedAt: renderedAt.current }
    );
    if (!result.ok) {
      setStatus("idle");
      setFormError(result);
      setFieldErrors(result.fields ?? {});
      const first = Object.keys(result.fields ?? {})[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setStatus("success");
  }

  // `aria-invalid` + `aria-describedby` for a control the server rejected.
  const invalid = (name: string) =>
    fieldErrors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};
  const errorText = (name: string) =>
    fieldErrors[name] ? (
      <p id={`${name}-error`} className="text-[13px] leading-4 text-[#b42318]">
        {fieldErrors[name]}
      </p>
    ) : null;

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-medium text-slate-900">{t("successTitle")}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-slate-600">{t("successMessage")}</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          {t("submitAnother")}
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      // A field's server error clears as soon as that field is edited.
      onChange={(e) => {
        const name = (e.target as HTMLInputElement).name;
        if (name && fieldErrors[name]) setFieldErrors(({ [name]: _cleared, ...rest }) => rest);
      }}
      className={
        compact
          ? "relative flex flex-col gap-5"
          : "relative flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white p-8 md:p-10"
      }
    >
      <Honeypot />
      {presetProduct && (
        <div className="rounded-xl bg-ocean-600/5 px-4 py-3 text-sm text-ocean-700">
          Inquiring about: <span className="font-medium">{presetProduct}</span>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input
            id="name"
            name="name"
            placeholder="Anil Sharma"
            required
            maxLength={100}
            autoComplete="name"
            {...invalid("name")}
          />
          {errorText("name")}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">{t("company")}</Label>
          <Input
            id="company"
            name="company"
            placeholder="Sharma Constructions"
            maxLength={120}
            autoComplete="organization"
            {...invalid("company")}
          />
          {errorText("company")}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="anil@company.com"
            required
            maxLength={254}
            autoComplete="email"
            {...invalid("email")}
          />
          {errorText("email")}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          {/* 10 digits, optionally after +91 or 0, spaces/dashes allowed
              between them — the same rule the server applies. */}
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            pattern="(\+91|0)?[ \-]*[0-9](?:[ \-]*[0-9]){9}"
            title="A 10-digit mobile number, optionally starting with +91 or 0, e.g. 98765 43210"
            maxLength={20}
            autoComplete="tel"
            inputMode="tel"
            {...invalid("phone")}
          />
          {errorText("phone")}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="enquiryType">Enquiry Type</Label>
        <Select
          value={enquiryType}
          onValueChange={(v) => {
            setEnquiryType(v as EnquiryType);
            setFieldErrors(({ enquiryType: _cleared, ...rest }) => rest);
          }}
          name="enquiryType"
        >
          <SelectTrigger id="enquiryType" {...invalid("enquiryType")}>
            <SelectValue placeholder="Select enquiry type" />
          </SelectTrigger>
          <SelectContent>
            {ENQUIRY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorText("enquiryType")}
      </div>

      {!presetProduct && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="interest">{t("productInterest")}</Label>
          <Select value={interest} onValueChange={setInterest} name="interest">
            <SelectTrigger id="interest">
              <SelectValue placeholder="Select a product category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories
                .filter((c) => c.id !== "all")
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              <SelectItem value="other">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project, quantity required, and timeline."
          required
          maxLength={5000}
          {...invalid("message")}
        />
        {errorText("message")}
      </div>

      {/* Why the send failed. `role="alert"` announces it; `#b42318` on this
          pale tint is ~6:1. When the fault is ours (server down, email not
          configured) the office line and inbox are offered instead. */}
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-sm leading-relaxed text-[#b42318]"
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

      <Button type="submit" size="lg" disabled={status === "submitting"} className="relative mt-2">
        <AnimatePresence mode="wait" initial={false}>
          {status === "submitting" ? (
            <motion.span
              key="loading"
              className="relative flex w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("submit")}
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="relative flex w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Send className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("submit")}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
