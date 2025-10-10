import {Suspense} from 'react'

import {AllPosts} from '@/app/components/Posts'
import HeroSection from '@/app/components/HeroSection'
import ExperienceTimeline from '@/app/components/ExperienceTimeline'
import ProjectGrid from '@/app/components/ProjectGrid'
import {homeQuery, allJobsQuery, allProjectsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Page() {
  const [{data: home}, {data: jobs}, {data: projects}] = await Promise.all([
    sanityFetch({query: homeQuery}),
    sanityFetch({query: allJobsQuery}),
    sanityFetch({query: allProjectsQuery}),
  ])

  const featuredProjects =
    home?.featuredProjects && home.featuredProjects.length > 0
      ? home.featuredProjects
      : projects?.slice(0, 6)

  return (
    <>
      <HeroSection
        headline={home?.headline || 'Welcome'}
        tagline={home?.tagline}
        profile={home?.profile}
        ctaButtons={home?.ctaButtons}
      />

      {/* <ExperienceTimeline jobs={jobs || []} /> */}

      <ProjectGrid projects={featuredProjects || []} />

      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">Latest Posts</span>
              </h2>
              <p className="text-xl text-gray-600">Thoughts, insights, and tutorials</p>
            </div>
            <Suspense fallback={<div className="text-center text-gray-500">Loading posts...</div>}>
              {await AllPosts()}
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
