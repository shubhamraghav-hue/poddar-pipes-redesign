import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BlogScrollRow } from "@/components/shared/BlogScrollRow";
import { blogPosts } from "@/lib/data/blog";

export async function LatestBlogs() {
  const t = await getTranslations("home");

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

        <BlogScrollRow posts={blogPosts} />
      </div>
    </section>
  );
}