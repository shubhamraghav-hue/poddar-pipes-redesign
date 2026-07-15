import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { PipeSchematicNav, type SchematicNode } from "@/components/shared/PipeSchematicNav";

// Specs are drawn straight from each line's own description below — no claim is
// asserted that the product data doesn't already make. Icons are string keys
// (resolved inside PipeSchematicNav) so this stays a Server Component.
const categories: SchematicNode[] = [
  {
    title: "uPVC",
    spec: "SCH 40/80",
    description: "Lead-free Schedule 40/80 solvent-weld pipes for hot & cold water plumbing.",
    icon: "pipette",
    href: "/products/category/upvc-pipes",
    image:
      "https://images.unsplash.com/photo-1545193329-4a052e14eb8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "CPVC",
    spec: "82°C RATED",
    description: "Hot & cold water plumbing systems rated for continuous 82°C service.",
    icon: "flame",
    href: "/products/category/cpvc-pipes",
    image:
      "https://images.unsplash.com/photo-1682540963112-facad29c3fa2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "SWR",
    spec: "SOIL · WASTE · RAIN",
    description: "Soil, waste & rainwater drainage systems for residential buildings.",
    icon: "waves",
    href: "/products/category/swr-pipes",
    image:
      "https://images.unsplash.com/photo-1646009445351-b8192e095f3a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "TANKS",
    spec: "2/3/4-LAYER",
    description: "Rotomoulded 2, 3 & 4-layer water storage tanks with anti-microbial protection.",
    icon: "cylinder",
    href: "/products/category/tanks",
    image:
      "https://images.unsplash.com/photo-1780590098621-02afa2e41504?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "UGD",
    spec: "SEWAGE · STORM",
    description: "Underground drainage pipes for sewage and storm water networks.",
    icon: "network",
    href: "/products/category/ugd-pipes",
    image:
      "https://images.unsplash.com/photo-1779718811629-92d973f0badb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Agriculture",
    spec: "IS 4985",
    description: "IS 4985 pressure pipes for water supply, plus drip irrigation lines.",
    icon: "sprout",
    href: "/products/category/agricultural-pipes",
    image:
      "https://images.pexels.com/photos/12532707/pexels-photo-12532707.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export function ProductCategories() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      {/* Ambient flow glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-flow-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-edge relative">
        <SectionHeading
          eyebrow="The distribution network"
          title="Six product categories. One manufacturing standard."
          description="From agricultural mains to hospital plumbing risers, every Poddar Pipes product line shares the same testing rigor and Indian Standard compliance."
          dark
        />

        <div className="mt-16">
          <PipeSchematicNav nodes={categories} />
        </div>

        <RevealOnScroll className="mt-14 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-flow-400/50 hover:text-flow-300"
          >
            View the full catalogue
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
