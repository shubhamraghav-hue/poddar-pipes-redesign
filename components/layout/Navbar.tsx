"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/data/nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!activeMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMenu]);

  const solid = scrolled || open || activeMenu !== null;

  return (
    <header
      onMouseLeave={() => setActiveMenu(null)}
      onBlur={(e) => {
        // Close only when focus leaves the header entirely — keeps the panel
        // open while a keyboard user tabs from the trigger link into its
        // mega-menu links, rather than closing on the very next Tab press.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setActiveMenu(null);
        }
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "bg-paper/95 shadow-sm backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <nav className="container-edge flex h-20 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/logo.svg" alt="Poddar Pipes" className="h-16 w-auto" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.megaMenu ? item.key : null)}
                onFocus={() => setActiveMenu(item.megaMenu ? item.key : null)}
              >
                <Link
                  href={item.href}
                  aria-haspopup={item.megaMenu ? "true" : undefined}
                  aria-expanded={item.megaMenu ? activeMenu === item.key : undefined}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2.5 font-display text-sm font-medium tracking-tight transition-colors",
                    solid ? "text-slate-700 hover:text-ocean-700" : "text-white/85 hover:text-white",
                    active && (solid ? "text-ocean-700" : "text-white")
                  )}
                >
                  {t(item.key as never)}
                  {item.megaMenu && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        activeMenu === item.key && "rotate-180"
                      )}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher dark={!solid} />
          <Button
            asChild
            variant={solid ? "primary" : "outline-light"}
            size="sm"
            className="relative min-w-[11rem]"
          >
            <Link href="/contact">
              {t("requestQuote")}
              <ArrowUpRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher dark={!solid} />
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              solid ? "text-slate-900" : "text-white"
            )}
            aria-label={open ? t("close") : t("menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Desktop mega-menu panel */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full hidden border-t border-slate-200/60 bg-paper shadow-lg lg:block"
          >
            <div className="container-edge grid grid-cols-3 gap-8 py-8">
              {navItems
                .find((n) => n.key === activeMenu)
                ?.megaMenu?.map((col) => (
                  <div key={col.heading}>
                    <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-slate-500">
                      {col.heading}
                    </h4>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-slate-700 transition-colors hover:text-ocean-700"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-200/60 bg-paper lg:hidden"
          >
            <div className="container-edge flex max-h-[75vh] flex-col gap-1 overflow-y-auto py-6">
              {navItems.map((item) => (
                <div key={item.key}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-100"
                  >
                    {t(item.key as never)}
                  </Link>
                  {item.megaMenu && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-slate-200 pl-4">
                      {item.megaMenu.flatMap((col) => col.links).map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="relative mt-3" size="sm">
                <Link href="/contact">
                  {t("requestQuote")}
                  <ArrowUpRight className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
