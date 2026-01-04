import { Link } from "@/components/ui/link";
import { getBlogPosts } from "@/lib/blog";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
          >
            <article className="flex flex-col h-full">
              <time
                dateTime={post.date}
                className="text-sm text-muted-foreground"
              >
                {t("publishedOn", { date: post.date })}
              </time>
              <h2 className="mt-4 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-muted-foreground line-clamp-3 flex-grow">
                {post.description}
              </p>
              <div className="mt-6 flex items-center font-medium text-primary">
                {t("readMore")}
                <svg
                  className="ml-2 size-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>{t("readMore")}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
