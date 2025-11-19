import { homeQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { localizeField, type LanguageId } from "@/lib/i18n";
import { ModeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";

type HeaderProps = {
  locale: LanguageId;
};

export async function Header({ locale }: HeaderProps) {
  const { data: home } = await sanityFetch({
    query: homeQuery,
  });

  const title = localizeField(home?.title, locale) || "Portfolio";

  return (
    <header className="bg-background border-border sticky inset-0 z-50 flex h-24 w-full items-center border-b px-3">
      <div className="container mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-5">
          <Link className="group flex items-center gap-2" href={`/${locale}`}>
            <span className="text-foreground hover:text-primary text-xl font-bold transition-colors sm:text-2xl">
              {title}
            </span>
          </Link>

          <NavigationMenu>
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
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
