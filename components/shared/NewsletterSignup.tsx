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
      {/* Radius is a PILL, per Figma node 1187:1484. The spec value is
          `100px`, which on a 54px-tall field clamps to half the height — so
          `rounded-full` is the faithful expression of it, not an
          approximation. Both this and the button previously carried
          `rounded-2xl` (16px), standing in for the earlier 18px spec.

          `placeholder:font-light` because the mock sets the placeholder in
          Anek Light 300, where the field would otherwise inherit 400. */}
      <Input
        type="email"
        required
        name="email"
        aria-label={t("newsletterPlaceholder")}
        placeholder={t("newsletterPlaceholder")}
        className="h-[54px] flex-1 rounded-full border-[#c0c0c0] bg-transparent px-5 text-white placeholder:font-light placeholder:text-[#c0c0c0] focus-visible:border-amber-500"
      />
      {/* `rounded-full` is also `Button`'s own base value — stated explicitly
          here only because the override it replaces was squaring it off. */}
      <Button
        type="submit"
        size="icon"
        aria-label={t("newsletterSubmit")}
        variant="accent"
        className="h-[54px] w-[54px] shrink-0 rounded-full bg-amber-600 hover:bg-amber-700"
      >
        {/* 23.33px is the mock's own icon size (node 1187:1488); this was 20px. */}
        <Send className="size-[23.33px]" />
      </Button>
    </form>
  );
}
