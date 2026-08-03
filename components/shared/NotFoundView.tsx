"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Handshake, UserRound, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactKind = "hr" | "distributor";

interface NotFoundViewProps {
  /** Big status code — "404". */
  code: string;
  /** Eyebrow label (rendered in the site's corner-bracket + amber voice). */
  eyebrow: string;
  /** Accessible page heading — carried sr-only (SEO/AT); the boxes take its
   *  visual slot per the brand layout. */
  title: string;
  /** Accessible supporting line — sr-only alongside the title. */
  desc: string;
  /** Button row — caller supplies links wired for its routing context. */
  actions: ReactNode;
  /** Show the Poddar brand mark. On for the standalone global route; off when
   *  rendered inside the locale layout, which already has the Navbar. */
  showBrand?: boolean;
  /** Role-based enquiry cards. Caller supplies the label so it can be
   *  translated per locale; `kind` picks the icon. */
  contacts?: { label: string; email: string; kind?: ContactKind }[];
  /** Full-bleed background clip (Poddar's own hero footage). Omitted /
   *  reduced-motion falls back to the blueprint field. */
  videoSrc?: string;
}

const CONTACT_ICON: Record<ContactKind, typeof Mail> = {
  hr: UserRound,
  distributor: Handshake,
};

/** The brand corner-bracket eyebrow, matching SectionHeading's engineering
 *  voice — an orange bracket + amber uppercase label. */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <path
          d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002"
          stroke="#F28000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{label}</span>
    </div>
  );
}

/** The brand corner-bracket (SectionHeading's mark) with a subtle live pulse —
 *  positioned absolutely to encase the 404 (top-left + a `rotate-180`
 *  bottom-right). Reduced-motion renders it static. */
function BracketMark({ className, reduce }: { className?: string; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none absolute h-9 w-9 sm:h-12 sm:w-12", className)}
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
      transition={reduce ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002"
        stroke="#F28000"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/**
 * NotFoundView — Poddar Pipes' 404, in the site's own design language
 * (BRAND_IDENTITY.md): ink + blueprint over the brand's hero footage, the
 * corner-bracket eyebrow, a flow-cyan-accented display "404", and the HR +
 * Distributor enquiry cards styled like the site's credential cards — given the
 * prominent middle slot, with the CTAs anchored at the bottom. Reduced-motion
 * drops the video for the static blueprint field. Presentational + link-agnostic
 * so the global (app/not-found) and locale (app/[locale]/not-found) share it.
 */
export function NotFoundView({
  code,
  eyebrow,
  title,
  desc,
  actions,
  showBrand = false,
  contacts,
  videoSrc = "/hero/slide-1.webm",
}: NotFoundViewProps) {
  const reduce = useReducedMotion();
  const showVideo = !reduce && !!videoSrc;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="bg-ink relative flex min-h-[100svh] flex-col overflow-hidden text-white">
      {/* ── Full-bleed hero footage (Poddar's own pipe/water clip) ───────── */}
      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster="/hero/poster-placeholder.svg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Legibility wash — deep ink so headline & cards clear AA over the clip */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,19,79,0.86) 0%, rgba(12,11,63,0.8) 45%, rgba(12,11,63,0.94) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Blueprint field + a single flow-cyan glow — the site's dark-section motif */}
      <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="bg-amber-500/10 pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Accessible heading — the boxes take its visual place */}
      <h1 className="sr-only">{title}</h1>
      <p className="sr-only">{desc}</p>

      {/* Brand mark — standalone route only (locale route has the Navbar) */}
      {showBrand && (
        <header className="container-edge relative z-10 pt-6">
          <a href="/" aria-label="Poddar Pipes — home" className="inline-block">
            <img src="/logo.svg" alt="Poddar Pipes" className="h-10 w-auto sm:h-11" />
          </a>
        </header>
      )}

      {/* ── Single-glance stack ──────────────────────────────────────────── */}
      <div className="container-edge relative z-10 flex flex-1 items-center justify-center py-8">
        <div className="relative flex w-full max-w-2xl flex-col items-center gap-[min(2.6vh,1.15rem)] text-center">
          {/* <motion.div {...rise(0)}>
            <Eyebrow label={eyebrow} />
          </motion.div> */}

          {/* Display 404 — encased by the brand corner brackets (top-left +
              bottom-right), each with a subtle live pulse. vh-clamped. */}
          <div className="relative px-3 py-2 sm:px-4 sm:py-3" aria-hidden="true">
            <div
              className="bg-amber-500/15 pointer-events-none absolute inset-0 -z-10 mx-auto my-auto h-2/3 w-3/4 rounded-full blur-[70px]"
            />
            <BracketMark className="-left-1 -top-1 sm:-left-2 sm:-top-2" reduce={!!reduce} />
            <BracketMark className="-bottom-1 -right-1 rotate-180 sm:-bottom-2 sm:-right-2" reduce={!!reduce} />
            <motion.p
              {...rise(0.06)}
              className="select-none font-display text-[clamp(3.25rem,15vh,9rem)] font-bold leading-none tracking-tighter text-white"
            >
              4<span className="text-amber-500">0</span>4
            </motion.p>
          </div>
          
          {/* ── Enquiry boxes — brand credential-card styling, prominent slot ─ */}
          {contacts && contacts.length > 0 && (
            <motion.div
              {...rise(0.14)}
              className="grid w-full gap-3 sm:grid-cols-2"
            >
            {contacts.map((c) => {
              const Icon = c.kind ? CONTACT_ICON[c.kind] : Mail;
              return (
                <a
                  key={c.email}
                  href={`mailto:${c.email}`}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:bg-white/[0.06]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-slate-200 transition-colors group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:text-amber-400">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0">
                    <span className="tech-label block text-[0.62rem] text-slate-400">
                      {c.label}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-slate-100 transition-colors group-hover:text-white">
                      {c.email}
                    </span>
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-amber-400" />
                </a>
              );
            })}
          </motion.div>
        )}

          {/* ── CTAs — equal columns so both buttons match at every size ──── */}
          <motion.div
            {...rise(0.22)}
            className="mt-3 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {actions}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
