import { Button } from "@/components/ui/button";
import { localizeField } from "@/sanity/lib/localization";
import { LanguageToggle } from "@/components/language-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { AnimatedLogo } from "./animated-logo";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import ResolvedLink from "./sanity/resolved-link";

type HeaderProps = {
  locale: string;
  className?: string;
};

export async function Header({ locale, className }: HeaderProps) {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  if (!settings) {
    return null;
  }

  const skipLinkText = localizeField(settings.header.skipLinkText, locale);
  const navigationLabel = localizeField(settings.header.navLabel, locale);

  console.log(settings.header.cta);

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
            className="group flex size-6 items-center gap-2 p-0 md:size-8"
            href="/"
          >
            <AnimatedLogo />
          </Link>

          <NavigationMenu aria-label={navigationLabel}>
            <NavigationMenuList className="gap-4 md:gap-6">
              <NavigationMenuItem>
                <ResolvedLink variant="default" link={settings.header.cta.link}>
                  {localizeField(settings.header.cta.text, locale)}
                </ResolvedLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <LanguageToggle currentLocale={locale} />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
