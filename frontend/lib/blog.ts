import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  id: string; // Cross-locale mapping ID
  slug: string; // Localized slug
  title: string;
  description: string;
  date: string;
  content: string;
  locale: string;
};

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const localeDir = path.join(BLOG_DIR, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(localeDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      return {
        id: data.id || file.replace(".mdx", ""), // Fallback to slug if id is missing
        slug: file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        date: data.date,
        content,
        locale,
      };
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogPost(
  slug: string,
  locale: string
): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`);

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
    date: data.date,
    content,
    locale,
  };
}

export type BlogPostWithTranslations = BlogPost & {
  translations: { locale: string; slug: string }[];
};

export async function getAllPostsWithTranslations(): Promise<
  BlogPostWithTranslations[]
> {
  const locales = ["en", "es", "ro"];
  const allPostsByLocale: Record<string, BlogPost[]> = {};

  for (const locale of locales) {
    allPostsByLocale[locale] = await getBlogPosts(locale);
  }

  // Create a map of posts by ID for grouping
  const postsById: Record<string, BlogPost[]> = {};

  for (const locale of locales) {
    for (const post of allPostsByLocale[locale]) {
      if (!postsById[post.id]) {
        postsById[post.id] = [];
      }
      postsById[post.id].push(post);
    }
  }

  const result: BlogPostWithTranslations[] = [];

  for (const id in postsById) {
    const posts = postsById[id];
    for (const post of posts) {
      result.push({
        ...post,
        translations: posts.map((p) => ({ locale: p.locale, slug: p.slug })),
      });
    }
  }

  return result;
}

export async function getAllPostSlugs(): Promise<
  { slug: string; locale: string }[]
> {
  const posts = await getAllPostsWithTranslations();
  return posts.map((p) => ({ slug: p.slug, locale: p.locale }));
}
