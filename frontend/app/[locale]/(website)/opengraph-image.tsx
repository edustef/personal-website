import { OG_CONTENT_TYPE, OG_SIZE, generateOgImage } from "@/lib/og-image";

export const alt =
  "Eduard Stefan - Web platforms for product and marketing teams";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Web platforms that keep product and marketing moving.",
    es: "Plataformas web que mantienen producto y marketing en movimiento.",
    ro: "Platforme web care mențin produsul și marketingul în mișcare.",
  };

  const ctas: Record<string, string> = {
    en: "Discuss a project",
    es: "Hablar de un proyecto",
    ro: "Discută un proiect",
  };

  const title = titles[locale] || titles.en;
  const cta = ctas[locale] || ctas.en;

  return generateOgImage(title, cta);
}
