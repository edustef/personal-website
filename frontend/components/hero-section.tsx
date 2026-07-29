import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Code2, Layers3, UsersRound } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

// Icons paired to the heroTrust items, in order:
// 0: senior partnership, 1: design-system discipline, 2: code ownership
const trustIcons = [UsersRound, Layers3, Code2];

export default async function HeroSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const trustItems = t.raw("heroTrust") as string[];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <AnimatedContainer
            className="flex max-w-4xl flex-col items-start"
            duration={1.2}
            delay={0.1}
            ease="veryGentle"
            offset={16}
          >
            <p className="text-primary mb-5 text-sm font-medium uppercase tracking-[0.18em]">
              {t("heroLabel")}
            </p>
            <h1 className="text-foreground group relative -ml-[0.03em] text-balance text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">
              {t.rich("headline", {
                strong: (chunks) => (
                  <strong className="text-primary font-normal">{chunks}</strong>
                ),
              })}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
              {t("tagline")}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto"
                id={HERO_CONTACT_BUTTON_ID}
              >
                <Link href="/schedule">
                  {t("primaryCta")}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/services/sanity">{t("secondaryCta")}</Link>
              </Button>
            </div>
          </AnimatedContainer>

          {Array.isArray(trustItems) && trustItems.length > 0 && (
            <AnimatedContainer
              className="border-border flex flex-col border-l pl-6"
              duration={1}
              delay={0.35}
              ease="veryGentle"
              offset={8}
            >
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <span
                    key={item}
                    className="border-border text-muted-foreground flex items-center gap-3 border-b py-4 text-sm first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <Icon className="text-primary size-4 shrink-0" />
                    {item}
                  </span>
                );
              })}
            </AnimatedContainer>
          )}
        </div>
      </div>
    </section>
  );
}
