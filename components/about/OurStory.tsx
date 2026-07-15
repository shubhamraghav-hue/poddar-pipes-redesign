import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function AboutHero() {
  return (
    <section id="story" className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-28 md:pt-48">
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="animate-float-slow absolute right-[10%] top-1/3 h-52 w-52 rounded-full bg-ocean-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <RevealOnScroll>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-300">
            About Poddar Pipes
          </span>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
            A legacy of trust, since 1975.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
            Founded by the Poddar family as pioneers of PVC plumbing solutions, we&apos;ve grown into
            one of Asia&apos;s largest plumbing corporations — carrying a 50-year legacy of quality,
            innovation, and trust into every pipe we manufacture today.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function OurStory() {
  return (
    <section className="container-edge py-24 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Our story"
            title="The Poddar family's fifty-year plumbing legacy."
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="flex flex-col gap-5 text-slate-600">
          <p className="leading-relaxed">
            At Poddar Pipes, we pride ourselves on a rich legacy of excellence in the plumbing
            industry that spans over 50 years. Founded by the Poddar family, the pioneering
            visionaries behind the creation of PVC plumbing solutions, we continue a tradition of
            unmatched quality, innovation, and trust.
          </p>
          <p className="leading-relaxed">
            Since 1975, Mr. Poddar has been at the forefront of revolutionizing plumbing solutions,
            and Poddar Pipes carries forward that legacy with a deep commitment to precision and
            durability. Erstwhile owner of one of Asia&apos;s largest plumbing corporations, Mr.
            Poddar&apos;s expertise and leadership have shaped the industry, making him a respected
            name globally in the field of plumbing solutions.
          </p>
          <p className="leading-relaxed">
            We specialize in high-quality pipes designed for durability, efficiency, and longevity,
            serving plumbing needs from residential homes to large-scale industrial projects. As
            the pioneers behind CPVC technology in India, our solutions are engineered to provide
            the highest standards of performance, safety, and reliability.
          </p>
          <p className="leading-relaxed">
            With over five decades of experience, Poddar Pipes combines traditional craftsmanship
            with cutting-edge technology to ensure that every product we deliver is built to last —
            continuing the legacy of quality that Mr. Poddar started so many years ago.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
