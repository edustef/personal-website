"use client";

import { trackContactEvent } from "@/lib/tracking";

type HeroContactButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function HeroContactButton({
  href,
  children,
  onClick,
  ...props
}: HeroContactButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackContactEvent();
    onClick?.(e);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
