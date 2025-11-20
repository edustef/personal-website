import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
// @ts-ignore - negotiator types are available but not being recognized
import Negotiator from "negotiator";
import { languages, defaultLanguage, type LanguageId } from "@/lib/i18n";

// Get the preferred locale from Accept-Language header
function getLocale(request: Request): LanguageId {
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  const preferredLanguages = new Negotiator({ headers }).languages();
  const availableLocales = languages.map((lang) => lang.id);

  return match(
    preferredLanguages,
    availableLocales,
    defaultLanguage,
  ) as LanguageId;
}

function getCookieLocale(request: Request): LanguageId | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const entry = cookies.find((cookie) =>
    cookie.startsWith("preferred_language="),
  );
  if (!entry) return undefined;
  const value = entry.split("=")[1];
  return languages.find((lang) => lang.id === value)?.id;
}

export function proxy(request: Request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = new URL(request.url);
  const pathnameHasLocale = languages.some(
    (locale) =>
      pathname.startsWith(`/${locale.id}/`) || pathname === `/${locale.id}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getCookieLocale(request) ?? getLocale(request);
  const url = new URL(request.url);
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
