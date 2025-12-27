export type Service = {
  _id: string;
  title: {
    en: string;
    ro?: string;
    es?: string;
  };
  description: {
    en: string;
    ro?: string;
    es?: string;
  };
  icon: string;
  featured: boolean;
};

export const services: Service[] = [
  {
    _id: "svc-1",
    title: {
      en: "Custom Web Applications",
    },
    description: {
      en: "Tailored solutions that solve your specific business challenges. From internal tools to customer-facing platforms, built for scale and performance.",
    },
    icon: "layers",
    featured: true,
  },
  {
    _id: "svc-2",
    title: {
      en: "E-commerce Solutions",
    },
    description: {
      en: "High-converting online stores optimized for revenue. Seamless checkout flows, inventory management, and analytics that drive growth.",
    },
    icon: "shopping-cart",
    featured: true,
  },
  {
    _id: "svc-3",
    title: {
      en: "Performance Optimization",
    },
    description: {
      en: "Speed is money. I audit, optimize, and transform slow websites into lightning-fast experiences that keep users engaged.",
    },
    icon: "zap",
    featured: false,
  },
  {
    _id: "svc-4",
    title: {
      en: "MVP Development",
    },
    description: {
      en: "Get to market fast. I help startups validate ideas quickly with lean, functional products that impress investors.",
    },
    icon: "rocket",
    featured: false,
  },
  {
    _id: "svc-5",
    title: {
      en: "UI/UX Implementation",
    },
    description: {
      en: "Pixel-perfect execution of your designs. I bridge the gap between design vision and working product.",
    },
    icon: "palette",
    featured: false,
  },
  {
    _id: "svc-6",
    title: {
      en: "Ongoing Support",
    },
    description: {
      en: "Long-term partnership for maintenance, updates, and continuous improvement. Your product evolves as your business grows.",
    },
    icon: "headphones",
    featured: false,
  },
];

