"use client";

import { useEffect, useRef } from "react";

export function ScrollAwareHeader() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.documentElement.classList.remove("header-scrolled");
        } else {
          document.documentElement.classList.add("header-scrolled");
        }
      },
      {
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.documentElement.classList.remove("header-scrolled");
    };
  }, []);

  return <div ref={sentinelRef} className="absolute top-0 left-0 h-1 w-full" />;
}
