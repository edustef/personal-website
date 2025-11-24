"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { locales } from "@/i18n/routing";
import { usePathname } from "@/i18n/navigation";

export function LanguageToggle({
  currentLocale,
  className,
}: {
  currentLocale: string;
  className?: string;
}) {
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.split("/").slice(1).join("/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(({ id, title }) => (
          <DropdownMenuItem
            key={id}
            className={id === currentLocale ? "font-semibold" : undefined}
          >
            <Link
              locale={id}
              href={
                pathnameWithoutLocale === "" ? "/" : `/${pathnameWithoutLocale}`
              }
            >
              {title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
