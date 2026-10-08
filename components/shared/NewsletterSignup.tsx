"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Honeypot } from "@/components/shared/Honeypot";
import {
  OFFICE_CONTACT,
  honeypotValue,
  submitForm,
  useRenderedAt,
  type SubmitResult,
} from "@/lib/forms/client";

/**
 * The footer's newsletter signup, on every page. Posts to /api/newsletter
 * (which, until a list provider is chosen, emails the office inbox). The
 * "subscribed" line shows ONLY on the server's `ok: true`; a failure keeps
 * the address in the field and explains itself below it.
 */
export function NewsletterSignup() {
  const t = useTranslations("footer");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Extract<SubmitResult, { ok: false }> | null>(null);
  const renderedAt = useRenderedAt();
  const errorId = useId();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    setError(null);
    const result = await submitForm(
      "/api/newsletter",
      { email: String(new FormData(form).get("email") ?? "") },
      { honeypot: honeypotValue(form), renderedAt: renderedAt.current }
    );
    setSubmitting(false);
    if (result.ok) setSubmitted(true);
    else setError(result);
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
    // The column holds the row and, under it, the error; the row keeps the
    // classes (and so the layout) it had before there was an error state.
    <div className="flex w-full max-w-sm flex-col gap-2">
      <form onSubmit={handleSubmit} className="relative flex w-full max-w-sm items-center gap-3 lg:gap-2.5">
        <Honeypot />
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
          maxLength={254}
          autoComplete="email"
          aria-invalid={error?.fields?.email ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={() => error && setError(null)}
          className="h-[44px] flex-1 rounded-full border-[#c0c0c0] bg-transparent px-5 text-[13px] text-white placeholder:font-light placeholder:text-[#c0c0c0] focus-visible:border-amber-500 lg:h-[54px] lg:text-base"
        />
        {/* `rounded-full` is also `Button`'s own base value — stated explicitly
            here only because the override it replaces was squaring it off. */}
        <Button
          type="submit"
          size="icon"
          aria-label={t("newsletterSubmit")}
          variant="accent"
          disabled={submitting}
          aria-busy={submitting || undefined}
          className="h-[44px] w-[44px] shrink-0 rounded-full bg-amber-600 hover:bg-amber-700 lg:h-[54px] lg:w-[54px]"
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
          {submitting ? (
            <Loader2 className="size-[19px] animate-spin lg:size-[23.33px]" />
          ) : (
            <Send className="size-[19px] translate-x-[-7.5%] translate-y-[7.9%] lg:size-[23.33px]" />
          )}
        </Button>
      </form>
      {/* On the footer's navy (#0b0b52), so a LIGHT red: `#fda29b` is ~9:1
          there, where the forms' `#b42318` would be unreadable. */}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] leading-[1.45] text-[#fda29b]">
          {error.fields?.email ?? error.message}
          {error.offerDirect && (
            <>
              {" "}
              <a href={`mailto:${OFFICE_CONTACT.email}`} className="font-semibold underline underline-offset-2">
                {OFFICE_CONTACT.email}
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
