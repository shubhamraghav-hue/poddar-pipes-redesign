import { useTranslations } from "next-intl";
import { Linkedin, Twitter, Youtube, Facebook } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

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

  return (
    <footer className="relative overflow-hidden border-t-2 border-flow-500/30 bg-ink text-slate-300">
      <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-edge relative py-16">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-lg font-medium text-white">{t("newsletterTitle")}</h3>
            <p className="mt-1.5 max-w-md text-sm text-slate-400">{t("newsletterDescription")}</p>
          </div>
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-2 gap-10 pt-12 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Poddar Pipes" className="h-9 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{t("tagline")}</p>
            <div className="mt-6 flex gap-3">
              {/* Social profiles aren't live yet — rendered as non-interactive
                  placeholders (no href, excluded from tab order) rather than
                  dead "#" links, until real URLs are wired in. */}
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  title="Coming soon"
                  className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-white/10 text-slate-600"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <div className="mt-6">
              <LanguageSwitcher dark />
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("company")}
            </h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-flow-300">
                    {tNav(link.key as never)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("productsHeading")}
            </h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-flow-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("resourcesHeading")}
            </h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-flow-300">
                    {tNav(link.key as never)}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("headOffice")}
            </h4>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-slate-400">
              <li>4th Floor, 1202, HAL 2nd Stage, Domlur</li>
              <li>100 Feet Road, Indiranagar, Bengaluru, Karnataka — 560008</li>
              <li>poddarpipes@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Poddar Pipes Pvt. Ltd. (CIN: 29AAECO2313F1ZQ). {t("rightsReserved")}</p>
          <div className="flex gap-6">
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
        </div>
      </div>
    </footer>
  );
}
