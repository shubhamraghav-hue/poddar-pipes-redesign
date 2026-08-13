import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { SocialIcons } from "@/components/shared/SocialIcons";

/**
 * Footer redesign (Figma "Poddar Pipes - Footer Ideation 1", node 1:26).
 * Color system — one accent, one secondary gray, kept small on purpose:
 *
 *   text-white       -> primary text (logo wordmark, nav headings, "Let's Talk")
 *   text-[#c0c0c0]   -> secondary text (address, nav links, legal line, placeholders)
 *   amber-600        -> the single brand accent (logo mark, send button)
 *   border-white/10  -> the single divider above the legal row
 *
 * Hover mechanic — ported from the poddarpipes.com "coming soon" site's dark
 * footer (D:\Projects\poddar-pipes-launching-soon\components\Footer.tsx /
 * SocialIcons.tsx): every interactive text/icon rests at opacity-70 and goes
 * to opacity-100 on hover, rather than this site's usual color-shift-to-flow
 * hover — applied uniformly across nav links, contact links, legal links,
 * and social icons so the whole footer reads as one consistent interaction.
 *
 * Note: the design mock spells the legal entity "Poddar Plumbing Systems" —
 * kept as "Poddar Plumbing System" (singular) here since that's the name
 * verified against the company's own press coverage (MB Patil's announcement,
 * Deccan Herald, First Construction Council, etc.), not a deviation.
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
    { label: "UGD", href: "/products/category/ugd-pipes" },
    { label: "Agriculture", href: "/products/category/agricultural-pipes" },
  ];

  const resourceLinks = [
    { key: "resources", href: "/resources" },
    { key: "contact", href: "/contact" },
  ];

  const navHeading = "text-sm font-bold uppercase tracking-wide text-white";
  const hoverLink = "opacity-70 transition hover:opacity-100";
  const navLink = `text-sm text-[#c0c0c0] uppercase ${hoverLink}`;

  return (
    <footer className="relative overflow-hidden bg-ink text-[#c0c0c0]">
      <div className="bg-blue absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-edge relative flex flex-col gap-14 py-16 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Logo + registered address + nav link groups */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div className="flex max-w-xs flex-col gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="Poddar Pipes" className="h-12 w-auto" />
              </Link>
              <div className="flex flex-col gap-1.5 text-sm leading-relaxed">
                <p>4th Floor, 1202, HAL 2nd Stage, Domlur,</p>
                <p>100 Feet Road, Indiranagar, Bengaluru, Karnataka – 560008</p>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <a href="mailto:poddarpipes@gmail.com" className={`font-bold text-white ${hoverLink}`}>
                  poddarpipes@gmail.com
                </a>
                <a href="tel:+919888822333" className={hoverLink}>
                  +91 98888 22333
                </a>
              </div>
            </div>

            <div className="flex gap-12 sm:gap-16">
              <div className="flex flex-col gap-8">
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

              <div className="flex flex-col gap-4">
                <h4 className={navHeading}>{t("productsHeading")}</h4>
                <ul className="flex flex-col gap-2">
                  {productLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={`text-sm text-[#c0c0c0] ${hoverLink}`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter — "Let's Talk" */}
          <div className="flex flex-col gap-6 lg:w-[380px] lg:shrink-0">
            <p className="text-sm uppercase text-white">{t("newsletterTitle")}</p>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-4xl font-bold leading-none text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                {t("ctaHeading")}
              </h3>
              <NewsletterSignup />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center gap-4 text-sm sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center sm:justify-start sm:text-left">
              <p>© {new Date().getFullYear()} Poddar Plumbing System Pvt. Ltd. {t("rightsReserved")}</p>
              <Link href="/privacy-policy" className={hoverLink}>
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms-of-service" className={hoverLink}>
                {t("termsOfService")}
              </Link>
            </div>

            <SocialIcons />
           </div>
        </div>
      </div>
    </footer>
  );
}