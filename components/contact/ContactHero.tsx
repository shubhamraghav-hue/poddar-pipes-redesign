import Image from "next/image";
import { useTranslations } from "next-intl";
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
// Figma "contact page BG 1" (node 1861:12806, 2026-10-16) — grey pipe stack,
// 4096x2286 source, replacing the earlier orange-pipe still.
const HERO_STILL = "/contact/contact-pipes-grey.webp";

const NAVY = "#0b0b52";
const NAVY_0 = "rgba(11,11,82,0)";

/** Nodes 1606:11632 / 1606:11635 — white @ 5% over the navy band.
    Hover (component set 1935:22469, "Property 1=hover", smart-animate
    ease-out 120ms): fill to white @ 12%, stroke 0.2px navy -> 0.5px white,
    value 32px Medium 1% tracking -> SemiBold 0%, still white. Keyboard focus
    mirrors it. Box as drawn: padding 110 / 58 / 60, label 20/1.2, 12px gap,
    value 32/1.1 (592x241 at 1512). Figma GLASS (no frost) is approximated
    with a faint inner edge light. Figma's
    box is 592x240; since the type moved to the home stat cards' sizes
    (2026-10-14) the height follows the content instead — equal padding all
    round (58px from `md`, Figma's left inset), no fixed min-height. */
function ContactCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      // `items-start` is explicit because a global rule in styles/globals.css
      // centres `align-items` on flex anchors; it is now scoped away from
      // `flex-col`, but stating the intent here keeps the two in sync. Figma
      // sets the copy flush at x57.8 of 592 (9.76%), which is the `px-[58px]`.
      className="group @container flex touch-manipulation select-none flex-col items-start justify-center rounded-[25px] border-[0.2px] border-[#0b0b52] bg-white/5 px-7 pb-7 pt-[52px] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_0_14px_rgba(255,255,255,0.05)] outline-none transition-[background-color,border-color,border-width,transform,translate,scale] duration-[120ms] ease-out hover:border-[0.5px] hover:border-white hover:bg-white/[0.12] focus-visible:border-[0.5px] focus-visible:border-white focus-visible:bg-white/[0.12] active:scale-[0.99] md:px-[58px] md:pb-[59px] md:pt-[109px]"
    >
      {/* 24px at 1.92px tracking is Figma's literal pair; the tracking is 8% of
          the size, which is wide enough that it has to scale with it rather
          than staying a fixed px value on smaller type. */}
      {/* OUTER EDGES TRIMMED, inner gap untouched: the label loses the space
          above its caps, the value loses the space below its baseline, and the
          `mt-3` between them stays as drawn. Untrimmed, Anek's bottom-heavy
          line box sat the block 7.7px (Call) / 4.2px (Email) high in the card;
          trimming both lines fully would also have shrunk the label→value gap. */}
      {/* TYPE SIZES (2026-10-19, Figma contact card 1979:32715): label is the
          sitewide `type-sub` (20px SemiBold on desktop), value 32px Medium,
          capped by the one-line fit below so the email never wraps. */}
      <span className="type-sub font-semibold uppercase leading-[1.2] text-[#f28000]">
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
        className="mt-3 break-all font-display font-medium leading-[1.1] tracking-[0.01em] text-white group-hover:font-semibold group-hover:tracking-normal group-focus-visible:font-semibold group-focus-visible:tracking-normal"
        style={{ fontSize: "max(14px, min(9.7cqw, 32px))" }}
      >
        {value}
      </span>
    </a>
  );
}

export function ContactHero() {
  const t = useTranslations("contactPage");
  return (
    <section className="relative mt-[80px] overflow-hidden bg-[#0b0b52]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ maxHeight: "100%" }}
      >
        <div className="relative aspect-[1512/895] min-h-[481px] w-full">
          {/* Placed exactly as the mock places it in its 1512x895 frame:
              2289x1278 at (-87, -200) — as percentages of the box, so it holds
              at every width. Inside that layer the photo is `object-cover`,
              so where the box is taller than 1512:895 (the 481px floor on
              phones) it crops rather than stretches. */}
          <div className="absolute left-[-5.754%] top-[-22.346%] h-[142.793%] w-[151.389%]">
            <Image
              src={HERO_STILL}
              alt=""
              fill
              priority
              quality={90}
              sizes="152vw"
              className="object-cover"
            />
          </div>
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

      <div className="container-figma relative pb-20 pt-24 md:pb-[150px] md:pt-[150px]">
        <RevealOnScroll>
          <h1 className="max-w-[307px] font-display type-hero uppercase text-white sm:max-w-[511px]">
            <span className="block font-light">{t("heroLine1")}</span>
            <span className="block font-bold">{t("heroLine2")}</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-[13px] max-w-[307px] type-body text-white sm:mt-5 sm:max-w-[437px]">
            {t("heroDesc")}
          </p>
        </RevealOnScroll>

        {/* One CTA: "Talk to our team" was removed (client deck 2026-10-22,
            slide 2237:15271) — it opened the same form. The label is
            cap-trimmed (`CAP_TRIM`): `Button`'s own trim never reaches an
            `asChild` label. */}
        <RevealOnScroll delay={0.14}>
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[15px] md:mt-[60px]">
            <Button
              asChild
              size="figma"
              variant="figma-orange"
              className="w-full max-w-[307px] sm:w-auto sm:max-w-none"
            >
              <EnquiryLink href="/contact#send-a-message">
                <span className={CAP_TRIM}>{t("ctaSendMessage")}</span>
              </EnquiryLink>
            </Button>
          </div>
        </RevealOnScroll>

        {/* Figma's 28px gutter between the two 592px cards, 280px below the
            CTA. Phones: 140px, so the hero runs longer and the cards sit low
            on the photo (client deck slide 2246:16567). The cards are links rather than plain panels — a phone number
            and an email address that are not tappable on a phone are a wasted
            affordance, and the mock has no hover state to contradict. */}
        <RevealOnScroll
          delay={0.1}
          className="mt-[140px] grid grid-cols-1 gap-7 md:mt-[280px] lg:grid-cols-2"
        >
          <ContactCard label={t("callLabel")} value={COMPANY.phone.display} href={COMPANY.phone.href} />
          <ContactCard label={t("emailLabel")} value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
        </RevealOnScroll>
      </div>
    </section>
  );
}
