import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * Dynamic robots.txt route.
 * All public pages (including `/card/`) are crawlable; only admin/login/api are blocked.
 */
export default function robots(): MetadataRoute.Robots {
  const isNonProdVercel =
    Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";
  const isProduction =
    process.env.NODE_ENV === "production" && !isNonProdVercel;

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
      sitemap: absoluteUrl("/sitemap.xml"),
      host: siteConfig.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/", "/_next/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
