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
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type HeaderProps = {
  className?: string;
};

const navItems = [
  { key: "services", slugKey: "servicesSlug" },
  { key: "pricing", slugKey: "pricingSlug" },
  { key: "blog", href: "/blog" },
] as const;

export function Header({ className }: HeaderProps) {
  const locale = useLocale();
  const pathname = usePathname();
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

  const isHomePage = pathname === "/";
  const servicesHref = isHomePage ? `#${servicesSlug}` : `/#${servicesSlug}`;
  const pricingHref = isHomePage ? `#${pricingSlug}` : `/#${pricingSlug}`;

  const [showContactButton, setShowContactButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [activeSection, setActiveSection] = useState("");

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash) {
        const sectionId = hash.slice(1);
        if (sectionId === servicesSlug || sectionId === pricingSlug) {
          setActiveSection(sectionId);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);
    handleScroll();
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [servicesSlug, pricingSlug]);

  useEffect(() => {
    if (!isHomePage) return;

    const servicesElement = document.getElementById(servicesSlug);
    const pricingElement = document.getElementById(pricingSlug);

    if (!servicesElement || !pricingElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === servicesSlug || id === pricingSlug) {
              setActiveSection(id);
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    observer.observe(servicesElement);
    observer.observe(pricingElement);

    return () => {
      observer.disconnect();
    };
  }, [isHomePage, servicesSlug, pricingSlug]);

  const getNavHref = (item: (typeof navItems)[number]) => {
    if ("href" in item && item.href) return item.href;
    const slug = item.key === "services" ? servicesSlug : pricingSlug;
    return isHomePage ? `#${slug}` : `/#${slug}`;
  };

  const getNavText = (item: (typeof navItems)[number]) => {
    if (item.key === "services") return servicesText;
    if (item.key === "pricing") return pricingText;
    return blogText;
  };

  const isActive = (item: (typeof navItems)[number]) => {
    if ("href" in item && item.href) return pathname.startsWith(item.href);
    if (item.key === "services") {
      return (
        isHomePage &&
        (currentHash === `#${servicesSlug}` || activeSection === servicesSlug)
      );
    }
    if (item.key === "pricing") {
      return (
        isHomePage &&
        (currentHash === `#${pricingSlug}` || activeSection === pricingSlug)
      );
    }
    return false;
  };

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-16 w-full items-center transition-all duration-300 md:h-20",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <a
        href="#main-content"
        className="focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-offset-background sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {skipLinkText}
      </a>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              aria-label={homeButtonLabel}
              className="group relative flex items-center gap-2 p-0 text-xl font-bold shrink-0 transition-colors hover:text-primary"
              href="/"
            >
              <span className="relative">
                Eduard Stefan
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.25, 1] }}
                />
              </span>
            </Link>
          </motion.div>

          <NavigationMenu
            aria-label={navigationLabel}
            className="hidden md:flex flex-1"
          >
            <NavigationMenuList className="gap-1">
              {navItems.map((item, index) => {
                const href = getNavHref(item);
                const text = getNavText(item);
                const active = isActive(item);

                return (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={href}
                        className={cn(
                          "group relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                          "hover:text-primary",
                          active && "text-primary"
                        )}
                      >
                        <span className="relative z-10">{text}</span>
                        <motion.span
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
                          initial={{ scaleX: active ? 1 : 0 }}
                          animate={{ scaleX: active ? 1 : 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 1, 0.25, 1],
                          }}
                        />
                        {active && (
                          <motion.div
                            className="absolute inset-0 rounded-md bg-primary/5 -z-10"
                            layoutId="activeNavItem"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <AnimatePresence mode="wait">
              {showContactButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block"
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
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ModeToggle />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <LanguageToggle currentLocale={locale} />
            </motion.div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      {isMobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="size-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="size-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="sr-only">{menuLabel}</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <SheetHeader className="text-left mb-8">
                    <SheetTitle className="text-xl font-bold">
                      Eduard Stefan
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      {navigationLabel}
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item, index) => {
                      const href = getNavHref(item);
                      const text = getNavText(item);
                      const active = isActive(item);

                      return (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                          }}
                        >
                          <Link
                            href={href}
                            className={cn(
                              "group relative flex items-center px-4 py-2 text-lg font-medium rounded-md transition-colors duration-300",
                              "hover:text-primary",
                              active && "text-primary"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="relative z-10">{text}</span>
                            <motion.span
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
                              initial={{ scaleX: active ? 1 : 0 }}
                              animate={{ scaleX: active ? 1 : 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.25, 1, 0.25, 1],
                              }}
                            />
                            {active && (
                              <motion.div
                                className="absolute inset-0 rounded-md bg-primary/5 -z-10"
                                layoutId="activeMobileNavItem"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: navItems.length * 0.1,
                      }}
                      className="mt-6 pt-6 border-t"
                    >
                      <Button asChild className="w-full" size="lg">
                        <a
                          href="https://wa.me/40775378525"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {contactMeText}
                        </a>
                      </Button>
                    </motion.div>
                  </nav>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
