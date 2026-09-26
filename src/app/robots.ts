import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep /k/ crawlable so noindex can be read; block admin + API
        disallow: ["/admin", "/api/", "/error-demo"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
