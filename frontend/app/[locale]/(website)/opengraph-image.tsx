import { OG_CONTENT_TYPE, OG_SIZE, generateOgImage } from "@/lib/og-image";

export const alt = "Eduard Stefan - Sanity CMS & Design Systems";
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
    en: "Book a call",
    es: "Reservar una llamada",
    ro: "Rezervă un apel",
  };

  const title = titles[locale] || titles.en;
  const cta = ctas[locale] || ctas.en;

  return generateOgImage(title, cta);
}
