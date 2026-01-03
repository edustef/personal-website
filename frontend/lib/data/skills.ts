export type Skill = {
  name: string;
  type: "technical" | "soft";
};

export const skills = [
  {
    name: "GatsbyJS",
    type: "technical",
  },
  {
    name: "React native",
    type: "technical",
  },
  {
    name: "Headless CMS",
    type: "technical",
  },
  {
    name: "TypeScript",
    type: "technical",
  },
  {
    name: "JavaScript",
    type: "technical",
  },
  {
    name: "React",
    type: "technical",
  },
  {
    name: "MySQL",
    type: "technical",
  },
  {
    name: "Storybook",
    type: "technical",
  },
  {
    name: "GraphQL",
    type: "technical",
  },
  {
    name: "NextJS",
    type: "technical",
  },
  {
    name: "REST APIs",
    type: "technical",
  },
] as const satisfies Skill[];
