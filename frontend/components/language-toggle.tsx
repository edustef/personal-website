"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { useEffect, useRef } from "react";

export function LanguageToggle({
  currentLocale,
  className,
}: {
  currentLocale: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      const scrollY = Number.parseInt(savedScroll, 10);
      sessionStorage.removeItem("scrollPosition");

      const restoreScroll = () => {
        window.scrollTo({
          top: scrollY,
          behavior: "auto",
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(restoreScroll);
      });

      setTimeout(restoreScroll, 100);
    }
  }, []);

  const currentLocaleTitle =
    locales.find((locale) => locale.id === currentLocale)?.title ||
    currentLocale.toUpperCase();

  const handleLanguageChange = (localeId: string) => {
    if (localeId === currentLocale) return;

    scrollPositionRef.current = window.scrollY;
    sessionStorage.setItem("scrollPosition", String(scrollPositionRef.current));

    router.push(pathname, { locale: localeId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {currentLocaleTitle}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={currentLocale}>
          {locales.map(({ id, title }) => (
            <DropdownMenuRadioItem
              key={id}
              value={id}
              onSelect={() => handleLanguageChange(id)}
            >
              {title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
