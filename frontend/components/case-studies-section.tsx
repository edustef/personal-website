import { projects, type Project } from "@/lib/data/projects";
import { getTranslations, getLocale } from "next-intl/server";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type CaseStudiesSectionProps = {
  projects?: Project[];
};

export default async function CaseStudiesSection({
  projects: projectsProp,
}: CaseStudiesSectionProps) {
  const projectsToDisplay = projectsProp || projects;
  if (!projectsToDisplay || projectsToDisplay.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "caseStudies" });

  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsToDisplay.map((project, index) => {
            const name =
              project.name[locale as keyof typeof project.name] ||
              project.name.en;
            const description =
              project.description[locale as keyof typeof project.description] ||
              project.description.en;
            const result =
              project.result[locale as keyof typeof project.result] ||
              project.result.en;

            const isFeatured = project.featured;

            return (
              <article
                key={project._id}
                className={cn(
                  "flex flex-col rounded-2xl border border-border bg-card",
                  isFeatured && index === 0 && "md:col-span-2 md:row-span-2",
                  isFeatured && index === 1 && "lg:col-span-1 lg:row-span-2",
                )}
              >
                <div
                  className={cn(
                    "flex h-full flex-col p-6",
                    isFeatured && index === 0 && "md:p-8",
                  )}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.duration && (
                        <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                          {project.duration}
                        </span>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                        aria-label={`${t("viewProject")}: ${name}`}
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "text-foreground mb-3 font-semibold",
                      isFeatured && index === 0
                        ? "text-2xl md:text-3xl"
                        : "text-xl",
                    )}
                  >
                    {name}
                  </h3>

                  <p
                    className={cn(
                      "text-muted-foreground mb-6 leading-relaxed",
                      isFeatured && index === 0 ? "text-base" : "text-sm",
                    )}
                  >
                    {description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {t("result")}
                      </p>
                      <p className="text-foreground text-sm leading-relaxed">
                        {result}
                      </p>
                    </div>

                    {project.metrics && project.metrics.length > 0 && (
                      <div
                        className={cn(
                          "grid gap-3",
                          project.metrics.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2",
                        )}
                      >
                        {project.metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-muted p-3 text-center"
                          >
                            <p className="text-primary text-lg font-bold md:text-xl">
                              {metric.value}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
