import { AnimatedContainer } from "@/components/ui/animated-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import {
  AddOnCard,
  AddOnCardMobile,
  PackageCard,
  PackageCardsProvider,
} from "./how-i-price-section-client";

const packages = ["launch", "growth", "custom"] as const;
const addOns = ["seo", "analytics", "store", "multiLanguage"] as const;

export default async function HowIPriceSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "howIPrice" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const pricingSlug = headerT("nav.pricingSlug");

  const whatsappUrl = getWhatsAppUrl(profileT("phone"), "40770378214");

  return (
    <section id={pricingSlug} className="scroll-mt-12 py-12 md:py-16">
      <div className="mx-auto max-w-6xl md:px-4">
        <SectionHeader
          label={t("label")}
          headline={t("headline")}
          subtitle={t("subtitle")}
          anchorSlug={pricingSlug}
          className="mb-16"
        />

        <div className="mb-16 px-4">
          <PackageCardsProvider>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {packages.map((pkg, index) => {
                const isPopular = pkg === "growth";
                const features = t.raw(`${pkg}.features`) as string[];

                return (
                  <AnimatedContainer
                    key={pkg}
                    trigger="scroll"
                    fadeDirection="up"
                    staggerIndex={index}
                    staggerDelay={0.12}
                    className={cn(isPopular && "lg:scale-105", "overflow-visible")}
                  >
                    <PackageCard
                      pkg={pkg}
                      isPopular={isPopular}
                      title={t(`${pkg}.title`)}
                      bestFor={t(`${pkg}.bestFor`)}
                      description={t(`${pkg}.description`)}
                      features={features}
                      timeline={t(`${pkg}.timeline`)}
                      investment=""
                      whatsappUrl={whatsappUrl}
                    />
                  </AnimatedContainer>
                );
              })}
            </div>
          </PackageCardsProvider>
        </div>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="text-center flex flex-col items-center px-4"
        >
          <h3 className="text-foreground mb-4 text-2xl font-semibold text-balance">
            {t("addOns.title")}
          </h3>
          <p className="text-muted-foreground mb-8 text-pretty">
            {t("addOns.subtitle")}
          </p>
        </AnimatedContainer>

        <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {addOns.map((addOn, index) => (
            <AddOnCard key={addOn} index={index}>
              <Card className="h-full rounded-xl border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                <CardContent className="p-5">
                  <h4 className="text-foreground text-xl mb-2 font-semibold text-balance">
                    {t(`addOns.${addOn}.title`)}
                  </h4>
                  <p className="text-muted-foreground mb-3 leading-relaxed text-pretty">
                    {t(`addOns.${addOn}.benefit`)}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary text-sm text-left w-full transition-colors"
                  >
                    {t("addOns.contactForPricing")}
                  </a>
                </CardFooter>
              </Card>
            </AddOnCard>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" aria-label={t("addOns.title")}>
            <CarouselContent className="-ml-4 px-4 pb-4">
              {addOns.map((addOn, index) => (
                <CarouselItem
                  key={addOn}
                  className={cn(
                    "pl-4 basis-[85%]",
                    index === addOns.length - 1 && "mr-4"
                  )}
                >
                  <AddOnCardMobile index={index}>
                    <Card className="h-full rounded-xl border-muted bg-background/50 backdrop-blur-sm overflow-hidden shadow-lg">
                      <CardContent className="p-5">
                        <h4 className="text-foreground text-xl mb-2 font-semibold text-balance">
                          {t(`addOns.${addOn}.title`)}
                        </h4>
                        <p className="text-muted-foreground mb-3 leading-relaxed text-pretty">
                          {t(`addOns.${addOn}.benefit`)}
                        </p>
                      </CardContent>
                      <CardFooter className="mt-auto pt-6">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary text-sm text-left w-full transition-colors"
                        >
                          {t("addOns.contactForPricing")}
                        </a>
                      </CardFooter>
                    </Card>
                  </AddOnCardMobile>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6">
              <CarouselDots />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
