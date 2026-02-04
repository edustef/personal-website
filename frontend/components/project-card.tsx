"use client";

import { ProjectVideo } from "@/components/project-video";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/portfolio";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("portfolio");

  // Link to external URL if available
  const hasLink = !!project.liveUrl;

  const cardContent = (
    <>
      {/* Video/Image Container with fade mask - portrait on mobile, landscape on desktop */}
      <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-muted">
        {project.images ? (
          <ProjectVideo
            desktopVideo={project.desktopVideo}
            mobileVideo={project.mobileVideo}
            desktopImage={project.images.desktop}
            mobileImage={project.images.mobile}
            title={project.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Coming Soon Badge */}
        {project.status === "coming-soon" && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border border-border shadow-md">
              {t("comingSoon")}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Below Image */}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-medium text-primary mb-2">
          {project.category}
        </p>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mt-auto">
          {project.description}
        </p>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      {hasLink ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col h-full rounded-2xl overflow-hidden bg-muted/50 border border-muted"
        >
          {cardContent}
        </a>
      ) : (
        <div className="group flex flex-col h-full rounded-2xl overflow-hidden bg-muted/50 border border-muted">
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}
