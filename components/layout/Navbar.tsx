"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { setScrollLocked } from "@/hooks/useLenis";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
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

  // Mobile menu: lock the page behind it (Lenis + native) and close on
  // Escape. Without the lock the page kept scrolling under the open menu.
  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    // Lenis is off under reduced motion, so lock the native scroller too.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      setScrollLocked(false);
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Every menu link closes the menu itself. Route changes already did, but
  // `usePathname` ignores the query string — tapping a category while on
  // /products (`/products?category=…`) left the menu open over the page.
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!activeMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    // Touch (landscape iPad gets this desktop bar): a tap outside the header
    // closes the dropdown — there is no mouseleave to do it.
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.("header")) setActiveMenu(null);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
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
        <Link href="/" aria-label="Poddar Pipes — home" className="flex shrink-0 items-center gap-2.5 py-1">
          {/* 36px renders the same artwork size the old `h-16` did: that 64px
              was 55.2% logo and 44.8% margin baked into the asset's viewBox.
              The asset is cropped to its ink now, so this also pulls the mark
              flush with the nav's left gutter. */}
          <img src="/logo.svg" alt="Poddar Pipes" className="h-9 w-auto" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            // A label-only item (no href) is "active" when the current page
            // is one of its dropdown links.
            const active = item.href
              ? pathname === item.href
              : !!item.megaMenu?.some((c) => c.links.some((l) => l.href === pathname));
            const triggerClass = cn(
              // `h-11`: 44px targets — iPads in landscape get this desktop bar
              // with touch, and the links were 29px tall.
              "flex h-11 items-center gap-1 rounded-full px-4 font-display text-sm font-medium uppercase tracking-tight transition-colors",
              "text-slate-700 hover:text-ocean-700",
              active && "font-semibold text-ocean-700"
            );
            const triggerContent = (
              <>
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
              </>
            );
            return (
              // NOT `relative`: the panel below positions against the fixed
              // <header>, so it can span the full bar while living HERE in the
              // DOM — right after its trigger. It used to render after the
              // whole nav row, so Tab went Products → Resources and keyboard
              // users could never reach the submenu links.
              <div
                key={item.key}
                onMouseEnter={() => setActiveMenu(item.megaMenu ? item.key : null)}
                onFocus={() => setActiveMenu(item.megaMenu ? item.key : null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-expanded={item.megaMenu ? activeMenu === item.key : undefined}
                    aria-controls={item.megaMenu ? `mega-${item.key}` : undefined}
                    className={triggerClass}
                  >
                    {triggerContent}
                  </Link>
                ) : (
                  // Label-only: a button that toggles the dropdown (hover and
                  // focus still open it, as for the other items); a click is
                  // how touch users on a landscape iPad get in.
                  <button
                    type="button"
                    aria-expanded={activeMenu === item.key}
                    aria-controls={`mega-${item.key}`}
                    // Opens, never toggles: on touch a tap fires mouseenter
                    // (which opens it) and THEN click — a toggle shut it again
                    // instantly. Closing is Escape, leaving the header, or a
                    // tap outside it (see the effect above).
                    onClick={() => setActiveMenu(item.key)}
                    className={triggerClass}
                  >
                    {triggerContent}
                  </button>
                )}
                <AnimatePresence>
                  {item.megaMenu && activeMenu === item.key && (
                    <motion.div
                      id={`mega-${item.key}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-x-0 top-full border-t border-slate-200/60 bg-paper shadow-lg"
                    >
                      <div className="container-edge grid grid-cols-3 gap-8 py-8">
                        {item.megaMenu.map((col) => (
                          <div key={col.heading}>
                            {/* A label, not a heading: an h4 here came before the page's h1. */}
                            <p className="font-mono text-xs uppercase tracking-[0.15em] text-slate-500">
                              {t(col.heading as never)}
                            </p>
                            <ul className="mt-4 flex flex-col gap-2.5">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setActiveMenu(null)}
                                    className={cn(
                                      "text-sm uppercase text-slate-700 transition-colors hover:text-ocean-700",
                                      keepCase(link.label) && "normal-case"
                                    )}
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
              </div>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher dark={false} />
          <Button asChild variant="primary" size="sm">
            <EnquiryLink>
              <span className="uppercase leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("requestQuote")}
              </span>
              {/* <ArrowUpRight className="h-4 w-4" /> */}
            </EnquiryLink>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher dark={false} />
          <button
            onClick={() => setOpen((v) => !v)}
            // 44px: the minimum comfortable tap target (was 40).
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-900"
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-menu-toggle
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>


      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          // Covers the whole screen under the bar (it used to stop at its own
          // height with the page showing, un-dimmed, beneath it) and scrolls
          // on its own — `data-lenis-prevent` hands the wheel/touch back to
          // the browser inside it.
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            data-lenis-prevent
            className="h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain border-t border-slate-200/60 bg-paper lg:hidden"
          >
            <div className="container-edge flex flex-col gap-1 py-6 pb-10">
              {navItems.map((item) => (
                <div key={item.key}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="block rounded-lg px-3 py-3 text-base font-medium uppercase text-slate-800 hover:bg-slate-100 aria-[current=page]:text-ocean-700"
                    >
                      {t(item.key as never)}
                    </Link>
                  ) : (
                    // Label-only group: a heading for its links, not a tap target.
                    <p className="px-3 py-3 text-base font-medium uppercase text-slate-800">
                      {t(item.key as never)}
                    </p>
                  )}
                  {item.megaMenu && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-slate-200 pl-4">
                      {item.megaMenu.flatMap((col) => col.links).map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={closeMenu}
                          aria-current={pathname === link.href ? "page" : undefined}
                          className={cn(
                            "rounded-lg px-3 py-3 text-sm uppercase text-slate-600 hover:bg-slate-100 aria-[current=page]:text-ocean-700",
                            keepCase(link.label) && "normal-case"
                          )}
                        >
                          {t(link.label as never)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="mt-3" size="sm">
                {/* Closes the menu itself: the pop-up does not change the
                    route, which is what normally shuts it. */}
                <EnquiryLink onClick={() => setOpen(false)}>
                  <span className="uppercase leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    {t("requestQuote")}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </EnquiryLink>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Labels whose spelling the `uppercase` transform would get wrong — "uPVC" is
 * the brand's own lowercase-u spelling, and the menu was showing "UPVC".
 */
function keepCase(label: string) {
  return label === "navUpvc";
}
