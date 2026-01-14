import { getAllPostSlugs, getBlogPost } from "@/lib/blog";
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

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: getCanonicalUrl(locale, `/blog/${slug}`),
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

  const content = <MDXRemote source={post.content} components={mdxComponents} />;

  return (
    <BlogPostClient
      post={post}
      content={content}
      socialLinks={socialLinksRaw}
    />
  );
}
