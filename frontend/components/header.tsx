import { LanguageToggle } from "@/components/language-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";

const AnimatedLogo = dynamic(
  () =>
    import("./animated-logo").then((mod) => ({ default: mod.AnimatedLogo })),
  {
    loading: () => <div className="size-6 md:size-8" />,
  },
);

type HeaderProps = {
  locale: string;
  className?: string;
};

export async function Header({ locale, className }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "settings.header" });

  const skipLinkText = t("skipLinkText");
  const navigationLabel = t("navLabel");
  const homeButtonLabel = t("homeButtonLabel");
  const cta = t.raw("cta") as { text: string; href: string };
  const ctaText = cta.text;
  const ctaHref = cta.href;

  return (
    <header
      className={cn(
        "fixed inset-0 z-50 flex h-16 w-full items-center bg-transparent px-4 backdrop-blur-lg backdrop-brightness-50 backdrop-grayscale-75 md:h-20",
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
            aria-label={homeButtonLabel}
            className="group flex size-6 items-center gap-2 p-0 md:size-8"
            href="/"
          >
            <AnimatedLogo />
          </Link>

          <NavigationMenu aria-label={navigationLabel}>
            <NavigationMenuList className="gap-4 md:gap-6">
              <NavigationMenuItem>
                <Button asChild variant="default">
                  <I18nLink href={ctaHref}>{ctaText}</I18nLink>
                </Button>
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
