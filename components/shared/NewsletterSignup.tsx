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
        <CheckCircle2 className="h-4 w-4" /> {t("newsletterSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <Input
        type="email"
        required
        name="email"
        aria-label={t("newsletterPlaceholder")}
        placeholder={t("newsletterPlaceholder")}
        className="border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-ocean-400"
      />
      <Button type="submit" size="icon" aria-label={t("newsletterSubmit")}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
