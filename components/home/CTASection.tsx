import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
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
}

export async function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref = "/resources",
}: CTASectionProps) {
  const t = await getTranslations("home");

  const resolvedEyebrow = eyebrow ?? t("ctaEyebrow");
  const resolvedTitle = title ?? t("ctaTitle");
  const resolvedDesc = description ?? t("ctaDesc");
  const resolvedPrimary = primaryLabel ?? t("ctaPrimary");
  const resolvedSecondary = secondaryLabel ?? t("ctaSecondary");

  return (
    <section className="container-edge py-24 md:py-28">
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16 md:py-20">
          <Image
            src="https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.20]"
          />
          <div className="bg-dark absolute inset-0 opacity-70" aria-hidden="true" />
          <div
            className="absolute -top-24 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-ocean-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              {resolvedEyebrow}
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-medium uppercase leading-tight tracking-tight text-white sm:text-4xl">
              {resolvedTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-balance text-slate-300">{resolvedDesc}</p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <Button asChild size="lg" variant="primary-on-dark" className="w-full sm:w-auto">
                <Link href={primaryHref}>
                  {resolvedPrimary}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-light" className="w-full sm:w-auto">
                <Link href={secondaryHref}>{resolvedSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
