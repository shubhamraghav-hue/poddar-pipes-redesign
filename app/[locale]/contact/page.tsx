import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { OfficeLocations } from "@/components/contact/OfficeLocations";
import { MapPlaceholder } from "@/components/contact/MapPlaceholder";
import { FAQ } from "@/components/contact/FAQ";
import { CTASection } from "@/components/home/CTASection";
import { Link } from "@/i18n/navigation";
import { Briefcase, ArrowRight } from "lucide-react";
import { offices } from "@/lib/data/offices";
import { hasPlaceholder } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — Sales, Business & Career Inquiries",
  description:
    "Get in touch with Poddar Pipes for product inquiries, business partnerships, technical support, or career opportunities across our regional offices.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const structuredOffices = offices.filter(
    (office) => !hasPlaceholder(office.city, office.address, office.phone)
  );

  return (
    <>
      {structuredOffices.map((office) => {
        const localBusinessSchema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `Poddar Pipes — ${office.type}`,
          address: { "@type": "PostalAddress", streetAddress: office.address, addressLocality: office.city, addressCountry: office.country },
          telephone: office.phone,
          email: office.email,
        };
        return (
          <script
            key={office.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          />
        );
      })}
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
        <div className="mt-10">
          <ContactInfo />
        </div>
      </section>

      <section className="container-edge py-24 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <RevealOnScroll>
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-3xl font-medium text-slate-900">{t("formHeading")}</h2>
              <p className="max-w-md leading-relaxed text-slate-600">
                {t("formDesc")}
              </p>
              <Link
                href="/careers"
                className="mt-2 flex w-fit items-center gap-2 rounded-full border-[1.5px] border-amber-600 px-4 py-2 text-sm font-medium text-ocean-700 transition-colors hover:bg-amber-600 hover:text-white"
              >
                <Briefcase className="h-4 w-4" />
                <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {t("careersLink")}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <InquiryForm />
          </RevealOnScroll>
        </div>
      </section>

      <OfficeLocations />
      <MapPlaceholder />
      <FAQ />
      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
      />
    </>
  );
}
