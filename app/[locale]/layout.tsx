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
import { isProductionSite } from "@/lib/seo";
import { offices } from "@/lib/data/offices";

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
    metadataBase: new URL("https://www.poddarpipes.com"),
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
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, l === routing.defaultLocale ? "/" : `/${l}`])
        ),
        "x-default": "/",
      },
    },
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      siteName: t("siteName"),
      type: "website",
      locale,
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

  // Real, verified HQ details (see lib/data/offices.ts) — CIN and address are
  // sourced directly from Poddar's own product catalogues.
  const hq = offices[0];
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Poddar Pipes",
    url: "https://www.poddarpipes.com",
    logo: "https://www.poddarpipes.com/icon.svg",
    description:
      "Poddar Pipes manufactures uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems for water, irrigation, and infrastructure applications across India.",
    identifier: "CIN: 29AAECO2313F1ZQ",
    foundingDate: "1975",
    email: hq.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: hq.address,
      addressLocality: hq.city,
      addressCountry: hq.country,
    },
    sameAs: [],
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
        <NextIntlClientProvider>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ScrollWaterRail />
            <WhatsAppButton />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
