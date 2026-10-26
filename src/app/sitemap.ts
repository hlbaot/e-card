import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { publicCards } from "@/server/cards/runtime";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexableEmployees = await publicCards.list();

  const entries: MetadataRoute.Sitemap = [];

  if (siteConfig.indexHomepage) {
    entries.push({
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  for (const emp of indexableEmployees) {
    entries.push({
      url: absoluteUrl(`/card/${emp.slug}`),
      lastModified: emp.updatedAt ? new Date(emp.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
