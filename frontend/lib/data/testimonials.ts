export type Testimonial = {
  _id: string;
  quote: {
    en: string;
    ro?: string;
    es?: string;
  };
  author: string;
  role: string;
  company: string;
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    _id: "test-1",
    quote: {
      en: "Eduard transformed our outdated platform into something our users genuinely love. The attention to detail and focus on performance made all the difference. Our conversion rates speak for themselves.",
    },
    author: "Marcus Chen",
    role: "CEO",
    company: "TechFlow Solutions",
  },
  {
    _id: "test-2",
    quote: {
      en: "Working with Eduard was a game-changer for our startup. He delivered our MVP in record time without cutting corners. We secured our seed round largely because of how polished the product was.",
    },
    author: "Sarah Mitchell",
    role: "Co-Founder",
    company: "Finova",
  },
  {
    _id: "test-3",
    quote: {
      en: "I've worked with many developers, but Eduard stands out. He doesn't just write code—he understands business objectives and builds solutions that drive real results.",
    },
    author: "David Park",
    role: "Product Director",
    company: "ScaleUp Agency",
  },
  {
    _id: "test-4",
    quote: {
      en: "Our e-commerce site was bleeding money due to poor mobile experience. Eduard's optimization work paid for itself within the first month. Highly recommend.",
    },
    author: "Elena Rodriguez",
    role: "Founder",
    company: "Bloom & Co",
  },
];

