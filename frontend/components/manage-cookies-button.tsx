"use client";

import { SHOW_COOKIE_BANNER_EVENT } from "./cookie-banner";

export function ManageCookiesButton({
  children,
}: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(SHOW_COOKIE_BANNER_EVENT))
      }
      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
    >
      {children}
    </button>
  );
}
