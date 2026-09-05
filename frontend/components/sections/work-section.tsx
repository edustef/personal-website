import { getTranslations } from "next-intl/server";
import Image, { type StaticImageData } from "next/image";

import { jobs } from "@/lib/data/jobs";
import { type Project, getPortfolioProjects } from "@/lib/portfolio";

type WorkSectionProps = {
  locale: string;
};

const displayedJobs = 2;
const displayedProjects = 2;

function getYear(date: string | null) {
  return date ? new Date(date).getUTCFullYear() : null;
}

function ProjectPreview({ project }: { project: Project }) {
  if (!project.images) return null;

  const content = (
    <>
      <div className="relative aspect-[1.985/1] overflow-hidden bg-white/5">
        <Image
          src={project.images.desktop}
          alt=""
          fill
          sizes="(min-width: 1280px) 35vw, (min-width: 768px) 44vw, calc(100vw - 2.5rem)"
          className="object-cover object-top transition-transform duration-500 ease-out motion-reduce:transition-none md:group-hover:scale-[1.012]"
        />
      </div>

      <div className="mt-5 max-w-[34rem]">
        <h3 className="text-balance font-sans text-[clamp(1.65rem,2.2vw,2.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-[var(--section-foreground)] transition-colors duration-200 group-hover:text-[var(--primary-text)]">
          {project.title}
        </h3>
        <p className="mt-2 text-[0.94rem] leading-6 text-[var(--section-muted)]">
          {project.description}
        </p>
      </div>
    </>
  );

  if (!project.liveUrl) {
    return <article>{content}</article>;
  }

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noreferrer"
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--editorial-dark)]"
    >
      {content}
    </a>
  );
}

function CompanyLogo({
  company,
  logo,
}: {
  company: string;
  logo: StaticImageData;
}) {
  return (
    <div className="flex min-h-[6.5rem] w-44 shrink-0 items-center">
      <Image
        src={logo}
        alt={`${company} logo`}
        sizes="176px"
        className="h-auto w-44"
      />
    </div>
  );
}

export default async function WorkSection({ locale }: WorkSectionProps) {
  const [t, projects] = await Promise.all([
    getTranslations({ locale, namespace: "home.work" }),
    getPortfolioProjects(locale),
  ]);

  const workHistory = jobs.slice(0, displayedJobs);
  const featuredProjects = projects.slice(0, displayedProjects);
  const experiments = t.raw("experiments") as string[];

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="editorial-section contrast-dark scroll-mt-20 bg-[var(--editorial-dark)] text-[var(--editorial-dark-foreground)] [--section-foreground:var(--editorial-dark-foreground)] [--section-muted:var(--editorial-dark-muted)] [--section-rule:var(--editorial-dark-rule)] [--section-subtle:var(--editorial-dark-subtle)]"
    >
      <div className="editorial-shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
          <div className="lg:col-span-5">
            <p className="editorial-label editorial-section-label">
              {t("label")}
            </p>
            <h2
              id="work-title"
              className="editorial-section-title mt-6 max-w-[10ch]"
            >
              {t("headline")}
            </h2>
            <p className="editorial-section-copy mt-7 max-w-[34rem]">
              {t("description")}
            </p>
          </div>

          <div className="lg:col-start-7 lg:col-span-6">
            {workHistory.map((job, index) => {
              const startYear = getYear(job.startDate);
              const endYear = getYear(job.endDate);

              return (
                <article
                  key={job._id}
                  className={`grid gap-5 py-7 sm:grid-cols-[11rem_minmax(9rem,1fr)_auto] sm:items-center sm:gap-7 ${
                    index === 0
                      ? "pt-0"
                      : "border-t border-[var(--section-rule)]"
                  }`}
                >
                  <CompanyLogo company={job.company} logo={job.logo} />

                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.025em] text-[var(--section-foreground)]">
                      {job.position}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-mono text-xs tracking-[0.08em] text-[var(--section-muted)]">
                      {startYear}–{job.isCurrent ? t("present") : endYear}
                    </p>
                    {job.isCurrent ? (
                      <span className="bg-[var(--primary)] px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--primary-foreground)]">
                        {t("current")}
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20 grid gap-12 sm:mt-24 md:grid-cols-2 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(12rem,0.42fr)] lg:gap-10 xl:gap-12">
          {featuredProjects.map((project) => (
            <ProjectPreview key={project.id} project={project} />
          ))}

          <aside className="border-t border-[var(--section-rule)] pt-8 md:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-1 lg:pl-10 xl:pl-12">
            <p className="editorial-label editorial-section-label">
              {t("experimentsLabel")}
            </p>
            <p className="mt-3 text-sm text-[var(--section-muted)]">
              {t("experimentsStatus")}
            </p>

            <ul className="mt-8 space-y-5">
              {experiments.slice(0, 3).map((experiment) => (
                <li
                  key={experiment}
                  className="text-base leading-snug text-[var(--section-foreground)]"
                >
                  {experiment}
                </li>
              ))}
            </ul>

            <p className="mt-9 font-mono text-xs font-medium tracking-[0.08em] text-[var(--primary-text)]">
              {t("moreInTheLab")}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
