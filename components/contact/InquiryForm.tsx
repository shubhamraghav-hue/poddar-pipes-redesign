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
import { productCategories } from "@/lib/data/products";

type Status = "idle" | "submitting" | "success";

const ENQUIRY_TYPES = ["General", "Sales", "Technical", "Business", "Career"] as const;
type EnquiryType = (typeof ENQUIRY_TYPES)[number];

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setStatus("success");
  }

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
      className={compact ? "flex flex-col gap-5" : "flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white p-8 md:p-10"}
    >
      {presetProduct && (
        <div className="rounded-xl bg-ocean-600/5 px-4 py-3 text-sm text-ocean-700">
          Inquiring about: <span className="font-medium">{presetProduct}</span>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input id="name" name="name" placeholder="Anil Sharma" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">{t("company")}</Label>
          <Input id="company" name="company" placeholder="Sharma Constructions" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" placeholder="anil@company.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="enquiryType">Enquiry Type</Label>
        <Select value={enquiryType} onValueChange={(v) => setEnquiryType(v as EnquiryType)} name="enquiryType">
          <SelectTrigger id="enquiryType">
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
        />
      </div>

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