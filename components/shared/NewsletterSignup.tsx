"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const t = useTranslations("footer");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="flex items-center gap-2 text-sm text-ocean-300">
        <CheckCircle2 className="h-4 w-4" />
        <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
          {t("newsletterSuccess")}
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2.5">
      <Input
        type="email"
        required
        name="email"
        aria-label={t("newsletterPlaceholder")}
        placeholder={t("newsletterPlaceholder")}
        className="h-[54px] flex-1 rounded-2xl border-white/25 bg-transparent px-5 text-center text-white placeholder:text-[#c0c0c0] focus-visible:border-amber-500"
      />
      <Button
        type="submit"
        size="icon"
        aria-label={t("newsletterSubmit")}
        variant="accent"
        className="h-[54px] w-[54px] shrink-0 rounded-2xl bg-amber-600 hover:bg-amber-700"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
