import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { LegalIntro, LegalSections } from "@/components/shared/LegalPage";
import { privacyPolicyIntro, privacyPolicySections } from "@/lib/data/legal";
import { privacyPolicyIntroHi, privacyPolicySectionsHi } from "@/lib/data/hi/legal";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Title and description from messages (seo.*), per locale.
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    path: "/privacy-policy",
    title: (await getTranslations({ locale: "en" }))("seo.privacyTitle"),
    description: t("seo.privacyDescription"),
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  // Hindi is a full translation of the English text (lib/data/hi/legal.ts),
  // not an overlay — legal text is swapped whole, never mixed.
  const isHi = locale === "hi";
  const intro = isHi ? privacyPolicyIntroHi : privacyPolicyIntro;
  const sections = isHi ? privacyPolicySectionsHi : privacyPolicySections;

  return (
    <section className="pb-20 pt-32 md:pt-36">
      <div className="container-figma">
        <RevealOnScroll className="mx-auto max-w-[760px]">
          <h1
            className="mt-2 font-display type-heading font-medium uppercase text-slate-900"
          >
            {t("footer.privacyPolicy")}
          </h1>
          <p className="mt-3 type-body text-slate-500">{t("legal.lastUpdated")}</p>

          <LegalIntro paragraphs={intro} />
          <LegalSections
            sections={sections}
            contactBlockAfterHeading={isHi ? "13. हमसे संपर्क करना" : "13. Contacting Us"}
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
