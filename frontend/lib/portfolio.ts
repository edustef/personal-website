import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { StaticImageData } from "next/image";
import { getProjectImages } from "./portfolio-images";

const PORTFOLIO_DIR = path.join(process.cwd(), "content/portfolio");
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "";

function getMediaUrl(filename: string): string {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  return `${MEDIA_URL}/${filename}`;
}

export type ProjectStatus = "live" | "coming-soon";

export type ProjectImages = {
  desktop: StaticImageData;
  mobile: StaticImageData;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  liveUrl?: string;
  images: ProjectImages | null;
  desktopVideo: string;
  mobileVideo: string;
  techStack: string[];
  date: string;
  content: string;
  locale: string;
};

export async function getPortfolioProjects(locale: string): Promise<Project[]> {
  const localeDir = path.join(PORTFOLIO_DIR, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir);

  const projects = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(localeDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const projectId = data.id || file.replace(".mdx", "");
      return {
        id: projectId,
        slug: file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status || "live",
        liveUrl: data.liveUrl,
        images: getProjectImages(projectId),
        desktopVideo: getMediaUrl(data.desktopVideo),
        mobileVideo: getMediaUrl(data.mobileVideo),
        techStack: data.techStack || [],
        date: data.date,
        content,
        locale,
      } as Project;
    });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPortfolioProject(
  slug: string,
  locale: string
): Promise<Project | null> {
  const filePath = path.join(PORTFOLIO_DIR, locale, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const projectId = data.id || slug;
  return {
    id: projectId,
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status || "live",
    liveUrl: data.liveUrl,
    images: getProjectImages(projectId),
    desktopVideo: getMediaUrl(data.desktopVideo),
    mobileVideo: getMediaUrl(data.mobileVideo),
    techStack: data.techStack || [],
    date: data.date,
    content,
    locale,
  };
}

export async function getAllProjectSlugs(): Promise<
  { slug: string; locale: string }[]
> {
  const locales = ["en", "es", "ro"];
  const slugs: { slug: string; locale: string }[] = [];

  for (const locale of locales) {
    const projects = await getPortfolioProjects(locale);
    for (const project of projects) {
      slugs.push({ slug: project.slug, locale });
    }
  }

  return slugs;
}

export async function getProjectTranslations(
  slug: string,
  locale: string
): Promise<{ locale: string; slug: string }[]> {
  const locales = ["en", "es", "ro"];
  const translations: { locale: string; slug: string }[] = [];

  for (const loc of locales) {
    const project = await getPortfolioProject(slug, loc);
    if (project) {
      translations.push({ locale: loc, slug: project.slug });
    }
  }

  return translations;
}
