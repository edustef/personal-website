import Image from 'next/image'
import {format} from 'date-fns'
import type {Metadata} from 'next'
import {PortableText} from '@portabletext/react'
import {
  resumeQuery,
  profileQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'
import {getLocalizedField, getLocalizedBlockContent} from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const {data: resume} = await sanityFetch({
    query: resumeQuery,
    stega: false,
  })

  const resumeTitle = getLocalizedField((resume as any)?.title, 'en') || 'Resume'
  const resumeDescription =
    getLocalizedField((resume as any)?.description, 'en') || 'Professional resume'

  return {
    title: resumeTitle,
    description: resumeDescription,
  }
}

export default async function ResumePage() {
  const [
    {data: resume},
    {data: profile},
    {data: jobs},
    {data: projects},
    {data: skills},
    {data: certificates},
  ] = await Promise.all([
    sanityFetch({query: resumeQuery}),
    sanityFetch({query: profileQuery}),
    sanityFetch({query: allJobsQuery}),
    sanityFetch({query: allProjectsQuery}),
    sanityFetch({query: allSkillsQuery}),
    sanityFetch({query: allCertificatesQuery}),
  ])

  const resumeData = resume as any
  const profileData = profile as any
  const jobsData = jobs as any[]
  const projectsData = projects as any[]
  const skillsData = skills as any[]
  const certificatesData = certificates as any[]

  const name = profileData?.name || 'Name'
  const email = profileData?.email
  const phone = profileData?.phone
  const location = getLocalizedField(profileData?.location, 'en')
  const about = getLocalizedField(profileData?.about, 'en')

  const groupedSkills: Record<string, any[]> = {}
  if (skillsData && skillsData.length > 0) {
    skillsData.forEach((skill: any) => {
      const category = 'Skills'
      if (!groupedSkills[category]) {
        groupedSkills[category] = []
      }
      groupedSkills[category].push(skill)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 print:bg-white py-12 print:py-0">
      <div className="container max-w-5xl">
        <div className="bg-white shadow-elevation-high print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
          <div className="p-8 md:p-12 print:p-8">
            <div className="flex flex-col md:flex-row print:flex-row gap-8 items-start mb-8 print:mb-6 pb-8 print:pb-6 border-b print:border-gray-300">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl print:text-4xl font-bold text-gray-900 mb-2 print:mb-1">
                  {name}
                </h1>
                {about && (
                  <p className="text-lg print:text-base text-gray-600 mb-4 print:mb-2">{about}</p>
                )}
                <div className="flex flex-wrap gap-4 print:gap-3 text-sm print:text-xs text-gray-600">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1 hover:text-primary-600 print:text-black transition-colors"
                    >
                      <svg
                        className="w-4 h-4 print:w-3 print:h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {email}
                    </a>
                  )}
                  {phone && (
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-4 h-4 print:w-3 print:h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {phone}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-4 h-4 print:w-3 print:h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {location}
                    </span>
                  )}
                </div>
                {profileData?.socialLinks && profileData.socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 print:gap-2 mt-4 print:mt-2 print:hidden">
                    {profileData.socialLinks.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <span className="text-sm">{link.platform}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {profileData?.picture && (
                <div className="flex-shrink-0 print:hidden">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-elevation-medium">
                    <Image
                      src={urlForImage(profileData.picture)?.width(200).height(200).url() || ''}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {jobsData && jobsData.length > 0 && (
              <section className="mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="text-2xl print:text-xl font-bold text-gray-900 mb-4 print:mb-3 pb-2 border-b-2 border-primary-500 print:border-gray-400">
                  Experience
                </h2>
                <div className="space-y-6 print:space-y-4">
                  {jobsData.map((job: any) => {
                    const startFormatted = format(new Date(job.startDate), 'MMM yyyy')
                    const endFormatted = job.current
                      ? 'Present'
                      : job.endDate
                        ? format(new Date(job.endDate), 'MMM yyyy')
                        : 'Present'
                    const jobPosition = getLocalizedField(job.position, 'en')
                    const jobDescription = getLocalizedBlockContent(job.description, 'en')

                    return (
                      <div key={job._id} className="print:break-inside-avoid">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 print:gap-1 mb-2 print:mb-1">
                          <div>
                            <h3 className="text-lg print:text-base font-bold text-gray-900">
                              {jobPosition}
                            </h3>
                            <p className="text-base print:text-sm font-semibold text-primary-600 print:text-gray-700">
                              {job.company}
                            </p>
                          </div>
                          <div className="text-sm print:text-xs text-gray-600 flex-shrink-0">
                            {startFormatted} - {endFormatted}
                          </div>
                        </div>
                        {jobDescription && jobDescription.length > 0 && (
                          <div className="text-gray-700 print:text-gray-800 text-sm print:text-xs mb-2 prose prose-sm print:prose-xs max-w-none">
                            <PortableText value={jobDescription} />
                          </div>
                        )}
                        {job.technologies && job.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 print:gap-1">
                            {job.technologies.map((tech: any, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 print:px-1 print:py-0.5 text-xs print:text-[10px] font-medium bg-primary-100 print:bg-gray-100 text-primary-700 print:text-gray-700 rounded print:rounded-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {resumeData?.showSkills !== false &&
              groupedSkills &&
              Object.keys(groupedSkills).length > 0 && (
                <section className="mb-8 print:mb-6 print:break-inside-avoid">
                  <h2 className="text-2xl print:text-xl font-bold text-gray-900 mb-4 print:mb-3 pb-2 border-b-2 border-primary-500 print:border-gray-400">
                    Skills
                  </h2>
                  <div className="space-y-4 print:space-y-2">
                    {Object.entries(groupedSkills).map(
                      ([category, categorySkills]: [string, any[]]) => (
                        <div key={category} className="print:break-inside-avoid">
                          <h3 className="text-base print:text-sm font-semibold text-gray-700 mb-2 print:mb-1">
                            {category}
                          </h3>
                          <div className="flex flex-wrap gap-2 print:gap-1">
                            {categorySkills.map((skill: any) => (
                              <span
                                key={skill._id}
                                className="px-3 py-1 print:px-2 print:py-0.5 text-sm print:text-xs bg-gray-100 print:bg-white print:border print:border-gray-300 text-gray-700 rounded-lg print:rounded"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

            {resumeData?.showProjects !== false && projectsData && projectsData.length > 0 && (
              <section className="mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="text-2xl print:text-xl font-bold text-gray-900 mb-4 print:mb-3 pb-2 border-b-2 border-primary-500 print:border-gray-400">
                  Projects
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {projectsData.slice(0, 6).map((project: any) => {
                    const projectName = getLocalizedField(project.name, 'en')
                    const projectDescription = getLocalizedBlockContent(project.description, 'en')

                    return (
                      <div key={project._id} className="print:break-inside-avoid">
                        <h3 className="text-lg print:text-base font-bold text-gray-900 mb-1">
                          {projectName}
                        </h3>
                        {projectDescription && projectDescription.length > 0 && (
                          <div className="text-gray-700 print:text-gray-800 text-sm print:text-xs mb-2 print:mb-1 prose prose-sm print:prose-xs max-w-none">
                            <PortableText value={projectDescription} />
                          </div>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 print:gap-1">
                            {project.technologies.map((tech: any, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 print:px-1 print:py-0.5 text-xs print:text-[10px] font-medium bg-accent-100 print:bg-gray-100 text-accent-700 print:text-gray-700 rounded print:rounded-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {resumeData?.showCertificates !== false &&
              certificatesData &&
              certificatesData.length > 0 && (
                <section className="mb-8 print:mb-6 print:break-inside-avoid">
                  <h2 className="text-2xl print:text-xl font-bold text-gray-900 mb-4 print:mb-3 pb-2 border-b-2 border-primary-500 print:border-gray-400">
                    Certifications
                  </h2>
                  <div className="space-y-3 print:space-y-2">
                    {certificatesData.map((cert: any) => {
                      const certTitle = getLocalizedField(cert.title, 'en')

                      return (
                        <div key={cert._id} className="print:break-inside-avoid">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <div>
                              <h3 className="text-base print:text-sm font-semibold text-gray-900">
                                {certTitle}
                              </h3>
                            </div>
                            {cert.issueDate && (
                              <span className="text-sm print:text-xs text-gray-600">
                                {format(new Date(cert.issueDate), 'MMM yyyy')}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

            <div className="mt-12 print:mt-8 pt-8 print:pt-6 border-t print:border-gray-300 print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-elevation-medium hover:shadow-elevation-high transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
