"use client";

import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  const locale = useLocale();
  const headerT = useTranslations("settings.header");
  const homeT = useTranslations("home");

  const skipLinkText = headerT("skipLinkText");
  const navigationLabel = headerT("navLabel");
  const homeButtonLabel = headerT("homeButtonLabel");
  const contactMeText = homeT("contactMe");
  const menuLabel = headerT("menuLabel");

  const servicesText = headerT("nav.services");
  const pricingText = headerT("nav.pricing");
  const blogText = headerT("nav.blog");
  const servicesSlug = headerT("nav.servicesSlug");
  const pricingSlug = headerT("nav.pricingSlug");

  const [showContactButton, setShowContactButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const heroButton = document.getElementById(HERO_CONTACT_BUTTON_ID);
    if (!heroButton) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowContactButton(!entry.isIntersecting);
      },
      {
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(heroButton);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed inset-0 z-50 flex h-16 w-full items-center md:h-20",
        className
      )}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 2,
        delay: 0.1,
        ease: [0.25, 1, 0.25, 1],
      }}
    >
      <a
        href="#main-content"
        className="focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-offset-background sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {skipLinkText}
      </a>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-10">
          <Link
            aria-label={homeButtonLabel}
            className="group flex items-center gap-2 p-0 text-xl font-bold shrink-0"
            href="/"
          >
            Eduard Stefan
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu
            aria-label={navigationLabel}
            className="hidden md:flex"
          >
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={`#${servicesSlug}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {servicesText}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={`#${pricingSlug}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {pricingText}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/blog"
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {blogText}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <div
              className={cn(
                "hidden md:block transition-opacity duration-200",
                showContactButton
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              )}
            >
              <Button asChild variant="default" size="sm">
                <a
                  href="https://wa.me/40775378525"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactMeText}
                </a>
              </Button>
            </div>
            <ModeToggle />
            <LanguageToggle currentLocale={locale} />

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-6" />
                  <span className="sr-only">{menuLabel}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="text-xl font-bold">
                    Eduard Stefan
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  <Link
                    href={`#${servicesSlug}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {servicesText}
                  </Link>
                  <Link
                    href={`#${pricingSlug}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {pricingText}
                  </Link>
                  <Link
                    href="/blog"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {blogText}
                  </Link>
                  <div className="mt-4 pt-4 border-t">
                    <Button asChild className="w-full">
                      <a
                        href="https://wa.me/40775378525"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {contactMeText}
                      </a>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
