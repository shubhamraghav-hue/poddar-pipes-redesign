"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { COMPANY, getAddressLines } from "@/lib/data/offices";
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
 * MOBILE (below `lg`) follows Figma node 2015:5641 ("footer mobile", 402
 * wide), which is a different layout rather than a narrower one:
 *   - 30px gutters, and every rule runs FULL-BLEED edge to edge.
 *   - Newsletter first, then the three link groups COLLAPSED into accordions
 *     (rule above and below each, 45.85px pitch, 20x21 #c0c0c0 chevron), then
 *     the logo block (`order-*` below `lg`).
 *   - Everything is left-aligned; the mock centres nothing below the CTA.
 *   - Type drops to 13px (headings, links, address, contacts) and 10px (legal),
 *     from 14px and 12px.
 *   - The address is `#c0c0c0`, not white.
 *   - Email and phone stack instead of sharing a line with a `|`.
 *   - Socials become 18px glyphs inside 24px rings on a 34px pitch. The rings
 *     are mobile-only — Figma's desktop footer (node 1311:10981) draws bare
 *     30px icons.
 *   - The copyright wraps to two lines on the left, the legal links stack
 *     right-aligned beside it.
 *
 * The accordions are `<details>`/`<summary>`, so they open with no JS.
 * Desktop renders its own expanded columns (`hidden lg:flex`) rather than
 * trying to force a `<details>` open with CSS, which is not reliable across
 * browsers — the same duplication trade already used for the social icons
 * above. This is a client component ONLY for `usePathname`: the footer lives
 * in the layout and survives navigation, so the accordions are keyed on the
 * path and remount closed on every route change (client, 2026-10-22).
 *
 * The legal entity is "Poddar Plumbing System" (singular), verified against
 * the company's press coverage. The mock's plural spelling is wrong — this
 * is not a deviation to "fix".
 */
/**
 * The brand slogan that sits with the footer logo (Figma nodes 1447:13561
 * mobile / 1447:13308 desktop): an orange corner bracket at the text's top-left, and
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

  // SAME PLACEMENT AS THE DESKTOP LOCKUP (client, 2026-10-19): the corner
  // mark at the top-left, the text 9.59px right of it and 8.1px lower at
  // 22.07px — so the mark sits above-and-before "PIPES", hugging the text's
  // corner. In em (0.4345em right, 0.367em down, mark 0.501em tall), so it is
  // the desktop geometry at any size. Previously (2026-10-12) the text was
  // cap-trimmed to the logo's 36px with the mark beside the first line, which
  // read as a misplaced bullet.
  //
  // 17px, down from 22 (client, 2026-10-22: "match the Figma footer"). Figma
  // 2015:5715 sets it at 17.008px with the mark 8.3px tall and the text 7.39
  // right / 6.24 down — the same em ratios above, so only the size changes.
  return (
    <div className="relative text-[17px]">
      <img
        src="/brand/tagline-mark.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-[0.501em] w-auto"
      />
      <p className="ml-[0.4345em] max-w-[9.2em] pt-[0.367em] font-semibold uppercase leading-none text-white">
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
  const tCommon = useTranslations("common");
  return (
    <div className="flex items-center gap-[60px]">
      <Link href="/" aria-label={tCommon("homeLinkLabel")} className="mt-[2px] block shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- the SVG logo */}
        <img src="/logo.svg" alt="Poddar Pipes" className="block h-[49.69px] w-auto" />
      </Link>
      <div className="relative h-[49.23px] w-[196.26px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative mark */}
        <img src="/brand/tagline-mark.svg" alt="" aria-hidden="true" className="absolute left-0 top-0 h-[10.49px] w-auto" />
        <p className="absolute left-[9.09px] top-[7.68px] w-[187.2px] text-[20.93px] font-bold uppercase leading-none tracking-[-0.4186px] text-white">
          {t.rich("brandTagline", {
            gold: (chunks) => <span className="tracking-[-0.32px] text-[#d9b365]">{chunks}</span>,
          })}
        </p>
      </div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // Manufacturing, Quality and Sustainability dropped from the footer
  // (client, 2026-10-16) — the pages still exist, they are just not linked.
  const companyLinks = [
    { key: "about", href: "/about" },
    { key: "careers", href: "/careers" },
  ];

  const productLinks = [
    { label: "uPVC", href: "/products/upvc-pipes#range" },
    { label: "CPVC", href: "/products/cpvc-pipes#range" },
    { label: "SWR", href: "/products/swr-pipes#range" },
    { label: "TANKS", href: "/products/tanks#range" },
    { label: "AGRI", href: "/products/agricultural-pipes#range" },
    { label: "UGD", href: "/products/ugd-pipes#range" },
  ];

  // /resources is gone (client decision 2026-10-08). The Pipe Material
  // Estimator left the footer too (client, 2026-10-16), after the header; the
  // /tools/calculator page itself is still live, just no longer linked here.
  const resourceLinks = [
    { key: "navBlogsArticles", href: "/articles" },
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
          line, 30 under it (546 tall at 1512). Below `lg` every gap is set
          per element from Figma 2015:5641 instead of one flex gap, and the
          gutter is the mock's 30px below `md` (`!`: `container-edge` is
          itself declared in the utilities layer and otherwise wins). */}
      <div className="container-edge relative flex flex-col pb-10 pt-16 max-md:px-[30px]! md:pt-20 lg:pb-[30px] lg:pt-[70px]">
        {/* Newsletter — left-aligned on mobile (the mobile node centres
            nothing below the CTA), side-by-side row from lg up. */}
        {/* Top row. Desktop = Figma: brand lockup left (bracket 19px below
            the row top), newsletter right (347 wide: 14px label, 6px, field).
            Mobile keeps its own order: newsletter first, lockup lower down. */}
        <div className="flex flex-col gap-[10px] lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="hidden pt-[4px] lg:block">
            <BrandLockupDesktop />
          </div>
          <div className="flex flex-col gap-[10px] lg:w-[347px] lg:gap-[6px]">
            <h3 className="text-[13px] font-normal uppercase leading-[1.2] tracking-normal text-white lg:text-[14px] lg:leading-[1.5]">
              {t("newsletterTitle")}
            </h3>
            <NewsletterSignup />
          </div>
        </div>

        {/* Below `lg` this is also the rule ABOVE the first accordion row
            (Figma: 51px under the field, full-bleed), so the accordions sit
            directly under it with no gap. */}
        <div className="-mx-[30px] mt-[51px] border-t border-[#4a4a4a] md:-mx-10 lg:-mx-6 lg:mt-[40px] xl:-mx-11" />

        <div className="flex flex-col lg:mt-[51px] lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
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
          {/* Below `lg` (Figma 2015:5641): 40px under the last accordion rule,
              33px from the tagline to the address, 10 to the email. */}
          <div className="order-2 mt-10 flex max-w-xs flex-col lg:order-1 lg:mt-0 lg:max-w-none lg:pl-[5px]">
            {/* Logo and tagline are ONE lockup, and Figma arranges it
                differently per breakpoint rather than merely reflowing it:
                STACKED 18px apart on mobile (nodes 2015:5671 / 2015:5715),
                SIDE BY SIDE 59px apart on desktop (1447:13320 / 1447:13308).
                Hence a row/column switch here rather than a wrap. */}
            <div className="mb-[33px] flex flex-col items-start gap-[18px] lg:hidden">
              <Link href="/" aria-label={tCommon("homeLinkLabel")} className="flex shrink-0 items-center gap-2.5">
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
                    ratio sets the width, so nothing else moves when it does.
                    32.8px since 2026-10-22 — Figma 2015:5671's full logo is
                    112.59x32.8, which is logo.svg's own ratio at that height
                    (and the link's old `py-1` is gone: Figma's 18px to the
                    tagline is measured from the artwork). */}
                <img src="/logo.svg" alt="Poddar Pipes" className="h-[32.8px] w-auto" />
              </Link>
              <BrandTagline />
            </div>
            {/* Registered office — client-approved wording from `COMPANY`
                (lib/data/offices.ts). Updated by the client on 2026-10-22.

                TWO LINES (client, 2026-10-22), broken where the client breaks
                it (`COMPANY.address.lines`): each line is its own block and
                there is no width cap, so the 342px second line stays whole on
                desktop. On a phone narrower than ~330px a line may still wrap.
                `#c0c0c0` below `lg` per the mobile node; white from `lg`. */}
            <p className="text-[13px] font-light leading-[1.25] tracking-[0.26px] text-[#c0c0c0] lg:text-[16px] lg:leading-[1.5] lg:tracking-[0.32px]">
              {getAddressLines(locale).map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
            {/* Stacked on mobile, one line with a `|` from `lg` — the mobile
                node has no separator and puts them on their own rows. */}
            {/* Below `lg` = Figma: 10px under the address, 15.6px rows (13px at
                1.2, as padding since <a> is forced to `line-height: 1`), 4px
                apart. The `before:` box keeps a ~28px tap target without
                spreading the rows. */}
            <div className="mt-[10px] flex flex-col gap-1 text-[13px] font-normal tracking-[0.26px] text-white lg:mt-4 lg:text-[16px] lg:leading-[1.2] lg:tracking-[0.32px]">
              <a href={`mailto:${COMPANY.email}`} className={`relative self-start py-[1.3px] before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] ${hoverLink}`}>
                {COMPANY.email}
              </a>
              <a href={COMPANY.phone.href} className={`relative self-start py-[1.3px] before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] lg:py-[1.4px] ${hoverLink}`}>
                {COMPANY.phone.display}
              </a>
            </div>
            {/* 32px under the contacts (Figma: 376 → 408). */}
            <div className="hidden lg:mt-8 lg:block">
              <SocialIcons variant="figma" />
            </div>
          </div>

          {/* Nav link groups, MOBILE — one `<details>` accordion per group
              with a full-bleed `#4a4a4a` rule under it, exactly as Figma
              2015:5646-5663 draws them: 13px bold labels on a 45.85px rule
              pitch (12px + the 21px chevron + 12px + the 1px rule), the 20x21
              chevron right-aligned on the 30px gutter. The negative margin
              takes the rules to the edges; the rows put the gutter back.

              KEYED ON THE PATH: the footer is in the layout and never
              unmounts, so an opened group used to stay open on the next
              page. A new key per route remounts them closed (client,
              2026-10-22). */}
          <div key={pathname} className="order-1 -mx-[30px] flex flex-col md:-mx-10 lg:hidden">
            {navGroups.map((group) => (
              <details key={group.heading} className="group border-b border-[#4a4a4a]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-[30px] py-3 md:px-10 [&::-webkit-details-marker]:hidden">
                  <span className="text-[13px] font-bold uppercase leading-[1.2] tracking-[0.52px] text-white">
                    {group.heading}
                  </span>
                  {/* `[transform:rotate(180deg)]`, not `rotate-180`. Tailwind
                      v4's `rotate-*` sets the standalone `rotate` property, so
                      two things went wrong: `transition-transform` does not
                      animate it, and measured it resolved to `0deg` rather
                      than 180 anyway. Setting `transform` directly rotates AND
                      transitions.

                      Figma's chevron is a 20x21 box with a 1px `#c0c0c0`
                      stroke; lucide draws on a 24 grid, so 1.2 scales to 1px
                      at 20px. */}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.2}
                    className="h-[21px] w-5 shrink-0 text-[#c0c0c0] transition-transform duration-200 group-open:[transform:rotate(180deg)]"
                  />
                </summary>
                {/* Rows carry their own `py-2` (32px tap targets) instead
                    of an 8px gap between 16px-tall links. Figma draws no open
                    state; this is the existing one, on the 30px gutter. */}
                <ul className="flex flex-col px-[30px] pb-3 md:px-10">
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
          {/* Figma 1979:32591: TWO columns 80px apart — PRODUCTS, then COMPANY
              stacked over RESOURCES (20px between the groups). */}
          <div className="order-2 hidden lg:-mr-[5px] lg:flex lg:gap-20 lg:pr-20">
            <div className="flex w-[68px] flex-col gap-[10px]">
              <h4 className={navHeading}>{t("productsHeading")}</h4>
              <ul className="flex flex-col">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <RangeLink href={link.href} className={productLink}>
                      {link.label}
                    </RangeLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-[109px] flex-col gap-5">
              <div className="flex flex-col gap-[10px]">
                <h4 className={navHeading}>{t("company")}</h4>
                <ul className="flex flex-col">
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={navLink}>
                        {tNav(link.key as never)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-[10px]">
                <h4 className={navHeading}>{t("resourcesHeading")}</h4>
                <ul className="flex flex-col">
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
          </div>

          {/* Social icons — own step in the mobile/tablet stack order; folded
              into the logo/address column from lg up instead (above). 30px
              under the phone line; the rings start 3px LEFT of the text column
              (Figma: ring x27, glyph x30), so the glyphs line up with it. */}
          <div className="order-3 -ml-[3px] mt-[30px] lg:hidden">
            <SocialIcons />
          </div>
        </div>

        {/* Divider sits much closer to the legal row than the gap-12 used
            between every other section above — matches the Figma spec's
            own gap-[16px] here specifically, rather than the sitewide
            rhythm, so it's grouped with the legal row instead of being a
            standalone flex sibling. */}
        {/* Below `lg` = Figma 2015:5690: the full-bleed rule 41.5px under the
            social rings, 20.5px over the legal row. */}
        <div className="mt-[41.5px] flex flex-col gap-[20.5px] lg:mt-[51px] lg:gap-4">
          <div className="-mx-[30px] border-t border-[#4a4a4a] md:-mx-10 lg:-mx-6 xl:-mx-11" />

          {/* Legal row */}
          {/* Below `lg` = Figma 2015:5711-5714: the copyright left in white,
              10px Light at 1.35 in a 182px box (so it wraps after "Ltd."),
              and the two links stacked right-aligned beside it, 10px on a
              14px pitch, `#c0c0c0` at 80%. `type-small` steps to 12px from
              `sm`; the desktop row from `lg` is unchanged. */}
          <div className="flex flex-row items-start justify-between gap-4 type-small font-light lg:items-center lg:leading-none">
            <p className="max-w-[182px] leading-[1.35] text-white sm:max-w-none lg:leading-none lg:text-inherit">
              © {new Date().getFullYear()} {COMPANY.legalName} {t("rightsReserved")}
            </p>
            <div className="flex shrink-0 flex-col items-end gap-1 opacity-80 lg:flex-row lg:items-center lg:gap-[53px] lg:opacity-100">
              <Link href="/privacy-policy" className={`relative before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-[''] ${hoverLink}`}>
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms-of-service" className={`relative before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-[''] ${hoverLink}`}>
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}