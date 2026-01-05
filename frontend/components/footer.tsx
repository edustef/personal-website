import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type FooterProps = {
  className?: string;
  locale: string;
};

export async function Footer({ className, locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });

  const currentYear = new Date().getFullYear();
  const footerText = t("text", { currentYear });
  const parts = footerText.split(currentYear.toString());

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const servicesSlug = headerT("nav.servicesSlug");
  const pricingSlug = headerT("nav.pricingSlug");

  return (
    <footer
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-4 md:px-6 border-t",
        className
      )}
    >
      <div className="mx-auto max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">
                {t("menu.title")}
              </h3>
              <nav className="flex flex-col items-start gap-3">
                <Link
                  href={`/#${servicesSlug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("menu.services")}
                </Link>
                <Link
                  href={`/#${pricingSlug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("menu.pricing")}
                </Link>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("menu.blog")}
                </Link>
              </nav>
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="font-semibold text-foreground">Legal</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <p className="mt-12 text-sm text-muted-foreground max-w-xs leading-relaxed">
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
    </footer>
  );
}
