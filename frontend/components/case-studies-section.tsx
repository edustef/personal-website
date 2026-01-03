import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { type Project, projects } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

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
	const tProjects = await getTranslations({ locale, namespace: "projects" });

	return (
		<section className="bg-muted/30 py-12 md:py-16">
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
											{project.durationKey && (
												<span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
													{tProjects(project.durationKey)}
												</span>
											)}
										</div>
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-primary"
												aria-label={`${t("viewProject")}: ${tProjects(project.nameKey)}`}
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
										{tProjects(project.nameKey)}
									</h3>

									<p
										className={cn(
											"text-muted-foreground mb-6 leading-relaxed",
											isFeatured && index === 0 ? "text-base" : "text-sm",
										)}
									>
										{tProjects(project.descriptionKey)}
									</p>

									<div className="mt-auto space-y-4">
										<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
											<p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
												{t("result")}
											</p>
											<p className="text-foreground text-sm leading-relaxed">
												{tProjects(project.resultKey)}
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
															{tProjects(metric.labelKey)}
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
