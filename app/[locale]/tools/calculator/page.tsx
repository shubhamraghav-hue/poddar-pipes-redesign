import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { Estimator } from "@/components/tools/Estimator";
import { QuoteCTA } from "@/components/tools/QuoteCTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // No translation key exists for this page's title/description yet, so
  // every locale keeps the English copy (canonical/hreflang are per-locale).
  return buildPageMetadata({
    locale,
    path: "/tools/calculator",
    title: "Pipe Material Estimator — Estimate Your Piping Needs",
    description: "Choose your project type — home plumbing, drainage, underground lines or irrigation — and get an instant indicative material estimate based on Poddar Pipes products.",
  });
}

// Figma node 1606:11713. Cropped to the 1512x675 window Figma draws it in and
// re-encoded as webp, the same treatment the About ripple still gets.
const HERO_STILL = "/tools/calculator-hero-1512.webp";

const NAVY = "#0b0b52";
const NAVY_0 = "rgba(11,11,82,0)";

/**
 * Figma "Calculator" (node 1488:14461), desktop frame only.
 *
 * The hero is the same construction as the About page's: a backdrop locked to
 * its own ratio with a floor under it, a bottom fade and a left fade, and the
 * copy sitting on top. Two differences from About, both from the mock:
 *   - the band is 675px at 1512 (ratio 2.24) rather than 895,
 *   - the bottom fade stops at `rgba(11,11,82,0.65)` rather than solid navy,
 *     so the calculator photo stays faintly visible behind the section seam.
 */
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="relative mt-[80px] overflow-hidden bg-[#0b0b52]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
          style={{ maxHeight: "100%" }}
        >
          {/* `min-h-[360px]` is the same device as the About backdrop's floor:
              at the mock's own ratio a phone would get a 170px strip, which
              reads as a banner rather than a hero. Above ~806px the ratio
              takes over and the floor stops binding, so there is no seam. */}
          <div className="relative aspect-[1512/675] min-h-[360px] w-full">
            <Image
              src={HERO_STILL}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_50%]"
            />
          </div>
          {/* Node 1488:14236 — y409..675 of the 675px band, i.e. the last
              39.4%, and it lands on 65% navy rather than 100%. */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "39.41%",
              background: `linear-gradient(to bottom, ${NAVY_0}, rgba(11,11,82,0.65))`,
            }}
          />
          {/* Node 1488:14237 — navy at the left edge running out by 67.5%,
              which is what holds the white copy legible over the keypad. */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: "67.46%",
              background: `linear-gradient(to left, ${NAVY_0}, ${NAVY})`,
            }}
          />
        </div>

        <div className="container-figma relative pb-24 pt-24 md:pb-[150px] md:pt-[150px]">
          <RevealOnScroll>
            <h1 className="max-w-[307px] font-display text-[36px] uppercase leading-[1.02] tracking-[0.2088px] text-white sm:max-w-[511px] sm:text-5xl sm:tracking-[0.32px] md:text-[60px]">
              <span className="block font-light">Estimate Your</span>
              <span className="block font-bold">Piping Needs</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <p className="mt-[13px] max-w-[307px] text-[13px] leading-[1.2] text-white sm:mt-7 sm:max-w-[486px] sm:text-base">
              Choose your project type, home plumbing, drainage, underground lines or
              irrigation, and get an instant material estimate based on real Poddar
              Pipes products.
            </p>
          </RevealOnScroll>

          {/* The outlined CTA's ring is an inset shadow, not a border — the
              homepage hero fix (59e95b7). A 1.2px border sits OUTSIDE the
              padding, so it rendered 48px tall against the solid one's 46 and
              its label 1px low. The shadow paints the ring without taking
              layout, so both are 46 by construction, as Figma has them.
              Height is set outright and the label cap-trimmed (`CAP_TRIM`):
              Figma's pt16/pb12 still left it 3.5px high in the browser. */}
          <RevealOnScroll delay={0.14}>
            <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-[68px]">
              <Button
                asChild
                size="lg"
                variant="accent-ink"
                className="h-[46px] w-full max-w-[307px] px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52] sm:w-auto sm:max-w-none"
              >
                <a href="#estimator">
                  <span className={CAP_TRIM}>Start Estimating</span>
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline-white"
                className="h-[46px] w-full max-w-[307px] border-0 px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] shadow-[inset_0_0_0_1.2px_#fff] hover:shadow-[inset_0_0_0_1.2px_#fff] sm:w-auto sm:max-w-none"
              >
                <EnquiryLink>
                  <span className={CAP_TRIM}>Talk to Our Team</span>
                </EnquiryLink>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Figma puts the tab strip 120px below the hero and the panel 81px under
          that; both are folded into the section's own padding here so the
          estimator is one scroll target for the hero's primary CTA. The quote
          CTA (node 1488:14348) lives in the SAME white section — 120px under
          the panel, 80px above the footer — so the bottom pad is 80, not 120. */}
      <section id="estimator" className="scroll-mt-24 bg-white pb-16 pt-20 md:pb-20 md:pt-[120px]">
        <div className="container-figma">
          <Estimator />
          <div className="mt-16 md:mt-[120px]">
            <QuoteCTA
              lead="Need a precise quote"
              accent="Not just an estimate?"
              description="Share your project scope and quantity requirements — our sales team will follow up within one business day with recommendations and a formal quote."
              primaryLabel="Start a Conversation"
              primaryHref="/contact"
              secondaryLabel="Download Catalogue"
              secondaryHref="#catalogues"
            />
          </div>
        </div>
      </section>
    </>
  );
}
