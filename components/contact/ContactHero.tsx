import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { COMPANY } from "@/lib/data/offices";

/**
 * Figma "Contact Page" > company overview (node 1606:11617).
 *
 * Same construction as the About hero — a backdrop locked to its own
 * 1512x895 ratio with a floor under it, a bottom fade and a left fade — so the
 * two dark page-openers stay one family. What is specific here is the pair of
 * translucent cards sitting ON the backdrop at y735, which is why they live in
 * this component rather than in a section of their own: the band is one
 * continuous `#0b0b52` surface in the mock and splitting them out would put a
 * seam through a background that has none.
 */
const HERO_STILL = "/contact/contact-pipes-1512.webp";

const NAVY = "#0b0b52";
const NAVY_0 = "rgba(11,11,82,0)";

/** Nodes 1606:11632 / 1606:11635 — 592x240, white @ 5% over the navy band. */
function ContactCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      // `items-start` is explicit because a global rule in styles/globals.css
      // centres `align-items` on flex anchors; it is now scoped away from
      // `flex-col`, but stating the intent here keeps the two in sync. Figma
      // sets the copy flush at x57.8 of 592 (9.76%), which is the `px-[58px]`.
      className="group @container flex min-h-[160px] touch-manipulation select-none flex-col items-start justify-center rounded-[25px] border-[0.2px] border-[#0b0b52] bg-white/5 px-7 py-8 transition-[background-color,transform,translate,scale] duration-100 ease-out hover:bg-white/[0.08] active:scale-[0.99] active:bg-white/[0.08] md:min-h-[240px] md:px-[58px]"
    >
      {/* 24px at 1.92px tracking is Figma's literal pair; the tracking is 8% of
          the size, which is wide enough that it has to scale with it rather
          than staying a fixed px value on smaller type. */}
      {/* OUTER EDGES TRIMMED, inner gap untouched: the label loses the space
          above its caps, the value loses the space below its baseline, and the
          `mt-3` between them stays as drawn. Untrimmed, Anek's bottom-heavy
          line box sat the block 7.7px (Call) / 4.2px (Email) high in the card;
          trimming both lines fully would also have shrunk the label→value gap. */}
      <span className="text-[18px] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-[#f28000] [text-box-edge:cap_alphabetic] [text-box-trim:trim-start] md:text-[24px]">
        {label}
      </span>
      {/* SIZED OFF THE CARD, not off the viewport — the same `cqw` technique
          the product cards and the About panels use.
 
          A per-breakpoint ramp cannot get this right: the card is one-up below
          `lg` and two-up above it, so its width does NOT track the viewport
          monotonically. A 1280px window gives the card only 351px of content
          box, LESS than a 768px window does at one-up, and a ramp tuned at
          768 put the 21-character email on two lines at 1280.
 
          Measured in Anek at this weight, the email sets at 10.14x its font
          size. `cqw` resolves against the container's CONTENT box, so the
          padding is already excluded and the limit is simply 100cqw / 10.14 =
          9.86cqw. 9.7 rounds that in so it always lands just under, and it
          holds across the padding change at `md` (px-7 -> px-[58px]) for free,
          because the content box moves with it. Clamped to Figma's 44px
          ceiling and a 14px floor — the floor was 22px, which overrode the
          cqw fit below a ~217px content box and split the email
          ("hello@poddarpipes.co|m") on 320px phones.
 
          `break-all` stays, but only as a backstop now: without a one-line
          guarantee the longest word would otherwise set the card's minimum
          width and force a horizontal scrollbar on the page. */}
      <span
        className="mt-5 break-all font-display font-medium leading-[1.1] text-white transition [text-box-edge:cap_alphabetic] [text-box-trim:trim-end] group-hover:text-[#f28000]"
        style={{ fontSize: "clamp(14px, 9.7cqw, 44px)" }}
      >
        {value}
      </span>
    </a>
  );
}

