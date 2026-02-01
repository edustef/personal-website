import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Localized titles
  const titles: Record<string, string> = {
    en: "Blog",
    es: "Blog",
    ro: "Blog",
  };

  const title = titles[locale] || titles.en;

  return generateOgImage(title);
}
