"use client";

import { ProjectVideo } from "@/components/project-video";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("portfolio");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block rounded-2xl overflow-hidden bg-muted/50 border border-muted"
      >
        {/* Video/Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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

          {/* Bottom fade mask */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-muted/50 to-transparent" />

          {/* Coming Soon Badge */}
          {project.status === "coming-soon" && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {t("comingSoon")}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Below Image */}
        <div className="p-6">
          <p className="text-sm font-medium text-primary mb-2">
            {project.category}
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
