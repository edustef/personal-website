import { homeFooterQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { cn } from "@/lib/utils";
import { localizeField } from "@/sanity/lib/localization";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

type FooterProps = {
  className?: string;
  locale: string;
};

export async function Footer({ className, locale }: FooterProps) {
  const { data: home } = await sanityFetch({
    query: homeFooterQuery,
  });

  const t = await getTranslations({ locale, namespace: "footer" });

  const currentYear = new Date().getFullYear();
  const footerTemplate = localizeField(home?.footer, locale);
  const fallbackTemplate = `@ {currentYear} ${
    home?.profile?.name || "Portfolio"
  }. Built with Next.js & Sanity.`;
  const template = footerTemplate || fallbackTemplate;
  const hasPlaceholder = template.includes("{currentYear}");
  const [beforeYear, afterYear = ""] = hasPlaceholder
    ? template.split("{currentYear}")
    : [template, ""];

  return (
    <footer
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-3",
        className,
      )}
    >
      <div className="relative py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="mt-12 w-full border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">
              {hasPlaceholder ? (
                <>
                  {beforeYear}
                  <time dateTime={currentYear.toString()}>{currentYear}</time>
                  {afterYear}
                </>
              ) : (
                template
              )}
            </p>
            <p className="mt-4 text-sm">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-foreground underline transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
