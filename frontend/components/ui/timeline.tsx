"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

interface TimelineEntry {
  id?: string;
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  headerTitle?: React.ReactNode;
  headerDescription?: React.ReactNode;
  showHeader?: boolean;
}

export const Timeline = ({
  data,
  headerTitle,
  headerDescription,
  showHeader = true,
}: TimelineProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // Throttle resize to max once per 100ms
    const throttledUpdateHeight = throttle(100, updateHeight);

    updateHeight();
    const timeoutId = setTimeout(updateHeight, 0);
    window.addEventListener("resize", throttledUpdateHeight, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", throttledUpdateHeight);
      (throttledUpdateHeight as { cancel: () => void }).cancel(); // Clean up throttle
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="relative w-full bg-transparent font-sans"
      ref={containerRef}
    >
      {showHeader && (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          {headerTitle && (
            <h2 className="text-lg md:text-xl mb-4 text-foreground max-w-4xl">
              {headerTitle}
            </h2>
          )}
          {headerDescription && (
            <p className="text-muted-foreground text-sm md:text-base max-w-sm">
              {headerDescription}
            </p>
          )}
        </div>
      )}

      <div ref={ref} className="relative max-w-3xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={item.id ?? `timeline-${index}`}
            className="flex justify-start not-first:pt-8 not-first:md:pt-16 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-foreground/5 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted-foreground" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl font-bold text-muted-foreground">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden mt-1 block text-2xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: `${height}px`,
          }}
          className="absolute md:left-8 left-8 top-20 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-gray-300 dark:via-gray-500 to-transparent to-99%  mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              filter:
                mounted && isDark
                  ? "drop-shadow(0 0 4px rgb(156 163 175 / 0.3)) drop-shadow(0 0 8px rgb(156 163 175 / 0.15))"
                  : "drop-shadow(0 0 4px rgb(107 114 128 / 0.3)) drop-shadow(0 0 8px rgb(107 114 128 / 0.15))",
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-linear-to-t from-gray-400 dark:from-gray-400 via-gray-300 dark:via-gray-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
