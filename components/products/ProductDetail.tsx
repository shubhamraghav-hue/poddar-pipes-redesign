"use client";

import { CheckCircle2, Download, Ruler, HelpCircle, Pipette, Flame, Network, Waves, Cylinder, Sprout, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { FeaturePill } from "@/components/shared/FeaturePill";
import { GoldStamp } from "@/components/shared/GoldStamp";
import { getFeatureTags } from "@/lib/productTags";
import type { Product } from "@/types";

function downloadDatasheet(product: Product) {
  const content = `PODDAR PIPES
Technical Datasheet (Sample)

Product: ${product.name}
Category: ${product.categoryLabel}

Overview
${product.description}

Features
${product.features.map((f) => `- ${f}`).join("\n")}

Benefits
${product.benefits.map((b) => `- ${b}`).join("\n")}

Specifications
${product.specs.map((s) => `- ${s.label}: ${s.value}`).join("\n")}

Available Sizes
${product.sizes.join(", ")}

Applications
${product.applications.map((a) => `- ${a}`).join("\n")}

Installation Guide
${product.installationGuide.map((step, i) => `${i + 1}. ${step}`).join("\n")}

This is a sample datasheet generated for demonstration purposes.
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${product.slug}-datasheet.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
const iconMap: Record<Product["icon"], LucideIcon> = {
  pipette: Pipette,
  flame: Flame,
  network: Network,
  waves: Waves,
  cylinder: Cylinder,
  sprout: Sprout,
};
export function ProductDetail({ product }: { product: Product }) {
  const Icon = iconMap[product.icon];
  const featureTags = getFeatureTags(product);
  const standardSpec = product.specs.find((s) => s.label === "Standard" || s.label === "Certification");

  return (
    <>
      <section className="bg-ink pb-16 pt-8 text-white md:pb-20">
        <div className="container-edge">
          <RevealOnScroll>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-600/20 text-ocean-300">
                <Icon className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <Badge variant="dark">{product.categoryLabel}</Badge>
            </div>
            <h1 className="mt-6 max-w-2xl text-balance font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg text-slate-300">
              {product.shortDescription}
            </p>
            {featureTags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {featureTags.map((tag) => (
                  <FeaturePill key={tag} dark>
                    {tag}
                  </FeaturePill>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => downloadDatasheet(product)}>
                <Download className="h-4 w-4" /> Download Datasheet
              </Button>
              <Button variant="outline-light" asChild>
                <a href="#inquiry">Request a Quote</a>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <p className="leading-relaxed text-slate-600">{product.description}</p>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-lg font-medium text-slate-900">Features</h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-slate-900">Benefits</h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-display text-lg font-medium text-slate-900">Applications</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.applications.map((a) => (
                      <Badge key={a} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs">
                {standardSpec && (
                  <div className="mb-8 flex items-center gap-4">
                    <GoldStamp label="ISI / Standard" sublabel={standardSpec.value} />
                    <p className="text-sm leading-relaxed text-slate-600">
                      Manufactured and tested to {standardSpec.value}.
                    </p>
                  </div>
                )}
                <dl className="flex flex-col gap-3">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
                    >
                      <dt className="text-slate-500">{spec.label}</dt>
                      <dd className="font-medium text-slate-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8">
                  <h3 className="flex items-center gap-2 font-display text-lg font-medium text-slate-900">
                    <Ruler className="h-4 w-4 text-ocean-600" /> Available Sizes
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full bg-slate-100 px-3.5 py-1.5 font-mono text-xs text-slate-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-display text-lg font-medium text-slate-900">Materials</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.materials.map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="installation">
                <ol className="flex flex-col gap-4">
                  {product.installationGuide.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 font-mono text-xs font-medium text-ocean-700">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                    </li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="faqs">
                <Accordion type="single" collapsible>
                  {product.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-base">
                        <span className="flex items-center gap-2.5">
                          <HelpCircle className="h-4 w-4 shrink-0 text-ocean-600" />
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div id="inquiry" className="scroll-mt-24">
            <h3 className="font-display text-lg font-medium text-slate-900">
              Request a quote for {product.name}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Share your quantity and project timeline — our sales team will respond within one
              business day.
            </p>
            <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6">
              <InquiryForm presetProduct={product.name} presetEnquiryType="Sales" compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
