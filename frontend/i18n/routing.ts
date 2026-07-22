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
  localePrefix: "always",
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/roi-calculator": {
      ro: "/calculator-roi",
      es: "/calculadora-roi",
    },
    "/services/sanity": {
      ro: "/servicii/sanity",
      es: "/servicios/sanity",
    },
    "/privacy-policy": {
      ro: "/politica-de-confidentialitate",
      es: "/politica-de-privacidad",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/lab": "/lab",
    "/back-to-00s": {
      ro: "/inapoi-in-anii-00",
      es: "/volver-a-los-00",
    },
    "/schedule": {
      ro: "/programeaza",
      es: "/agendar",
    },
    "/appointments": {
      ro: "/programari",
      es: "/citas",
    },
  },
});
