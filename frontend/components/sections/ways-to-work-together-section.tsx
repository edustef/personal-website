import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { getWhatsAppUrl } from "@/lib/utils";
import { Check } from "lucide-react";
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
  const whatsappUrl = getWhatsAppUrl(undefined);

  return (
    <section id={sectionSlug} className="scroll-mt-12 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          label={t("label")}
          headline={t("headline")}
          subtitle={t("subtitle")}
          anchorSlug={sectionSlug}
        />

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          viewportMargin="-5%"
        >
          <Card className="overflow-hidden rounded-2xl border-border/30 bg-card/80 p-0 shadow-lg backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.85fr)]">
                <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                  <h3 className="text-foreground max-w-2xl text-2xl font-semibold leading-tight text-balance md:text-3xl">
                    {t("engagementTitle")}
                  </h3>
                  <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
                    {t("description")}
                  </p>

                  <dl className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12">
                    <div className="border-t border-border/60 pt-4">
                      <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                        {t("scopeLabel")}
                      </dt>
                      <dd className="text-foreground mt-2 max-w-sm text-base font-semibold leading-snug text-pretty">
                        {t("scopeValue")}
                      </dd>
                    </div>
                    <div className="border-t border-border/60 pt-4">
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

                <div className="flex flex-col border-t border-border/60 bg-muted/20 p-6 sm:p-8 md:p-10 lg:border-t-0 lg:border-l lg:p-12">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                    {t("includesTitle")}
                  </p>

                  <ul className="mt-8 space-y-5">
                    {includedItems.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check
                          aria-hidden="true"
                          className="text-primary mt-0.5 size-5 shrink-0"
                        />
                        <span className="text-foreground leading-relaxed text-pretty">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10 md:pt-12">
                    <Button asChild size="lg" className="min-h-12 w-full">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon aria-hidden="true" className="size-4" />
                        {t("cta")}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </section>
  );
}
