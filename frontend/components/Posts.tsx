import Link from "next/link";
import Image from "next/image";

import { sanityFetch } from "@/sanity/lib/live";
import { morePostsQuery, allPostsQuery } from "@/sanity/lib/queries";
import { AllPostsQueryResult } from "@/sanity.types";
import DateComponent from "@/components/date";
import { createDataAttribute } from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils";
import { localizeField } from "@/sanity/lib/localization";

const Post = ({
  post,
  locale,
}: {
  post: AllPostsQueryResult[number];
  locale: string;
}) => {
  const { _id, title, slug, excerpt, date, coverImage } = post;

  const postTitle = localizeField(title, locale) || "Untitled";
  const postExcerpt = localizeField(excerpt, locale);

  const attr = createDataAttribute({
    id: _id,
    type: "post",
    path: "title",
  });

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="group glass-card shadow-elevation-medium hover:shadow-elevation-high overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
    >
      {coverImage && (
        <div className="from-primary-100 to-accent-100 relative h-48 w-full overflow-hidden bg-linear-to-br">
          <Image
            src={urlForImage(coverImage)?.width(800).height(400).url() || ""}
            alt={postTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
      <div className="flex flex-col justify-between p-6">
        <div>
          <Link
            className="hover:text-primary-600 block transition-colors"
            href={`/${locale}/posts/${slug}`}
          >
            <h3 className="group-hover:text-primary-600 mb-3 text-2xl leading-tight font-bold text-gray-900 transition-colors">
              {postTitle}
            </h3>
          </Link>

          {postExcerpt && (
            <p className="mb-4 line-clamp-3 text-base leading-relaxed text-gray-600">
              {postExcerpt}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <time className="text-sm font-medium text-gray-500" dateTime={date}>
            <DateComponent dateString={date} />
          </time>
          <Link
            href={`/${locale}/posts/${slug}`}
            className="text-primary-600 hover:text-primary-700 group inline-flex items-center gap-1 text-sm font-medium"
          >
            Read more
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

const Posts = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

export async function MorePosts({
  skip,
  limit,
  locale,
}: {
  skip: string;
  limit: number;
  locale: string;
}) {
  const { data } = await sanityFetch({
    query: morePostsQuery,
    params: { skip, limit, locale },
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Posts>
      {data?.map((post) => (
        <Post key={post._id} post={post} locale={locale} />
      ))}
    </Posts>
  );
}

export async function AllPosts({ locale }: { locale: string }) {
  const { data } = await sanityFetch({
    query: allPostsQuery,
    params: { locale },
  });

  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-600">No posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <Posts>
      {data.map((post) => (
        <Post key={post._id} post={post} locale={locale} />
      ))}
    </Posts>
  );
}
