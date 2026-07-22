import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getWhatsAppUrl } from "@/lib/utils";
import { Calendar, Code2, MessageCircle, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

// Icons paired to the heroTrust items, in order:
// 0: "Publish without a dev queue", 1: "You own the code", 2: "No commitment, just a chat"
const trustIcons = [Zap, Code2, MessageCircle];

export default async function HeroSection() {
  const locale = await getLocale();
  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const trustItems = t.raw("heroTrust") as string[];
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

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
            <h1 className="text-foreground group relative text-balance text-4xl md:text-6xl leading-tight">
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
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            duration={2}
            delay={0.4}
            ease="veryGentle"
            offset={12}
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto"
              id={HERO_CONTACT_BUTTON_ID}
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-5" />
                {t("letsChat")}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/schedule">
                <Calendar className="size-5" />
                {t("seeHowIWork")}
              </Link>
            </Button>
          </AnimatedContainer>

          {Array.isArray(trustItems) && trustItems.length > 0 && (
            <AnimatedContainer
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              duration={2}
              delay={0.5}
              ease="veryGentle"
              offset={8}
            >
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <Icon className="size-4 text-primary" />
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
