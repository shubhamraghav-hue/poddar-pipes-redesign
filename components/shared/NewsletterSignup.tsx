"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
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
    <div className="flex w-full max-w-sm flex-col gap-2 lg:max-w-[347px]">
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
          // Desktop = Figma 1530:7196: 290x47 pill, 1px #c0c0c0, 20px left pad,
          // 14px Light placeholder.
          className="h-[44px] flex-1 rounded-full border-[#c0c0c0] bg-transparent px-5 text-[13px] text-white placeholder:font-light placeholder:text-[#c0c0c0] focus-visible:border-amber-500 lg:h-[47px] lg:w-[290px] lg:flex-none lg:text-[14px]"
        />
        {/* `rounded-full` is also `Button`'s own base value — stated explicitly
            here only because the override it replaces was squaring it off. */}
        <Button
          type="submit"
          size="icon"
          aria-label={t("newsletterSubmit")}
          variant="figma-orange"
          disabled={submitting}
          aria-busy={submitting || undefined}
          className="h-[44px] w-[44px] shrink-0 rounded-full lg:h-[47px] lg:w-[47px]"
        >
          {/* Figma's own send glyph (public/brand/send.svg). SMALLER and
              re-centred (client, 2026-10-22: "too big and visually off
              center"). Size is the mobile mock's (node 2015:5669): 19px in the
              44px circle, ~43% of it — and the same ratio from `lg` (20px in
              47) rather than desktop node 1530:7200's 26px, which is the size
              the client called too big.

              NO nudge: the glyph's ink spans its whole 26x26 box (0–26 on
              both axes), so the box centred in the circle IS the plane
              centred. Two optical offsets were tried — desktop Figma's 9.6%
              and a 4.6% "centroid" shift, both left and down — and each read
              as the plane sitting low-left (client, 2026-10-22, twice). */}
          {submitting ? (
            <Loader2 className="size-[19px] animate-spin lg:size-[20px]" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- a small SVG glyph
            <img
              src="/brand/send.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="size-[19px] lg:size-[20px]"
            />
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
