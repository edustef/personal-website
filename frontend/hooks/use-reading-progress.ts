import { useEffect, useState } from "react";

export function useReadingProgress(selector: string = "article") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (!element) return;

    const calculateProgress = (entry?: IntersectionObserverEntry) => {
      const rect = entry?.boundingClientRect ?? element.getBoundingClientRect();
      const rootBounds = entry?.rootBounds ?? {
        top: 0,
        bottom: window.innerHeight,
        height: window.innerHeight,
      };
      
      const windowHeight = rootBounds.height;
      const elementHeight = rect.height;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      if (elementTop >= windowHeight) {
        setProgress(100);
        return;
      }

      if (elementBottom <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = Math.max(0, elementHeight - windowHeight);

      if (totalScrollable <= 0) {
        setProgress(elementTop <= 0 ? 100 : 0);
        return;
      }

      const calculatedProgress = (scrolled / totalScrollable) * 100;
      setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        calculateProgress(entry);
      }
    }, observerOptions);

    const resizeObserver = new ResizeObserver(() => {
      calculateProgress();
    });

    observer.observe(element);
    resizeObserver.observe(element);
    resizeObserver.observe(document.documentElement);

    calculateProgress();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [selector]);

  return progress;
}
