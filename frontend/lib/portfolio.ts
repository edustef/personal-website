import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PORTFOLIO_DIR = path.join(process.cwd(), "content/portfolio");

export type ProjectStatus = "live" | "coming-soon";

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  liveUrl?: string;
  coverImage: string;
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

      return {
        id: data.id || file.replace(".mdx", ""),
        slug: file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status || "live",
        liveUrl: data.liveUrl,
        coverImage: data.coverImage,
        desktopVideo: data.desktopVideo,
        mobileVideo: data.mobileVideo,
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

  return {
    id: data.id || slug,
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status || "live",
    liveUrl: data.liveUrl,
    coverImage: data.coverImage,
    desktopVideo: data.desktopVideo,
    mobileVideo: data.mobileVideo,
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
