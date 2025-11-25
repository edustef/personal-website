import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";
import { headers } from "next/headers";
import { locales, routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  });
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const localeId = locale.id;
    const localePath = localeId === routing.defaultLocale ? "" : `/${localeId}`;

    sitemap.push({
      url: `${baseUrl}${localePath}`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "monthly",
    });

    const localizedPath = routing.pathnames?.["/start-your-project"]?.[localeId] || "/start-your-project";
    sitemap.push({
      url: `${baseUrl}${localePath}${localizedPath}`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "monthly",
    });

    if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
      for (const p of allPostsAndPages.data) {
        if (p._type === "post") {
          sitemap.push({
            url: `${baseUrl}${localePath}/posts/${p.slug}`,
            lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
            priority: 0.5,
            changeFrequency: "never",
          });
        }
      }
    }
  }

  return sitemap;
}
