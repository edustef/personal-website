import { getAllPostSlugs, getBlogPost, getPostTranslations } from "@/lib/blog";
import { getCanonicalUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import BlogPostClient from "./blog-post-client";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
};

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

  const translations = await getPostTranslations(slug, locale);
  const englishTranslation = translations.find(
    (translation) => translation.locale === "en"
  );
  const canonical = getCanonicalUrl(locale, `/blog/${slug}`);
  const languages = Object.fromEntries(
    translations.map((translation) => [
      translation.locale,
      getCanonicalUrl(translation.locale, `/blog/${translation.slug}`),
    ])
  );

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": englishTranslation
          ? getCanonicalUrl("en", `/blog/${englishTranslation.slug}`)
          : canonical,
      },
    },
    openGraph: {
      type: "article",
      locale,
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
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

  const profileT = await getTranslations({ locale, namespace: "profile" });
  const socialLinksRaw = profileT.raw("socialLinks") as
    | Array<{ name: string; url: string }>
    | undefined;

  const content = (
    <MDXRemote source={post.content} components={mdxComponents} />
  );

  return (
    <BlogPostClient
      post={post}
      content={content}
      socialLinks={socialLinksRaw}
    />
  );
}
