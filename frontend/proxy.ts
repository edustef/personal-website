import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const countryToLocale = {
  RO: "ro",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  DO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
} as const;

function getCountryFromRequest(request: NextRequest): string | null {
  const country = request.headers.get("x-vercel-ip-country");

  return country || null;
}

function getLocaleFromCountry(country: string | null): string | null {
  if (!country) return null;
  return (
    (countryToLocale[country as keyof typeof countryToLocale] as string) || null
  );
}

const pathRedirects: Record<string, string> = {
  "/ro/începe-proiectul-tău": "/ro/incepe-proiectul-tau",
  "/ro/politică-de-confidențialitate": "/ro/politica-de-confidentialitate",
  "/es/política-de-privacidad": "/es/politica-de-privacidad",
};

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle redirects for old accented paths
  if (pathRedirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = pathRedirects[pathname];
    return NextResponse.redirect(url, 308);
  }

  const hasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const country = getCountryFromRequest(request);
    const localeFromCountry = getLocaleFromCountry(country);

    if (
      localeFromCountry &&
      routing.locales.includes(
        localeFromCountry as (typeof routing.locales)[number]
      )
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${localeFromCountry}${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return handleI18nRouting(
    request as unknown as Parameters<typeof handleI18nRouting>[0]
  );
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|magical-app).*)",
};
