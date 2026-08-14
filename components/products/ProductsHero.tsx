import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";

export async function ProductsHero() {
  const t = await getTranslations("products");
  return (
    <>
      {/* A slim brand-colour strip exactly matching the fixed navbar's height
          (h-20) — not a hero. See /tools/find-a-plumber (PlumberFinder.tsx)
          for the pattern this follows sitewide. */}
      <div className="h-20 bg-ink" aria-hidden="true" />
      <section className="container-edge pt-10 pb-8 md:pt-12">
        <SectionHeading
          as="h1"
          eyebrow={t("heroEyebrow")}
          title={`${t("heroLine1")} ${t("heroLine2")}`}
          titleAccent={t("heroBold")}
          description={t("heroDesc")}
        />
      </section>
    </>
  );
}
