import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const pathRedirects: Record<string, string> = {
  "/ro/începe-proiectul-tău": "/ro/incepe-proiectul-tau",
  "/ro/politică-de-confidențialitate": "/ro/politica-de-confidentialitate",
  "/es/política-de-privacidad": "/es/politica-de-privacidad",
};

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathRedirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = pathRedirects[pathname];
    return NextResponse.redirect(url, 308);
  }

  return handleI18nRouting(
    request as unknown as Parameters<typeof handleI18nRouting>[0]
  );
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|magical-app).*)",
};
