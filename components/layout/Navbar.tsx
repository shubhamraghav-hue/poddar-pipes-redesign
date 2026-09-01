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
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations("nav");

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
      // Figma's header (node 13:528) is a static solid-white bar on every
      // page — no transparent-over-hero state that turns solid on scroll.
      className="fixed inset-x-0 top-0 z-50 bg-paper/95 shadow-sm backdrop-blur-lg"
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
                    "flex items-center gap-1 rounded-full px-4 py-2.5 font-display text-sm font-medium uppercase tracking-tight transition-colors",
                    "text-slate-700 hover:text-ocean-700",
                    active && "font-semibold text-ocean-700"
                  )}
                >
                  <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    {t(item.key as never)}
                  </span>
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
          <LanguageSwitcher dark={false} />
          <Button asChild variant="primary" size="sm">
            <Link href="/contact">
              <span className="uppercase leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("requestQuote")}
              </span>
              {/* <ArrowUpRight className="h-4 w-4" /> */}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher dark={false} />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900"
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
                      {t(col.heading as never)}
                    </h4>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm uppercase text-slate-700 transition-colors hover:text-ocean-700"
                          >
                            {t(link.label as never)}
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
                    className="block rounded-lg px-3 py-3 text-base font-medium uppercase text-slate-800 hover:bg-slate-100"
                  >
                    {t(item.key as never)}
                  </Link>
                  {item.megaMenu && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-slate-200 pl-4">
                      {item.megaMenu.flatMap((col) => col.links).map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="rounded-lg px-3 py-2 text-sm uppercase text-slate-600 hover:bg-slate-100"
                        >
                          {t(link.label as never)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="mt-3" size="sm">
                <Link href="/contact">
                  <span className="uppercase leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    {t("requestQuote")}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
