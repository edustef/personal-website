import { getBlogPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import BlogClient from "./blog-client";

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

function BlogLoadingFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <div className="h-12 w-48 mx-auto bg-muted animate-pulse rounded" />
        <div className="h-6 w-96 mx-auto bg-muted animate-pulse rounded" />
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-12 w-full bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-6 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BlogPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);

  return (
    <Suspense fallback={<BlogLoadingFallback />}>
      <BlogClient posts={posts} />
    </Suspense>
  );
}
