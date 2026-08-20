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
      className="dark-instrument scroll-mt-16 border-white/15 border-t py-24 md:py-32"
    >
      <div className="editorial-shell text-center">
        <p className="editorial-label text-white/50">
          07 / {t("contact.label")}
        </p>
        <h2 className="editorial-display mx-auto mt-6 max-w-5xl text-5xl text-[#f4f0e7] sm:text-7xl lg:text-9xl">
          {t("contact.headline")}
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
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
          <Link
            href="/schedule"
            className="border-white/45 border-b pb-1 text-white hover:border-primary hover:text-primary"
          >
            {t("orBookTime")} ↗
          </Link>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-white/25 border-t pt-6 text-left font-mono text-xs uppercase tracking-wider text-white/55 md:flex-row md:items-center md:justify-between">
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
                  className="hover:text-primary"
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
