import PortableText from "@/components/PortableText";
import { homeFooterQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { LanguageId, localizeBlockContent } from "@/lib/i18n";
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
  const footerContent = localizeBlockContent(home?.footer, locale);
  const profileName = home?.profile?.name;

  return (
    <footer
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-3",
        className,
      )}
    >
      <div className="relative py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          {footerContent.length > 0 && (
            <PortableText
              className="prose-invert text-center"
              value={footerContent}
            />
          )}
          <div className="mt-12 w-full border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">
              © {currentYear} {profileName || "Portfolio"}. Built with Next.js
              & Sanity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
