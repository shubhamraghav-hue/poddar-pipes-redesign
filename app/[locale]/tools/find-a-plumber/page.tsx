import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlumberFinder } from "@/components/tools/PlumberFinder";
import { CTASection } from "@/components/home/CTASection";

// SWITCHED OFF for launch. The directory in lib/data/plumbers.ts is sample
// data — fictional plumbers with real-looking phone numbers — so publishing
// it would send customers to strangers. The page now 404s, it is excluded
// from app/sitemap.ts, and its nav entry in lib/data/nav.ts is commented out.
//
// To restore once a verified plumber list exists: replace the data in
// lib/data/plumbers.ts, delete the `notFound()` call below (and the
// `robots` line), add "/tools/find-a-plumber" back to app/sitemap.ts and
// uncomment the nav entry. PlumberFinder.tsx and the CTA copy are untouched.
export const metadata: Metadata = {
  // The layout's "%s | Poddar Pipes" template adds the brand — the title
  // used to carry it too and read "… — Poddar Pipes | Poddar Pipes".
  title: "Find My Plumber",
  description:
    "Search by pincode to find plumbers near you who work with Poddar Pipes products.",
  robots: { index: false, follow: false },
};

export default async function FindPlumberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();

  // Unreachable while switched off — kept so restoring is a one-line change.
  const t = await getTranslations("findPlumber");
  return (
    <>
      <PlumberFinder />

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        description={t("ctaDesc")}
        primaryLabel={t("ctaPrimary")}
        primaryHref="/contact"
        secondaryLabel={t("ctaSecondary")}
        secondaryHref="/products"
      />
    </>
  );
}
