import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CatalogueLink, EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";

/**
 * Figma "start a conversation" (node 1488:14348) — the calculator's closing CTA.
 *
 * NOT `CTASection`. That component's `flush` variant is a full-bleed band; this
 * mock draws a 1212x464 rounded card (radius 25) INSIDE the white estimator
 * section, 120px under the panel and 80px above the footer. The title is also
 * split differently — no sentence boundary for `splitLeadAccent` to find — so
 * the two lines come in as separate props.
 *
 *   title   48px, leading 1.2, line 1 Light white, line 2 SemiBold `#f28000`
 *   copy    14px / 1.5, `#c0c0c0`, 518 wide, 20px under the title
 *   buttons 80px under the copy, 15px apart, BOTH 46 tall (pt16 pb12 px24)
 *   pads    80 top and bottom
 *
 * EQUAL BUTTON HEIGHTS — the same fix as the homepage hero (59e95b7). Figma's
 * stroke is inside the 46px frame; a CSS `border` is added OUTSIDE the padding,
 * so the outlined button came out taller and its label sat 1.2px lower than the
 * solid one's. The ring is an inset `box-shadow` instead, which paints without
 * occupying layout, so the two are padding-for-padding identical.
 *
 * CENTRED ON THE CAPS, not Figma's pt16/pb12. That padding pair still left the
 * label 3.5px high in the browser (Anek's line box is bottom-heavy), so the
 * height is set outright at 46 and the label is cap-trimmed (`CAP_TRIM`) and
 * flex-centred. `Button`'s own trim never reaches an `asChild` label — its text
 * is a bare node in the `<a>` — hence the explicit span.
 */
export function QuoteCTA({
  lead,
  accent,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  lead: string;
  accent: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <RevealOnScroll>
      <div className="rounded-[25px] bg-[#0b0b52] px-6 py-14 text-center sm:px-10 md:py-20">
        <h2 className="font-display text-[28px] uppercase leading-[1.2] sm:text-4xl md:text-[48px]">
          <span className="block font-light text-white">{lead}</span>
          <span className="block font-semibold text-[#f28000]">{accent}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[518px] text-[14px] max-md:[text-wrap:balance] leading-[1.5] text-[#c0c0c0]">
          {description}
        </p>
        <div className="mx-auto mt-10 flex max-w-[307px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-[15px] md:mt-20">
          <Button
            asChild
            size="lg"
            variant="accent-ink"
            className="h-[46px] px-6 py-0 text-lg font-semibold uppercase leading-none tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52]"
          >
            {primaryHref === "/contact" ? (
              <EnquiryLink>
                <span className={CAP_TRIM}>{primaryLabel}</span>
              </EnquiryLink>
            ) : (
              <Link href={primaryHref}>
                <span className={CAP_TRIM}>{primaryLabel}</span>
              </Link>
            )}
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline-white"
            className="h-[46px] border-0 px-6 py-0 text-lg font-semibold uppercase leading-none tracking-[0.36px] shadow-[inset_0_0_0_1.2px_#fff] hover:shadow-[inset_0_0_0_1.2px_#fff]"
          >
            {secondaryHref === "#catalogues" ? (
              <CatalogueLink>
                <span className={CAP_TRIM}>{secondaryLabel}</span>
              </CatalogueLink>
            ) : (
              <Link href={secondaryHref}>
                <span className={CAP_TRIM}>{secondaryLabel}</span>
              </Link>
            )}
          </Button>
        </div>
      </div>
    </RevealOnScroll>
  );
}
