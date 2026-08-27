import { Link } from "@/i18n/navigation";
import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

type SocialLink = { name: string; url: string };
type ContactSectionProps = { socialLinks?: SocialLink[] };

export default async function ContactSection({
  socialLinks,
}: ContactSectionProps) {
  const locale = await getLocale();
  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

  return (
    <section
      id="contact"
      className="dark-instrument dark-instrument-smooth editorial-section scroll-mt-16 border-[var(--section-rule)] border-t"
    >
      <div className="editorial-shell text-center">
        <p className="editorial-label editorial-section-label">
          {t("contact.label")}
        </p>
        <h2 className="editorial-display mx-auto mt-6 max-w-5xl text-[clamp(3.25rem,8vw,7rem)] text-[var(--section-foreground)]">
          {t("contact.headline")}
        </h2>
        <p className="editorial-section-copy mx-auto mt-7 max-w-2xl">
          {t("contact.subtitle")}
        </p>
        <div className="mt-9 flex flex-col items-center gap-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="signal-button inline-flex min-h-14 w-full max-w-lg items-center justify-center gap-2 text-lg"
          >
            {t("letsChat")}
            <ArrowUpRight className="size-5" />
          </a>
          <Link href="/schedule" className="editorial-text-link">
            {t("orBookTime")} ↗
          </Link>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-[var(--section-rule-strong)] border-t pt-6 text-left font-mono text-xs uppercase tracking-wider text-[var(--section-subtle)] md:flex-row md:items-center md:justify-between">
          <span>Eduard Stefan</span>
          <span>Oradea, Romania · Europe</span>
          {socialLinks?.length ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {link.name}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
