"use client";

import { Link, getPathname } from "@/i18n/navigation";
import { trackContactEvent } from "@/lib/tracking";

type ContactSectionLinkButtonProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: Parameters<typeof getPathname>[0]["href"];
};

export function ContactSectionLinkButton({
  href,
  children,
  onClick,
  ...props
}: ContactSectionLinkButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackContactEvent();
    onClick?.(e);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

type ContactSectionAnchorButtonProps =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    ariaLabel: string;
  };

export function ContactSectionAnchorButton({
  href,
  ariaLabel,
  children,
  onClick,
  ...props
}: ContactSectionAnchorButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackContactEvent();
    onClick?.(e);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
