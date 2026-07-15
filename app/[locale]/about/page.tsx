import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutHero, OurStory } from "@/components/about/OurStory";
import { MissionVision, CoreValues } from "@/components/about/MissionVision";
import { Leadership } from "@/components/about/Leadership";
import { Facilities, GlobalPresence } from "@/components/about/Facilities";
import { Timeline } from "@/components/about/Timeline";
import { Certifications } from "@/components/about/Certifications";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us — Company Profile, Leadership & Milestones",
  description:
    "Learn about Poddar Pipes' history, mission, leadership team, manufacturing facilities, and certifications as an Indian piping systems manufacturer.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <CoreValues />
      <Leadership />
      <Facilities />
      <GlobalPresence />
      <Timeline />
      <Certifications />
      <CTASection
        eyebrow="Work with us"
        title="Have a project or partnership in mind?"
        description="Whether it's a bulk order, an infrastructure project, or a business partnership enquiry, our team responds within one business day."
        primaryLabel="Request a Quote"
        primaryHref="/contact"
        secondaryLabel="Talk to Our Team"
        secondaryHref="/contact"
      />
    </>
  );
}
