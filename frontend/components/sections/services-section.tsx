import { Link } from "@/i18n/navigation";
import { type Service, services } from "@/lib/data/services";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

type ServicesSectionProps = { services?: Service[] };

export default async function ServicesSection({
  services: servicesProp,
}: ServicesSectionProps) {
  const items = servicesProp || services;
  if (!items?.length) return null;

  const locale = await getLocale();
  const [t, headerT] = await Promise.all([
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "settings.header" }),
  ]);
  const servicesSlug = headerT("nav.servicesSlug");

  return (
    <section id={servicesSlug} className="scroll-mt-16 py-24 md:py-36">
      <div className="editorial-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="editorial-label">01 / {t("label")}</p>
            <h2 className="editorial-display mt-5 max-w-5xl text-5xl sm:text-6xl lg:text-8xl">
              {t("headline")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed lg:col-span-4 lg:pb-2 lg:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid border-border/80 border-t border-l sm:grid-cols-2 lg:grid-cols-12">
          {items.map((service, index) => {
            const featured = service.featured;
            return (
              <article
                key={service._id}
                className={`group relative min-h-64 border-border/80 border-r border-b p-6 transition-colors hover:bg-[#a96f52]/12 md:p-8 ${featured ? "lg:col-span-6 lg:min-h-80" : "lg:col-span-3"}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <div className="mt-16 md:mt-24">
                  <h3
                    className={`max-w-lg font-normal leading-[1.05] tracking-[-0.035em] ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
                  >
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
                    {t(service.descriptionKey)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/schedule"
            className="group inline-flex items-center gap-2 border-foreground/50 border-b pb-1 font-medium hover:border-primary"
          >
            {t("cta")}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
