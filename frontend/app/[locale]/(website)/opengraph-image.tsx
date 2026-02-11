import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Eduard Stefan - Web Developer & Creative Problem Solver";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Your idea deserves great execution.",
    es: "Tu idea merece una gran ejecución.",
    ro: "Ideea ta merită o execuție excelentă.",
  };

  const ctas: Record<string, string> = {
    en: "Book Discovery Call",
    es: "Reserva Llamada",
    ro: "Rezervă un Apel",
  };

  const title = titles[locale] || titles.en;
  const cta = ctas[locale] || ctas.en;

  return generateOgImage(title, cta);
}
