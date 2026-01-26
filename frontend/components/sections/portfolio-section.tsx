import { AnimatedContainer } from "@/components/ui/animated-container";
import { ProjectCard } from "@/components/project-card";
import { getPortfolioProjects } from "@/lib/portfolio";
import { getLocale, getTranslations } from "next-intl/server";

export default async function PortfolioSection() {
  const locale = await getLocale();
  const projects = await getPortfolioProjects(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="scroll-mt-12 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
            <a href="#portfolio" className="hover:text-primary transition-colors">
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
