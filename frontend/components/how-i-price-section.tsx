import { AnimatedContainer } from "@/components/ui/animated-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  PackageCard,
  PackageCardsProvider,
} from "./how-i-price-section-client";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

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
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-16 text-center"
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

        <div className="mb-16">
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
          className="flex flex-col items-center"
        >
          <h3 className="text-foreground mb-4 text-2xl font-semibold">
            {t("addOns.title")}
          </h3>
          <p className="text-muted-foreground mb-8">{t("addOns.subtitle")}</p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
