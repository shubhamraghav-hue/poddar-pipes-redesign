"use client";

import { CheckCircle2, Download, Ruler, HelpCircle, Pipette, Flame, Network, Waves, Cylinder, Sprout, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { FeaturePill } from "@/components/shared/FeaturePill";
import { getFeatureTags } from "@/lib/productTags";
import type { Product } from "@/types";

/**
 * The product's real catalogue PDF (public/downloads), by category. This
 * replaced a "Download Datasheet" button that generated a .txt file marked
 * "sample … for demonstration purposes". CPVC has no web-ready catalogue yet
 * (see lib/data/blog.ts), so its pages show no download until one exists.
 */
const CATALOGUE_BY_CATEGORY: Partial<Record<Product["category"], string>> = {
  "upvc-pipes": "/downloads/poddar-upvc-gold-catalogue.pdf",
  "swr-pipes": "/downloads/poddar-swr-gold-catalogue.pdf",
  "ugd-pipes": "/downloads/poddar-ugd-gold-catalogue.pdf",
  "agricultural-pipes": "/downloads/poddar-agri-gold-catalogue.pdf",
  tanks: "/downloads/poddar-water-tanks-catalogue.pdf",
};
const iconMap: Record<Product["icon"], LucideIcon> = {
  pipette: Pipette,
  flame: Flame,
  network: Network,
  waves: Waves,
  cylinder: Cylinder,
  sprout: Sprout,
};
export function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("products");
  const tHome = useTranslations("home");
  const Icon = iconMap[product.icon];
  const featureTags = getFeatureTags(product);
  const standardSpec = product.specs.find((s) => s.label === "Standard");

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
            {/* `text-white` is explicit: the global h1–h4 rule (globals.css) sets
                slate-900, and without it the product name rendered dark navy
                on this navy hero — invisible on every product page. */}
            <h1 className="mt-6 max-w-2xl text-balance font-display text-3xl font-medium leading-tight text-white sm:text-4xl md:text-5xl">
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
              {/* White on the navy hero — the default navy fill barely
                  separated from the background. */}
              {CATALOGUE_BY_CATEGORY[product.category] && (
                <Button asChild variant="primary-on-dark">
                  <a href={CATALOGUE_BY_CATEGORY[product.category]} download>
                    <Download className="h-4 w-4" /> {tHome("ctaSecondaryHome")}
                  </a>
                </Button>
              )}
              <Button variant="outline-light" asChild>
                {/* Opens the enquiry pop-up with the product named. The
                    inline form further down stays for people who scroll. */}
                <EnquiryLink
                  href="/contact"
                  preset={{
                    enquiryType: "Sales & Pricing",
                    message: `I'd like a quote for ${product.name}.`,
                  }}
                >
                  {t("requestQuote")}
                </EnquiryLink>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-edge py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Tabs defaultValue="overview">
              {/* An even 2×2 on phones — free-wrapping left "FAQs" alone on a
                  second row. 40px-tall triggers for touch. */}
              <TabsList className="grid w-full grid-cols-2 rounded-[24px] sm:inline-flex sm:w-auto sm:rounded-full">
                <TabsTrigger value="overview" className="min-h-10">{t("tabOverview")}</TabsTrigger>
                <TabsTrigger value="specs" className="min-h-10">{t("tabSpecs")}</TabsTrigger>
                <TabsTrigger value="installation" className="min-h-10">{t("tabInstallation")}</TabsTrigger>
                <TabsTrigger value="faqs" className="min-h-10">{t("tabFaqs")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <p className="leading-relaxed text-slate-600">{product.description}</p>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-lg font-medium text-slate-900">{t("featuresH")}</h3>
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
                    <h3 className="font-display text-lg font-medium text-slate-900">{t("benefitsH")}</h3>
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
                  <h3 className="font-display text-lg font-medium text-slate-900">{t("applicationsH")}</h3>
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
                  // A plain note, not a GoldStamp seal: the company holds no
                  // certifications (client, Oct 2026), and a seal reads as one.
                  // Phrase as design intent only — never "certified/compliant".
                  <div className="mb-8 rounded-[25px] border border-slate-200/70 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#171796]">
                      Design standard
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Designed and manufactured to {standardSpec.value} specifications.
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
                    <Ruler className="h-4 w-4 text-ocean-600" />
                    <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                      {t("sizesH")}
                    </span>
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
                  <h3 className="font-display text-lg font-medium text-slate-900">{t("materialsH")}</h3>
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
                {/* The guide used to be reachable only from /resources, which
                    was removed — this is now its way in. */}
                <Link
                  href="/resources/installation"
                  className="mt-6 inline-flex items-center gap-1.5 py-3 text-sm font-medium text-ocean-700 hover:text-ocean-800"
                >
                  <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                    Full solvent-weld installation guide
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
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
              {t("quoteHeading", { name: product.name } as never)}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {t("quoteDesc")}
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
