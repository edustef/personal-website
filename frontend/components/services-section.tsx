import { services, type Service } from "@/lib/data/services";
import { getTranslations, getLocale } from "next-intl/server";
import {
  Layers,
  ShoppingCart,
  Zap,
  Rocket,
  Palette,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  layers: Layers,
  "shopping-cart": ShoppingCart,
  zap: Zap,
  rocket: Rocket,
  palette: Palette,
  headphones: Headphones,
};

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

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service) => {
            const Icon = iconMap[service.icon] || Layers;
            const title =
              service.title[locale as keyof typeof service.title] ||
              service.title.en;
            const description =
              service.description[locale as keyof typeof service.description] ||
              service.description.en;

            return (
              <div
                key={service._id}
                className={cn(
                  "rounded-2xl border border-border bg-card p-8",
                  "lg:col-span-2 lg:row-span-2",
                )}
              >
                <div className="bg-primary/10 text-primary mb-6 inline-flex rounded-xl p-3">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-semibold">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}

          {otherServices.map((service) => {
            const Icon = iconMap[service.icon] || Layers;
            const title =
              service.title[locale as keyof typeof service.title] ||
              service.title.en;
            const description =
              service.description[locale as keyof typeof service.description] ||
              service.description.en;

            return (
              <div
                key={service._id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-lg p-2.5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-2 text-base font-semibold">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
