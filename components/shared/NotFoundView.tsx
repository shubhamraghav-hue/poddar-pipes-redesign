"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Handshake, UserRound, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactKind = "hr" | "distributor";

interface NotFoundViewProps {
  code: string;
  eyebrow: string;
  title: string;
  desc: string;
  actions: ReactNode;
  showBrand?: boolean;
  contacts?: { label: string; email: string; kind?: ContactKind }[];
  videoSrc?: string;
}

const CONTACT_ICON: Record<ContactKind, typeof Mail> = {
  hr: UserRound,
  distributor: Handshake,
};

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

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,19,79,0.86) 0%, rgba(12,11,63,0.8) 45%, rgba(12,11,63,0.94) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />

      <h1 className="sr-only">{title}</h1>
      <p className="sr-only">{desc}</p>

      {showBrand && (
        <header className="container-edge relative z-10 pt-6">
          <a href="/" aria-label="Poddar Pipes — home" className="inline-block">
            <img src="/logo.svg" alt="Poddar Pipes" className="h-16 w-auto" />
          </a>
        </header>
      )}

      <div className="container-edge relative z-10 flex flex-1 items-center justify-center py-8">
        <div className="relative flex w-full max-w-2xl flex-col items-center gap-[min(2.6vh,1.15rem)] text-center">

          {/* `inline-flex`, not block: the height must collapse to the text,
              or the bottom-right bracket lands far below "SOON". */}
          <div
            className="relative inline-flex flex-col items-center px-3 py-2 sm:px-4 sm:py-3"
            aria-hidden="true"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto my-auto h-2/3 w-3/4 rounded-full bg-amber-500/15 blur-[70px]" />

            <BracketMark className="-top-1 -left-1 sm:-top-2 sm:-left-2" reduce={!!reduce} />
            <BracketMark
              className="-right-1 -bottom-1 rotate-180 sm:-right-2 sm:-bottom-2"
              reduce={!!reduce}
            />

            <motion.div {...rise(0.06)} className="flex flex-col items-center leading-none">
              <span className="font-display text-[clamp(2.7rem,9vw,6.2rem)] font-bold tracking-[-0.08em] text-white select-none">
                COMING
              </span>
              <span className="font-display -mt-[0.05em] text-[clamp(2.7rem,9vw,6.2rem)] font-bold tracking-[-0.08em] text-amber-500 select-none">
                SOON
              </span>
            </motion.div>
          </div>

          {contacts && contacts.length > 0 && (
            <motion.div {...rise(0.14)} className="grid w-full gap-3 sm:grid-cols-2">
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
