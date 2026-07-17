import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { TiltCard } from "@/components/shared/TiltCard";
import { FeaturePill } from "@/components/shared/FeaturePill";
import { blogPosts } from "@/lib/data/blog";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export async function LatestBlogs() {
  const t = await getTranslations("home");
  const [featured, ...rest] = blogPosts;
  const sidePosts = rest.slice(0, 3);

  return (
    <section className="bg-paper-2 py-24 md:py-32">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("blogEyebrow")} title={t("blogsH1")} titleAccent={t("blogsH2")} />
          <Link
            href="/resources#blogs"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ocean-700 hover:text-ocean-800"
          >
            {t("blogsCta")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {featured && (
            <RevealOnScroll className="lg:col-span-2">
              <TiltCard max={4} className="h-full rounded-2xl">
                <Link
                  href="/resources#blogs"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-colors duration-300 hover:border-flow-400/50 hover:shadow-xl hover:shadow-ocean-900/5"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
                    {featured.image && (
                      <Image
                        src={featured.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                    <FeaturePill className="absolute left-5 top-5 border-white/40 bg-ink/40 text-white backdrop-blur-sm">
                      {featured.category}
                    </FeaturePill>
                  </div>
                  <div className="flex flex-1 flex-col p-8 md:p-10">
                    <h3 className="max-w-xl font-display text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">{featured.excerpt}</p>
                    <div className="mt-auto flex items-center gap-3 pt-8 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {fmtDate(featured.date)}
                      </span>
                      <span>·</span>
                      <span>{featured.readTime}</span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-ocean-700 transition-colors group-hover:text-flow-500">
                        {t("blogsReadArticle")}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </RevealOnScroll>
          )}

          <div className="flex flex-col gap-4">
            {sidePosts.map((post, i) => (
              <RevealOnScroll key={post.id} delay={i * 0.08} className="h-full">
                <Link
                  href="/resources#blogs"
                  className="group flex h-full gap-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-flow-400/50 hover:shadow-md"
                >
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
                    {post.image && (
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
                    <span className="tech-label text-ocean-700">{post.category}</span>
                    <h3 className="mt-1.5 font-display text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-ocean-800">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      {fmtDate(post.date)}
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
