"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LanguageToggle({
  hrefs,
  className,
}: {
  hrefs?: { locale: string; href: string }[];
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  const currentLocaleTitle =
    locales.find((l) => l.id === locale)?.title || locale.toUpperCase();

  if (!hrefs) {
    hrefs = locales.map((l) => ({ locale: l.id, href: pathname }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {currentLocaleTitle}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(({ id, title }) => (
          <DropdownMenuItem key={id} asChild>
            {hrefs?.find((href) => href.locale === id) ? (
              <Link
                href={hrefs.find((href) => href.locale === id)?.href as "/"}
                locale={id}
              >
                {title}
              </Link>
            ) : (
              <Button variant="link" asChild disabled>
                {title}
              </Button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
