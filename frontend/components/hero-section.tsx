import heroWorkingSurfaceLight from "@/assets/images/hero-working-surface-light.png";
import heroWorkingSurface from "@/assets/images/hero-working-surface.png";
import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Link } from "@/i18n/navigation";
import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function HeroSection() {
  const locale = await getLocale();
  const [t, profileT, headerT] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "settings.header" }),
  ]);
  const trustItems = t.raw("heroTrust") as string[];
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));
  const howIWorkSlug = headerT("nav.howIWorkSlug");
  const [headlineLead, headlineRest] = t("headline").split(", ");

  return (
    <section className="hero-instrument relative -mt-16 min-h-[100svh] overflow-hidden border-b border-[var(--hero-rule)] md:-mt-20">
      <div className="absolute inset-0">
        <Image
          src={heroWorkingSurfaceLight}
          alt=""
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          className="object-cover object-[63%_center] opacity-60 dark:hidden md:object-center"
        />
        <Image
          src={heroWorkingSurface}
          alt=""
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          className="hidden object-cover object-[63%_center] dark:block md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,240,231,.9)_0%,rgba(244,240,231,.62)_48%,rgba(244,240,231,.14)_100%)] dark:bg-[linear-gradient(90deg,rgba(13,13,11,.83)_0%,rgba(20,18,15,.59)_48%,rgba(16,15,13,.38)_100%)] md:bg-[linear-gradient(90deg,rgba(244,240,231,.82)_0%,rgba(244,240,231,.46)_55%,rgba(244,240,231,.08)_100%)] md:dark:bg-[linear-gradient(90deg,rgba(13,13,11,.7)_0%,rgba(20,18,15,.36)_55%,rgba(16,15,13,.26)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(238,232,220,.9)_0%,rgba(244,240,231,.08)_58%,rgba(244,240,231,.2)_100%)] dark:bg-[linear-gradient(0deg,rgba(12,12,10,.92)_0%,rgba(14,13,11,.26)_58%,rgba(10,10,9,.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_34%,transparent_0%,rgba(128,108,82,.04)_52%,rgba(83,69,50,.18)_100%)] dark:bg-[radial-gradient(circle_at_74%_34%,transparent_0%,rgba(9,9,8,.12)_52%,rgba(8,8,7,.52)_100%)]" />
      </div>

      <div className="relative flex min-h-[100svh] w-full flex-col justify-end px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 md:pb-6 md:pt-36 lg:px-12">
        <AnimatedContainer
          className="max-w-[63rem]"
          duration={1.4}
          delay={0.05}
          ease="veryGentle"
          offset={18}
        >
          <p className="editorial-label max-w-[21rem] leading-relaxed text-[var(--hero-muted)]">
            {t("heroEyebrow")}
          </p>
          <h1 className="editorial-display mt-3 max-w-[75rem] text-[clamp(3.15rem,5.15vw,5.4rem)] text-[var(--hero-fg)] [text-wrap:wrap] md:mt-4">
            <span className="sm:whitespace-nowrap">{headlineLead},</span>
            <br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap">{headlineRest}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[0.96rem] leading-relaxed text-[var(--hero-copy)] md:mt-2 md:text-lg">
            {t("tagline")}
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          className="mt-6 flex flex-wrap items-center gap-x-9 gap-y-3 md:mt-5"
          duration={1.2}
          delay={0.2}
          ease="veryGentle"
          offset={12}
        >
          <a
            id={HERO_CONTACT_BUTTON_ID}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="signal-button inline-flex min-h-12 items-center justify-center gap-3 px-7"
          >
            {t("primaryCta")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <Link
            href={{ pathname: "/", hash: howIWorkSlug }}
            className="inline-flex min-h-11 items-center border-[var(--hero-rule-strong)] border-b pt-0.5 text-sm font-medium text-[var(--hero-fg)] transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("seeHowIWork")}
          </Link>
        </AnimatedContainer>

        {Array.isArray(trustItems) && trustItems.length > 0 ? (
          <div className="mt-7 grid border-[var(--hero-rule)] border-t text-[0.82rem] text-[var(--hero-muted)] sm:grid-cols-3 md:mt-7 md:text-sm">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex min-h-11 items-center border-[var(--hero-rule)] border-b py-2.5 sm:border-r sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:border-r-0"
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p className="editorial-label absolute right-5 bottom-[29%] hidden origin-bottom-right rotate-90 text-primary sm:right-8 lg:right-12 lg:block">
        {t("availabilityNote")}
      </p>
    </section>
  );
}
