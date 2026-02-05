import { Button } from "@/components/ui/button";
import { type Service, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { ServicesSectionClient, ServiceCard } from "./services";
import { ServicesSectionMobileCarousel } from "./services/services-section-mobile";

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
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const featuredServices = servicesToDisplay.filter((s) => s.featured);
  const otherServices = servicesToDisplay.filter((s) => !s.featured);

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const servicesSlug = headerT("nav.servicesSlug");

  const phone = profileT("phone");
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : "https://wa.me/40775378525";

  // Pre-translate all services for client components
  const translatedServices = servicesToDisplay.map((service, index) => ({
    ...service,
    title: t(service.titleKey),
    description: t(service.descriptionKey),
    patternVariant: getPatternForService(index),
    featured: service.featured,
  }));

  const translatedFeatured = translatedServices.filter((s) => s.featured);
  const translatedOther = translatedServices.filter((s) => !s.featured);

  return (
    <section
      id={servicesSlug}
      className="scroll-mt-12 overflow-x-hidden py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl md:px-6">
        <ServicesSectionClient>
          {/* Header */}
          <div className="mb-12 md:mb-16 text-center px-4">
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
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {translatedFeatured.map((service, index) => (
              <div
                key={service._id}
                className={cn("min-w-0 lg:col-span-2 lg:row-span-2 text-lg")}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  patternVariant={service.patternVariant}
                  isVisible={true}
                  delay={0.6 + index * 0.1}
                  featured
                />
              </div>
            ))}

            {translatedOther.map((service, index) => (
              <div key={service._id} className="min-w-0">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  patternVariant={service.patternVariant}
                  isVisible={true}
                  delay={0.6 + (translatedFeatured.length + index) * 0.1}
                />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <ServicesSectionMobileCarousel
            services={translatedServices}
            headline={t("headline")}
          />

          {/* Section CTA */}
          <div className="mt-12 text-center px-4">
            <Button asChild size="lg" variant="outline">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t("cta")}
              </a>
            </Button>
          </div>
        </ServicesSectionClient>
      </div>
    </section>
  );
}
