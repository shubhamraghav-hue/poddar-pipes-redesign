import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FAQ } from "@/components/contact/FAQ";
import { CTASection } from "@/components/home/CTASection";

const FAQ_COUNT = 11;

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Poddar Pipes products, certifications, bulk orders, warranty, and technical support.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: FAQ_COUNT }, (_, i) => ({
      "@type": "Question",
      name: t(`q${i}` as never),
      acceptedAnswer: { "@type": "Answer", text: t(`a${i}` as never) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <RevealOnScroll>
          <SectionHeading
            as="h1"
            eyebrow={t("eyebrow")}
            title={t("heading")}
            titleAccent={t("headingAccent")}
            description={t("desc")}
          />
        </RevealOnScroll>
      </section>

      <section className="container-edge py-20 md:py-24">
        <FAQ hideHeading />
      </section>

      <CTASection />
    </>
  );
}
