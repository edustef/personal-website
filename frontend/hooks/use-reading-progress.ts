import { useEffect, useState } from "react";

export function useReadingProgress(selector = "article") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (!element) return;

    const calculateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // Article hasn't started yet
      if (elementTop >= windowHeight) {
        setProgress(0);
        return;
      }

      // Article is fully scrolled past
      if (elementBottom <= 0) {
        setProgress(100);
        return;
      }

      // Calculate how much we've scrolled through the article
      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = Math.max(0, elementHeight - windowHeight);

      if (totalScrollable <= 0) {
        setProgress(elementTop <= 0 ? 100 : 0);
        return;
      }

      const calculatedProgress = (scrolled / totalScrollable) * 100;
      setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    };

    // Use scroll event for continuous tracking
    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });

    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [selector]);

  return progress;
}
