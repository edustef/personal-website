"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function BackgroundPaperShaders() {
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        const rect = container?.getBoundingClientRect();
        setDimensions({
          width: rect?.width || window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateDimensions();

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        if (typeof window !== "undefined") {
          const rect = container?.getBoundingClientRect();
          setDimensions({
            width: rect?.width || window.innerWidth,
            height: window.innerHeight,
          });
        }
      });
    }

    resizeObserverRef.current.observe(container);

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="absolute -z-10 inset-0 h-screen w-full"
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="absolute -z-10 inset-0 h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <MeshGradient
          className="mask-b-from-50% mask-b-to-100%"
          width={dimensions.width}
          height={dimensions.height}
          colors={isDark ? ["#000000", "#333333"] : ["#ffffff", "#dddddd"]}
          distortion={1}
          swirl={0.5}
          grainMixer={0}
          grainOverlay={0}
          speed={0.7}
          rotation={90}
        />
      )}
    </motion.div>
  );
}
