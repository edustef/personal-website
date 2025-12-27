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
  challenge: {
    en: string;
    ro?: string;
    es?: string;
  };
  result: {
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
  metrics?: {
    label: string;
    value: string;
  }[];
};

export const projects: Project[] = [
  {
    _id: "proj-1",
    name: {
      en: "FinTech Trading Platform",
    },
    description: {
      en: "A comprehensive wealth management platform serving thousands of users globally with real-time portfolio tracking and automated investment strategies.",
    },
    challenge: {
      en: "The client needed to scale their legacy trading platform to handle 10x user growth while maintaining sub-second response times.",
    },
    result: {
      en: "Delivered a modern, scalable architecture that reduced page load times by 60% and enabled the platform to handle peak trading volumes effortlessly.",
    },
    featured: true,
    duration: "18 months",
    technologies: ["Next.js", "TypeScript", "GraphQL"],
    metrics: [
      { label: "Load Time Reduction", value: "60%" },
      { label: "User Growth Handled", value: "10x" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  {
    _id: "proj-2",
    name: {
      en: "E-commerce Conversion Boost",
    },
    description: {
      en: "Complete redesign and optimization of a mid-market e-commerce store struggling with cart abandonment and slow mobile performance.",
    },
    challenge: {
      en: "High bounce rates on mobile and a 78% cart abandonment rate were costing the business significant revenue.",
    },
    result: {
      en: "Implemented a streamlined checkout flow and optimized mobile experience, resulting in measurable revenue growth within 3 months.",
    },
    featured: true,
    duration: "4 months",
    technologies: ["React", "Node.js", "Stripe"],
    metrics: [
      { label: "Conversion Increase", value: "35%" },
      { label: "Cart Abandonment Drop", value: "22%" },
      { label: "Mobile Speed Score", value: "95" },
    ],
  },
  {
    _id: "proj-3",
    name: {
      en: "SaaS Dashboard Rebuild",
    },
    description: {
      en: "Transformed a cluttered analytics dashboard into an intuitive interface that users actually love to use.",
    },
    challenge: {
      en: "Customer support tickets related to UI confusion were overwhelming the team, and user retention was declining.",
    },
    result: {
      en: "Redesigned the entire UX with a focus on clarity and efficiency. Support tickets dropped significantly and user satisfaction scores improved.",
    },
    featured: false,
    duration: "6 months",
    technologies: ["React", "D3.js", "Tailwind CSS"],
    metrics: [
      { label: "Support Tickets", value: "-45%" },
      { label: "User Satisfaction", value: "+30%" },
    ],
  },
  {
    _id: "proj-4",
    name: {
      en: "Startup MVP Launch",
    },
    description: {
      en: "Took an idea from napkin sketch to launched product in record time, helping founders validate their market hypothesis.",
    },
    challenge: {
      en: "The founders had limited runway and needed to get to market fast to secure their next funding round.",
    },
    result: {
      en: "Delivered a fully functional MVP in 8 weeks that impressed investors and secured seed funding for the startup.",
    },
    featured: false,
    duration: "8 weeks",
    technologies: ["Next.js", "Supabase", "Vercel"],
    metrics: [
      { label: "Time to Market", value: "8 weeks" },
      { label: "Funding Secured", value: "$500K" },
    ],
  },
];
