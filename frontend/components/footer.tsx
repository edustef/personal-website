import { homeFooterQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { LanguageId, localizeField } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
  locale: LanguageId;
};

export async function Footer({ className, locale }: FooterProps) {
  const { data: home } = await sanityFetch({
    query: homeFooterQuery,
  });

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
          </div>
        </div>
      </div>
    </footer>
  );
}
