export type Project = {
  _id: string;
  nameKey: string;
  descriptionKey: string;
  challengeKey: string;
  resultKey: string;
  image?: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
  durationKey?: string;
  metrics?: {
    labelKey: string;
    value: string;
  }[];
};

export const projects: Project[] = [
  {
    _id: "proj-1",
    nameKey: "proj-1.name",
    descriptionKey: "proj-1.description",
    challengeKey: "proj-1.challenge",
    resultKey: "proj-1.result",
    featured: true,
    durationKey: "proj-1.duration",
    technologies: ["Next.js", "TypeScript", "GraphQL"],
    metrics: [
      { labelKey: "proj-1.metrics.loadTimeReduction", value: "60%" },
      { labelKey: "proj-1.metrics.userGrowthHandled", value: "10x" },
      { labelKey: "proj-1.metrics.uptime", value: "99.9%" },
    ],
  },
  {
    _id: "proj-2",
    nameKey: "proj-2.name",
    descriptionKey: "proj-2.description",
    challengeKey: "proj-2.challenge",
    resultKey: "proj-2.result",
    featured: true,
    durationKey: "proj-2.duration",
    technologies: ["React", "Node.js", "Stripe"],
    metrics: [
      { labelKey: "proj-2.metrics.conversionIncrease", value: "35%" },
      { labelKey: "proj-2.metrics.cartAbandonmentDrop", value: "22%" },
      { labelKey: "proj-2.metrics.mobileSpeedScore", value: "95" },
    ],
  },
  {
    _id: "proj-3",
    nameKey: "proj-3.name",
    descriptionKey: "proj-3.description",
    challengeKey: "proj-3.challenge",
    resultKey: "proj-3.result",
    featured: false,
    durationKey: "proj-3.duration",
    technologies: ["React", "D3.js", "Tailwind CSS"],
    metrics: [
      { labelKey: "proj-3.metrics.supportTickets", value: "-45%" },
      { labelKey: "proj-3.metrics.userSatisfaction", value: "+30%" },
    ],
  },
  {
    _id: "proj-4",
    nameKey: "proj-4.name",
    descriptionKey: "proj-4.description",
    challengeKey: "proj-4.challenge",
    resultKey: "proj-4.result",
    featured: false,
    durationKey: "proj-4.duration",
    technologies: ["Next.js", "Supabase", "Vercel"],
    metrics: [
      { labelKey: "proj-4.metrics.timeToMarket", value: "8 weeks" },
      { labelKey: "proj-4.metrics.fundingSecured", value: "$500K" },
    ],
  },
];
