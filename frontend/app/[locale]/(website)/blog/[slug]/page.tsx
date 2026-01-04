import { Link } from "@/components/ui/link";
import { getAllPostSlugs, getBlogPost } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    locale: post.locale,
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <article className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-8"
      >
        <svg
          className="mr-2 size-4 rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <title>{t("backToBlog")}</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        {t("backToBlog")}
      </Link>

      <header className="mb-12">
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {t("publishedOn", { date: post.date })}
        </time>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">{post.description}</p>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
