import whatsappLogo from "@/assets/images/whatsapp-logo.png";
import { ContactSectionAnchorButton } from "@/components/contact-section-button";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { getSocialIcon } from "@/lib/social-icons";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

type SocialLink = {
  name: string;
  url: string;
};

type ContactSectionProps = {
  socialLinks?: SocialLink[];
  whatsappUrl?: string;
};

export default async function ContactSection({
  socialLinks,
  whatsappUrl,
}: ContactSectionProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  const hasWhatsApp = !!whatsappUrl;
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
          {hasWhatsApp && (
            <AnimatedContainer
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={0}
              staggerDelay={0.1}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                variant="default"
                className="w-full bg-[#25d366] text-white hover:bg-[#25d366]/90"
              >
                <ContactSectionAnchorButton
                  href={whatsappUrl}
                  ariaLabel={t("contact.whatsappLabel")}
                >
                  <Image
                    src={whatsappLogo}
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  WhatsApp
                </ContactSectionAnchorButton>
              </Button>
            </AnimatedContainer>
          )}

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
