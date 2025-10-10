import {format} from 'date-fns'
import {PortableText} from '@portabletext/react'

type Job = {
  _id: string
  title: string
  company: string
  location?: any
  startDate: string
  endDate?: string
  current?: boolean
  description?: any
  responsibilities?: string[]
  technologies?: string[]
}

type ExperienceTimelineProps = {
  jobs: Job[]
}

export default function ExperienceTimeline({jobs}: ExperienceTimelineProps) {
  if (!jobs || jobs.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-xl text-gray-600">My professional journey</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-primary-300" />

            <div className="space-y-12">
              {jobs.map((job, index) => {
                const isEven = index % 2 === 0
                const startFormatted = format(new Date(job.startDate), 'MMM yyyy')
                const endFormatted = job.current
                  ? 'Present'
                  : job.endDate
                    ? format(new Date(job.endDate), 'MMM yyyy')
                    : 'Present'
                const location = Array.isArray(job.location) ? job.location[0]?.value : job.location

                return (
                  <div
                    key={job._id}
                    className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow-primary transform -translate-x-1.5 md:-translate-x-2 z-10" />

                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="ml-16 md:ml-0">
                        <div
                          className="glass-card p-6 rounded-2xl shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            animation: 'var(--animate-slide-up)',
                            animationDelay: `${index * 0.1}s`,
                            animationFillMode: 'both',
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                              <p className="text-lg font-semibold text-primary-600">
                                {job.company}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {startFormatted} - {endFormatted}
                            </span>
                            {location && (
                              <span className="inline-flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
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

                          {job.description && (
                            <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
                              {Array.isArray(job.description) && job.description[0]?.value ? (
                                <PortableText value={job.description[0].value} />
                              ) : (
                                <PortableText value={job.description} />
                              )}
                            </div>
                          )}

                          {job.technologies && job.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {job.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block w-1/2" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
