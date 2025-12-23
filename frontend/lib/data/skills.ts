export type Skill = {
  _id: string;
  name: string;
  type: "technical" | "soft";
};

export const skills: Skill[] = [
  {
    _id: "f46a566c-668e-405a-abd3-d5f82c7942eb",
    name: "GatsbyJS",
    type: "technical",
  },
  {
    _id: "66aeaa2d-7a13-4e84-ab77-e87b312fd9a4",
    name: "React native",
    type: "technical",
  },
  {
    _id: "caacd3af-c25d-45c4-a08f-e27609082902",
    name: "Headless CMS",
    type: "technical",
  },
  {
    _id: "38c3186f-1f20-449d-a64a-7cfeeb241218",
    name: "TypeScript",
    type: "technical",
  },
  {
    _id: "3318f8d1-f883-4a59-8128-f44ca4bde9d4",
    name: "JavaScript",
    type: "technical",
  },
  {
    _id: "be211837-ea2a-404e-a416-86eba83a2c2a",
    name: "React",
    type: "technical",
  },
  {
    _id: "beb8467c-99cb-4432-b27c-bc72620bcfcd",
    name: "MySQL",
    type: "technical",
  },
  {
    _id: "24cfcf56-6962-4ad7-a658-dd9230568e05",
    name: "Storybook",
    type: "technical",
  },
  {
    _id: "6cd5831e-670e-4dd6-8604-6a413049cd07",
    name: "GraphQL",
    type: "technical",
  },
  {
    _id: "bca82780-68dd-451f-af1b-602cf68334e1",
    name: "NextJS",
    type: "technical",
  },
  {
    _id: "22384042-4f12-42fc-9020-4a2af0bb0e5d",
    name: "REST APIs",
    type: "technical",
  },
].sort((a, b) => a.name.localeCompare(b.name));

