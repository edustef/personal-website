"use client";

import { TableOfContents } from "@/components/blog/table-of-contents";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Link } from "@/components/ui/link";
import type { BlogPost } from "@/lib/blog";
import { getSocialIcon } from "@/lib/social-icons";
import { motion } from "framer-motion";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type SocialLink = {
  name: string;
  url: string;
};

interface BlogPostClientProps {
  post: BlogPost;
  content: React.ReactNode;
  socialLinks?: SocialLink[];
}

export default function BlogPostClient({
  post,
  content,
  socialLinks,
}: BlogPostClientProps) {
  const t = useTranslations("blog");
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const hasSocialLinks = socialLinks && socialLinks.length > 0;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = post.title;

    const shareUrls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(
      shareUrls[platform as keyof typeof shareUrls],
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: readingProgress / 100 }}
      />

      {/* Table of Contents */}
      <TableOfContents />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[90ch] px-4">
          <article>
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                variant="outline"
                href="/blog"
                className="inline-flex items-center font-medium mb-8"
              >
                <ChevronLeftIcon className="size-4" />
                {t("backToBlog")}
              </Link>
            </motion.div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="mb-12"
            >
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-4xl text-pretty">
                {post.title}
              </h1>

              {/* Description */}
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed text-pretty">
                {post.description}
              </p>

              {/* Meta Info */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                {post.readTime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{t("minRead", { minutes: post.readTime })}</span>
                    </div>
                  </>
                )}

                {post.author && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{post.author}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="mt-8 h-px bg-border" />
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[90ch] prose dark:prose-invert prose-p:text-lg text-pretty"
            >
              {content}
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 pt-8 border-t"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Share this article
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handleShare("x")}
                  size="lg"
                  variant="outline"
                  aria-label="Share on X (formerly Twitter)"
                  title="Share on X (formerly Twitter)"
                  className="aspect-square p-0 bg-transparent hover:bg-transparent"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>

                <Button
                  type="button"
                  onClick={() => handleShare("linkedin")}
                  size="lg"
                  variant="outline"
                  aria-label="Share on LinkedIn"
                  title="Share on LinkedIn"
                  className="aspect-square p-0 bg-transparent hover:bg-transparent"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Button>

                <Button
                  type="button"
                  onClick={() => handleShare("facebook")}
                  size="lg"
                  variant="outline"
                  aria-label="Share on Facebook"
                  title="Share on Facebook"
                  className="aspect-square p-0 bg-transparent hover:bg-transparent"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>

                <CopyButton
                  text={currentUrl}
                  ariaLabel="Copy link to clipboard"
                />
              </div>
            </motion.div>

            {/* Social Links Section */}
            {hasSocialLinks && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 pt-8 border-t"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Connect with me
                </h3>
                <div className="flex gap-2">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.name);
                    return (
                      <Button
                        key={link.name}
                        asChild
                        size="lg"
                        variant="outline"
                        className="aspect-square p-0 bg-transparent hover:bg-transparent"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                        >
                          {Icon && <Icon className="size-5" />}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
