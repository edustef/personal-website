import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/back-to-00s",
          "/*/back-to-00s",
          "/*/inapoi-in-anii-00",
          "/*/volver-a-los-00",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
