import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { COMPANY } from "@/lib/data/offices";

/**
 * Footer (Figma node 8:7). Colours, tracking and sizes are the mock's literal
 * values rather than the site's brand tokens or Tailwind's nearest named
 * step — deliberate, so the type matches pixel-for-pixel.
 *
 * Hover is the footer's own opacity-70 → 100 convention, not the flow-cyan
 * colour shift used on other dark surfaces; the mock has no hover variant.
 *
 * Social icons render once at any width: with the logo column from `lg` up,
 * and as their own row below it, gated by `lg:hidden` / `hidden lg:block`
 * rather than duplicated markup.
 *
 * MOBILE follows Figma node 1311:10827, which is a different layout rather
 * than a narrower one:
 *   - The three link groups COLLAPSE into accordions with a chevron and a rule
 *     under each, instead of sitting side by side expanded.
 *   - They come BEFORE the logo block, not after it (`order-*` below `lg`).
 *   - Everything is left-aligned; the mock centres nothing below the CTA.
 *   - Type drops to 13px (headings, links, address, contacts) and 10px (legal),
 *     from 14px and 12px.
 *   - The address is `#c0c0c0`, not white, and wraps to three lines.
 *   - Email and phone stack instead of sharing a line with a `|`.
 *   - Socials become 18px glyphs inside 24px rings on a 34px pitch. The rings
 *     are mobile-only — Figma's desktop footer (node 1311:10981) draws bare
 *     30px icons.
 *   - The legal links stack right-aligned rather than sitting in a row.
 *
 * The accordions are `<details>`/`<summary>`, so they need no client JS and
 * keep this a server component. Desktop renders its own expanded columns
 * (`hidden lg:flex`) rather than trying to force a `<details>` open with CSS,
 * which is not reliable across browsers — the same duplication trade already
 * used for the social icons above.
 *
 * The legal entity is "Poddar Plumbing System" (singular), verified against
 * the company's press coverage. The mock's plural spelling is wrong — this
 * is not a deviation to "fix".
 */
/**
 * The brand slogan that sits with the footer logo (Figma nodes 1447:13561
 * mobile / 1447:13308 desktop): an orange corner bracket above the text, and
 * "GOLD" in `#d9b365` inside an otherwise white line.
 *
 * The string lives in `footer.brandTagline` and is IDENTICAL in all eleven
 * locale files, deliberately. It is Hinglish by design and functions as part
 * of the lockup rather than as body copy, so it is not translated — the key
 * exists per-locale only because next-intl resolves every key per-locale.
 * `t.rich` rather than three keys, so the coloured word stays inside one
 * translatable sentence instead of being assembled from fragments.
 *
 * `max-w-[9.2em]` is the one value that forces the two-line break, and it is
 * in `em` on purpose: Figma sets the box to 152.125px at 17.008px on mobile
 * and 197.414px at 22.071px on desktop, which are the SAME 8.945em — so one
 * measure holds the break at both sizes with no breakpoint of its own. 9.2
 * rather than 8.945 is deliberate slack: our Anek sets "STANDARD. PHIR SE."
 * at 146.8px against the 152.1px box, and 5px is close enough that a
 * different font-loading path could spill it onto a third line. 9.2em buys
 * ~10px and cannot pull the break the other way — hoisting "STANDARD." up to
 * line one needs ~199px, far past either value.
 *
 * The indent is a MARGIN, not padding, and that is load-bearing. Figma's
 * 152.125px is the text box measured from x37.39 — i.e. AFTER the 7.4px
 * offset. As padding under `border-box` the same number is the box INCLUDING
 * the offset, which left 144.8px of measure, and at 146.8px the last line
 * broke to "STANDARD. PHIR" / "SE.".
 */
