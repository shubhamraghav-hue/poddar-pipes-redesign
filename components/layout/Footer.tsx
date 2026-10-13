import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { COMPANY } from "@/lib/data/offices";
import { RangeLink } from "@/components/shared/RangeLink";

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

  // SAME HEIGHT AS THE LOGO (36px), no padding (client, 2026-10-12). The
  // text box is trimmed to its ink — cap top of line 1 to baseline of line 2
  // (`text-box-trim`), measured 1.638em in Anek — so 22px of type is
  // exactly 36px, top and bottom flush with the logo beside/above it. The
  // corner bracket used to sit ABOVE the text (+12px); it now sits in the
  // top-left corner beside the first line, inside the same 36px, with the
  // text indented to clear it.
  return (
    <div className="relative">
      <img
        src="/brand/tagline-mark.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-[11px] w-auto"
      />
      <p className="max-w-[10em] pl-[0.62em] text-[22px] font-semibold uppercase leading-none text-white [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
        {t.rich("brandTagline", {
          gold: (chunks) => <span className="text-[#d9b365]">{chunks}</span>,
        })}
      </p>
    </div>
  );
}

/**
 * Desktop brand lockup, EXACTLY Figma 1530:7202 + 1530:7190: the full logo at
 * 170.57x49.69 (logo.svg is that artwork, cropped to its ink), then 59.4px
 * to the tagline group — the corner bracket (10.77x11.06) at its top-left,
 * the 22.07px SemiBold two-line text 9.59px right of it and 8.1px lower. The
 * bracket sits 2px above the logo's top edge, as in the mock.
 */
