import Image from "next/image";
import { projects } from "@/lib/data/projects";
import { getTranslations } from "next-intl/server";

type ProjectGridProps = {
  projects?: typeof projects;
  title?: string;
  subtitle?: string;
  locale: string;
};

export default async function ProjectGrid({
  projects: projectsProp,
  title = "Featured Projects",
  subtitle = "Some of my recent work",
  locale,
}: ProjectGridProps) {
  const projectsToDisplay = projectsProp || projects;
  
  if (!projectsToDisplay || projectsToDisplay.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold md:text-6xl">
              <span className="gradient-text">{title}</span>
            </h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projectsToDisplay.map((project, index) => {
              const projectName = t(project.nameKey);
              const projectDescription = t(project.descriptionKey);

              return (
                <div
                  key={project._id}
                  className="group relative"
                  style={{
                    animation: "var(--animate-slide-up)",
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="glass-card shadow-elevation-medium hover:shadow-elevation-high relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                    {project.image && (
                      <div className="from-primary-100 to-accent-100 relative h-48 w-full overflow-hidden bg-linear-to-br">
                        <Image
                          src={project.image}
                          alt={projectName || "Project"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <h3 className="group-hover:text-primary-600 text-2xl font-bold text-gray-900 transition-colors">
                        {projectName || "Untitled"}
                      </h3>

                      {projectDescription && projectDescription.length > 0 && (
                        <div className="prose prose-sm line-clamp-3 max-w-none text-gray-600 whitespace-pre-line">
                          {projectDescription}
                        </div>
                      )}

                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies
                              .slice(0, 4)
                              .map((tech: string, i: number) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                                >
                                  {tech}
                                </span>
                              ))}
                            {project.technologies.length > 4 && (
                              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
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
                            className="from-primary-600 to-accent-600 hover:shadow-glow-primary inline-flex items-center gap-2 rounded-lg bg-linear-to-r px-4 py-2 text-sm font-medium text-white transition-all"
                          >
                            <span>View Project</span>
                            <svg
                              className="h-4 w-4"
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
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </section>
  );
}
