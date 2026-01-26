import { AnimatedContainer } from "@/components/ui/animated-container";
import { ProjectCard } from "@/components/project-card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { getPortfolioProjects } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function PortfolioSection() {
  const locale = await getLocale();
  const projects = await getPortfolioProjects(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="scroll-mt-12 overflow-x-hidden py-12 md:py-16">
      <div className="mx-auto max-w-6xl md:px-6">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-12 md:mb-16 text-center px-4"
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

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 gap-6 px-4 md:px-0">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" aria-label={t("headline")}>
            <CarouselContent className="-ml-4 px-4 pb-4 items-stretch">
              {projects.map((project, index) => (
                <CarouselItem
                  key={project.id}
                  className={cn(
                    "pl-4 basis-[85%] h-auto",
                    index === projects.length - 1 && "mr-4"
                  )}
                >
                  <div className="h-full">
                    <ProjectCard project={project} index={index} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6">
              <CarouselDots />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
