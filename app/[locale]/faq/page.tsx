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

      {/* Compact header, not a full hero — same ink/blueprint band and
          eyebrow treatment as the rest of the site, just shorter, since this
          page's job is to get straight to the accordion below. */}
      <section className="relative overflow-hidden bg-ink bg-blueprint pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="container-edge relative">
          <RevealOnScroll>
            <SectionHeading
              as="h1"
              dark
              eyebrow={t("eyebrow")}
              title={t("heading")}
              description={t("desc")}
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-20 md:py-24">
        <FAQ hideHeading />
      </section>

      <CTASection />
    </>
  );
}
