import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="animate-float-slow absolute left-[8%] top-1/4 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <RevealOnScroll>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
            Product Catalog
          </span>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Piping systems for every stage of India&apos;s water network.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
            Browse uPVC, CPVC, SWR, TANKS, UGD, and Agriculture piping systems — filter by
            category, review full technical specifications, and download datasheets.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
