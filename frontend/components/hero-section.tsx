import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { HighlightBadge } from "@/components/ui/highlight-badge";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function HeroSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  const ctaButtons = t.raw("ctaButtons") as Array<{
    text: string;
    href: string;
    variant: string;
  }>;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-10 text-center">
          <AnimatedContainer
            className="flex max-w-3xl flex-col items-center"
            duration={2.5}
            delay={0.1}
            ease="veryGentle"
            offset={16}
          >
            <HighlightBadge
              className="text-left text-sm md:text-base"
              href="/roi-calculator"
            >
              {t.rich("announcementLabel", {
                strong: (chunks) => (
                  <strong className="font-bold">{chunks}</strong>
                ),
              })}
            </HighlightBadge>
            <h1 className="mt-8 text-foreground group relative text-balance text-4xl md:text-6xl leading-tight">
              {t.rich("headline", {
                strong: (chunks) => (
                  <strong className="text-primary font-semibold">
                    {chunks}
                  </strong>
                ),
              })}
            </h1>
            <p className="mt-4 text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-pretty">
              {t("tagline")}
            </p>
          </AnimatedContainer>

          <AnimatedContainer
            className="flex gap-4"
            duration={2}
            delay={0.4}
            ease="veryGentle"
            offset={12}
          >
            <Button
              asChild
              size="lg"
              variant="default"
              id={HERO_CONTACT_BUTTON_ID}
            >
              <a
                href="https://wa.me/40775378525"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contactMe")}
              </a>
            </Button>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
