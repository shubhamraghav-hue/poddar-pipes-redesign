import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-white">
      <span className="font-mono text-sm text-ocean-300">{t("code")}</span>
      <h1 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        {t("desc")}
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">{t("backButton")}</Link>
      </Button>
    </section>
  );
}
