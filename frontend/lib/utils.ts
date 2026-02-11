import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CommonProps = {
  className?: string;
  children: React.ReactNode;
};

export const productionHost = "https://eduardstefan.dev";

const DEFAULT_WHATSAPP_NUMBER = "40775378525";

export function getWhatsAppUrl(phone: string | undefined): string;
export function getWhatsAppUrl(
  phone: string | undefined,
  fallbackNumber: string
): string;
export function getWhatsAppUrl(
  phone: string | undefined,
  fallbackNumber: undefined
): string | undefined;
export function getWhatsAppUrl(
  phone: string | undefined,
  fallbackNumber: string | undefined = DEFAULT_WHATSAPP_NUMBER
): string | undefined {
  if (phone) {
    return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
  }
  return fallbackNumber ? `https://wa.me/${fallbackNumber}` : undefined;
}

export function getBaseUrl(): string {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_SITE_URL
  ) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return productionHost;
}
