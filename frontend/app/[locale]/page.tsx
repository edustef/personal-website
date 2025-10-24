import {Suspense} from 'react'
import {notFound} from 'next/navigation'

import {AllPosts} from '@/components/Posts'
import HeroSection from '@/components/HeroSection'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import ProjectGrid from '@/components/ProjectGrid'
import SkillsSection from '@/components/SkillsSection'
import CertificatesSection from '@/components/CertificatesSection'
import {
  homeQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {languages, type LanguageId} from '@/lib/i18n'

type Props = {
  params: Promise<{locale: string}>
}

export default async function Page(props: Props) {
  const params = await props.params
  const locale = params.locale as LanguageId

  if (!languages.find((lang) => lang.id === locale)) {
    notFound()
  }

  const [{data: home}, {data: jobs}, {data: projects}, {data: skills}, {data: certificates}] =
    await Promise.all([
      sanityFetch({query: homeQuery, params: {locale}}),
      sanityFetch({query: allJobsQuery, params: {locale}}),
      sanityFetch({query: allProjectsQuery, params: {locale}}),
      sanityFetch({query: allSkillsQuery, params: {locale}}),
      sanityFetch({query: allCertificatesQuery, params: {locale}}),
    ])

  const featuredProjects =
    home?.featuredProjects && home.featuredProjects.length > 0
      ? home.featuredProjects
      : projects?.slice(0, 6)

  return (
    <>
      <HeroSection
        headline={home?.headline}
        tagline={home?.tagline}
        profile={home?.profile}
        ctaButtons={home?.ctaButtons}
        locale={locale}
      />

      <ExperienceTimeline jobs={jobs || []} locale={locale} />

      <SkillsSection skills={skills || []} />

      <ProjectGrid projects={featuredProjects || []} locale={locale} />

      <CertificatesSection certificates={certificates || []} locale={locale} />

      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Latest Posts</h2>
              <p className="text-xl text-muted-foreground">Thoughts, insights, and tutorials</p>
            </div>
            <Suspense
              fallback={<div className="text-center text-muted-foreground">Loading posts...</div>}
            >
              {await AllPosts(locale)}
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
