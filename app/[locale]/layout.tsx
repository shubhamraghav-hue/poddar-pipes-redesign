import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Anek_Devanagari } from "next/font/google";
import "@/styles/globals.css";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ScrollWaterRail } from "@/components/shared/ScrollWaterRail";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import { OG_LOCALES, SITE_URL, buildAlternates, isProductionSite } from "@/lib/seo";
import { COMPANY } from "@/lib/data/offices";

// Single-typeface system: Anek Devanagari carries every role (display, body,
// and technical labels), with hierarchy built from weight and size rather than
// from contrasting typefaces. It's a variable font covering Latin + Devanagari
// and many Indic scripts, so the 11-locale site stays fully covered. The
// semantic tokens (--font-display/-body/-mono) all resolve to it in
// styles/globals.css.
const anekDevanagari = Anek_Devanagari({
  subsets: ["latin", "devanagari"],
  variable: "--font-anek",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    keywords: [
      "Poddar Pipes",
      "uPVC pipes",
      "CPVC pipes",
      "SWR pipes",
      "water storage tanks",
      "UGD underground drainage pipes",
      "agricultural pipes",
    ],
    // Fallback for routes without their own generateMetadata (e.g. the 404):
    // every page builds its own canonical/hreflang/OG via buildPageMetadata
    // (lib/seo.ts), because page-level keys replace these wholesale.
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      siteName: t("siteName"),
      type: "website",
      // Open Graph expects language_TERRITORY ("en_IN"), not a bare "en".
      locale: OG_LOCALES[locale] ?? locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    robots: isProductionSite()
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Contact details from `COMPANY` (lib/data/offices.ts, client-approved).
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Poddar Pipes",
    legalName: COMPANY.legalName,
    url: "https://www.poddarpipes.com",
    logo: "https://www.poddarpipes.com/icon.svg",
    description:
      "Poddar Pipes manufactures uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems for water, irrigation, and infrastructure applications across India.",
    // GSTIN-shaped (29 = Karnataka + PAN + entity/check digits), so published
    // as `taxID`, not a CIN. UNVERIFIED: confirm with the client before launch.
    taxID: "29AAECO2313F1ZQ",
    foundingDate: "1975",
    email: COMPANY.email,
    telephone: COMPANY.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      postalCode: COMPANY.address.postalCode,
      addressRegion: COMPANY.address.region,
      addressCountry: "IN",
    },
    // Same profiles as the footer's social icons — keep in sync with the
    // LINKS list in components/shared/SocialIcons.tsx.
    sameAs: [
      "https://x.com/Poddarpipe",
      "https://www.linkedin.com/company/poddar-pipes/",
      "https://youtube.com/@poddarpipes",
      "https://www.instagram.com/poddarpipes",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Poddar Pipes",
    url: "https://www.poddarpipes.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.poddarpipes.com/products?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} className={anekDevanagari.variable}>
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Skip link — first thing a keyboard user reaches, so they can jump
            past the header (8 links, language switcher, CTA). Hidden until
            focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0b0b52] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <NextIntlClientProvider>
          <SmoothScroll>
            {/* One enquiry pop-up for the whole site — every enquiry CTA opens
                it via `EnquiryLink` (components/enquiry). */}
            <EnquiryProvider>
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <ScrollWaterRail />
            <WhatsAppButton />
            </EnquiryProvider>
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
