"use client";

import { trackContactEvent } from "@/lib/tracking";

type HeroContactButtonProps = {
  href: string;
  children: React.ReactNode;
};

export function HeroContactButton({ href, children }: HeroContactButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackContactEvent}
    >
      {children}
    </a>
  );
}
