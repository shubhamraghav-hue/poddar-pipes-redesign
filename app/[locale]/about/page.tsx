import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/AboutHero";
import { Assurances } from "@/components/about/Assurances";
import { LegacyStory } from "@/components/home/LegacyStory";
import { CTASection } from "@/components/home/CTASection";
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
    path: "/about",
    title: locale === "en" ? "About Us — Our Story, Vision & Quality Assurances" : t("nav.about"),
    description: "Five decades of Poddar Pipes: the vision and mission behind the company, the ten assurances behind every product, and the milestones from 1975 to today.",
  });
}

/**
 * Figma "About Us 1" (node 1001:5531). Section order is the mock's own,
 * top to bottom:
 *
 *   company overview (1001:5975)  -> AboutHero
 *   Assurances       (1032:8548)  -> Assurances
 *   legacy section   (1001:5996)  -> LegacyStory, the SAME frame already
 *                                    built for the landing page (node
 *                                    51:488); only the heading lead-in and
 *                                    the year colour differ, both props.
 *   start a conversation (1029:8208) -> CTASection variant="flush", whose
 *                                    `home` defaults already carry this
 *                                    node's exact title and description.
 *
 * Header and footer are the global layout's and are not rendered here.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <AboutHero />
      <Assurances />
      {/* Node 1001:6008 reads "OUR / Story" where the landing-page frame reads
          "LEGACY". The milestone years were briefly navy `#171796` per that
          node, but the brand team's type spec puts them in `#F28000` amber —
          which is `LegacyStory`'s default, so no `yearColor` override here.
          The rest of that spec (Anek Devanagari, 600, 48px, 108%, 0.32px,
          uppercase) the component already matched exactly. */}
      <LegacyStory titleLead="Our" />
      <CTASection
        variant="flush"
        primaryLabel={t("ctaPrimaryHome")}
        secondaryLabel={t("ctaSecondaryHome")}
      />
    </>
  );
}
