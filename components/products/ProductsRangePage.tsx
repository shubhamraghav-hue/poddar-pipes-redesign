import { getTranslations } from "next-intl/server";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { ProductsHero } from "@/components/products/ProductsHero";
import { CTASection } from "@/components/home/CTASection";

/**
 * The products page body, shared by /products and the six range URLs
 * /products/<range-id> (SEO-003). Identical markup on every URL: the dark
 * hero, the range showcase (pills, card, partner strip, "What is" / "Why"),
 * then the flush "start a conversation" band.
 *
 * The hero line is an H2 here; the page's H1 is the selected range's name,
 * screen-reader-only at the range card (see ProductShowcase).
 */
export async function ProductsRangePage({
  category,
  query = "",
}: {
  category?: string;
  query?: string;
}) {
  const tHome = await getTranslations("home");
  return (
    <>
      <ProductsHero headingAs="h2" />
      <ProductShowcase initialCategory={category} initialQuery={query} />
      <CTASection
        variant="flush"
        primaryLabel={tHome("ctaPrimaryHome")}
        secondaryLabel={tHome("ctaSecondaryHome")}
      />
    </>
  );
}
