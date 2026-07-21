import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { CTASection } from "@/components/home/CTASection";
import { categoryContent, getCategoryContent } from "@/lib/data/categoryContent";
import { products } from "@/lib/data/products";

export function generateStaticParams() {
  return categoryContent.map((c) => ({ category: c.category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const content = getCategoryContent(category);
  if (!content) return {};

  return {
    // Absolute so the root layout's "%s | Poddar Pipes" template isn't appended
    // (metaTitle already ends with the brand).
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: `/products/category/${content.category}` },
    // Not ready for production — keep every category landing page out of the
    // index regardless of environment until the content is signed off.
    robots: { index: false, follow: false },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const nav = await getTranslations("nav");

  const content = getCategoryContent(category);
  if (!content) notFound();

  const categoryProducts = products.filter((p) => p.category === content.category);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-blue absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-flow-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-edge relative">
          <nav className="tech-label mb-6 flex items-center gap-2 text-ocean-300" aria-label="Breadcrumb">
            <Link href="/products" className="transition-colors hover:text-flow-300">
              {nav("products")}
            </Link>
            <span className="text-ocean-300/50">/</span>
            <span className="text-flow-300">{content.label}</span>
          </nav>

          <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            {content.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-slate-300">{content.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" variant="primary-on-dark">
              <Link href="/contact">
                {t("requestQuote")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link href="/products">{t("categoryBrowseAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-5">
            <span className="tech-label text-ocean-700">{t("categoryOverview")}</span>
            {content.intro.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-balance font-display text-xl font-medium leading-relaxed text-slate-900 md:text-2xl"
                    : "leading-relaxed text-slate-600"
                }
              >
                {para}
              </p>
            ))}
          </div>

          {/* Applications */}
          <div className="rounded-2xl border border-slate-200/70 bg-paper-2 p-7">
            <span className="tech-label text-ocean-700">{t("categoryWhereUsed")}</span>
            <ul className="mt-5 space-y-3">
              {content.applications.map((app) => (
                <li key={app} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-flow-500" strokeWidth={2.2} />
                  {app}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 transition-colors duration-300 hover:border-flow-400/50"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products in this category */}
      {categoryProducts.length > 0 && (
        <section className="bg-paper-2 py-20 md:py-28">
          <div className="container-edge">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="tech-label text-ocean-700">{t("categoryRange")}</span>
                <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                  {content.label} products
                </h2>
              </div>
              <Link
                href={`/products?category=${content.category}`}
                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
              >
                {t("categoryFilterCatalogue")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content.faqs.length > 0 && (
        <section className="container-edge py-20 md:py-28">
          <span className="tech-label text-ocean-700">{t("categoryCommonQuestions")}</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            {content.label} FAQs
          </h2>
          <dl className="mt-10 grid gap-6 md:grid-cols-2">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200/70 bg-white p-7">
                <dt className="font-display text-lg font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-slate-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <CTASection
        title={t("categoryCTATitle")}
        description={t("categoryCTADesc")}
      />
    </>
  );
}
