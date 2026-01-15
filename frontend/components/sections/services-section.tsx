import { AnimatedContainer } from "@/components/ui/animated-container";
import { BGPattern } from "@/components/ui/bg-pattern";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { type Service, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { Globe, Headphones, Layers, Palette, Rocket, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const iconMap: Record<string, React.ElementType> = {
  layers: Layers,
  zap: Zap,
  rocket: Rocket,
  palette: Palette,
  headphones: Headphones,
  globe: Globe,
};

const patternVariants: Array<"dots" | "diagonal-stripes" | "grid"> = [
  "diagonal-stripes",
  "dots",
  "grid",
];

function getPatternForService(
  index: number
): "dots" | "diagonal-stripes" | "grid" {
  const patternIndex = index % patternVariants.length;
  return patternVariants[patternIndex];
}

type ServicesSectionProps = {
  services?: Service[];
};

export default async function ServicesSection({
  services: servicesProp,
}: ServicesSectionProps) {
  const servicesToDisplay = servicesProp || services;
  if (!servicesToDisplay || servicesToDisplay.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "services" });

  const featuredServices = servicesToDisplay.filter((s) => s.featured);
  const otherServices = servicesToDisplay.filter((s) => !s.featured);

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const servicesSlug = headerT("nav.servicesSlug");

  return (
    <section
      id={servicesSlug}
      className="scroll-mt-12 overflow-x-hidden py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl md:px-6">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-12 md:mb-16 text-center px-4"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
            <a
              href={`#${servicesSlug}`}
              className="hover:text-primary transition-colors"
            >
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Layers;
            const patternVariant = getPatternForService(index);

            return (
              <AnimatedContainer
                key={service._id}
                trigger="scroll"
                fadeDirection="left"
                staggerIndex={index}
                staggerDelay={0.15}
                className={cn("min-w-0 lg:col-span-2 lg:row-span-2 text-lg")}
              >
                <Card className="isolate relative h-full w-full overflow-hidden rounded-2xl border-muted bg-background/50 backdrop-blur-sm">
                  <BGPattern variant={patternVariant} mask="fade-edges" opacity={0.25} />
                  <CardContent className="relative p-8">
                    <Icon className="size-10 mb-4" />
                    <h3 className="text-foreground mb-3 break-words text-xl font-semibold text-balance">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-lg break-words leading-relaxed text-pretty">
                      {t(service.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            );
          })}

          {otherServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Layers;
            const patternVariant = getPatternForService(
              featuredServices.length + index
            );

            return (
              <AnimatedContainer
                key={service._id}
                trigger="scroll"
                fadeDirection="up"
                staggerIndex={featuredServices.length + index}
                staggerDelay={0.1}
                className="min-w-0"
              >
                <Card className="isolate relative h-full w-full overflow-hidden rounded-2xl border-muted bg-background/50 backdrop-blur-sm">
                  <BGPattern
                    variant={patternVariant}
                    mask="fade-edges"
                    size={20}
                    opacity={0.25}
                  />
                  <CardContent className="relative p-6">
                    <Icon className="size-8 mb-4" />
                    <h3 className="text-foreground mb-2 break-words text-xl md:text-base font-semibold text-balance">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-muted-foreground break-words text-lg leading-relaxed text-pretty">
                      {t(service.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" aria-label={t("headline")}>
            <CarouselContent className="-ml-4 px-4 pb-4">
              {[...featuredServices, ...otherServices].map((service, index) => {
                const Icon = iconMap[service.icon] || Layers;
                const patternVariant = getPatternForService(index);

                return (
                  <CarouselItem
                    key={service._id}
                    className={cn(
                      "pl-4 basis-[85%]",
                      index === servicesToDisplay.length - 1 && "mr-4"
                    )}
                  >
                    <div className="h-full">
                      <Card className="isolate relative h-full w-full overflow-hidden rounded-2xl border-muted bg-background/50 backdrop-blur-sm">
                        <BGPattern
                          variant={patternVariant}
                          mask="fade-edges"
                          size={20}
                          opacity={0.25}
                        />
                        <CardContent className="relative p-6 flex flex-col h-full">
                          <Icon className="size-8 mb-4 shrink-0" />
                          <h3 className="text-foreground mb-2 break-words text-xl font-semibold text-balance">
                            {t(service.titleKey)}
                          </h3>
                          <p className="text-muted-foreground break-words text-lg leading-relaxed flex-grow text-pretty">
                            {t(service.descriptionKey)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
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