export function ContactHero() {
  return (
    <section className="relative mt-[80px] overflow-hidden bg-[#0b0b52]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ maxHeight: "100%" }}
      >
        <div className="relative aspect-[1512/895] min-h-[481px] w-full">
          {/* `object-[62%_50%]` rather than centre: the mock crops a 2752px
              source down to a 1512 window biased right of centre, which is
              where the pipe mouths are densest. Centring it frames the flatter
              left-hand stack instead. */}
          <Image
            src={HERO_STILL}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_50%]"
          />
        </div>

        {/* Node 1606:11622 — y499..895, the last 44.25% of the backdrop. */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "44.25%",
            background: `linear-gradient(to bottom, ${NAVY_0}, ${NAVY})`,
          }}
        />
        {/* Node 1606:11623 — navy at the left edge, out by 80.6%. Wider than
            the About page's 67.5% because this photo is busy all the way
            across and the copy needs more cover to stay readable. */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: "80.62%",
            background: `linear-gradient(to left, ${NAVY_0}, ${NAVY})`,
          }}
        />
      </div>

      <div className="container-figma relative pb-16 pt-24 md:pb-[150px] md:pt-[150px]">
        <RevealOnScroll>
          <h1 className="max-w-[307px] font-display text-[36px] uppercase leading-[1.02] tracking-[0.2088px] text-white sm:max-w-[511px] sm:text-5xl sm:tracking-[0.32px] md:text-[60px]">
            <span className="block font-light">We&rsquo;d Love To</span>
            <span className="block font-bold">Hear From You</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-[13px] max-w-[307px] text-[13px] leading-[1.2] text-white sm:mt-5 sm:max-w-[437px] sm:text-base">
            Questions about our upcoming range, partnerships or projects? Reach the
            Poddar Pipes team and we&rsquo;ll get back to you within one business day.
          </p>
        </RevealOnScroll>

        {/* Outlined CTA ring is an inset shadow, not a border (homepage hero
            fix, 59e95b7): the 1.2px border sat outside the padding and made it
            48px against the solid button's 46, label 1px low. Height is set
            outright and the label cap-trimmed (`CAP_TRIM`) — `Button`'s own
            trim never reaches an `asChild` label, which sat 3.5px high. */}
        <RevealOnScroll delay={0.14}>
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[15px] md:mt-[60px]">
            <Button
              asChild
              size="lg"
              variant="accent-ink"
              className="h-[46px] w-full max-w-[307px] px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] text-[#0B0B52] hover:text-[#0B0B52] sm:w-auto sm:max-w-none"
            >
              <EnquiryLink href="/contact#send-a-message">
                <span className={CAP_TRIM}>Send Us a Message</span>
              </EnquiryLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline-white"
              className="h-[46px] w-full max-w-[307px] border-0 px-6 py-0 text-lg font-semibold uppercase tracking-[0.36px] shadow-[inset_0_0_0_1.2px_#fff] hover:shadow-[inset_0_0_0_1.2px_#fff] sm:w-auto sm:max-w-none"
            >
              <EnquiryLink href="/contact#send-a-message">
                <span className={CAP_TRIM}>Talk to Our Team</span>
              </EnquiryLink>
            </Button>
          </div>
        </RevealOnScroll>

        {/* Figma's 28px gutter between the two 592px cards, 280px below the
            CTAs. The cards are links rather than plain panels — a phone number
            and an email address that are not tappable on a phone are a wasted
            affordance, and the mock has no hover state to contradict. */}
        <RevealOnScroll
          delay={0.1}
          className="mt-20 grid grid-cols-1 gap-7 md:mt-[280px] lg:grid-cols-2"
        >
          <ContactCard label="Call Our Office" value={COMPANY.phone.display} href={COMPANY.phone.href} />
          <ContactCard label="Email Us" value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
        </RevealOnScroll>
      </div>
    </section>
  );
}
