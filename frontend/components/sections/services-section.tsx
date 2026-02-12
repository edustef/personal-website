import { BGPattern } from "@/components/ui/bg-pattern";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { getWhatsAppUrl } from "@/lib/utils";
import { type Service, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { Globe, Headphones, Layers, Palette, Rocket, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ServiceCard,
  ServiceCardMobile,
  ServicesCTA,
} from "./services-section-client";

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

// Define glow colors for variety
const glowColors = [
  "217 91% 60%", // Blue
  "262 83% 58%", // Purple
  "142 71% 45%", // Green
  "24 95% 53%",  // Orange
  "339 90% 51%", // Pink
  "198 93% 60%", // Cyan
];

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
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const featuredServices = servicesToDisplay.filter((s) => s.featured);
  const otherServices = servicesToDisplay.filter((s) => !s.featured);

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const servicesSlug = headerT("nav.servicesSlug");

  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

  return (
    <section
      id={servicesSlug}
      className="scroll-mt-12 overflow-x-hidden py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl md:px-6">
        <SectionHeader
          label={t("label")}
          headline={t("headline")}
          subtitle={t("subtitle")}
          anchorSlug={servicesSlug}
        />

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Layers;
            const patternVariant = getPatternForService(index);
            const glowColor = glowColors[index % glowColors.length];

            return (
              <ServiceCard
                key={service._id}
                index={index}
                featured
                glowColor={glowColor}
                className="lg:col-span-2 lg:row-span-2"
              >
                <div className="isolate relative h-full w-full overflow-hidden">
                  <BGPattern
                    variant={patternVariant}
                    mask="fade-edges"
                    opacity={0.25}
                  />
                  <CardContent className="relative p-8">
                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <Icon className="size-8 text-primary transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <h3 className="text-foreground mb-3 break-words text-xl font-semibold text-balance">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-lg break-words leading-relaxed text-pretty">
                      {t(service.descriptionKey)}
                    </p>
                  </CardContent>
                </div>
              </ServiceCard>
            );
          })}

          {otherServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Layers;
            const patternVariant = getPatternForService(
              featuredServices.length + index
            );
            const glowColor =
              glowColors[(featuredServices.length + index) % glowColors.length];

            return (
              <ServiceCard
                key={service._id}
                index={featuredServices.length + index}
                glowColor={glowColor}
              >
                <div className="isolate relative h-full w-full overflow-hidden">
                  <BGPattern
                    variant={patternVariant}
                    mask="fade-edges"
                    size={20}
                    opacity={0.25}
                  />
                  <CardContent className="relative p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <Icon className="size-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <h3 className="text-foreground mb-2 break-words text-xl md:text-base font-semibold text-balance">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-muted-foreground break-words text-lg md:text-base leading-relaxed text-pretty">
                      {t(service.descriptionKey)}
                    </p>
                  </CardContent>
                </div>
              </ServiceCard>
            );
          })}
        </div>

        {/* Mobile Carousel with scroll animations */}
        <div className="md:hidden">
          <Carousel className="w-full" aria-label={t("headline")}>
            <CarouselContent className="-ml-4 px-4 pb-4">
              {[...featuredServices, ...otherServices].map((service, index) => {
                const Icon = iconMap[service.icon] || Layers;
                const patternVariant = getPatternForService(index);
                const glowColor = glowColors[index % glowColors.length];

                return (
                  <CarouselItem
                    key={service._id}
                    className={cn(
                      "pl-4 basis-[85%]",
                      index === servicesToDisplay.length - 1 && "mr-4"
                    )}
                  >
                    <ServiceCardMobile
                      index={index}
                      glowColor={glowColor}
                      icon={<Icon className="size-7 text-primary" />}
                      bgPattern={
                        <BGPattern
                          variant={patternVariant}
                          mask="fade-edges"
                          size={20}
                          opacity={0.25}
                        />
                      }
                    >
                      <h3 className="text-foreground mb-2 break-words text-xl font-semibold text-balance">
                        {t(service.titleKey)}
                      </h3>
                      <p className="text-muted-foreground break-words text-lg leading-relaxed flex-grow text-pretty">
                        {t(service.descriptionKey)}
                      </p>
                    </ServiceCardMobile>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="mt-6">
              <CarouselDots />
            </div>
          </Carousel>
        </div>

        {/* Section CTA */}
        <ServicesCTA whatsappUrl={whatsappUrl} ctaText={t("cta")} />
      </div>
    </section>
  );
}
