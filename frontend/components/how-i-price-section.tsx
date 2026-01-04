import { AnimatedContainer } from "@/components/ui/animated-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import {
  PackageCard,
  PackageCardsProvider,
} from "./how-i-price-section-client";

const packages = ["launch", "growth", "custom"] as const;
const addOns = ["seo", "store", "multiLanguage", "analytics"] as const;

export default async function HowIPriceSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "howIPrice" });

  const formatPrice = (amount: number): string => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(amount)}+`;
  };

  return (
    <section id="how-i-price" className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl md:px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-16 text-center px-4"
        >
          <p className="text-primary mb-3 font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            <a
              href="#how-i-price"
              className="hover:text-primary transition-colors"
            >
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

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
                    className={cn(isPopular && "lg:scale-105")}
                  >
                    <PackageCard
                      pkg={pkg}
                      isPopular={isPopular}
                      title={t(`${pkg}.title`)}
                      bestFor={t(`${pkg}.bestFor`)}
                      description={t(`${pkg}.description`)}
                      features={features}
                      timeline={t(`${pkg}.timeline`)}
                      investment={
                        pkg === "custom"
                          ? t(`${pkg}.investment`)
                          : formatPrice(
                              t.raw(`${pkg}.investmentAmount`) as number
                            )
                      }
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
          className="flex flex-col items-center px-4"
        >
          <h3 className="text-foreground mb-4 text-2xl font-semibold">
            {t("addOns.title")}
          </h3>
          <p className="text-muted-foreground mb-8">{t("addOns.subtitle")}</p>
        </AnimatedContainer>

        <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {addOns.map((addOn, index) => (
            <AnimatedContainer
              key={addOn}
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={index}
              staggerDelay={0.08}
            >
              <Card className="h-full rounded-xl">
                <CardContent className="p-5">
                  <h4 className="text-foreground text-xl mb-2 font-semibold">
                    {t(`addOns.${addOn}.title`)}
                  </h4>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {t(`addOns.${addOn}.benefit`)}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <p className="text-primary text-lg font-semibold">
                    {formatPrice(
                      t.raw(`addOns.${addOn}.priceAmount`) as number
                    )}
                  </p>
                </CardFooter>
              </Card>
            </AnimatedContainer>
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
                  <div className="h-full">
                    <Card className="h-full rounded-xl">
                      <CardContent className="p-5">
                        <h4 className="text-foreground text-xl mb-2 font-semibold">
                          {t(`addOns.${addOn}.title`)}
                        </h4>
                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {t(`addOns.${addOn}.benefit`)}
                        </p>
                      </CardContent>
                      <CardFooter className="mt-auto pt-6">
                        <p className="text-primary text-lg font-semibold">
                          {formatPrice(
                            t.raw(`addOns.${addOn}.priceAmount`) as number
                          )}
                        </p>
                      </CardFooter>
                    </Card>
                  </div>
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
