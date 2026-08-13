import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { LegalIntro, LegalSections } from "@/components/shared/LegalPage";
import { privacyPolicyIntro, privacyPolicySections } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the poddarpipes.com website, operated by Poddar Plumbing System Pvt. Ltd.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="pb-20 pt-32 md:pt-36">
      <div className="container-edge">
        <RevealOnScroll className="mx-auto max-w-[760px]">
          <h1
            className="mt-2 font-medium text-slate-900"
            style={{ fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)", lineHeight: "120%", letterSpacing: "0.02em" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: August 13, 2026</p>

          <LegalIntro paragraphs={privacyPolicyIntro} />
          <LegalSections sections={privacyPolicySections} contactBlockAfterHeading="13. Contacting Us" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
