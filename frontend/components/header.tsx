"use client";

import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { ModeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type HeaderProps = {
  className?: string;
  languageToggle?: React.ReactNode;
};

const navItems = [
  { key: "services" },
  { key: "howIWork" },
  { key: "pricing" },
  { key: "blog", href: "/blog" },
] as const;

export function Header({ className, languageToggle }: HeaderProps) {
  const pathname = usePathname();
  const headerT = useTranslations("settings.header");

  const skipLinkText = headerT("skipLinkText");
  const navigationLabel = headerT("navLabel");
  const homeButtonLabel = headerT("homeButtonLabel");
  const contactMeText = headerT("cta.text");
  const menuLabel = headerT("menuLabel");

  const whatsappUrl = getWhatsAppUrl(undefined);
  const servicesText = headerT("nav.services");
  const pricingText = headerT("nav.pricing");
  const howIWorkText = headerT("nav.howIWork");
  const blogText = headerT("nav.blog");
  const servicesSlug = headerT("nav.servicesSlug");
  const pricingSlug = headerT("nav.pricingSlug");
  const howIWorkSlug = headerT("nav.howIWorkSlug");

  const isHomePage = pathname === "/";

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
      // Clear active section when at top of page
      if (window.scrollY < 100) {
        setActiveSection("");
        setCurrentHash("");
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash) {
        const sectionId = hash.slice(1);
        if (
          sectionId === servicesSlug ||
          sectionId === pricingSlug ||
          sectionId === howIWorkSlug
        ) {
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
  }, [servicesSlug, pricingSlug, howIWorkSlug]);

  useEffect(() => {
    if (!isHomePage) return;

    const servicesElement = document.getElementById(servicesSlug);
    const pricingElement = document.getElementById(pricingSlug);
    const howIWorkElement = document.getElementById(howIWorkSlug);

    if (!servicesElement || !pricingElement || !howIWorkElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (
              id === servicesSlug ||
              id === pricingSlug ||
              id === howIWorkSlug
            ) {
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
    observer.observe(howIWorkElement);

    return () => {
      observer.disconnect();
    };
  }, [isHomePage, servicesSlug, pricingSlug, howIWorkSlug]);

  const getNavHref = (item: (typeof navItems)[number]) => {
    if ("href" in item && item.href) return item.href;
    let slug: string;
    if (item.key === "services") slug = servicesSlug;
    else if (item.key === "pricing") slug = pricingSlug;
    else if (item.key === "howIWork") slug = howIWorkSlug;
    else slug = "";
    return isHomePage ? `#${slug}` : `/#${slug}`;
  };

  const getNavText = (item: (typeof navItems)[number]) => {
    if (item.key === "services") return servicesText;
    if (item.key === "pricing") return pricingText;
    if (item.key === "howIWork") return howIWorkText;
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
    if (item.key === "howIWork") {
      return (
        isHomePage &&
        (currentHash === `#${howIWorkSlug}` || activeSection === howIWorkSlug)
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
              onClick={() => {
                setActiveSection("");
                setCurrentHash("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
            className="hidden flex-1 md:flex"
          >
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => {
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
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="size-4" />
                      {contactMeText}
                    </a>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ModeToggle />
            </motion.div>

            <motion.div
              className="hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {languageToggle}
            </motion.div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "md:hidden"
                  )}
                  aria-label={menuLabel}
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-sm overflow-y-auto p-0"
              >
                <div className="flex min-h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-14">
                  <SheetHeader className="px-0 text-left">
                    <SheetTitle className="text-2xl tracking-tight">
                      Eduard Stefan
                    </SheetTitle>
                    <SheetDescription>{navigationLabel}</SheetDescription>
                  </SheetHeader>

                  <nav
                    aria-label={navigationLabel}
                    className="mt-10 flex flex-col"
                  >
                    {navItems.map((item) => {
                      const href = getNavHref(item);
                      const text = getNavText(item);
                      const active = isActive(item);

                      return (
                        <Link
                          key={item.key}
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "justify-start rounded-none border-b px-0 py-5 text-2xl font-medium tracking-tight no-underline transition-colors",
                            "hover:text-primary hover:no-underline focus-visible:text-primary",
                            active && "text-primary"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {text}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="mt-auto space-y-6 pt-10">
                    <Button asChild size="lg" className="w-full">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <WhatsAppIcon className="size-5" />
                        {contactMeText}
                      </a>
                    </Button>

                    <div className="flex items-center justify-between border-t pt-5">
                      <ModeToggle />
                      {languageToggle}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
