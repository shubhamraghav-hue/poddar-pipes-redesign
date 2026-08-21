import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /**
   * "card" (default) is the site's standing treatment used on every other
   * page that renders this component — a rounded, inset card within
   * `container-edge` padding. "flush" is scoped to the homepage's Figma
   * match (node 13:456, "start a conversation"): a full-bleed band with no
   * rounded corners or outer margin. Kept as a variant on the shared
   * component, rather than a separate one, so the other ~14 call sites
   * don't need to change and stay on their existing look.
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

  const content = (
    <div
      className={
        isFlush
          ? "relative overflow-hidden bg-ink px-6 py-20 text-center sm:px-8 md:py-28"
          : "relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16 md:py-20"
      }
    >
      <Image
        // Flush variant is the homepage-only Figma match (node 13:456) and
        // uses that exact background photo; every other page keeps the
        // original stock photo for its card treatment.
        src={isFlush ? "/home/cta-background.png" : "https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=2000"}
        alt=""
        fill
        sizes="100vw"
        className={isFlush ? "object-cover opacity-50" : "object-cover opacity-[0.20]"}
      />
      {isFlush ? (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink" aria-hidden="true" />
      ) : (
        <>
          <div className="bg-dark absolute inset-0 opacity-70" aria-hidden="true" />
          <div
            className="absolute -top-24 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-ocean-500/20 blur-3xl"
            aria-hidden="true"
          />
        </>
      )}
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
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <Button
            asChild
            size="lg"
            variant={isFlush ? "accent-ink" : "primary-on-dark"}
            className="w-full sm:w-auto"
          >
            <Link href={primaryHref}>{resolvedPrimary}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant={isFlush ? "outline-white" : "outline-light"}
            className="w-full sm:w-auto"
          >
            <Link href={secondaryHref}>{resolvedSecondary}</Link>
          </Button>
        </div>
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
