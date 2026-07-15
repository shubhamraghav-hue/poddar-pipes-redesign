import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const SITE_URL = "https://www.poddarpipes.com";

/** BreadcrumbList JSON-LD matching the visual trail rendered by <Breadcrumbs>. */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const allItems = [{ label: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link href="/" className="flex items-center text-slate-400 transition-colors hover:text-ocean-300">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          {item.href ? (
            <Link href={item.href} className="text-slate-400 transition-colors hover:text-ocean-300">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
