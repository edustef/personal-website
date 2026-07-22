import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function WaysToWorkTogetherSection() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "waysToWorkTogether",
  });
  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });

  const sectionSlug = headerT("nav.pricingSlug");
  const includedItems = t.raw("includedItems") as string[];

  return (
    <section
      id={sectionSlug}
      aria-labelledby={`${sectionSlug}-title`}
      className="scroll-mt-12 py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-10 max-w-4xl md:mb-14"
        >
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-primary/40 md:w-14"
            />
            <p className="text-primary text-sm font-medium uppercase tracking-wider">
              {t("label")}
            </p>
          </div>
          <h2
            id={`${sectionSlug}-title`}
            className="text-foreground max-w-3xl text-3xl leading-tight tracking-tight text-balance md:text-5xl"
          >
            <a
              href={`#${sectionSlug}`}
              className="transition-colors hover:text-primary"
            >
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          viewportMargin="-5%"
        >
          <article className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-2xl shadow-foreground/5">
            <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.85fr)]">
              <div className="relative bg-secondary/35 p-6 sm:p-8 md:p-10 lg:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
                />

                <h3 className="text-foreground max-w-xl text-2xl font-semibold leading-tight text-balance md:text-3xl">
                  {t("engagementTitle")}
                </h3>
                <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
                  {t("description")}
                </p>

                <dl className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12">
                  <div className="border-t border-border/80 pt-4">
                    <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      {t("scopeLabel")}
                    </dt>
                    <dd className="text-foreground mt-2 max-w-xs text-base font-semibold leading-snug text-pretty">
                      {t("scopeValue")}
                    </dd>
                  </div>
                  <div className="border-t border-border/80 pt-4">
                    <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      {t("timelineLabel")}
                    </dt>
                    <dd className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
                      {t("timelineValue")}
                    </dd>
                  </div>
                </dl>

                <p className="text-muted-foreground mt-6 text-sm leading-relaxed text-pretty">
                  {t("timelineNote")}
                </p>
              </div>

              <div className="flex flex-col bg-navy-800 p-6 text-navy-50 sm:p-8 md:p-10 lg:p-12 dark:bg-navy-900">
                <p className="text-navy-200 text-sm font-medium uppercase tracking-wider">
                  {t("includesTitle")}
                </p>

                <ul className="mt-8 space-y-5">
                  {includedItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-navy-400 bg-navy-700">
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                      <span className="leading-relaxed text-pretty">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10 md:pt-12">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-12 w-full bg-navy-50 text-navy-900 shadow-none hover:bg-navy-100 hover:shadow-none"
                  >
                    <Link href="/start-your-project">
                      {t("cta")}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </AnimatedContainer>
      </div>
    </section>
  );
}
