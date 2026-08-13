import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { LegalIntro, LegalSections } from "@/components/shared/LegalPage";
import { termsOfServiceIntro, termsOfServiceSections } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for the poddarpipes.com website, operated by Poddar Plumbing System Pvt. Ltd.",
  alternates: { canonical: "/terms-of-service" },
};

export default async function TermsOfServicePage({
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: August 13, 2026</p>

          {/* Unlike the Privacy Policy (ported verbatim from poddarpipes.com's
              launch site), no Terms & Conditions page existed anywhere to
              copy from — this is a fresh, standard-form draft and has not
              been reviewed by legal/business yet. Flagged here rather than
              presented as finalized. */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-100/60 p-4 text-sm text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong className="font-semibold">Draft — pending legal review.</strong> This page is a
              standard-form starting point and has not yet been reviewed or approved by our legal team.
            </p>
          </div>

          <LegalIntro paragraphs={termsOfServiceIntro} />
          <LegalSections sections={termsOfServiceSections} contactBlockAfterHeading="11. Contact Us" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
