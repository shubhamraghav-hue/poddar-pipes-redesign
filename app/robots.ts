import type { MetadataRoute } from "next";
import { isProductionSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.poddarpipes.com/sitemap.xml",
  };
}
