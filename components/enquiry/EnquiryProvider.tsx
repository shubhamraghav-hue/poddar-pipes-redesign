"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { setScrollLocked } from "@/hooks/useLenis";
import { EnquiryForm, PartnerForm, type EnquiryPreset } from "@/components/enquiry/EnquiryForm";
import { downloads } from "@/lib/data/blog";

/**
 * The global enquiry pop-up (Figma node 1605:11496).
 *
 * ONE dialog for the whole site, mounted once in the locale layout. Any CTA
 * opens it through `EnquiryLink` (or `useEnquiry().open()`), optionally with a
 * preset — a product name, an estimate — so there is exactly one form, one
 * submit path and one set of a11y wiring rather than a modal per page.
 */

type EnquiryContextValue = {
  open: (preset?: EnquiryPreset) => void;
  /** The "Become a Partner" form — see `PartnerLink`. */
  openPartner: (preset?: EnquiryPreset) => void;
  /** The catalogue picker — see `CatalogueLink`. */
  openCatalogues: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

/** Null outside the provider — `EnquiryLink` then falls back to its href. */
export function useEnquiry() {
  return useContext(EnquiryContext);
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Which form the pop-up shows: the contact form, or "Become a Partner".
  const [mode, setMode] = useState<"enquiry" | "partner">("enquiry");
  const [preset, setPreset] = useState<EnquiryPreset | undefined>();
  // Bumped per open so the form remounts: a fresh preset, cleared fields, and
  // no success screen left over from the last enquiry.
  const [session, setSession] = useState(0);
  // Whatever opened the dialog, to hand focus back on close. Radix only does
  // that for a `Dialog.Trigger`, and these CTAs are plain links all over the
  // page — without this, focus fell to <body> and keyboard users lost their
  // place.
  const returnFocus = useRef<HTMLElement | null>(null);

  const [cataloguesOpen, setCataloguesOpen] = useState(false);
  const openCatalogues = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setCataloguesOpen(true);
  }, []);

  const open = useCallback((p?: EnquiryPreset) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setMode("enquiry");
    setPreset(p);
    setSession((n) => n + 1);
    setIsOpen(true);
  }, []);

  const openPartner = useCallback((p?: EnquiryPreset) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setMode("partner");
    setPreset(p);
    setSession((n) => n + 1);
    setIsOpen(true);
  }, []);

  // Radix locks `body` scroll; Lenis drives the page from wheel events itself,
  // so it has to be stopped too or the page scrolls behind the dialog.
  useEffect(() => {
    setScrollLocked(isOpen || cataloguesOpen);
    return () => setScrollLocked(false);
  }, [isOpen, cataloguesOpen]);

  const value = useMemo(() => ({ open, openPartner, openCatalogues }), [open, openPartner, openCatalogues]);

  const restoreFocus = (e: Event) => {
    e.preventDefault();
    const target = returnFocus.current?.isConnected
      ? returnFocus.current
      : document.querySelector<HTMLElement>("[data-menu-toggle]");
    target?.focus({ preventScroll: true });
  };

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[60] bg-[#0b0b52]/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </DialogPrimitive.Overlay>
              {/* Centring wrapper, not the panel: the panel animates `scale`
                  and `y`, and a translate-based centre would fight that. */}
              <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4">
                <DialogPrimitive.Content
                  asChild
                  forceMount
                  {...(mode === "enquiry" ? { "aria-describedby": undefined } : {})}
                  // The opener can be gone by now — a link in the mobile menu,
                  // which closes as the pop-up opens; `restoreFocus` falls back
                  // to the menu button rather than dropping focus on <body>.
                  onCloseAutoFocus={restoreFocus}
                >
                  <motion.div
                    // Panel per node 1605:11496: 621 wide, `#fbfbfb`, 1px
                    // `#c0c0c0`, radius 20, 35px side pads, 80 above the first
                    // row (the close button lives in that band), 41 below.
                    //
                    // `data-lenis-prevent`: Lenis is stopped while this is
                    // open; this lets wheel and touch scroll the panel itself
                    // natively when the form is taller than the screen.
                    data-lenis-prevent
                    className="pointer-events-auto relative max-h-[calc(100dvh-32px)] w-full max-w-[621px] overflow-y-auto overscroll-contain rounded-[20px] border border-[#c0c0c0] bg-[#fbfbfb] px-5 pb-8 pt-16 shadow-[0_24px_64px_-16px_rgba(11,11,82,0.45)] focus:outline-none sm:px-[35px] sm:pb-[41px] sm:pt-20"
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 6 }}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                  >
                    {/* The mock has no visible heading; the dialog still needs
                        an accessible name. */}
                    {mode === "enquiry" ? (
                      <DialogPrimitive.Title className="sr-only">Send us an enquiry</DialogPrimitive.Title>
                    ) : (
                      // Accessible name for the partner pop-up; the visible
                      // title + intro are rendered by PartnerForm (`intro`) so
                      // they give way to the success screen after submit.
                      <DialogPrimitive.Title className="sr-only">Become a Poddar Partner</DialogPrimitive.Title>
                    )}

                    {/* Node 1606:11709: the 32px "add" glyph turned 45° in a
                        45px hit area, 9px in from the top-right corner. */}
                    <DialogPrimitive.Close
                      aria-label="Close"
                      className="absolute right-[9px] top-[9px] flex size-[45px] items-center justify-center rounded-full text-[#4a4a4a] transition-[background-color,color,rotate] duration-200 ease-out hover:rotate-90 hover:bg-black/5 hover:text-[#f28000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171796]/40"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="rotate-45">
                        <path
                          d="M16.0019 6.99958V15.9996M16.0019 15.9996V24.9996M16.0019 15.9996H25.0019M16.0019 15.9996H7.00188"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </DialogPrimitive.Close>

                    {mode === "enquiry" ? (
                      <EnquiryForm
                        key={session}
                        variant="dialog"
                        preset={preset}
                        onDone={() => setIsOpen(false)}
                      />
                    ) : (
                      <PartnerForm
                        key={session}
                        preset={preset}
                        onDone={() => setIsOpen(false)}
                        intro={
                          <div className="mb-10">
                            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#f28000]">
                              Dealers &amp; Distributors
                            </p>
                            <p
                              aria-hidden="true"
                              className="mt-3 font-display text-[28px] uppercase leading-[1.08] text-[#4a4a4a] md:text-[36px]"
                            >
                              <span className="block font-light">Become a</span>
                              <span className="block font-bold">Poddar Partner</span>
                            </p>
                            <DialogPrimitive.Description className="mt-4 text-[14px] leading-[1.5] text-[#606060] md:text-[15px]">
                              Interested in partnering with us? We are always looking to expand our
                              distribution network with reliable business partners. Please complete
                              the form below, and our business development team will get back to you
                              shortly.
                            </DialogPrimitive.Description>
                          </div>
                        }
                      />
                    )}
                  </motion.div>
                </DialogPrimitive.Content>
              </div>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>

      {/* Catalogue picker. /resources used to be the only place listing all
          the catalogue PDFs; it was removed (client decision 2026-10-08), so
          every "Download Catalogue" CTA opens this instead and the download
          starts from wherever the visitor is. Same shell as the enquiry
          pop-up, so both feel like one system. */}
      <DialogPrimitive.Root open={cataloguesOpen} onOpenChange={setCataloguesOpen}>
        <AnimatePresence>
          {cataloguesOpen && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[60] bg-[#0b0b52]/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </DialogPrimitive.Overlay>
              <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4">
                <DialogPrimitive.Content asChild forceMount onCloseAutoFocus={restoreFocus}>
                  <motion.div
                    data-lenis-prevent
                    className="pointer-events-auto relative max-h-[calc(100dvh-32px)] w-full max-w-[621px] overflow-y-auto overscroll-contain rounded-[20px] border border-[#c0c0c0] bg-[#fbfbfb] px-5 pb-8 pt-16 shadow-[0_24px_64px_-16px_rgba(11,11,82,0.45)] focus:outline-none sm:px-[35px] sm:pb-[41px] sm:pt-20"
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 6 }}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                  >
                    <DialogPrimitive.Close
                      aria-label="Close"
                      className="absolute right-[9px] top-[9px] flex size-[45px] items-center justify-center rounded-full text-[#4a4a4a] transition-[background-color,color,rotate] duration-200 ease-out hover:rotate-90 hover:bg-black/5 hover:text-[#f28000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171796]/40"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="rotate-45">
                        <path
                          d="M16.0019 6.99958V15.9996M16.0019 15.9996V24.9996M16.0019 15.9996H25.0019M16.0019 15.9996H7.00188"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </DialogPrimitive.Close>

                    <DialogPrimitive.Title className="font-display text-[28px] uppercase leading-[1.08] text-[#4a4a4a] md:text-[36px]">
                      <span className="block font-light">Product</span>
                      <span className="block font-bold">Catalogues</span>
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-4 text-[14px] leading-[1.5] text-[#606060] md:text-[15px]">
                      Pick a range to download its catalogue (PDF).
                    </DialogPrimitive.Description>

                    <ul className="mt-8 divide-y divide-[#c0c0c0] overflow-hidden rounded-[20px] border border-[#c0c0c0] bg-white">
                      {downloads.map((d) => (
                        <li key={d.id}>
                          <a
                            href={d.fileUrl}
                            download
                            className="group flex min-h-[64px] items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-[#171796]/5"
                          >
                            <span className="min-w-0">
                              <span className="block text-[16px] font-medium leading-[1.3] text-[#4a4a4a]">{d.title}</span>
                              <span className="mt-1 block text-[13px] leading-none text-[#606060]">
                                {d.fileType} · {d.fileSize}
                              </span>
                            </span>
                            <span
                              aria-hidden="true"
                              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#171796]/10 text-[#171796] transition-colors group-hover:bg-[#171796] group-hover:text-white"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <g stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 10V12.6667C14 13.4026 13.4026 14 12.6667 14H3.33333C2.59745 14 2 13.4026 2 12.6667V10" />
                                  <path d="M4.66667 6.66667L8 10L11.3333 6.66667" />
                                  <path d="M8 10V2" />
                                </g>
                              </svg>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </DialogPrimitive.Content>
              </div>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </EnquiryContext.Provider>
  );
}

/**
 * A "Download Catalogue" CTA: opens the catalogue picker. Like `EnquiryLink`
 * it is a real link underneath — without JS, outside the provider, or on a
 * modified click it goes to /products, where every product page offers its
 * own catalogue. Works under `Button asChild`.
 */
export const CatalogueLink = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof Link>, "href">
>(function CatalogueLink({ onClick, ...props }, ref) {
  const ctx = useEnquiry();
  return (
    <Link
      ref={ref}
      href="/products"
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || !ctx) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        ctx.openCatalogues();
      }}
      {...props}
    />
  );
});

/**
 * A CTA that opens the enquiry pop-up. It is still a REAL link to /contact:
 * without JS, outside the provider, or on a modified click (new tab / window)
 * it navigates like any link. A plain click opens the dialog instead.
 *
 * Works under `Button asChild` — Slot merges its className and handlers in.
 */
export const EnquiryLink = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof Link>, "href"> & { href?: string; preset?: EnquiryPreset }
>(function EnquiryLink({ href = "/contact", preset, onClick, ...props }, ref) {
  const enquiry = useEnquiry();
  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || !enquiry) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        enquiry.open(preset);
      }}
      {...props}
    />
  );
});

/**
 * A "Become a Partner" CTA: opens the partner (dealers & distributors) form in
 * the pop-up. A real link to /contact underneath, like `EnquiryLink`, so it
 * still goes somewhere useful without JS or on a modified click.
 */
export const PartnerLink = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof Link>, "href"> & { preset?: EnquiryPreset }
>(function PartnerLink({ preset, onClick, ...props }, ref) {
  const ctx = useEnquiry();
  return (
    <Link
      ref={ref}
      href="/contact"
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || !ctx) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        ctx.openPartner(preset);
      }}
      {...props}
    />
  );
});
