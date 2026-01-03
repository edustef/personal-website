import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CommonProps = {
  className?: string;
  children: React.ReactNode;
};

export function getBaseUrl(): string {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_SITE_URL
  ) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "https://eduardstefan.dev";
}
