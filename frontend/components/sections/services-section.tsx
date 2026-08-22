import contentModelDarkImage from "@/assets/images/services/content-model-dark.webp";
import contentModelImage from "@/assets/images/services/content-model.webp";
import continuityTimelineDarkImage from "@/assets/images/services/continuity-timeline-dark.webp";
import continuityTimelineImage from "@/assets/images/services/continuity-timeline.webp";
import migrationSheetDarkImage from "@/assets/images/services/migration-sheet-dark.webp";
import migrationSheetImage from "@/assets/images/services/migration-sheet.webp";
import pageLayoutDarkImage from "@/assets/images/services/page-layout-dark.webp";
import pageLayoutImage from "@/assets/images/services/page-layout.webp";
import qualityAuditDarkImage from "@/assets/images/services/quality-audit-dark.webp";
import qualityAuditImage from "@/assets/images/services/quality-audit.webp";
import spacingSpecDarkImage from "@/assets/images/services/spacing-spec-dark.webp";
import spacingSpecImage from "@/assets/images/services/spacing-spec.webp";
import { Link } from "@/i18n/navigation";
import { type Service, services } from "@/lib/data/services";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image, { type StaticImageData } from "next/image";
import { ServicesGridMotion } from "./services-grid-motion";

type ServicesSectionProps = { services?: Service[] };

function ThemedArtifactImage({
  lightSrc,
  darkSrc,
  sizes,
  className,
}: {
  lightSrc: StaticImageData;
  darkSrc: StaticImageData;
  sizes: string;
  className: string;
}) {
  return (
    <>
      <Image
        src={lightSrc}
        alt=""
        fill
        aria-hidden="true"
        sizes={sizes}
        className={`${className} will-change-transform dark:hidden`}
      />
      <Image
        src={darkSrc}
        alt=""
        fill
        aria-hidden="true"
        sizes={sizes}
        className={`hidden ${className} will-change-transform dark:block`}
      />
    </>
  );
}

