import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
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
      <section className="relative overflow-hidden bg-ink pb-16 pt-40 text-white md:pb-20 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="animate-float-slow absolute right-[6%] top-1/4 h-56 w-56 rounded-full bg-ocean-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-edge relative">
          <RevealOnScroll>
            <div className="mb-5 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002" stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">{t("heroEyebrow")}</span>
            </div>
            <h1 className="max-w-2xl font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              <span className="block">{t("heroLine1")}</span>
              <span className="block text-amber-500">{t("heroLine2")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
          <div className="mt-12">
            <ContactInfo />
          </div>
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
                <Briefcase className="h-4 w-4" /> {t("careersLink")}
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
