import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
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
