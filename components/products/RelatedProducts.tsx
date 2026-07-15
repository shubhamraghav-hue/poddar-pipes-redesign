import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

export function RelatedProducts({ current }: { current: Product }) {
  const related = products.filter((p) => p.category === current.category && p.id !== current.id);
  const fallback = products.filter((p) => p.id !== current.id).slice(0, 3);
  const list = (related.length > 0 ? related : fallback).slice(0, 3);

  if (list.length === 0) return null;

  return (
    <section className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge">
        <h2 className="font-display text-2xl font-medium text-slate-900 sm:text-3xl">
          Related Products
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
