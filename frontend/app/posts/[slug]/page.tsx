import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import CoverImage from '@/app/components/CoverImage'
import DateComponent from '@/app/components/Date'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  return (
    <>
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="container py-12 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              {post?.coverImage && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-elevation-high">
                  <CoverImage image={post.coverImage} priority />
                </div>
              )}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="gradient-text">{post.title}</span>
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <time dateTime={post.date} className="text-sm font-medium">
                    <DateComponent dateString={post.date} />
                  </time>
                </div>
                {post.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
                )}
              </div>
            </div>

            <article
              className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-gray-700
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:shadow-elevation-medium
              prose-img:rounded-xl prose-img:shadow-elevation-medium
              prose-ul:my-6 prose-ol:my-6
              prose-li:my-2"
            >
              {post.content?.length && <PortableText value={post.content as PortableTextBlock[]} />}
            </article>
          </div>
        </div>
      </div>

      {(await MorePosts({skip: post._id, limit: 3})) && (
        <div className="border-t border-gray-200 bg-white py-16 lg:py-24">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                <span className="gradient-text">More Posts</span>
              </h2>
              <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
                {await MorePosts({skip: post._id, limit: 3})}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
