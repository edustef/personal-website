import { OG_CONTENT_TYPE, OG_SIZE, generateOgImage } from "@/lib/og-image";

export const alt = "Sanity CMS development and migration by Eduard Stefan";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Ship on-brand pages at the speed of marketing.",
    es: "Publica páginas fieles a tu marca a la velocidad del marketing.",
    ro: "Publică pagini pe brand la viteza marketingului.",
  };

  const ctas: Record<string, string> = {
    en: "Sanity CMS development",
    es: "Desarrollo Sanity CMS",
    ro: "Dezvoltare Sanity CMS",
  };

  return generateOgImage(titles[locale] || titles.en, ctas[locale] || ctas.en);
}
