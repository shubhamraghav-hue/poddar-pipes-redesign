"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Handshake } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { scrollToTop, setScrollLocked } from "@/hooks/useLenis";
import { PartnerLink } from "@/components/enquiry/EnquiryProvider";
import { navItems } from "@/lib/data/nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { rangeLinkProps } from "@/lib/productFocus";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // After a page change, hand focus from the link that was clicked to the new
  // page (`<main id="main" tabIndex={-1}>` in the locale layout). The navbar
  // and footer never unmount, so the clicked link otherwise KEPT focus, and
  // Chrome drew the orange keyboard ring on it the moment any key was pressed
  // (scrolling with Space/arrows) — "sometimes" a ring on CONTACT. Moving
  // focus also starts screen readers and Tab on the new page's content.
  // Only when focus sits outside <main> (nav, footer, menu); query-only
  // changes (/products?category=…) keep the pathname and are left alone.
  const seenPath = useRef(pathname);
  useEffect(() => {
    if (pathname === seenPath.current) return;
    seenPath.current = pathname;
    const main = document.getElementById("main");
    const active = document.activeElement;
    if (main && active && active !== document.body && !main.contains(active)) {
      main.focus({ preventScroll: true });
    }
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

  // Clicking the page you are already on takes you back to its top (client
  // deck 2026-10-22, slide 2207:15135). Next does nothing for a same-URL link.
  const topIfCurrent = (href: string) => () => {
    if (pathname === href) scrollToTop();
  };

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
      // Figma "header products hover" (1979:33062): #fbfbfb, 0 4 8 12% shadow.
      className="fixed inset-x-0 top-0 z-50 bg-[#fbfbfb] shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]"
    >
      <nav className="container-edge flex h-20 items-center justify-between">
        <Link href="/" onClick={topIfCurrent("/")} aria-label={tCommon("homeLinkLabel")} className="flex shrink-0 items-center gap-2.5 py-1">
          {/* 36px renders the same artwork size the old `h-16` did: that 64px
              was 55.2% logo and 44.8% margin baked into the asset's viewBox.
              The asset is cropped to its ink now, so this also pulls the mark
              flush with the nav's left gutter. */}
          <img src="/logo.svg" alt="Poddar Pipes" className="h-9 w-auto" />
        </Link>

        {/* Figma 1979:32592: labels 35px apart with no padding, HOME at x411
            (168px after the logo) at 1512. */}
        <div className="hidden items-center gap-1 lg:flex xl:ml-[168px] xl:mr-auto xl:gap-[35px]">
          {navItems.map((item) => {
            // A label-only item (no href) is "active" when the current page
            // is one of its dropdown links.
            // A range URL (/products/<id>) keeps "Products" selected.
            const active = item.href
              ? pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
              : !!item.megaMenu?.some((c) => c.links.some((l) => l.href.split("#")[0] === pathname));
            const triggerClass = cn(
              // `h-11`: 44px targets — iPads in landscape get this desktop bar
              // with touch, and the links were 29px tall.
              // `whitespace-nowrap` + tighter padding below `xl`: at 1024 the
              // two-word labels ("About Us", "News & Media") wrapped onto two
              // lines.
              // Figma 1979:33062: 16px Medium #4a4a4a; the CURRENT page's item
              // Bold #171796 (client: "keep the selected items bold"). px-1.5 below
              // xl: at 16px the row otherwise ran into the language button at 1024.
              "flex h-11 items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 font-display text-[16px] uppercase transition-colors xl:px-0",
              active ? "font-bold text-[#171796]" : "font-medium text-[#4a4a4a] hover:text-[#171796]"
            );
            const triggerContent = (
              <>
                <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {t(item.key as never)}
                </span>
                {item.megaMenu && (
                  <ChevronDown
                    className={cn(
                      "size-[15px] transition-transform",
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
                    onClick={topIfCurrent(item.href)}
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
                      // Figma 1979:33062: a white panel under the bar; three
                      // columns across a centred 1012px block (x250-1262 at
                      // 1512), spread edge to edge — titles at y114, links
                      // from y158 on a 32px pitch (16px apart), 44px of panel below them.
                      className="absolute inset-x-0 top-full bg-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.12)]"
                    >
                      {/* The bar's own 0 4 8 shadow falling onto the panel, as
                          in the mock (the panel would otherwise paint over it). */}
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/[0.08] to-transparent" />
                      <div className="mx-auto flex w-full max-w-[1060px] justify-between px-6 pb-[44px] pt-[34px]">
                        {item.megaMenu.map((col) => (
                          <div key={col.heading}>
                            {/* A label, not a heading: an h4 here came before the page's h1. */}
                            <p className="font-display text-[16px] uppercase leading-[1.2] text-[#a4a4a4]">
                              {t(col.heading as never)}
                            </p>
                            <ul className="mt-[25px] flex flex-col gap-4">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    {...rangeLinkProps(link.href, () => setActiveMenu(null))}
                                    className={cn(
                                      "block font-display text-[16px] font-medium uppercase leading-none text-[#4a4a4a] transition-colors hover:text-[#171796]",
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

        <div className="hidden items-center gap-[10px] lg:flex">
          <LanguageSwitcher dark={false} />
          {/* "Become a Partner" — Figma 1979:32592 "header button 4": #171796
              pill, 164 wide, 21px handshake, 14px Medium #fbfbfb in sentence
              case. Opens the dealers & distributors form. */}
          <Button
            asChild
            size="sm"
            className="group h-[38px] w-[164px] gap-0.5 bg-[#171796] px-[17px] text-[14px] font-normal text-[#fbfbfb] shadow-none duration-[120ms] ease-out hover:bg-[#121278] hover:text-[#fbfbfb] hover:shadow-none"
          >
            <PartnerLink>
              <Handshake aria-hidden="true" strokeWidth={1.5} className="size-[21px] transition-transform duration-200 ease-out group-hover:-rotate-12" />
              <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                {t("becomePartner")}
              </span>
            </PartnerLink>
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
                      onClick={() => {
                        closeMenu();
                        topIfCurrent(item.href!)();
                      }}
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
                          {...rangeLinkProps(link.href, closeMenu)}
                          aria-current={pathname === link.href.split("#")[0] ? "page" : undefined}
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
              <Button asChild size="sm" className="mt-3 gap-1 bg-[#171796] text-[14px] font-normal text-[#fbfbfb] duration-[120ms] ease-out hover:bg-[#121278] hover:text-[#fbfbfb]">
                {/* Closes the menu itself: the pop-up does not change the
                    route, which is what normally shuts it. */}
                <PartnerLink onClick={() => setOpen(false)}>
                  <Handshake aria-hidden="true" strokeWidth={1.5} className="size-[21px]" />
                  <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    {t("becomePartner")}
                  </span>
                </PartnerLink>
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
