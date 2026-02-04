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
  const [desktopLoaded, setDesktopLoaded] = useState(false);
  const [mobileLoaded, setMobileLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const desktopVid = desktopVideoRef.current;
    const mobileVid = mobileVideoRef.current;

    // Ensure muted attribute is set (required for autoplay on mobile)
    if (desktopVid) desktopVid.muted = true;
    if (mobileVid) mobileVid.muted = true;

    if (!container) return;

    const playVideos = () => {
      // Use catch to silently handle AbortError (happens when play/pause race)
      desktopVid?.play().catch(() => {});
      mobileVid?.play().catch(() => {});
    };

    const pauseVideos = () => {
      desktopVid?.pause();
      mobileVid?.pause();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            playVideos();
          } else {
            pauseVideos();
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
      {/* Desktop version */}
      <div className="hidden md:block absolute inset-0">
        {!desktopLoaded && (
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
          src={desktopVideo}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={desktopImage.src}
          onCanPlay={() => setDesktopLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            desktopLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* Mobile version */}
      <div className="md:hidden absolute inset-0">
        {!mobileLoaded && (
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
          src={mobileVideo}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={mobileImage.src}
          onCanPlay={() => setMobileLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            mobileLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  );
}
