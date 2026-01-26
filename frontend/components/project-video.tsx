"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type ProjectVideoProps = {
  desktopVideo: string;
  mobileVideo: string;
  coverImage: string;
  title: string;
  className?: string;
};

export function ProjectVideo({
  desktopVideo,
  mobileVideo,
  coverImage,
  title,
  className,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  const videoSrc = isMobile ? mobileVideo : desktopVideo;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay failed, likely due to browser policy
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Fallback image shown until video loads */}
      {!isLoaded && (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={coverImage}
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
