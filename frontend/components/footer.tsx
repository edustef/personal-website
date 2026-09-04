import { LanguageToggle } from "@/components/language-toggle";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ManageCookiesButton } from "./manage-cookies-button";

type FooterProps = {
  className?: string;
  locale: string;
};

type SocialLink = { name: string; url: string };

const utilityLinkClassName =
  "inline-flex min-h-11 items-center text-[#eee7dc]/68 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none";

export async function Footer({ className, locale }: FooterProps) {
  const [t, profileT, headerT] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "settings.header" }),
  ]);

  const currentYear = new Date().getFullYear();
  const footerText = t("text", { currentYear });
  const parts = footerText.split(currentYear.toString());
  const servicesSlug = headerT("nav.servicesSlug");
  const pricingSlug = headerT("nav.pricingSlug");
  const socialLinks = profileT.raw("socialLinks") as SocialLink[];

  return (
    <footer
      className={cn(
        "relative overflow-hidden bg-[#11110f] text-[#f2ece2]",
        className
      )}
    >
      <div className="editorial-shell">
        <div className="border-white/18 border-t py-7 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[auto_minmax(16rem,1fr)_auto] lg:items-center lg:gap-10">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.13em] text-[#f2ece2]">
                {profileT("name")}
              </p>
              <p className="mt-2 max-w-[28rem] text-sm leading-relaxed text-[#eee7dc]/60 lg:hidden">
                {t("location")}
              </p>
            </div>

            <p className="hidden justify-self-center text-center text-sm text-[#eee7dc]/66 lg:block">
              {t("location")}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 text-sm">
              {socialLinks.map((socialLink) => (
                <a
                  key={socialLink.name}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={utilityLinkClassName}
                >
                  {socialLink.name}
                </a>
              ))}
              <LanguageToggle className="h-11 min-h-11 min-w-11 rounded-none px-0 font-mono text-xs font-medium uppercase tracking-[0.12em] text-[#f2ece2] underline decoration-[#f2ece2]/55 underline-offset-4 hover:text-primary focus-visible:ring-primary/85" />
            </div>
          </div>

          <div className="mt-5 grid gap-5 text-sm lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <nav
              aria-label={t("menu.title")}
              className="grid grid-cols-2 gap-x-5 sm:flex sm:flex-wrap sm:gap-x-6"
            >
              <Link
                href={{ pathname: "/", hash: servicesSlug }}
                className={utilityLinkClassName}
              >
                {t("menu.services")}
              </Link>
              <Link href="/services/sanity" className={utilityLinkClassName}>
                {t("menu.sanity")}
              </Link>
              <Link
                href={{ pathname: "/", hash: pricingSlug }}
                className={utilityLinkClassName}
              >
                {t("menu.pricing")}
              </Link>
              <Link href="/blog" className={utilityLinkClassName}>
                {t("menu.blog")}
              </Link>
            </nav>

            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 lg:justify-end">
              <nav
                aria-label={t("legal.title")}
                className="flex flex-wrap items-center gap-x-6"
              >
                <Link href="/privacy-policy" className={utilityLinkClassName}>
                  {t("privacyPolicy")}
                </Link>
                <span className="flex [&>button]:min-h-11 [&>button]:text-[#eee7dc]/68 [&>button]:hover:text-primary [&>button]:focus-visible:outline-2 [&>button]:focus-visible:outline-offset-4 [&>button]:focus-visible:outline-primary">
                  <ManageCookiesButton>
                    {t("legal.manageCookies")}
                  </ManageCookiesButton>
                </span>
              </nav>

              <p className="max-w-md py-2 text-xs leading-relaxed text-[#eee7dc]/48 sm:text-right">
                {parts.length > 1 ? (
                  <>
                    {parts[0]}
                    <time dateTime={currentYear.toString()}>{currentYear}</time>
                    {parts[1]}
                  </>
                ) : (
                  footerText
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
