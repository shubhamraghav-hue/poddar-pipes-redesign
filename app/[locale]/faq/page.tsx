import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { FAQ, FAQ_COUNT } from "@/components/contact/FAQ";
import { CTASection } from "@/components/home/CTASection";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // English title/description are the page's own copy. There are no
  // per-page meta keys in messages/*.json yet, so other locales reuse the
  // page's translated nav label as the title; the description stays English.
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/faq",
    title: locale === "en" ? "Frequently Asked Questions" : t("nav.navFaqs"),
    description: "Answers to common questions about Poddar Pipes products, Indian Standards, bulk orders, warranty, and technical support.",
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const tHome = await getTranslations("home");

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
          (h-20) — not a hero; the same strip opens every inner page that has no
          hero of its own. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      {/* Figma 1979:32754 / 1989:36714: content starts 150 below the header,
          80 between the title block and the questions, 150 to the CTA band.
          Heading: light #4a4a4a line over a BOLD #171796 line (this page only;
          other headings keep both lines grey). */}
      <section className="container-figma pb-20 pt-12 md:pb-[150px] md:pt-[150px]">
        <RevealOnScroll>
          <h1 className="font-display type-heading uppercase text-[#4a4a4a]">
            <span className="block font-light">{t("heading")}</span>
            <span className="block font-bold text-[#171796]">{t("headingAccent")}</span>
          </h1>
          <p className="mt-5 max-w-[317px] type-body text-[#606060]">{t("desc")}</p>
        </RevealOnScroll>
        <div className="mt-12 md:mt-20">
          <FAQ />
        </div>
      </section>

      {/* Figma 1989:36716 (FAQs page "Footer/top"): the full-bleed navy band
          with its own copy, "STILL HAVE / A QUESTION?". */}
      <CTASection
        variant="flush"
        title={t("ctaLead")}
        titleAccent={t("ctaAccent")}
        description={t("ctaDesc")}
        primaryLabel={tHome("ctaPrimaryHome")}
      />
    </>
  );
}
