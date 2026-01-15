import { LanguageToggle } from "@/components/language-toggle";
import { getPostTranslations } from "@/lib/blog";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const translations = await getPostTranslations(slug, locale);

  return (
    <LanguageToggle
      hrefs={translations.map((t) => ({
        locale: t.locale,
        href: `/blog/${t.slug}`,
      }))}
    />
  );
}
