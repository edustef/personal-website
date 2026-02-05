"use client";

import { useEffect, useRef, useState } from "react";
import { BlobsLayer } from "./blobs-layer";
import { TendrilsLayer } from "./tendrils-layer";

type ServicesSectionClientProps = {
  children: React.ReactNode;
};

export function ServicesSectionClient({ children }: ServicesSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <BlobsLayer isVisible={isVisible} />
      <TendrilsLayer isVisible={isVisible} />
      {children}
    </div>
  );
}
