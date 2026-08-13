import { useTranslations } from "next-intl";
import { Linkedin, X, Youtube, Facebook, Instagram } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";

/**
 * Footer redesign (Figma "Poddar Pipes - Footer Ideation 1", node 1:26).
 * Color system — one accent, one secondary gray, kept small on purpose:
 *
 *   text-white       -> primary text (logo wordmark, nav headings, "Let's Talk")
 *   text-[#c0c0c0]   -> secondary text (address, nav links, legal line, placeholders)
 *   text-slate-600   -> disabled / "coming soon" placeholders only
 *   amber-600        -> the single brand accent (logo mark, send button)
 *   flow-300         -> link hover state (matches the rest of the site's dark-surface links)
 *   border-white/10  -> the single divider above the legal row
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
  const navLink = "text-sm text-[#c0c0c0] uppercase transition-colors hover:text-flow-300";

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
                <a href="mailto:poddarpipes@gmail.com" className="font-bold text-white transition-colors hover:text-flow-300">
                  poddarpipes@gmail.com
                </a>
                <a href="tel:+919888822333" className="transition-colors hover:text-flow-300">
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
                      <Link href={link.href} className="text-sm text-[#c0c0c0] transition-colors hover:text-flow-300">
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
              {/* No Privacy Policy / Terms pages exist yet — legal copy needs
                  to come from the business/legal team, not be fabricated here.
                  Rendered as non-interactive placeholders until those pages
                  exist and can be linked for real. */}
              <span aria-hidden="true" title="Coming soon" className="cursor-not-allowed text-slate-600">
                {t("privacyPolicy")}
              </span>
              <span aria-hidden="true" title="Coming soon" className="cursor-not-allowed text-slate-600">
                {t("termsOfService")}
              </span>
            </div>

            <div className="flex items-center gap-5">
              {/* Social profiles aren't live yet — rendered as non-interactive
                  placeholders (no href, excluded from tab order) rather than
                  dead "#" links, until real URLs are wired in. lucide's plain
                  `X` glyph stands in for the X/Twitter mark — there's no
                  separate brand asset to reproduce, and a bare X is exactly
                  what that logo is. */}
              {[Linkedin, X, Youtube, Facebook, Instagram].map((Icon, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  title="Coming soon"
                  className="flex cursor-not-allowed items-center justify-center text-slate-600"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              ))}
            </div>
           </div>
        </div>
      </div>
    </footer>
  );
}