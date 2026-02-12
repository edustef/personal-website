import cosentinoLogo from "@/assets/images/cosention-logo.png";
import swissborgLogo from "@/assets/images/swissborg-logo.png";
import type { StaticImageData } from "next/image";

export type Job = {
  _id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  descriptionKey: string;
  logo: StaticImageData;
  skills: string[];
};

export const jobs: Job[] = [
  {
    _id: "7dd627c1-777c-46cd-8321-58170dd47f64",
    position: "Intern Web Developer",
    company: "Cosentino",
    startDate: "2021-04-01",
    endDate: "2021-06-30",
    isCurrent: false,
    descriptionKey: "jobs.job-1.description",
    logo: cosentinoLogo,
    skills: ["TypeScript", "REST APIs"],
  },
  {
    _id: "1a41ec49-04d9-4500-ac41-61cd9ddb98a9",
    position: "Web Developer",
    company: "SwissBorg",
    startDate: "2021-11-17",
    endDate: "2025-09-30",
    isCurrent: false,
    descriptionKey: "jobs.job-2.description",
    logo: swissborgLogo,
    skills: [
      "NextJS",
      "GatsbyJS",
      "GraphQL",
      "TypeScript",
      "Headless CMS",
      "Storybook",
    ],
  },
].sort(
  (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
);
