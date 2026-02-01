import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ProjectVideo } from "@/components/project-video";
import {
  getAllProjectSlugs,
  getPortfolioProject,
  getPortfolioProjects,
} from "@/lib/portfolio";
import { getCanonicalUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import NextLink from "next/link";
import { notFound } from "next/navigation";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPortfolioProject(slug, locale);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: getCanonicalUrl(locale, `/portfolio/${slug}`),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((item) => ({
    locale: item.locale,
    slug: item.slug,
  }));
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPortfolioProject(slug, locale);

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const allProjects = await getPortfolioProjects(locale);

  // Find prev/next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <Link
          variant="outline"
          href="/#portfolio"
          className="inline-flex items-center font-medium mb-8"
        >
          <ChevronLeftIcon className="size-4" />
          {t("backToPortfolio")}
        </Link>

        {/* Hero Video */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="aspect-video">
            {project.images && (
              <ProjectVideo
                desktopVideo={project.desktopVideo}
                mobileVideo={project.mobileVideo}
                desktopImage={project.images.desktop}
                mobileImage={project.images.mobile}
                title={project.title}
                className="absolute inset-0"
              />
            )}
          </div>
          {project.status === "coming-soon" && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {t("comingSoon")}
              </Badge>
            </div>
          )}
        </div>

        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-medium text-primary mb-2">
            {project.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Live Link */}
          {project.status === "live" && project.liveUrl && (
            <Button asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("viewLive")}
                <ExternalLinkIcon className="ml-2 size-4" />
              </a>
            </Button>
          )}
        </header>

        {/* MDX Content */}
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <MDXRemote source={project.content} components={mdxComponents} />
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t flex justify-between">
          {prevProject ? (
            <NextLink
              href={`/portfolio/${prevProject.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">{t("previousProject")}</span>
              <p className="font-medium">{prevProject.title}</p>
            </NextLink>
          ) : (
            <div />
          )}
          {nextProject ? (
            <NextLink
              href={`/portfolio/${nextProject.slug}`}
              className="text-right text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">{t("nextProject")}</span>
              <p className="font-medium">{nextProject.title}</p>
            </NextLink>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
