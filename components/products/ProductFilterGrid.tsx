"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { products, productCategories } from "@/lib/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

// `initialCategory` is read server-side from the page's `searchParams` prop
// rather than via the client `useSearchParams()` hook. That hook forces
// Next.js to bail this whole route out of static rendering
// (BAILOUT_TO_CLIENT_SIDE_RENDERING), which meant the real product grid
// never reached crawlers or no-JS clients — only the loading fallback did.
export function ProductFilterGrid({
  initialCategory = "all",
  initialQuery = "",
}: {
  initialCategory?: Product["category"] | "all";
  initialQuery?: string;
}) {
  const t = useTranslations("products");
  const router = useRouter();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState<Product["category"] | "all">(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Keeps the URL in sync with both filters — this is also what makes the
  // WebSite SearchAction's `/products?q={search_term_string}` URL pattern
  // (see app/[locale]/layout.tsx) a real, working search rather than an
  // unwired schema claim: loading that URL pre-fills and applies the query.
  function updateUrl(nextCategory: Product["category"] | "all", nextQuery: string) {
    const params = new URLSearchParams();
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextQuery.trim() !== "") params.set("q", nextQuery.trim());
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function selectCategory(id: Product["category"] | "all") {
    setActiveCategory(id);
    updateUrl(id, query);
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    updateUrl(activeCategory, next);
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        p.applications.some((a) => a.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section id="catalog" className="container-edge py-24 md:py-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                activeCategory === cat.id
                  ? "border-ocean-600 bg-ocean-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-ocean-500/50 hover:text-ocean-700"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-ocean-500 focus-visible:outline-none"
          />
        </div>
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-slate-500">{t("noResults")}</p>
      )}
    </section>
  );
}
