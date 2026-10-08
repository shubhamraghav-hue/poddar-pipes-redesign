import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CatalogueLink, EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";

/**
 * A `/contact` destination is an enquiry: it opens the global pop-up
 * (`EnquiryLink`, still a real link to /contact underneath). Any other href —
 * the catalogue, the calculator, products — stays a plain link.
 *
 * MUST pass every prop through. It sits under `Button asChild`, and Radix's
 * Slot hands the button's `className` (and ref/handlers) to this element; the
 * first version only forwarded `href`/`children`, so every CTASection button
 * on the site rendered as bare unstyled text.
 */
function CtaLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  if (href === "/contact") return <EnquiryLink {...props} />;
  // /resources was removed; "Download Catalogue" opens the catalogue picker.
  if (href === "#catalogues") return <CatalogueLink {...props} />;
  return <Link href={href} {...props} />;
}

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
  // "#catalogues" opens the catalogue picker (see CtaLink).
  secondaryHref = "#catalogues",
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
  // variants, unlike everything else here. Hero renders the same pair without
  // `uppercase` — the one known exception.
  //
  // Figma 1530:7321: both buttons 46 tall, 15 apart, px24. The outlined one's
  // ring is an inset shadow, not a border — a border sits outside the padding
  // and made it 48 against the solid one's 46. Labels are cap-trimmed
  // (`CAP_TRIM`) and flex-centred: `Button`'s own trim never reaches an
  // `asChild` label, and Anek's line box otherwise sits the caps ~3px high.
  // Same treatment as QuoteCTA and the /contact hero.
  //
  // Below `sm` a label may WRAP (the button grows from 46px): "Download
  // Product Catalogue" is ~290px at 18px and was clipped by the card at 320.
  const ctaButtons = (
    <div
      className={cn(
        "mx-auto flex max-w-[307px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-[15px]",
        isFlush ? "mt-10 md:mt-20" : "mt-9"
      )}
    >
      <Button
        asChild
        size="lg"
        variant="accent-ink"
        className="h-[46px] px-6 py-0 text-lg max-sm:h-auto max-sm:min-h-[46px] max-sm:whitespace-normal max-sm:py-3 max-sm:text-center font-semibold uppercase leading-none tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52]"
      >
        <CtaLink href={primaryHref}>
          <span className={`${CAP_TRIM} max-sm:leading-[1.15]`}>{resolvedPrimary}</span>
        </CtaLink>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline-white"
        className="h-[46px] border-0 px-6 py-0 text-lg max-sm:h-auto max-sm:min-h-[46px] max-sm:whitespace-normal max-sm:py-3 max-sm:text-center font-semibold uppercase leading-none tracking-[0.36px] shadow-[inset_0_0_0_1.2px_#fff] hover:shadow-[inset_0_0_0_1.2px_#fff]"
      >
        <CtaLink href={secondaryHref}>
          <span className={`${CAP_TRIM} max-sm:leading-[1.15]`}>{resolvedSecondary}</span>
        </CtaLink>
      </Button>
    </div>
  );

  const content = isFlush ? (
    // Figma 1530:7318 is 600 tall: title at 120, buttons end at 424 — so
    // 120 above and 176 below from `lg`; tablets and phones keep the lighter
    // pads.
    <div className="relative overflow-hidden bg-[#0b0b52] px-6 py-20 text-center sm:px-8 md:py-28 lg:pb-[176px] lg:pt-[120px]">
      <div className="relative mx-auto max-w-5xl">
        {/* Each sentence should be exactly one line. `max-w-2xl` was too
            narrow at `text-5xl` and wrapped the second into three; `max-w-5xl`
            fits both. `block` guarantees the split regardless. */}
        {/* 28px at base to match the mobile frame (home node 1311:11088 draws
            this heading at 28px, same as every other section heading there)
            and so it does not sit 2px off its neighbours, which now come
            through `SectionHeading` at 28px. Steps above it unchanged. */}
        <h2 className="text-balance font-display text-[28px] uppercase leading-[1.2] sm:text-4xl md:text-5xl">
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
    <div className="relative overflow-hidden rounded-3xl bg-ink px-5 py-16 text-center sm:px-16 md:py-20">
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
