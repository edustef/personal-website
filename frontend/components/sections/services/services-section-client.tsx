"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { BlobsLayer } from "./blobs-layer";
import { TendrilsLayer } from "./tendrils-layer";

type ServicesVisibilityContextType = {
  isVisible: boolean;
};

const ServicesVisibilityContext = createContext<ServicesVisibilityContextType>({
  isVisible: false,
});

export function useServicesVisibility() {
  return useContext(ServicesVisibilityContext);
}

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
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <ServicesVisibilityContext.Provider value={{ isVisible }}>
      <div ref={sectionRef} className="relative">
        <BlobsLayer isVisible={isVisible} />
        <div className="hidden md:block">
          <TendrilsLayer isVisible={isVisible} />
        </div>
        {children}
      </div>
    </ServicesVisibilityContext.Provider>
  );
}
