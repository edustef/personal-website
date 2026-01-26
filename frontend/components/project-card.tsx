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
      className="h-full"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block h-full rounded-2xl overflow-hidden bg-muted"
      >
        <div className="relative aspect-[4/5] md:aspect-[4/5] overflow-hidden">
          {/* Video/Image */}
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
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-6xl font-bold text-muted-foreground/20">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Top gradient for text readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />

          {/* Text overlay at top */}
          <div className="absolute top-0 left-0 right-0 p-6 z-20">
            <p className="text-sm font-medium text-white/80 mb-1">
              {project.category}
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              {project.title}
            </h3>
          </div>

          {/* Coming Soon Badge */}
          {project.status === "coming-soon" && (
            <div className="absolute bottom-4 right-4 z-20">
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0">
                {t("comingSoon")}
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
