import { BlockContent } from "@/sanity.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CommonProps = {
  className?: string;
  children: React.ReactNode;
};