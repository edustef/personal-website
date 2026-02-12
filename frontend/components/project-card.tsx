"use client";

import { ProjectVideo } from "@/components/project-video";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/portfolio";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("portfolio");
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices (no hover capability)
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  // For mobile: trigger "hover" effects when card is centered in viewport
  const isInView = useInView(ref, { amount: 0.7 });
  const isActive = isHovered || (isTouchDevice && isInView);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig);

  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  // Different glow colors per card
  const glowColors = ["217 91% 60%", "262 83% 58%", "142 71% 45%", "339 90% 51%", "24 95% 53%"];
  const glowColor = glowColors[index % glowColors.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  // Link to external URL if available
  const hasLink = !!project.liveUrl;

  const cardContent = (
    <>
      {/* Video/Image Container with fade mask - portrait on mobile, landscape on desktop */}
      <div className="relative aspect-4/5 md:aspect-16/10 overflow-hidden bg-muted">
        {project.images && project.desktopVideo && project.mobileVideo ? (
          <ProjectVideo
            desktopVideo={project.desktopVideo}
            mobileVideo={project.mobileVideo}
            desktopImage={project.images.desktop}
            mobileImage={project.images.mobile}
            title={project.title}
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : project.images ? (
          <>
            <Image
              src={project.images.desktop}
              alt={project.title}
              fill
              className="hidden md:block object-cover absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <Image
              src={project.images.mobile}
              alt={project.title}
              fill
              className="md:hidden object-cover absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Coming Soon Badge */}
        {project.status === "coming-soon" && (
          <motion.div
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm border border-border shadow-md"
            >
              {t("comingSoon")}
            </Badge>
          </motion.div>
        )}

        {/* Gradient overlay that intensifies on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, hsl(var(--card)) 0%, transparent 50%)`,
          }}
          animate={{
            opacity: isActive ? 0.9 : 0.7,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content Below Image */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Category with animated underline */}
        <div className="relative inline-flex mb-2 self-start">
          <p className="text-sm font-medium text-primary">
            {project.category}
          </p>
          <motion.div
            className="absolute -bottom-0.5 left-0 h-px bg-primary"
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : "0%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mt-auto">
          {project.description}
        </p>
      </div>
    </>
  );

  const CardWrapper = hasLink ? motion.a : motion.div;
  const wrapperProps = hasLink
    ? {
        href: project.liveUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <motion.div
      ref={ref}
      className="h-full group"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
<CardWrapper
          {...wrapperProps}
          className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-card/80 border border-border/30 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl"
        >
          {/* Animated gradient border */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: `linear-gradient(135deg, hsl(${glowColor} / 0.5) 0%, transparent 40%, transparent 60%, hsl(${glowColor} / 0.3) 100%)`,
              opacity: isActive ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Inner background */}
          <div className="absolute inset-px rounded-[calc(1rem-1px)] bg-card" />

          {/* Mouse-following glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(400px circle at ${x}% ${y}%, hsl(${glowColor} / 0.08), transparent 50%)`
              ),
              opacity: isActive ? 1 : 0,
            }}
          />

          {/* Shine sweep effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ x: "-100%" }}
              animate={isActive ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                transform: "skewX(-15deg)",
              }}
            />
          </motion.div>

          {/* Card content */}
          <div className="relative z-10 flex flex-col h-full">{cardContent}</div>
        </CardWrapper>
      </motion.div>
    </motion.div>
  );
}
