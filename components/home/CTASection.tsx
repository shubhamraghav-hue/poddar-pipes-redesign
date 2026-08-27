import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

// Flush variant only: Figma styles the two sentences differently (white lead,
// amber second). Split at the sentence boundary rather than adding separate
// translation keys, since every locale already ships `ctaTitle` as a pair.
function splitLeadAccent(text: string): [string, string] {
  const match = text.match(/^(.*?[.!?])\s+([\s\S]*)$/);
  return match ? [match[1], match[2]] : [text, ""];
}

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /**
   * "card" (default) is the standing treatment on every other page — a
   * rounded, inset card. "flush" is the homepage's Figma match (node
   * 34:390): a full-bleed flat-navy band, no photo or rounded corners. A
   * variant rather than a separate component so the other ~14 call sites
   * stay untouched.
   */
  variant?: "card" | "flush";
}

export async function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref = "/resources",
  variant = "card",
}: CTASectionProps) {
  const t = await getTranslations("home");

  const resolvedEyebrow = eyebrow ?? t("ctaEyebrow");
  const resolvedTitle = title ?? t("ctaTitle");
  const resolvedDesc = description ?? t("ctaDesc");
  const resolvedPrimary = primaryLabel ?? t("ctaPrimary");
  const resolvedSecondary = secondaryLabel ?? t("ctaSecondary");

  const isFlush = variant === "flush";

  const [ctaLead, ctaAccent] = isFlush ? splitLeadAccent(resolvedTitle) : [resolvedTitle, ""];

  // The site's standard CTA pair. Deliberately IDENTICAL across both
  // variants, unlike everything else here. Height is content-driven rather
  // than `size="lg"`'s fixed `h-14`. Hero renders the same pair without
  // `uppercase` — the one known exception.
  const ctaButtons = (
    <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
      <Button
        asChild
        size="lg"
        variant="accent-ink"
        className="h-auto w-full px-6 pb-3 pt-4 text-lg font-semibold uppercase tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52] sm:w-auto"
      >
        <Link href={primaryHref}>{resolvedPrimary}</Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline-white"
        className="h-auto w-full border-[length:1.2px] border-white px-6 pb-3 pt-4 text-lg font-semibold uppercase tracking-[0.36px] sm:w-auto"
      >
        <Link href={secondaryHref}>{resolvedSecondary}</Link>
      </Button>
    </div>
  );

  const content = isFlush ? (
    <div className="relative overflow-hidden bg-[#0b0b52] px-6 py-20 text-center sm:px-8 md:py-28">
      <div className="relative mx-auto max-w-5xl">
        {/* Each sentence should be exactly one line. `max-w-2xl` was too
            narrow at `text-5xl` and wrapped the second into three; `max-w-5xl`
            fits both. `block` guarantees the split regardless. */}
        <h2 className="text-balance font-display text-3xl uppercase leading-[1.2] sm:text-4xl md:text-5xl">
          <span className="block font-light text-white">{ctaLead}</span>
          {ctaAccent && <span className="block font-semibold text-amber-600">{ctaAccent}</span>}
        </h2>
        <p className="mx-auto mt-5 max-w-[518px] text-balance text-sm font-normal leading-[1.5] text-[#c0c0c0]">
          {resolvedDesc}
        </p>
        {ctaButtons}
      </div>
    </div>
  ) : (
    <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16 md:py-20">
      <Image
        src="https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=2000"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.20]"
      />
      <div
        className="absolute -top-24 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-ocean-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">
            {resolvedEyebrow}
          </span>
        </div>
        <h2 className="mt-4 text-balance font-display text-3xl font-medium uppercase leading-tight tracking-tight text-white sm:text-4xl">
          {resolvedTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-balance text-slate-300">{resolvedDesc}</p>
        {ctaButtons}
      </div>
    </div>
  );

  if (isFlush) {
    return <RevealOnScroll>{content}</RevealOnScroll>;
  }

  return (
    <section className="container-edge py-24 md:py-28">
      <RevealOnScroll>{content}</RevealOnScroll>
    </section>
  );
}
