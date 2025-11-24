import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";

import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import { MorePosts } from "@/components/posts";
import PortableText from "@/components/sanity/portable-text";
import { sanityFetch } from "@/sanity/lib/live";
import { postPagesSlugs, postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import {
  localizeField,
  localizeBlockContent,
  LanguageId,
  languages,
} from "@/lib/i18n";
import { getLocalizedSettingsMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string; locale: LanguageId }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as LanguageId;

  const [{ data: post }, localizedSettings, parentMetadata] = await Promise.all(
    [
      sanityFetch({ query: postQuery, params, stega: false }),
      getLocalizedSettingsMetadata(locale),
      parent,
    ],
  );

  if (!post?._id) {
    return {
      title: localizedSettings.title,
      description: localizedSettings.description,
    };
  }

  const postTitle =
    localizeField(post.title, locale) || localizedSettings.title;
  const postExcerpt =
    localizeField(post.excerpt, locale) || localizedSettings.description;
  const postImage =
    resolveOpenGraphImage(post.coverImage) || localizedSettings.ogImage;
  const previousImages = parentMetadata.openGraph?.images || [];
  const images = postImage
    ? [postImage, ...previousImages]
    : previousImages.length
      ? previousImages
      : undefined;
  const alternateLanguages = Object.fromEntries(
    languages.map((lang) => [lang.id, `/${lang.id}/posts/${params.slug}`]),
  );

  return {
    title: postTitle,
    description: postExcerpt || localizedSettings.description,
    alternates: {
      canonical: `/${locale}/posts/${params.slug}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "article",
      locale,
      title: postTitle,
      description: postExcerpt || localizedSettings.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      images,
    },
    twitter: {
      card: postImage ? "summary_large_image" : "summary",
      title: postTitle,
      description: postExcerpt || localizedSettings.description,
      images: postImage ? [postImage.url] : undefined,
    },
  };
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;
  const [{ data: post }] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  const postTitle = localizeField(post.title, locale) || "Untitled";
  const postExcerpt = localizeField(post.excerpt, locale);
  const postContent = localizeBlockContent(post.content, locale);

  return (
    <>
      <div className="bg-linear-to-b from-white to-gray-50">
        <div className="container py-12 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              {post?.coverImage && (
                <div className="shadow-elevation-high mb-8 overflow-hidden rounded-2xl">
                  <CoverImage image={post.coverImage} priority />
                </div>
              )}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  <span className="gradient-text">{postTitle}</span>
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <time dateTime={post.date} className="text-sm font-medium">
                    <DateComponent dateString={post.date} />
                  </time>
                </div>
                {postExcerpt && (
                  <p className="text-xl leading-relaxed text-gray-600">
                    {postExcerpt}
                  </p>
                )}
              </div>
            </div>

            <article className="prose prose-lg prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:shadow-elevation-medium prose-img:rounded-xl prose-img:shadow-elevation-medium prose-ul:my-6 prose-ol:my-6 prose-li:my-2 max-w-none">
              {postContent?.length > 0 && (
                <PortableText value={postContent as PortableTextBlock[]} />
              )}
            </article>
          </div>
        </div>
      </div>

      {(await MorePosts({
        skip: post._id,
        limit: 3,
        locale,
      })) && (
        <div className="border-t border-gray-200 bg-white py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                <span className="gradient-text">More Posts</span>
              </h2>
              <Suspense
                fallback={
                  <div className="text-center text-gray-500">Loading...</div>
                }
              >
                {await MorePosts({
                  skip: post._id,
                  limit: 3,
                  locale,
                })}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
