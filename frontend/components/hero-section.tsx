import heroWorkingSurfaceLight from "@/assets/images/hero-working-surface-light.png";
import heroWorkingSurfaceDark from "@/assets/images/hero-working-surface.png";
import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function HeroSection() {
  const locale = await getLocale();
  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const trustItems = t.raw("heroTrust") as string[];
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));
  const [headlineLead, headlineRest] = t("headline").split(", ");

  return (
    <section className="hero-instrument relative min-h-[100svh] overflow-hidden border-[var(--hero-rule)] border-b">
      <div className="absolute inset-0">
        <Image
          src={heroWorkingSurfaceLight}
          alt=""
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          className="object-cover object-[62%_center] dark:hidden md:object-center"
        />
        <Image
          src={heroWorkingSurfaceDark}
          alt=""
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          className="hidden object-cover object-[62%_center] dark:block md:object-center"
        />
        <div className="hero-scrim-side absolute inset-0" />
        <div className="hero-scrim-depth absolute inset-0" />
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
          <h1 className="editorial-display mt-3 max-w-[75rem] text-balance text-[clamp(3.15rem,5.15vw,5.4rem)] text-[var(--hero-fg)] md:mt-4">
            <span className="sm:whitespace-nowrap">{headlineLead},</span>
            <br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap">{headlineRest}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-[0.96rem] leading-relaxed text-[var(--hero-copy)] md:mt-2 md:text-lg">
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
            className="signal-button group inline-flex min-h-12 items-center justify-center gap-3 px-7 motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("primaryCta")}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </a>
        </AnimatedContainer>

        {Array.isArray(trustItems) && trustItems.length > 0 ? (
          <div className="mt-7 grid border-[var(--hero-grid-rule)] border-t text-[0.82rem] text-[var(--hero-muted)] sm:grid-cols-3 md:mt-7 md:text-sm">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex min-h-11 items-center border-[var(--hero-grid-rule)] border-b py-2.5 sm:border-r sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:border-r-0"
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
