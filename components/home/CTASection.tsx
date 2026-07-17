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

export function CTASection({
  eyebrow = "Get in touch",
  title = "Tell us what you're building. We'll recommend the right piping system.",
  description = "Share your project scope and quantity requirements — our sales team will follow up within one business day with recommendations and a formal quote.",
  primaryLabel = "Request a Quote",
  primaryHref = "/contact",
  secondaryLabel = "Download Product Catalogue",
  secondaryHref = "/resources",
}: CTASectionProps) {
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
          <div className="bg-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
          <div
            className="absolute -top-24 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-ocean-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              {eyebrow}
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-medium uppercase leading-tight tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-balance text-slate-300">{description}</p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <Button asChild size="lg" variant="primary-on-dark" className="relative w-full sm:w-auto">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowUpRight className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 sm:static sm:translate-y-0" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-light" className="w-full sm:w-auto">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
