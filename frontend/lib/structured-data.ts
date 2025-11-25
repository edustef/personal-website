import { getCanonicalUrl } from "./seo";
import { routing } from "@/i18n/routing";

export type PersonSchema = {
  "@context": "https://schema.org";
  "@type": "Person";
  name?: string;
  email?: string;
  telephone?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  url?: string;
};

export type WebSiteSchema = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  description?: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
  inLanguage?: string[];
  alternateName?: string[];
};

export type ArticleSchema = {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Person";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  url?: string;
  inLanguage?: string;
};

export function createPersonSchema(
  person: {
    name?: string;
    email?: string;
    phone?: string;
    motto?: string;
    about?: string;
    picture?: { asset?: { url?: string } };
    socialLinks?: Array<{ url?: string }>;
  },
  locale: string,
): PersonSchema {
  const schema: PersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
  };

  if (person.name) {
    schema.name = person.name;
  }

  if (person.email) {
    schema.email = person.email;
  }

  if (person.phone) {
    schema.telephone = person.phone;
  }

  if (person.motto) {
    schema.jobTitle = person.motto;
  }

  if (person.about) {
    schema.description = person.about;
  }

  if (person.picture?.asset?.url) {
    schema.image = person.picture.asset.url;
  }

  if (person.socialLinks && person.socialLinks.length > 0) {
    schema.sameAs = person.socialLinks
      .map((link) => link.url)
      .filter((url): url is string => Boolean(url));
  }

  return schema;
}

export async function createWebSiteSchema(
  name: string,
  description: string | undefined,
  locale: string,
): Promise<WebSiteSchema> {
  const url = await getCanonicalUrl(locale, "");
  const locales = routing.locales.map((loc) => loc.id);

  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    inLanguage: locales,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

export function createArticleSchema(
  article: {
    title: string;
    excerpt?: string;
    coverImage?: { asset?: { url?: string } };
    date?: string;
    _updatedAt?: string;
  },
  authorName: string,
  publisherName: string,
  url: string,
  locale: string,
): ArticleSchema {
  const schema: ArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    url,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
    },
  };

  if (article.excerpt) {
    schema.description = article.excerpt;
  }

  if (article.coverImage?.asset?.url) {
    schema.image = article.coverImage.asset.url;
  }

  if (article.date) {
    schema.datePublished = article.date;
  }

  if (article._updatedAt) {
    schema.dateModified = article._updatedAt;
  }

  return schema;
}
