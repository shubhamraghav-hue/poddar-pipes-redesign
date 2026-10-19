import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { LegalIntro, LegalSections } from "@/components/shared/LegalPage";
import { privacyPolicyIntro, privacyPolicySections } from "@/lib/data/legal";
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
    path: "/privacy-policy",
    title: locale === "en" ? "Privacy Policy" : t("footer.privacyPolicy"),
    description: "Privacy policy for the poddarpipes.com website, operated by Poddar Plumbing System Pvt. Ltd.",
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="pb-20 pt-32 md:pt-36">
      <div className="container-figma">
        <RevealOnScroll className="mx-auto max-w-[760px]">
          <h1
            className="mt-2 font-display type-heading font-medium uppercase text-slate-900"
          >
            Privacy Policy
          </h1>
          <p className="mt-3 type-body text-slate-500">Last updated: 13 August 2026</p>

          <LegalIntro paragraphs={privacyPolicyIntro} />
          <LegalSections sections={privacyPolicySections} contactBlockAfterHeading="13. Contacting Us" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