function PageLayoutArtifact() {
  return (
    <figure
      data-service-artifact
      className="relative order-first aspect-[3/2] w-full overflow-hidden border-foreground/12 border-b md:order-last md:aspect-auto md:min-h-64 md:border-b-0 md:border-l"
    >
      <ThemedArtifactImage
        lightSrc={pageLayoutImage}
        darkSrc={pageLayoutDarkImage}
        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

function ContentModelArtifact({ alternate = false }: { alternate?: boolean }) {
  return (
    <figure
      data-service-artifact
      className={`relative order-first aspect-square w-full self-stretch overflow-hidden md:aspect-auto md:min-h-64 ${alternate ? "xl:order-last" : "md:order-last"}`}
    >
      <ThemedArtifactImage
        lightSrc={contentModelImage}
        darkSrc={contentModelDarkImage}
        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

function MigrationArtifact() {
  return (
    <figure
      data-service-artifact
      className="relative order-first aspect-square w-full self-stretch overflow-hidden md:order-last md:aspect-auto md:min-h-44"
    >
      <ThemedArtifactImage
        lightSrc={migrationSheetImage}
        darkSrc={migrationSheetDarkImage}
        sizes="(min-width: 1280px) 16vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

function SpacingArtifact({ alternate = false }: { alternate?: boolean }) {
  return (
    <figure
      data-service-artifact
      className={`relative order-first aspect-[1586/992] w-full self-stretch overflow-hidden md:aspect-auto md:min-h-44 ${alternate ? "xl:order-last" : "md:order-last"}`}
    >
      <ThemedArtifactImage
        lightSrc={spacingSpecImage}
        darkSrc={spacingSpecDarkImage}
        sizes="(min-width: 1280px) 16vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

function PerformanceArtifact() {
  return (
    <figure
      data-service-artifact
      className="relative order-first aspect-square w-full self-stretch overflow-hidden md:order-last md:aspect-auto md:min-h-44"
    >
      <ThemedArtifactImage
        lightSrc={qualityAuditImage}
        darkSrc={qualityAuditDarkImage}
        sizes="(min-width: 1280px) 16vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

function CapabilityCell({
  title,
  description,
  artifact,
  className,
}: {
  title: string;
  description: string;
  artifact: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`grid min-w-0 border-foreground/18 border-r border-b md:h-64 md:grid-cols-[minmax(15rem,0.82fr)_minmax(16rem,1.18fr)] xl:h-72 ${className ?? ""}`}
    >
      <div className="flex min-w-0 flex-col p-5 sm:p-7 md:justify-center xl:p-6">
        <div>
          <h3 className="max-w-[18ch] text-[1.75rem] leading-[1.02] font-normal tracking-[-0.04em] text-balance sm:text-[2rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-[38ch] text-[0.82rem] leading-[1.5] text-foreground/66 sm:text-[0.86rem]">
            {description}
          </p>
        </div>
      </div>
      {artifact}
    </article>
  );
}

function EvidenceCell({
  title,
  description,
  artifact,
}: {
  title: string;
  description: string;
  artifact: React.ReactNode;
}) {
  return (
    <article className="grid min-w-0 border-foreground/18 border-r border-b md:h-48 md:grid-cols-[minmax(11rem,0.95fr)_minmax(10rem,1.05fr)]">
      <div className="flex min-w-0 flex-col p-5 sm:p-6 md:justify-center">
        <div>
          <h3 className="max-w-[16ch] text-[1.45rem] leading-[1.02] font-normal tracking-[-0.035em] text-balance">
            {title}
          </h3>
          <p className="mt-3 max-w-[34ch] text-[0.82rem] leading-[1.5] text-foreground/62">
            {description}
          </p>
        </div>
      </div>
      {artifact}
    </article>
  );
}

function ContinuityArtifact() {
  return (
    <figure
      data-service-artifact
      className="relative order-first aspect-[1923/818] w-full overflow-hidden md:aspect-auto md:min-h-32 xl:order-last"
    >
      <ThemedArtifactImage
        lightSrc={continuityTimelineImage}
        darkSrc={continuityTimelineDarkImage}
        sizes="(min-width: 768px) 65vw, 100vw"
        className="object-cover"
      />
    </figure>
  );
}

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
  const [first, second, ...remaining] = items;

  return (
    <section
      id={servicesSlug}
      className="scroll-mt-16 bg-background py-20 text-foreground md:py-16 dark:bg-[#11110f]"
    >
      <div className="editorial-shell">
        <header className="max-w-[76rem]">
          <p className="editorial-label text-foreground/56">
            {t("label")}
          </p>
          <h2 className="editorial-display mt-5 max-w-[22ch] text-[clamp(3rem,4.5vw,4.35rem)]">
            {t("headline")}
          </h2>
          <p className="mt-5 max-w-[50ch] text-base leading-[1.55] text-foreground/68 md:text-lg">
            {t("subtitle")}
          </p>
        </header>

        <ServicesGridMotion>
          {first ? (
            <CapabilityCell
              title={t(first.titleKey)}
              description={t(first.descriptionKey)}
              artifact={<PageLayoutArtifact />}
              className="xl:col-span-6"
            />
          ) : null}
          {second ? (
            <CapabilityCell
              title={t(second.titleKey)}
              description={t(second.descriptionKey)}
              artifact={<ContentModelArtifact alternate />}
              className="xl:col-span-6"
            />
          ) : null}

          <div className="grid min-w-0 xl:col-span-12 xl:grid-cols-3">
            <EvidenceCell
              title={t("artifacts.migration.title")}
              description={t("artifacts.migration.description")}
              artifact={<MigrationArtifact />}
            />
            <EvidenceCell
              title={t("artifacts.spacing.title")}
              description={t("artifacts.spacing.description")}
              artifact={<SpacingArtifact alternate />}
            />
            <EvidenceCell
              title={t("artifacts.performance.title")}
              description={t("artifacts.performance.description")}
              artifact={<PerformanceArtifact />}
            />
          </div>

          {remaining.map((service) => (
            <article
              key={service._id}
              className="grid min-w-0 border-foreground/18 border-r border-b md:h-40 md:grid-cols-[minmax(18rem,0.35fr)_minmax(24rem,0.65fr)] xl:col-span-12"
            >
              <div className="flex min-w-0 flex-col p-5 sm:p-7 md:justify-center xl:p-8">
                <div>
                  <h3 className="max-w-[16ch] text-[1.65rem] leading-[1.02] font-normal tracking-[-0.04em] text-balance sm:text-[1.9rem]">
                    {t(service.titleKey)}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-sm leading-[1.5] text-foreground/64">
                    {t(service.descriptionKey)}
                  </p>
                </div>
              </div>
              <ContinuityArtifact />
            </article>
          ))}
        </ServicesGridMotion>

        <div className="mt-7 flex justify-end">
          <Link
            href="/schedule"
            className="group inline-flex min-h-11 items-center gap-2 border-foreground/48 border-b pt-0.5 font-medium transition-colors hover:border-primary hover:text-primary motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("cta")}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
