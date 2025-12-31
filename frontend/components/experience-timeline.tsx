import { format } from "date-fns";
import Image from "next/image";
import { jobs } from "@/lib/data/jobs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

type ExperienceTimelineProps = {
  jobs?: typeof jobs;
  locale: string;
};

export default async function ExperienceTimeline({
  jobs: jobsProp,
  locale,
}: ExperienceTimelineProps) {
  const jobsToDisplay = jobsProp || jobs;
  
  if (!jobsToDisplay || jobsToDisplay.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "jobs" });

  return (
    <section className="from-background to-muted/20 bg-linear-to-b py-24">
      <div className="mx-auto max-w-5xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold md:text-6xl">
              <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-muted-foreground text-xl">
              My professional journey
            </p>
          </div>

          <div className="relative">
            <div className="from-primary/30 via-primary/50 to-primary/30 absolute top-0 bottom-0 left-8 w-0.5 bg-linear-to-b md:left-1/2" />

            <div className="space-y-12">
              {jobsToDisplay.map((job, index) => {
                const isEven = index % 2 === 0;
                const startFormatted = format(
                  new Date(job.startDate),
                  "MMM yyyy",
                );
                const endFormatted = job.isCurrent
                  ? "Present"
                  : job.endDate
                    ? format(new Date(job.endDate), "MMM yyyy")
                    : "Present";

                return (
                  <div
                    key={job._id}
                    className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className="bg-primary absolute left-8 z-10 h-4 w-4 -translate-x-1.5 transform rounded-full shadow-lg md:left-1/2 md:-translate-x-2" />

                    <div
                      className={`w-full md:w-1/2 ${isEven ? "md:pr-12" : "md:pl-12"}`}
                    >
                      <div className="ml-16 md:ml-0">
                        <Card
                          className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          style={{
                            animation: "var(--animate-slide-up)",
                            animationDelay: `${index * 0.1}s`,
                            animationFillMode: "both",
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 shrink-0">
                                <Image
                                  src={job.logo}
                                  alt={job.company}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <CardTitle className="text-2xl">
                                  {job.position}
                                </CardTitle>
                                <CardDescription className="text-primary text-lg font-semibold">
                                  {job.company}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="mb-4 flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="inline-flex items-center gap-1"
                              >
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {startFormatted} - {endFormatted}
                              </Badge>
                            </div>

                            {t(job.descriptionKey) && t(job.descriptionKey).length > 0 && (
                              <div className="prose prose-sm max-w-none whitespace-pre-line">
                                {t(job.descriptionKey)}
                              </div>
                            )}
                            {job.skills && job.skills.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="hidden w-1/2 md:block" />
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </section>
  );
}
