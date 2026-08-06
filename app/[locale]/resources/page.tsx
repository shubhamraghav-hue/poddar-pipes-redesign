import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FAQ } from "@/components/contact/FAQ";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { FeaturePill } from "@/components/shared/FeaturePill";
import { downloads, blogPosts } from "@/lib/data/blog";
import { faqs } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Resources — Catalogues, Datasheets & Guides",
  description:
    "Download Poddar Pipes product catalogues, technical data sheets, and installation manuals, or browse blogs and FAQs.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white md:pb-24 md:pt-48">
        <div className="bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-edge relative">
          <RevealOnScroll>
            <div className="mb-5 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M3.3335 15.0002V6.66683C3.3335 4.44461 4.44461 3.3335 6.66683 3.3335H15.0002" stroke="#F28000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28000]">{t("heroEyebrow")}</span>
            </div>
            <h1 className="max-w-3xl font-display text-4xl font-light uppercase leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              <span className="block">{t("heroLine1")}</span>
              <span className="block text-amber-500">{t("heroLine2")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-slate-300">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section id="catalogues" className="container-edge scroll-mt-24 py-24 md:py-28">
        <div id="datasheets" />
        <div id="manuals" />
        <SectionHeading
          eyebrow={t("downloadsEyebrow")}
          title={t("downloadsH1")}
          titleAccent={t("downloadsH2")}
        />
        <Link
          href="/resources/installation"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
        >
          {t("installLink")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((d, i) => (
            <RevealOnScroll key={d.id} delay={i * 0.06}>
              <div className="flex items-center justify-between gap-4 rounded-[25px] border border-slate-200/70 bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171796]/10 text-[#171796]">
                    <FileText className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ocean-700">{d.category}</p>
                    <h3 className="mt-1 font-display text-sm font-medium leading-snug text-slate-900">
                      {d.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{d.fileType} · {d.fileSize}</p>
                  </div>
                </div>
                <DownloadButton title={d.title} fileUrl={d.fileUrl} />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="blogs" className="scroll-mt-24 bg-paper-2 py-24 md:py-28">
        <div className="container-edge">
          <SectionHeading eyebrow={t("blogEyebrow")} title={t("blogH1")} titleAccent={t("blogH2")} />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogPosts.map((post, i) => (
              <RevealOnScroll key={post.id} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-[25px] border border-slate-200/70 bg-white p-6">
                  <FeaturePill className="w-fit">{post.category}</FeaturePill>
                  <h3 className="mt-4 font-display text-base font-medium leading-snug text-slate-900">
                    {post.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div id="faqs" className="scroll-mt-24">
        <FAQ />
      </div>
    </>
  );
}
