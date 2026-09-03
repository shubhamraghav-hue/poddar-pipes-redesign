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

  const navHeading = "text-[14px] font-bold uppercase tracking-[0.56px] text-white";
  const hoverLink = "opacity-70 transition hover:opacity-100";
  const navLink = `text-[14px] font-normal uppercase tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;
  const productLink = `text-[14px] font-normal tracking-[0.56px] text-[#c0c0c0] ${hoverLink}`;

  return (
    <footer className="relative overflow-hidden bg-[#0b0b52] text-[#c0c0c0]">
      <div className="container-edge relative flex flex-col gap-12 py-16 md:py-20">
        {/* Newsletter — centered on mobile, side-by-side row from lg up */}
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left">
          <div className="flex flex-col gap-2 lg:max-w-md">
            <h3 className="text-[18px] font-normal uppercase tracking-[0.36px] text-white">
              {t("newsletterTitle")}
            </h3>

            <p className="max-w-[380px] text-sm font-light leading-[1.5] tracking-[0.14px] text-[#86868c]">
              {t("newsletterDescription")}
            </p>
          </div>

          <NewsletterSignup />
        </div>

        <div className="-mx-2 border-t border-white/10 sm:-mx-4 md:-mx-6 xl:-mx-11" />

        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
          {/* Logo + registered address (social icons join here from lg up) */}
          <div className="flex max-w-xs flex-col gap-6">
            <Link href="/" className="flex items-center justify-center gap-2.5 lg:justify-start">
              <img src="/logo.svg" alt="Poddar Pipes" className="h-16 w-auto" />
            </Link>
            <div className="flex flex-col text-[14px] font-normal leading-[1.3] tracking-[0.28px] text-white">
              <p className="whitespace-nowrap">
                3rd Floor, 1202, HAL 2nd Stage, Domlur, 100 Feet Road,
              </p>
              <p className="whitespace-nowrap">
                Indiranagar, Bengaluru, Karnataka – 560008
              </p>
            </div>
            <div className="flex flex-row items-center gap-2 text-[14px] font-normal tracking-[0.28px] text-white">
              <a href="mailto:hello@poddarpipes.com" className={hoverLink}>
                hello@poddarpipes.com
              </a>
              <span>|</span>
              <a href="tel:+919888822333" className={hoverLink}>
                +91 98888 22333
              </a>
            </div>
            <div className="hidden lg:block">
              <SocialIcons />
            </div>
          </div>

          {/* Nav link groups */}
          <div className="flex gap-8 sm:gap-16">
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
          <div className="lg:hidden">
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
          <div className="flex flex-col items-center gap-4 text-center text-[12px] font-light sm:flex-row sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} Poddar Plumbing System Pvt. Ltd. {t("rightsReserved")}
            </p>
            <div className="flex items-center gap-[53px]">
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