function BrandTagline() {
  const t = useTranslations("footer");

  return (
    <div className="flex flex-col items-start gap-px">
      {/* Figma draws this bracket 8.3x8.52 on mobile and 10.77x11.06 on
          desktop — the same 0.9735 ratio, so one asset scaled by height. It
          is decoration beside text that already reads, hence aria-hidden. */}
      <img
        src="/brand/tagline-mark.svg"
        alt=""
        aria-hidden="true"
        className="h-[8.5px] w-auto lg:h-[11px]"
      />
      {/* Indented to clear the bracket: Figma offsets the text 7.39px from
          the mark's left edge at 17px, and 9.59px at 22px — both 0.435em. */}
      <p className="ml-[0.435em] max-w-[9.2em] text-[17px] font-semibold uppercase leading-none text-white lg:text-[22px]">
        {t.rich("brandTagline", {
          gold: (chunks) => <span className="text-[#d9b365]">{chunks}</span>,
        })}
      </p>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const companyLinks = [
    { key: "about", href: "/about" },
    { key: "manufacturing", href: "/manufacturing" },
    { key: "quality", href: "/quality" },
    { key: "sustainability", href: "/sustainability" },
    { key: "careers", href: "/careers" },
  ];

  const productLinks = [
    { label: "uPVC", href: "/products?category=upvc-pipes" },
    { label: "CPVC", href: "/products?category=cpvc-pipes" },
    { label: "SWR", href: "/products?category=swr-pipes" },
    { label: "TANKS", href: "/products?category=tanks" },
    { label: "AGRI", href: "/products?category=agricultural-pipes" },
    { label: "UGD", href: "/products?category=ugd-pipes" },
  ];

  // /resources is gone (client decision 2026-10-08): the column lists what
  // the header's Resources dropdown holds, plus Contact.
  const resourceLinks = [
    { key: "navBlogsArticles", href: "/articles" },
    { key: "navPipeCementCalculator", href: "/tools/calculator" },
    { key: "contact", href: "/contact" },
  ];

  // The same three groups the desktop columns render, flattened to
  // `{ label, href }` so the mobile accordion can map them without repeating
  // the translation lookups.
  const navGroups = [
    {
      heading: t("company"),
      uppercase: true,
      links: companyLinks.map((l) => ({ label: tNav(l.key as never), href: l.href })),
    },
    { heading: t("productsHeading"), uppercase: false, links: productLinks.map((l) => ({ label: l.label, href: l.href })) },
    {
      heading: t("resourcesHeading"),
      uppercase: true,
      links: resourceLinks.map((l) => ({ label: tNav(l.key as never), href: l.href })),
    },
  ];

  const navHeading = "text-[14px] font-bold uppercase tracking-[0.56px] text-white";
  const hoverLink = "opacity-70 transition hover:opacity-100";
  const navLink = `text-[14px] font-normal uppercase tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;
  const productLink = `text-[14px] font-normal tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;

  return (
    <footer className="relative overflow-hidden bg-[#0b0b52] text-[#c0c0c0]">
      <div className="container-edge relative flex flex-col gap-12 py-16 md:py-20">
        {/* Newsletter — left-aligned on mobile (the mobile node centres
            nothing below the CTA), side-by-side row from lg up. */}
        <div className="flex flex-col gap-[10px] lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-2 lg:max-w-md">
            <h3 className="text-[13px] font-normal uppercase text-white lg:text-[18px] lg:tracking-[0.36px]">
              {t("newsletterTitle")}
            </h3>

            {/* Desktop only. The mobile node drops this paragraph entirely and
                keeps just the label above the field. */}
            <p className="hidden max-w-[380px] text-sm font-light leading-[1.5] tracking-[0.14px] text-[#86868c] lg:block">
              {t("newsletterDescription")}
            </p>
          </div>

          <NewsletterSignup />
        </div>

        <div className="-mx-2 border-t border-white/10 sm:-mx-4 md:-mx-6 xl:-mx-11" />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
          {/* Logo + registered address (social icons join here from lg up).
              `order-2` below `lg`: the mobile node puts the link groups first
              and the logo block under them. */}
          {/* `lg:max-w-none` releases a cap that was not doing the job it
              looks like it is doing. `max-w-xs` is 320px, so from `lg` it was
              silently overriding the address paragraph's own
              `lg:max-w-[340px]`; Figma's desktop address box is 330px (node
              1447:13303), so lifting the cap moves that wrap TOWARD the mock
              rather than away from it. It also gives the logo + tagline row
              below the width it needs to sit side by side. Below `lg` the cap
              is untouched, so mobile is unaffected. */}
          <div className="order-2 flex max-w-xs flex-col gap-6 lg:order-1 lg:max-w-none">
            {/* Logo and tagline are ONE lockup, and Figma arranges it
                differently per breakpoint rather than merely reflowing it:
                STACKED 18px apart on mobile (nodes 1447:13517 / 1447:13561),
                SIDE BY SIDE 59px apart on desktop (1447:13320 / 1447:13308).
                Hence a row/column switch here rather than a wrap. */}
            <div className="flex flex-col items-start gap-[18px] lg:flex-row lg:items-center lg:gap-[59px]">
              <Link href="/" aria-label="Poddar Pipes — home" className="flex shrink-0 items-center gap-2.5 py-1">
                {/* 36px, and the number dropped from 65 WITHOUT the logo
                    getting smaller. `logo.svg` used to carry a uniform 72-unit
                    margin inside its own 757x323.89 viewBox — measured 72.00
                    left and right, 72.50 top and bottom — so only 55.2% of any
                    height given to it was actually artwork. At the old
                    `h-[65px]` that spent 14.45px on empty space down the left,
                    which is why the lockup never sat flush with the address and
                    tagline below it, and 14.55px top and bottom, which is why
                    it kept reading small and kept getting nudged up (44 -> 50
                    -> 65). The asset is now cropped to its ink, so 36px of box
                    is 36px of logo and the left edge is the left edge.

                    One value for both breakpoints now: the old pair rendered
                    35.90px of artwork on mobile and 35.35px from `lg`, which
                    was never a deliberate 0.55px step, just two paddings
                    resolving slightly differently.

                    Still the ONE number to retune: `w-auto` means the SVG's own
                    ratio sets the width, and the gap under the lockup is the
                    parent's `gap-6`, so nothing else moves when it does. */}
                <img src="/logo.svg" alt="Poddar Pipes" className="h-9 w-auto" />
              </Link>
              <BrandTagline />
            </div>
            {/* Registered office — client-approved wording from `COMPANY`
                (lib/data/offices.ts). It supersedes the earlier "3rd Floor,
                1202 …" text and Figma's "4th Floor".

                One paragraph that wraps: three lines in 232px on mobile, two
                in ~340px on desktop. `#c0c0c0` below `lg` per the mobile node;
                white from `lg`. */}
            <p className="max-w-[232px] text-[13px] font-light leading-[1.25] tracking-[0.26px] text-[#c0c0c0] lg:max-w-[340px] lg:text-[14px] lg:font-normal lg:leading-[1.3] lg:tracking-[0.28px] lg:text-white">
              {COMPANY.address.oneLine}
            </p>
            {/* Stacked on mobile, one line with a `|` from `lg` — the mobile
                node has no separator and puts them on their own rows. */}
            {/* `py-2` below `lg`: a bigger tap target for the two contact
                links (they were 13px-tall strips on phones). */}
            <div className="flex flex-col text-[13px] font-normal tracking-[0.26px] text-white lg:flex-row lg:items-center lg:gap-2 lg:text-[14px] lg:tracking-[0.28px]">
              <a href={`mailto:${COMPANY.email}`} className={`relative self-start py-2 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] lg:py-0 ${hoverLink}`}>
                {COMPANY.email}
              </a>
              <span className="hidden lg:inline">|</span>
              <a href={COMPANY.phone.href} className={`relative self-start py-2 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] lg:py-0 ${hoverLink}`}>
                {COMPANY.phone.display}
              </a>
            </div>
            <div className="hidden lg:block">
              <SocialIcons />
            </div>
          </div>

          {/* Nav link groups, MOBILE — one `<details>` accordion per group
              with a rule under it, exactly as the mobile node draws them:
              13px bold labels on a 45.85px row pitch with a 20px chevron
              right-aligned. `<details>` rather than client state so this stays
              a server component and works with no JS. */}
          <div className="order-1 flex flex-col lg:hidden">
            {navGroups.map((group) => (
              <details key={group.heading} className="group border-b border-white/10">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
                  <span className="text-[13px] font-bold uppercase tracking-[0.52px] text-white">
                    {group.heading}
                  </span>
                  {/* `[transform:rotate(180deg)]`, not `rotate-180`. Tailwind
                      v4's `rotate-*` sets the standalone `rotate` property, so
                      two things went wrong: `transition-transform` does not
                      animate it, and measured it resolved to `0deg` rather
                      than 180 anyway. Setting `transform` directly rotates AND
                      transitions. */}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-white transition-transform duration-200 group-open:[transform:rotate(180deg)]"
                  />
                </summary>
                {/* Rows carry their own `py-2` (32px tap targets) instead
                    of an 8px gap between 16px-tall links. */}
                <ul className="flex flex-col pb-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block py-2 text-[13px] font-normal tracking-[0.52px] text-[#c0c0c0] ${hoverLink} ${group.uppercase ? "uppercase" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          {/* Nav link groups, DESKTOP — unchanged. Kept as its own markup
              rather than reusing the `<details>` above, because forcing a
              closed `<details>` open with CSS is not reliable across
              browsers. */}
          <div className="order-2 hidden gap-8 sm:gap-16 lg:flex">
            <div className="flex flex-col gap-4">
              <h4 className={navHeading}>{t("company")}</h4>
              <ul className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLink}>
                      {tNav(link.key as never)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className={navHeading}>{t("productsHeading")}</h4>
              <ul className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={productLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className={navHeading}>{t("resourcesHeading")}</h4>
              <ul className="flex flex-col gap-2">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLink}>
                      {tNav(link.key as never)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social icons — own step in the mobile/tablet stack order; folded
              into the logo/address column from lg up instead (above) */}
          <div className="order-3 lg:hidden">
            <SocialIcons />
          </div>
        </div>

        {/* Divider sits much closer to the legal row than the gap-12 used
            between every other section above — matches the Figma spec's
            own gap-[16px] here specifically, rather than the sitewide
            rhythm, so it's grouped with the legal row instead of being a
            standalone flex sibling. */}
        <div className="flex flex-col gap-4">
          <div className="-mx-2 border-t border-white/10 sm:-mx-4 md:-mx-6 xl:-mx-11" />

          {/* Legal row */}
          {/* A row at every width now: the mobile node puts the copyright
              left and stacks the two legal links right-aligned beside it,
              both at 10px — raised to 12px (10px was below a readable size
              on a phone). From `sm` it is the existing 12px row. */}
          {/* Stacked below `sm`: beside the copyright the two links had
              ~70px and broke into "Privacy / Policy", "Terms of / Service". */}
          <div className="flex flex-col gap-3 text-[12px] font-light sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="leading-[1.35]">
              © {new Date().getFullYear()} {COMPANY.legalName} {t("rightsReserved")}
            </p>
            <div className="-my-1.5 flex flex-row items-center gap-6 sm:my-0 sm:gap-[53px]">
              <Link href="/privacy-policy" className={`relative py-1.5 before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-[''] sm:py-0 ${hoverLink}`}>
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms-of-service" className={`relative py-1.5 before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-[''] sm:py-0 ${hoverLink}`}>
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}