import { useTranslations } from "next-intl";
import { products } from "@/lib/data/products";
import { productsHi } from "@/lib/data/hi/products";
import { hasOverlays, localizeList } from "@/lib/i18n/localize";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

export function RelatedProducts({ current, locale }: { current: Product; locale: string }) {
  const t = useTranslations("common");
  const all = localizeList(products, hasOverlays(locale) ? productsHi : undefined, "slug");
  const related = all.filter((p) => p.category === current.category && p.id !== current.id);
  const fallback = all.filter((p) => p.id !== current.id).slice(0, 3);
  const list = (related.length > 0 ? related : fallback).slice(0, 3);

  if (list.length === 0) return null;

  return (
    <section className="bg-paper-2 py-24 md:py-28">
      <div className="container-figma">
        <h2 className="font-display text-2xl font-medium text-slate-900 sm:text-3xl">
          {t("relatedProducts")}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
