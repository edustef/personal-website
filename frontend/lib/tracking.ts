"use client";

import posthog from "posthog-js";

declare global {
  interface Window {
    fbq: any;
  }
}

export function trackContactEvent() {
  if (typeof window === "undefined") return;

  const hasConsent = posthog.has_opted_in_capturing();
  if (!hasConsent) return;

  if (typeof window.fbq !== "undefined") {
    window.fbq("track", "Contact");
  }
}
