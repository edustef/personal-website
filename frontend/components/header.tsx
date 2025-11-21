import { Button } from "@/components/ui/button";
import { type LanguageId } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/eduard-stefan-logo.svg";
import Image from "next/image";

const skipCopy: Record<LanguageId, string> = {
  en: "Skip to main content",
  ro: "Sari la continutul principal",
  es: "Saltar al contenido principal",
};

const navCopy: Record<LanguageId, string> = {
  en: "Primary navigation",
  ro: "Navigatie principala",
  es: "Navegacion principal",
};

const contactCopy: Record<LanguageId, string> = {
  en: "Contact me",
  ro: "Contacteaza-ma",
  es: "Contactame",
};

type HeaderProps = {
  locale: LanguageId;
  className?: string;
};

export async function Header({ locale, className }: HeaderProps) {
  const skipLinkText = skipCopy[locale] ?? skipCopy.en;
  const navLabel = navCopy[locale] ?? navCopy.en;
  const contactLabel = contactCopy[locale] ?? contactCopy.en;

  return (
    <header
      className={cn(
        "sticky inset-0 z-50 flex h-16 w-full items-center bg-transparent px-4 backdrop-blur-lg backdrop-brightness-50 backdrop-grayscale-75 md:h-20",
        className,
      )}
    >
      <a
        href="#main-content"
        className="focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-offset-background sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {skipLinkText}
      </a>
      <div className="container mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-5">
          <Link
            className="group flex items-center gap-2 p-0"
            href={`/${locale}`}
          >
            <Image
              className="size-6 md:size-8"
              src={Logo}
              alt="Eduard Stefan Logo"
            />
            {/* <span className="text-foreground hover:text-primary text-lg font-bold transition-colors sm:text-2xl">
              {title}
            </span> */}
          </Link>

          <NavigationMenu aria-label={navLabel}>
            <NavigationMenuList className="gap-4 md:gap-6">
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={`/${locale}`}>Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={`/${locale}/posts`}>Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button size="sm" asChild>
                  <Link href={`/${locale}/resume`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Link>
                </Button>
              </NavigationMenuItem> */}

              <NavigationMenuItem>
                <Button className="w-fit" asChild>
                  <a href="#contact">{contactLabel}</a>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <LanguageToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
