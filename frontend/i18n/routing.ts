import { defineRouting } from "next-intl/routing";

export const locales = [
  { id: "en", title: "English" },
  { id: "ro", title: "Română" },
  { id: "es", title: "Español" },
] as const;

export type LocaleId = (typeof locales)[number]["id"];

export const defaultLocale = "en" satisfies LocaleId;

export const routing = defineRouting({
  defaultLocale,
  locales: locales.map((locale) => locale.id),
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/start-your-project": {
      ro: "/începe-proiectul-tău",
      es: "/inicia-tu-proyecto",
    },
    "/privacy-policy": {
      ro: "/politică-de-confidențialitate",
      es: "/política-de-privacidad",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
  },
});
