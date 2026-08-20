"use client";

import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { ModeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
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
import { ArrowUpRight, Menu } from "lucide-react";
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
          ? "border-b border-border/50 bg-background/88 text-foreground shadow-sm backdrop-blur-md"
          : isHomePage
            ? "hero-header bg-transparent"
            : "bg-background/82 text-foreground backdrop-blur-md",
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
        className="focus-visible:bg-primary focus-visible:text-primary-foreground sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        {skipLinkText}
      </a>
      <div className="w-full px-5 sm:px-8">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_2fr_1fr]">
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
              className="group relative flex min-h-11 items-center justify-start p-0 font-sans text-sm font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:text-base"
              href="/"
            >
              <span>EDUARD STEFAN</span>
            </Link>
          </motion.div>

          <NavigationMenu
            aria-label={navigationLabel}
            className="hidden max-w-none justify-self-center md:flex"
          >
            <NavigationMenuList className="gap-4 lg:gap-7">
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
                          "group relative min-h-11 px-2 py-3 text-sm font-normal transition-colors duration-300 hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit data-[active=true]:bg-transparent data-[active=true]:hover:bg-transparent lg:text-base",
                          active && "text-primary"
                        )}
                      >
                        <span className="relative z-10">{text}</span>
                        {active && (
                          <motion.div
                            className="absolute inset-x-2 bottom-1 h-px bg-primary -z-10"
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

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <AnimatePresence mode="wait">
              {showContactButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {contactMeText}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden md:block [&_button]:min-w-11 [&_button]:px-2 [&_button]:font-mono [&_button]:text-xs [&_button]:uppercase">
              {languageToggle}
            </div>

            <div className="hidden border-l border-current/30 pl-3 md:block">
              <ModeToggle />
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "utility", size: "icon" }),
                    "size-11 md:hidden"
                  )}
                  aria-label={menuLabel}
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="contrast-dark w-full max-w-sm overflow-y-auto border-l border-white/15 bg-[#151512] p-0 text-[#f4f0e7]"
              >
                <div className="flex min-h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-14">
                  <SheetHeader className="px-0 text-left">
                    <SheetTitle className="text-2xl tracking-tight text-white">
                      Eduard Stefan
                    </SheetTitle>
                    <SheetDescription className="text-white/55">
                      {navigationLabel}
                    </SheetDescription>
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
                            "min-h-14 justify-start rounded-none border-white/20 border-b px-0 py-5 text-2xl font-medium tracking-tight text-white transition-colors",
                            "hover:text-primary focus-visible:text-primary",
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
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      {contactMeText}
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>

                    <div className="flex items-center justify-end gap-3 border-white/20 border-t pt-5">
                      <div className="[&_button]:min-w-11 [&_button]:font-mono [&_button]:text-xs [&_button]:uppercase">
                        {languageToggle}
                      </div>
                      <div className="border-white/30 border-l pl-3">
                        <ModeToggle />
                      </div>
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
