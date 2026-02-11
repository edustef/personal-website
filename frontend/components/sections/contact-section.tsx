import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/navigation";
import { getSocialIcon } from "@/lib/social-icons";
import { Calendar } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

type SocialLink = {
  name: string;
  url: string;
};

type ContactSectionProps = {
  socialLinks?: SocialLink[];
};

export default async function ContactSection({
  socialLinks,
}: ContactSectionProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  const hasSocialLinks = socialLinks && socialLinks.length > 0;

  return (
    <section id="contact" className="scroll-mt-12 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          label={t("contact.label")}
          headline={t("contact.headline")}
          subtitle={t("contact.subtitle")}
          anchorSlug="contact"
          className="mb-16 px-0"
        />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <AnimatedContainer
            trigger="scroll"
            fadeDirection="up"
            staggerIndex={0}
            staggerDelay={0.1}
            className="w-full sm:w-auto"
          >
            <Button asChild size="lg" variant="default" className="w-full">
              <Link href="/schedule">
                <Calendar className="size-5" />
                {t("scheduleCall")}
              </Link>
            </Button>
          </AnimatedContainer>

          {hasSocialLinks && (
            <AnimatedContainer
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={1}
              staggerDelay={0.1}
              className="flex gap-2"
            >
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.name);
                return (
                  <Button
                    key={link.name}
                    asChild
                    size="lg"
                    variant="outline"
                    className="aspect-square p-0"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      {Icon && <Icon className="size-5" />}
                    </a>
                  </Button>
                );
              })}
            </AnimatedContainer>
          )}
        </div>
      </div>
    </section>
  );
}
