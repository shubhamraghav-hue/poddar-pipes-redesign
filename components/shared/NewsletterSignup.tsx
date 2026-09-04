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
        {/* 23.33px is the mock's own icon size (node 1187:1488).

            The nudge is OPTICAL centring, not a fudge. The glyph is already
            centred geometrically — its bounding box is a symmetric 2-22 in
            both axes and the flex centring puts it within 0.01px of the
            button's middle. But a paper plane is a triangle: rasterising it
            and taking the centroid of the ink puts its visual mass at
            (13.81, 10.10) in a viewBox centred on (12, 12), because the body
            fills the lower-left while only a thin tip reaches the upper-right.
            That reads as up-and-right of centre inside a circle, which has no
            edges to reference against.

            So it is shifted back by that offset — expressed as a share of the
            icon's own box (1.81/24 and 1.90/24) rather than in px, so it holds
            if the icon size ever changes. */}
        <Send className="size-[23.33px] translate-x-[-7.5%] translate-y-[7.9%]" />
      </Button>
    </form>
  );
}