function BrandLockupDesktop() {
  const t = useTranslations("footer");
  return (
    <div className="flex items-start gap-[59.4px]">
      <Link href="/" aria-label="Poddar Pipes — home" className="mt-[2px] block shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- the SVG logo */}
        <img src="/logo.svg" alt="Poddar Pipes" className="block h-[49.69px] w-auto" />
      </Link>
      <div className="relative h-[52.1px] w-[207px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative mark */}
        <img src="/brand/tagline-mark.svg" alt="" aria-hidden="true" className="absolute left-0 top-0 h-[11.06px] w-auto" />
        <p className="absolute left-[9.59px] top-[8.1px] w-[197.4px] text-[22.07px] font-semibold uppercase leading-none text-white">
          {t.rich("brandTagline", {
            gold: (chunks) => <span className="text-[#d9b365]">{chunks}</span>,
          })}
        </p>
      </div>
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
    { label: "uPVC", href: "/products?category=upvc-pipes#range" },
    { label: "CPVC", href: "/products?category=cpvc-pipes#range" },
    { label: "SWR", href: "/products?category=swr-pipes#range" },
    { label: "TANKS", href: "/products?category=tanks#range" },
    { label: "AGRI", href: "/products?category=agricultural-pipes#range" },
    { label: "UGD", href: "/products?category=ugd-pipes#range" },
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

  const navHeading = "text-[14px] font-bold uppercase leading-[1.5] tracking-[0.56px] text-white";
  // Figma 1530:7156 sets every link at full #c0c0c0 (they were dimmed to
  // 70% opacity); hover lifts to white.
  const hoverLink = "transition-colors hover:text-white";
  // 28px rows (Figma: 14px at line-height 2). As padding, not `leading`:
  // globals.css forces `line-height: 1` on every <a>, unlayered, so a
  // leading utility on the link loses.
  const navLink = `block py-[7px] text-[14px] font-normal uppercase tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;
  const productLink = `block py-[7px] text-[14px] font-normal tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;

  return (
    <footer className="relative overflow-hidden bg-[#0b0b52] text-[#c0c0c0]">
      {/* Desktop rhythm is Figma 1530:7156's: 68 to the top row, 41 under it
          to the rule, 61 to the body, 41 to the lower rule, 16 to the legal
          line, 30 under it (546 tall at 1512). */}
      <div className="container-edge relative flex flex-col gap-12 py-16 md:py-20 lg:gap-0 lg:pb-[30px] lg:pt-[68px]">
        {/* Newsletter — left-aligned on mobile (the mobile node centres
            nothing below the CTA), side-by-side row from lg up. */}
        {/* Top row. Desktop = Figma: brand lockup left (bracket 19px below
            the row top), newsletter right (347 wide: 14px label, 6px, field).
            Mobile keeps its own order: newsletter first, lockup lower down. */}
        <div className="flex flex-col gap-[10px] lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="hidden pt-[19px] lg:block">
            <BrandLockupDesktop />
          </div>
          <div className="flex flex-col gap-[10px] lg:w-[347px] lg:gap-[6px]">
            <h3 className="text-[13px] font-normal uppercase text-white lg:text-[14px] lg:leading-[1.5]">
              {t("newsletterTitle")}
            </h3>
            <NewsletterSignup />
          </div>
        </div>

        <div className="-mx-2 border-t border-[#4a4a4a] sm:-mx-4 md:-mx-6 lg:mt-[41px] xl:-mx-11" />

        <div className="flex flex-col gap-12 lg:mt-[61px] lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
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
          <div className="order-2 flex max-w-xs flex-col gap-6 lg:order-1 lg:max-w-none lg:gap-0 lg:pt-[19px]">
            {/* Logo and tagline are ONE lockup, and Figma arranges it
                differently per breakpoint rather than merely reflowing it:
                STACKED 18px apart on mobile (nodes 1447:13517 / 1447:13561),
                SIDE BY SIDE 59px apart on desktop (1447:13320 / 1447:13308).
                Hence a row/column switch here rather than a wrap. */}
            <div className="flex flex-col items-start gap-[18px] lg:hidden">
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
            <p className="max-w-[232px] text-[13px] font-light leading-[1.25] tracking-[0.26px] text-[#c0c0c0] lg:max-w-[330px] lg:text-[14px] lg:leading-[1.5] lg:tracking-[0.28px]">
              {COMPANY.address.oneLine}
            </p>
            {/* Stacked on mobile, one line with a `|` from `lg` — the mobile
                node has no separator and puts them on their own rows. */}
            {/* `py-2` below `lg`: a bigger tap target for the two contact
                links (they were 13px-tall strips on phones). */}
            <div className="flex flex-col text-[13px] font-normal tracking-[0.26px] text-white lg:mt-3 lg:gap-1 lg:leading-[1.2]">
              <a href={`mailto:${COMPANY.email}`} className={`relative self-start py-2 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] lg:py-[1.3px] ${hoverLink}`}>
                {COMPANY.email}
              </a>
              <a href={COMPANY.phone.href} className={`relative self-start py-2 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] lg:py-[1.4px] lg:text-[14px] lg:tracking-[0.28px] ${hoverLink}`}>
                {COMPANY.phone.display}
              </a>
            </div>
            {/* 32px under the contacts (Figma: 376 → 408). */}
            <div className="hidden lg:mt-8 lg:block">
              <SocialIcons variant="figma" />
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
                      <RangeLink
                        href={link.href}
                        className={`block py-2 text-[13px] font-normal tracking-[0.52px] text-[#c0c0c0] ${hoverLink} ${group.uppercase ? "uppercase" : ""}`}
                      >
                        {link.label}
                      </RangeLink>
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
          <div className="order-2 hidden gap-8 sm:gap-16 lg:mr-20 lg:flex lg:gap-20">
            <div className="flex flex-col gap-4 lg:gap-[10px]">
              <h4 className={navHeading}>{t("company")}</h4>
              <ul className="flex flex-col gap-2 lg:gap-0">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLink}>
                      {tNav(link.key as never)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 lg:gap-[10px]">
              <h4 className={navHeading}>{t("productsHeading")}</h4>
              <ul className="flex flex-col gap-2 lg:gap-0">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <RangeLink href={link.href} className={productLink}>
                      {link.label}
                    </RangeLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 lg:gap-[10px]">
              <h4 className={navHeading}>{t("resourcesHeading")}</h4>
              <ul className="flex flex-col gap-2 lg:gap-0">
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
        <div className="flex flex-col gap-4 lg:mt-[41px]">
          <div className="-mx-2 border-t border-[#4a4a4a] sm:-mx-4 md:-mx-6 xl:-mx-11" />

          {/* Legal row */}
          {/* A row at every width now: the mobile node puts the copyright
              left and stacks the two legal links right-aligned beside it,
              both at 10px — raised to 12px (10px was below a readable size
              on a phone). From `sm` it is the existing 12px row. */}
          {/* Stacked below `sm`: beside the copyright the two links had
              ~70px and broke into "Privacy / Policy", "Terms of / Service". */}
          <div className="flex flex-col gap-3 text-[12px] font-light sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:leading-none">
            <p className="leading-[1.35] lg:leading-none">
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