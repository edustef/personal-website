import { homeQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, FileText } from "lucide-react";
import { localizeField, type LanguageId } from "@/lib/i18n";
import { ModeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

type HeaderProps = {
  locale: LanguageId;
  className?: string;
};

export async function Header({ locale, className }: HeaderProps) {
  const { data: home } = await sanityFetch({
    query: homeQuery,
  });

  const title = localizeField(home?.title, locale) || "Portfolio";

  return (
    <header
      className={cn(
        "bg-background border-border sticky inset-0 z-50 flex h-24 w-full items-center border-b px-4",
        className,
      )}
    >
      <div className="container mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-5">
          <Link
            className="group flex items-center gap-2 p-0"
            href={`/${locale}`}
          >
            <span className="text-foreground hover:text-primary text-lg font-bold transition-colors sm:text-2xl">
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
                <Button className="w-fit" asChild>
                  <a
                    href="/files/eduard-stefan-resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get my resume</span>
                    <ExternalLinkIcon className="size-4" />
                  </a>
                </Button>
              </NavigationMenuItem>
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
