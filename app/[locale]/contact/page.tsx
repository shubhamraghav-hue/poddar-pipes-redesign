import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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

  // Only emit LocalBusiness schema for offices whose address/phone have been
  // filled in with real info — never ship "[Street Address]" etc. into
  // structured data search engines may surface directly in results.
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
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
              Contact
            </span>
            <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
              Let&apos;s talk about your project.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              Whether it&apos;s a single plumbing retrofit or a municipal water scheme, our sales team
              responds to every inquiry within one business day.
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
              <h2 className="font-display text-3xl font-medium text-slate-900">Send an inquiry</h2>
              <p className="max-w-md leading-relaxed text-slate-600">
                Fill out the form with as much project or quantity detail as you can. Bulk and
                project inquiries are routed directly to a regional sales manager.
              </p>
              <Link
                href="/careers"
                className="mt-2 flex w-fit items-center gap-2 rounded-full border-[1.5px] border-amber-600 px-4 py-2 text-sm font-medium text-ocean-700 transition-colors hover:bg-amber-600 hover:text-white"
              >
                <Briefcase className="h-4 w-4" /> Looking for a job instead? Visit Careers
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
      <CTASection />
    </>
  );
}
