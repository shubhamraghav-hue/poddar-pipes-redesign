import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { timeline } from "@/lib/data/timeline";

export function Timeline() {
  return (
    <section id="timeline" className="container-edge py-24 md:py-28">
      <SectionHeading eyebrow="Milestones" title="Three decades, mapped." />
      <div className="relative mt-16">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-12">
          {timeline.map((event, i) => (
            <RevealOnScroll key={event.year} delay={i * 0.05}>
              <div
                className={`relative flex flex-col gap-2 pl-8 sm:w-1/2 sm:pl-0 ${
                  i % 2 === 0 ? "sm:mr-auto sm:pr-14 sm:text-right" : "sm:ml-auto sm:pl-14"
                }`}
              >
                <span
                  className={`absolute top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ocean-600 bg-paper left-0 ${
                    i % 2 === 0 ? "sm:left-auto sm:-right-[7px]" : "sm:-left-[7px]"
                  }`}
                  aria-hidden="true"
                />
                <span className="font-mono text-sm text-ocean-700">{event.year}</span>
                <h4 className="font-display text-xl font-medium text-slate-900">{event.title}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{event.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
