export type Project = {
  _id: string;
  name: {
    en: string;
    ro?: string;
    es?: string;
  };
  description: {
    en: string;
    ro?: string;
    es?: string;
  };
  image?: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
  duration?: string;
};

export const projects: Project[] = [];

