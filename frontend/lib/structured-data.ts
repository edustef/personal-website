import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "./seo";

export function sanitizeJsonLd(json: object): string {
  return JSON.stringify(json).replace(/</g, "\\u003c");
}

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
  worksFor?: {
      "@type": "Organization";
      name: string;
  };
  knowsAbout?: string[];
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
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    about?: string | null;
    picture?: string | null;
    socialLinks?: Array<{ url?: string | null }> | null;
    jobTitle?: string | null;
    url?: string | null;
    worksFor?: string | null;
    knowsAbout?: string[] | null;
  },
  locale: string
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

  if (person.about) {
    schema.description = person.about;
  }

  if (person.picture) {
    schema.image = person.picture;
  }
  
  if (person.jobTitle) {
    schema.jobTitle = person.jobTitle;
  }

  if (person.url) {
    schema.url = person.url;
  }
  
  if (person.worksFor) {
     schema.worksFor = {
        "@type": "Organization",
        name: person.worksFor
     };
  }
  
  if (person.knowsAbout && person.knowsAbout.length > 0) {
      schema.knowsAbout = person.knowsAbout;
  }

  if (person.socialLinks && person.socialLinks.length > 0) {
    schema.sameAs = person.socialLinks
      .map((link) => link.url)
      .filter((url): url is string => Boolean(url));
  }

  return schema;
}

export function createWebSiteSchema(
  name: string,
  description: string | undefined,
  locale: string
): WebSiteSchema {
  const url = getCanonicalUrl(locale, "");

  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    inLanguage: routing.locales,
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
  locale: string
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

export type FAQPageSchema = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
  inLanguage?: string;
};

export function createFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale: string
): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    inLanguage: locale,
  };
}

export type ServiceSchema = {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Person";
    name: string;
  };
  areaServed?: string;
  serviceType?: string;
  url?: string;
};

export function createServiceSchema(
  service: {
    name: string;
    description: string;
    providerName: string;
    url?: string;
  },
): ServiceSchema {
  const schema: ServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Person",
      name: service.providerName,
    },
    areaServed: "Worldwide",
    serviceType: "Web Development",
  };

  if (service.url) {
    schema.url = service.url;
  }

  return schema;
}
