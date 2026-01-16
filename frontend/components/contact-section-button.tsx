"use client";

import { Link } from "@/i18n/navigation";
import { trackContactEvent } from "@/lib/tracking";

type ContactSectionLinkButtonProps = {
  href: string;
  children: React.ReactNode;
};

export function ContactSectionLinkButton({
  href,
  children,
}: ContactSectionLinkButtonProps) {
  return (
    <Link href={href} onClick={trackContactEvent}>
      {children}
    </Link>
  );
}

type ContactSectionAnchorButtonProps = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
};

export function ContactSectionAnchorButton({
  href,
  ariaLabel,
  children,
}: ContactSectionAnchorButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={trackContactEvent}
    >
      {children}
    </a>
  );
}
