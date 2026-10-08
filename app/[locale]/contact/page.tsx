import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactHero } from "@/components/contact/ContactHero";
import { SendMessage } from "@/components/contact/SendMessage";
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
    path: "/contact",
    title: locale === "en" ? "Contact Us — We'd Love to Hear From You" : t("nav.contact"),
    description: "Questions about our upcoming range, partnerships or projects? Reach the Poddar Pipes team by phone, email or the enquiry form and we'll get back to you within one business day.",
  });
}

/**
 * Figma "Contact Page" (node 1606:11700). Section order is the mock's own:
 *
 *   company overview (1606:11617) -> ContactHero, which also carries the
 *                                    Call / Email cards, because the mock
 *                                    draws them ON the hero's navy band.
 *   legacy section   (1606:11568) -> SendMessage (copy + offices + form)
 *
 * Header and footer are the global layout's and are not rendered here.
 *
 * WHAT THIS REPLACES: the previous page composed ContactInfo, OfficeLocations,
 * MapPlaceholder, InquiryForm and FAQ. The new mock carries none of those —
 * the office data moved into SendMessage's left rail and the contact channels
 * became the two hero cards. Those four components are left in the tree
 * untouched rather than deleted: `InquiryForm` is still embedded elsewhere,
 * and the FAQ block has its own route at /faq.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ContactHero />
      <SendMessage />
    </>
  );
}
