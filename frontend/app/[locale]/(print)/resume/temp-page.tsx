import Image from "next/image";
import { format } from "date-fns";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import {
  resumeQuery,
  profileQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { urlForImage } from "@/sanity/lib/utils";
import {
  languages,
  localizeField,
  localizeBlockContent,
  type LanguageId,
} from "@/lib/i18n";
import { AllSkillsQueryResult } from "@/sanity.types";
import PrintButton from "./print-button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as LanguageId;

  if (!languages.find((lang) => lang.id === locale)) {
    return {};
  }

  const { data: resume } = await sanityFetch({
    query: resumeQuery,
    stega: false,
  });

  const resumeTitle = localizeField((resume as any)?.title, locale) || "Resume";
  const resumeDescription =
    localizeField((resume as any)?.description, locale) ||
    "Professional resume";

  return {
    title: resumeTitle,
    description: resumeDescription,
  };
}

export default async function ResumePage(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;

  if (!languages.find((lang) => lang.id === locale)) {
    notFound();
  }

  const [
    { data: resume },
    { data: profile },
    { data: jobs },
    { data: projects },
    { data: skills },
    { data: certificates },
  ] = await Promise.all([
    sanityFetch({ query: resumeQuery }),
    sanityFetch({ query: profileQuery }),
    sanityFetch({ query: allJobsQuery }),
    sanityFetch({ query: allProjectsQuery }),
    sanityFetch({ query: allSkillsQuery }),
    sanityFetch({ query: allCertificatesQuery }),
  ]);

  if (!profile || !jobs || !projects || !skills || !certificates) {
    notFound();
  }

  const name = profile.name || "Name";
  const email = profile.email;
  const phone = profile.phone;
  const location = localizeField(profile.location, locale);
  const about = localizeField(profile.about, locale);

  const groupedSkills: Record<string, AllSkillsQueryResult> = {};
  skills.forEach((skill) => {
    const category = "Skills";
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div className="from-primary-50 to-accent-50 min-h-screen bg-gradient-to-br py-12 print:bg-white print:py-0">
      <div className="container max-w-5xl">
        <div className="shadow-elevation-high overflow-hidden rounded-2xl bg-white print:rounded-none print:shadow-none">
          <div className="p-8 md:p-12 print:p-8">
            <div className="mb-8 flex flex-col items-start gap-8 border-b pb-8 md:flex-row print:mb-6 print:flex-row print:border-gray-300 print:pb-6">
              <div className="flex-1">
                <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl print:mb-1 print:text-4xl">
                  {name}
                </h1>
                {about && (
                  <p className="mb-4 text-lg text-gray-600 print:mb-2 print:text-base">
                    {about}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 print:gap-3 print:text-xs">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-primary-600 inline-flex items-center gap-1 transition-colors print:text-black"
                    >
                      <svg
                        className="h-4 w-4 print:h-3 print:w-3"
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
                        className="h-4 w-4 print:h-3 print:w-3"
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
                        className="h-4 w-4 print:h-3 print:w-3"
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
                {profile?.socialLinks && profile?.socialLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3 print:mt-2 print:hidden print:gap-2">
                    {profile?.socialLinks.map((link, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 text-gray-600 transition-colors"
                      >
                        <span className="text-sm">{link.platform}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {profile?.picture && (
                <div className="flex-shrink-0 print:hidden">
                  <div className="shadow-elevation-medium relative h-32 w-32 overflow-hidden rounded-xl">
                    <Image
                      src={
                        urlForImage(profile?.picture)
                          ?.width(200)
                          .height(200)
                          .url() || ""
                      }
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {jobs && jobs.length > 0 && (
              <section className="mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="border-primary-500 mb-4 border-b-2 pb-2 text-2xl font-bold text-gray-900 print:mb-3 print:border-gray-400 print:text-xl">
                  Experience
                </h2>
                <div className="space-y-6 print:space-y-4">
                  {jobs.map((job) => {
                    const startFormatted = format(
                      new Date(job.startDate),
                      "MMM yyyy",
                    );
                    const endFormatted = job.current
                      ? "Present"
                      : job.endDate
                        ? format(new Date(job.endDate), "MMM yyyy")
                        : "Present";
                    const jobDescription = localizeBlockContent(
                      job.description,
                      locale,
                    );

                    return (
                      <div key={job._id} className="print:break-inside-avoid">
                        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between print:mb-1 print:gap-1">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 print:text-base">
                              {job.position}
                            </h3>
                            <p className="text-primary-600 text-base font-semibold print:text-sm print:text-gray-700">
                              {job.company}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-600 print:text-xs">
                            {startFormatted} - {endFormatted}
                          </div>
                        </div>
                        {jobDescription && jobDescription.length > 0 && (
                          <div className="prose prose-sm print:prose-xs mb-2 max-w-none text-sm text-gray-700 print:text-xs print:text-gray-800">
                            <PortableText value={jobDescription} />
                          </div>
                        )}
                        {job.technologies && job.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 print:gap-1">
                            {job.technologies.map((tech, i: number) => (
                              <span
                                key={i}
                                className="bg-primary-100 text-primary-700 rounded px-2 py-1 text-xs font-medium print:rounded-sm print:bg-gray-100 print:px-1 print:py-0.5 print:text-[10px] print:text-gray-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {resume?.showSkills !== false &&
              groupedSkills &&
              Object.keys(groupedSkills).length > 0 && (
                <section className="mb-8 print:mb-6 print:break-inside-avoid">
                  <h2 className="border-primary-500 mb-4 border-b-2 pb-2 text-2xl font-bold text-gray-900 print:mb-3 print:border-gray-400 print:text-xl">
                    Skills
                  </h2>
                  <div className="space-y-4 print:space-y-2">
                    {Object.entries(groupedSkills).map(
                      ([category, categorySkills]: [string, any[]]) => (
                        <div
                          key={category}
                          className="print:break-inside-avoid"
                        >
                          <h3 className="mb-2 text-base font-semibold text-gray-700 print:mb-1 print:text-sm">
                            {category}
                          </h3>
                          <div className="flex flex-wrap gap-2 print:gap-1">
                            {categorySkills.map((skill) => (
                              <span
                                key={skill.name}
                                className="rounded-lg bg-gray-100 px-4 py-1 text-sm text-gray-700 print:rounded print:border print:border-gray-300 print:bg-white print:px-2 print:py-0.5 print:text-xs"
                              >
                                {localizeField(skill.name, locale)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

            {resume?.showProjects !== false &&
              projects &&
              projects.length > 0 && (
                <section className="mb-8 print:mb-6 print:break-inside-avoid">
                  <h2 className="border-primary-500 mb-4 border-b-2 pb-2 text-2xl font-bold text-gray-900 print:mb-3 print:border-gray-400 print:text-xl">
                    Projects
                  </h2>
                  <div className="space-y-4 print:space-y-3">
                    {projects.slice(0, 6).map((project) => {
                      const projectDescription = localizeBlockContent(
                        project.description,
                        locale,
                      );

                      return (
                        <div
                          key={project._id}
                          className="print:break-inside-avoid"
                        >
                          <h3 className="mb-1 text-lg font-bold text-gray-900 print:text-base">
                            {localizeField(project.name, locale)}
                          </h3>
                          {projectDescription &&
                            projectDescription.length > 0 && (
                              <div className="prose prose-sm print:prose-xs mb-2 max-w-none text-sm text-gray-700 print:mb-1 print:text-xs print:text-gray-800">
                                <PortableText value={projectDescription} />
                              </div>
                            )}
                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 print:gap-1">
                                {project.technologies.map((tech, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-accent-100 text-accent-700 rounded px-2 py-1 text-xs font-medium print:rounded-sm print:bg-gray-100 print:px-1 print:py-0.5 print:text-[10px] print:text-gray-700"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            {resume?.showCertificates !== false &&
              certificates &&
              certificates.length > 0 && (
                <section className="mb-8 print:mb-6 print:break-inside-avoid">
                  <h2 className="border-primary-500 mb-4 border-b-2 pb-2 text-2xl font-bold text-gray-900 print:mb-3 print:border-gray-400 print:text-xl">
                    Certifications
                  </h2>
                  <div className="space-y-3 print:space-y-2">
                    {certificates.map((cert) => (
                      <div
                        key={cert.title}
                        className="print:break-inside-avoid"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 print:text-sm">
                              {cert.title}
                            </h3>
                          </div>
                          {cert.dateIssued && (
                            <span className="text-sm text-gray-600 print:text-xs">
                              {new Date(cert.dateIssued).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            <div className="mt-12 border-t pt-8 print:mt-8 print:hidden print:border-gray-300 print:pt-6">
              <PrintButton>Print</PrintButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
