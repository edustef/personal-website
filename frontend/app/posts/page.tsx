import {Suspense} from 'react'
import type {Metadata} from 'next'
import {AllPosts} from '@/components/Posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my latest blog posts and articles',
}

export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-gray-600">Thoughts, insights, and tutorials</p>
          </div>

          <Suspense fallback={<div className="text-center text-gray-500">Loading posts...</div>}>
            {await AllPosts()}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
