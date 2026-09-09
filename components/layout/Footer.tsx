import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SocialIcons } from "@/components/shared/SocialIcons";

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
    { label: "uPVC", href: "/products/category/upvc-pipes" },
    { label: "CPVC", href: "/products/category/cpvc-pipes" },
    { label: "SWR", href: "/products/category/swr-pipes" },
    { label: "TANKS", href: "/products/category/tanks" },
    { label: "AGRI", href: "/products/category/agricultural-pipes" },
    { label: "UGD", href: "/products/category/ugd-pipes" },
  ];

  const resourceLinks = [
    { key: "resources", href: "/resources" },
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
          <div className="order-2 flex max-w-xs flex-col gap-6 lg:order-1">
            <Link href="/" className="flex items-center gap-2.5">
              {/* 33px on mobile per the mobile node's 32.8px lockup; the
                  existing 64px stays from `lg`. */}
              <img src="/logo.svg" alt="Poddar Pipes" className="h-[33px] w-auto lg:h-16" />
            </Link>
            {/* "4th Floor", not 3rd. This file was the only place in the
                codebase saying 3rd — `lib/data/offices.ts`,
                `components/shared/LegalPage.tsx` and both Figma footer nodes
                all say 4th. Corrected here rather than propagated.

                One paragraph that wraps, rather than two `whitespace-nowrap`
                lines: the mock sets three lines in 232px on mobile and two in
                ~330px on desktop, which the two max-widths produce on their
                own. `#c0c0c0` below `lg` per the mobile node; white from `lg`. */}
            <p className="max-w-[232px] text-[13px] font-light leading-[1.25] tracking-[0.26px] text-[#c0c0c0] lg:max-w-[340px] lg:text-[14px] lg:font-normal lg:leading-[1.3] lg:tracking-[0.28px] lg:text-white">
              4th Floor, 1202, HAL 2nd Stage, Domlur, 100 Feet Road, Indiranagar,
              Bengaluru, Karnataka – 560008
            </p>
            {/* Stacked on mobile, one line with a `|` from `lg` — the mobile
                node has no separator and puts them on their own rows. */}
            <div className="flex flex-col gap-1 text-[13px] font-normal tracking-[0.26px] text-white lg:flex-row lg:items-center lg:gap-2 lg:text-[14px] lg:tracking-[0.28px]">
              <a href="mailto:hello@poddarpipes.com" className={hoverLink}>
                hello@poddarpipes.com
              </a>
              <span className="hidden lg:inline">|</span>
              <a href="tel:+919888822333" className={hoverLink}>
                +91 98888 22333
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
                <ul className="flex flex-col gap-2 pb-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-[13px] font-normal tracking-[0.52px] text-[#c0c0c0] ${hoverLink} ${group.uppercase ? "uppercase" : ""}`}
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
              both at 10px. From `sm` it is the existing 12px row. */}
          <div className="flex items-start justify-between gap-4 text-[10px] font-light sm:items-center sm:text-[12px]">
            <p className="max-w-[182px] leading-[1.35] sm:max-w-none">
              © {new Date().getFullYear()} Poddar Plumbing System Pvt. Ltd. {t("rightsReserved")}
            </p>
            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-[53px]">
              <Link href="/privacy-policy" className={hoverLink}>
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms-of-service" className={hoverLink}>
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}