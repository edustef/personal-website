import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import {createDataAttribute} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, coverImage} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="group glass-card rounded-2xl overflow-hidden shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:scale-[1.02]"
    >
      {coverImage && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
          <Image
            src={urlForImage(coverImage)?.width(800).height(400).url() || ''}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex flex-col justify-between">
        <div>
          <Link className="hover:text-primary-600 transition-colors block" href={`/posts/${slug}`}>
            <h3 className="text-2xl font-bold mb-3 leading-tight text-gray-900 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
          </Link>

          {excerpt && (
            <p className="line-clamp-3 text-base leading-relaxed text-gray-600 mb-4">{excerpt}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <time className="text-gray-500 text-sm font-medium" dateTime={date}>
            <DateComponent dateString={date} />
          </time>
          <Link
            href={`/posts/${slug}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1 group"
          >
            Read more
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

const Posts = ({children}: {children: React.ReactNode}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts>
      {data?.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async () => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <Posts>
      {data.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}
