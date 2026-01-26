"use client";

import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectVideoProps = {
  desktopVideo: string;
  mobileVideo: string;
  desktopImage: StaticImageData;
  mobileImage: StaticImageData;
  title: string;
  className?: string;
};

export function ProjectVideo({
  desktopVideo,
  mobileVideo,
  desktopImage,
  mobileImage,
  title,
  className,
}: ProjectVideoProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const desktopVideo = desktopVideoRef.current;
    const mobileVideo = mobileVideoRef.current;

    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            desktopVideo?.play().catch(() => {});
            mobileVideo?.play().catch(() => {});
          } else {
            desktopVideo?.pause();
            mobileVideo?.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Desktop version */}
      <div className="hidden md:block absolute inset-0">
        {!isLoaded && (
          <Image
            src={desktopImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
        <video
          ref={desktopVideoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={desktopImage.src}
          onLoadedData={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={desktopVideo} type="video/mp4" />
        </video>
      </div>

      {/* Mobile version */}
      <div className="md:hidden absolute inset-0">
        {!isLoaded && (
          <Image
            src={mobileImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
        <video
          ref={mobileVideoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={mobileImage.src}
          onLoadedData={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={mobileVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
