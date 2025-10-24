import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {urlForImage} from '@/sanity/lib/utils'
import {localizeField, localizeBlockContent, type LanguageId} from '@/lib/i18n'

type Project = any

type ProjectGridProps = {
  projects: Project[]
  title?: string
  subtitle?: string
  locale: LanguageId
}

export default function ProjectGrid({
  projects,
  title = 'Featured Projects',
  subtitle = 'Some of my recent work',
  locale,
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">{title}</span>
            </h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const projectName = localizeField(project.name, locale)
              const projectDescription = localizeBlockContent(project.description, locale)

              return (
                <div
                  key={project._id}
                  className="group relative"
                  style={{
                    animation: 'var(--animate-slide-up)',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="relative h-full glass-card rounded-2xl overflow-hidden shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:scale-[1.02]">
                    {project.image && (
                      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                        <Image
                          src={urlForImage(project.image)?.width(600).height(400).url() || ''}
                          alt={projectName || 'Project'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {projectName || 'Untitled'}
                      </h3>

                      {projectDescription && projectDescription.length > 0 && (
                        <div className="text-gray-600 line-clamp-3 prose prose-sm max-w-none">
                          <PortableText value={projectDescription} />
                        </div>
                      )}

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium text-sm hover:shadow-glow-primary transition-all"
                          >
                            <span>View Project</span>
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
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
