import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { NotFoundView } from "@/components/shared/NotFoundView";
import { HR_EMAIL, DISTRIBUTOR_EMAIL } from "@/lib/data/enquiries";

// Locale-scoped 404 — rendered for unknown paths that DO resolve into a locale
// (the common case). Shares the brand NotFoundView with the global route, but
// with translated copy and locale-aware links, inside the full nav/footer shell.
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <NotFoundView
      code={t("code")}
      eyebrow={t("eyebrow")}
      title={t("title")}
      desc={t("desc")}
      contacts={[
        { label: t("hrEnquiry"), email: HR_EMAIL, kind: "hr" },
        { label: t("distributorEnquiry"), email: DISTRIBUTOR_EMAIL, kind: "distributor" },
      ]}
      actions={
        <>
          <Button
            asChild
            size="figma"
            variant="figma-orange"
            className="w-full"
          >
            <Link href="/">{t("backButton")}</Link>
          </Button>
          <Button asChild size="figma" variant="figma-white" className="w-full">
            <Link href="/products">{t("productsButton")}</Link>
          </Button>
        </>
      }
    />
  );
}
