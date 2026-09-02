import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/AboutHero";
import { Assurances } from "@/components/about/Assurances";
import { LegacyStory } from "@/components/home/LegacyStory";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us — Our Story, Vision & Quality Assurances",
  description:
    "Five decades of Poddar Pipes: the vision and mission behind the company, the ten assurances behind every product, and the milestones from 1975 to today.",
  alternates: { canonical: "/about" },
};

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
      {/* Node 1001:6008 reads "OUR / Story" and draws the years in `#171796`
          navy, where the landing-page frame uses "LEGACY" and amber. */}
      <LegacyStory titleLead="Our" yearColor="#171796" />
      <CTASection
        variant="flush"
        primaryLabel={t("ctaPrimaryHome")}
        secondaryLabel={t("ctaSecondaryHome")}
      />
    </>
  );
}
