"use client";

import { Link } from "@/components/ui/link";
import type { BlogPost } from "@/lib/blog";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const post of posts) {
      if (post.tags) {
        for (const tag of post.tags) {
          tags.add(tag);
        }
      }
    }
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        !selectedTag || (post.tags?.includes(selectedTag) ?? false);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
  };

  const hasActiveFilters = !!searchQuery || !!selectedTag;

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground"
        >
          {t("description")}
        </motion.p>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden mt-12 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("filterByTag")}:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !selectedTag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t("allTags")}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-primary hover:underline"
          >
            {t("clearFilters")}
          </button>
        )}
      </motion.div>

      {/* Posts Grid */}
      <div className="mt-12">
        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-16 text-center"
            >
              <svg
                className="mx-auto size-16 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {t("noResults")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("noResultsDescription")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="whitespace-normal group block h-full overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
                  >
                    <article className="flex h-full flex-col p-6">
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <time dateTime={post.date} className="truncate">
                          {new Date(post.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        {post.readTime && (
                          <>
                            <span className="shrink-0">•</span>
                            <span className="truncate">
                              {t("minRead", { minutes: post.readTime })}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="mt-4 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p className="mt-2 grow text-muted-foreground">
                        {post.description}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground truncate max-w-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="mt-6 flex items-center font-medium text-primary shrink-0">
                        <span className="truncate">{t("readMore")}</span>
                        <svg
                          className="ml-2 size-4 shrink-0 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <title>{t("readMore")}</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
