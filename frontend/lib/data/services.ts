export type Service = {
  _id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  featured: boolean;
};

export const services: Service[] = [
  {
    _id: "svc-1",
    titleKey: "svc-1.title",
    descriptionKey: "svc-1.description",
    icon: "layers",
    featured: true,
  },
  {
    _id: "svc-2",
    titleKey: "svc-2.title",
    descriptionKey: "svc-2.description",
    icon: "palette",
    featured: true,
  },
  {
    _id: "svc-3",
    titleKey: "svc-3.title",
    descriptionKey: "svc-3.description",
    icon: "rocket",
    featured: false,
  },
  {
    _id: "svc-4",
    titleKey: "svc-4.title",
    descriptionKey: "svc-4.description",
    icon: "headphones",
    featured: false,
  },
];
