"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { ArrowUp, List, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get all headings from the article
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const headingData: Heading[] = [];

    elements.forEach((element, index) => {
      const id = element.id || `heading-${index}`;
      if (!element.id) {
        element.id = id;
      }

      headingData.push({
        id,
        text: element.textContent || "",
        level: Number.parseInt(element.tagName.charAt(1)),
      });
    });

    setHeadings(headingData);

    // Intersection Observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop - Sticky Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-12rem)] overflow-y-auto z-[100]"
      >
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            On this page
          </h3>
          <nav>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="flex w-full items-center gap-2 py-1 text-left text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowUp className="size-4" />
                  Go to top
                </button>
              </li>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                >
                  <a
                    href={`#${heading.id}`}
                    className={`block py-1 transition-colors hover:text-primary ${
                      activeId === heading.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {/* Mobile - Floating Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="xl:hidden fixed bottom-6 right-6 z-[100]">
          <PopoverTrigger asChild>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              aria-label="Toggle table of contents"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="size-6" />
                ) : (
                  <List className="size-6" />
                )}
              </motion.div>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-72 max-h-96 overflow-y-auto bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              On this page
            </h3>
            <nav>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => scrollToTop(), 100);
                    }}
                    className="flex w-full items-center gap-2 py-1 text-left text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowUp className="size-4" />
                    Go to top
                  </button>
                </li>
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                  >
                    <a
                      href={`#${heading.id}`}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className={`block py-1 transition-colors hover:text-primary ${
                        activeId === heading.id
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </PopoverContent>
        </div>
      </Popover>
    </>
  );
}
