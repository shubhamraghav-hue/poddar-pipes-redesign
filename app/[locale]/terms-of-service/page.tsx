import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { LegalIntro, LegalSections } from "@/components/shared/LegalPage";
import { termsOfServiceIntro, termsOfServiceSections } from "@/lib/data/legal";
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
    path: "/terms-of-service",
    title: locale === "en" ? "Terms of Service" : t("footer.termsOfService"),
    description: "Terms of Service for the poddarpipes.com website, operated by Poddar Plumbing System Pvt. Ltd.",
  });
}

export default async function TermsOfServicePage({
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
            Terms of Service
          </h1>
          <p className="mt-3 type-body text-slate-500">Last updated: 13 August 2026</p>

          {/* Unlike the Privacy Policy (ported verbatim from poddarpipes.com's
              launch site), no Terms & Conditions page existed anywhere to
              copy from — this is a fresh, standard-form draft and has not
              been reviewed by legal/business yet. Flagged here rather than
              presented as finalized. (Restoring the banner below also means
              re-adding `import { AlertTriangle } from "lucide-react"`.) */}
          {/* <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-100/60 p-4 text-sm text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong className="font-semibold">Draft — pending legal review.</strong> This page is a
              standard-form starting point and has not yet been reviewed or approved by our legal team.
            </p>
          </div> */}

          <LegalIntro paragraphs={termsOfServiceIntro} />
          <LegalSections sections={termsOfServiceSections} contactBlockAfterHeading="11. Contact Us" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
