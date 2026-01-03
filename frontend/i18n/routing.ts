import { defineRouting } from "next-intl/routing";

export const locales = [
  { id: "en", title: "English" },
  { id: "ro", title: "Română" },
  // { id: "es", title: "Español" },
] as const;

export type LocaleId = (typeof locales)[number]["id"];

export const defaultLocale = "en" satisfies LocaleId;

export const routing = defineRouting({
  defaultLocale: "en",
  locales: locales.map((locale) => locale.id),

  pathnames: {
    "/start-your-project": {
      ro: "/incepe-proiectul-tau",
      // es: "/inicia-tu-proyecto",
    },
    "/privacy-policy": {
      ro: "/politica-de-confidențialitate",
      // es: "/política-de-privacidad",
    },
  },
});
