"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { languages, type LanguageId } from "@/lib/i18n";
import { useLocale } from "@/app/[locale]/locale-provider";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setPreferredLanguage = useCallback((nextLocale: LanguageId) => {
    document.cookie = `preferred_language=${nextLocale}; path=/; max-age=31536000; sameSite=Lax`;
    const parts = pathname.split("/");
    const rest = parts.slice(2).join("/");
    const nextPath = rest ? `/${nextLocale}/${rest}` : `/${nextLocale}`;
    router.push(nextPath);
  }, [pathname, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onSelect={(event) => {
              event.preventDefault();
              if (lang.id !== locale) {
                setPreferredLanguage(lang.id);
              }
            }}
            className={lang.id === locale ? "font-semibold" : undefined}
          >
            {lang.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

