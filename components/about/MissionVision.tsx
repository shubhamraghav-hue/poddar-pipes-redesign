import { Target, Telescope, BadgeCheck, ShieldCheck, Compass, Lightbulb, Users, Leaf, Award } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function MissionVision() {
  return (
    <section id="mission" className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge grid gap-6 md:grid-cols-2">
        <RevealOnScroll>
          <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-9">
            <Target className="h-8 w-8 text-ocean-700" strokeWidth={1.6} />
            <h3 className="mt-6 font-display text-2xl font-medium text-slate-900">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              To manufacture piping systems that Indian households, farms, and industries can
              depend on for decades — reducing failure, waste, and rework across every network we
              supply.
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-9">
            <Telescope className="h-8 w-8 text-amber-600" strokeWidth={1.6} />
            <h3 className="mt-6 font-display text-2xl font-medium text-slate-900">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              To be the piping brand every Indian dealer, contractor, and farmer trusts first —
              recognized as much for engineering integrity as for reach.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

const values = [
  {
    icon: BadgeCheck,
    title: "Quality First",
    description:
      "We are committed to delivering products that stand the test of time. Every product we produce reflects our dedication to excellence, ensuring superior durability and reliability for every project.",
  },
  {
    icon: ShieldCheck,
    title: "Trust and Integrity",
    description:
      "We build long-lasting relationships based on honesty, transparency, and an unwavering commitment to doing what's right. Our reputation for integrity is the foundation of everything we do.",
  },
  {
    icon: Compass,
    title: "Driven by Purpose",
    description:
      "Our work is not just manufacturing pipes; it's about making a difference. We are driven by a purpose to deliver solutions that improve lives, protect communities, and create a lasting, positive impact on the world.",
  },
  {
    icon: Lightbulb,
    title: "Defining Industry Innovation",
    description:
      "We focus on developing innovative plumbing solutions that anticipate future needs, while ensuring sustainability and efficiency. Our innovation is always guided by a deep sense of responsibility to our customers and the environment.",
  },
  {
    icon: Users,
    title: "Customer-Centricity",
    description:
      "Our customers are the heart of our business. We listen, understand, and respond to their needs with products and services designed to deliver the highest performance, value, and reliability.",
  },
  {
    icon: Leaf,
    title: "Sustainability and Responsibility",
    description:
      "We are dedicated to building a sustainable future through environmentally-conscious practices and products. We believe in leaving a positive footprint, ensuring that the future we build today benefits generations to come.",
  },
  {
    icon: Award,
    title: "Heritage of Excellence",
    description:
      "With over five decades of expertise, we honor our legacy while embracing new technologies and approaches. Our rich history of excellence inspires us to continually innovate and lead the way forward.",
  },
];

export function CoreValues() {
  return (
    <section className="container-edge py-24 md:py-28">
      <SectionHeading eyebrow="Core values" title="Not just making pipes — building relationships that last." />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <RevealOnScroll key={v.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-7">
              <v.icon className="h-6 w-6 text-ocean-700" strokeWidth={1.7} />
              <h4 className="mt-5 font-display text-base font-medium text-slate-900">{v.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
