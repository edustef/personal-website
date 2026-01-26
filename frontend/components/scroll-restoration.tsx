"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useLayoutEffect } from "react";

export function ScrollRestoration() {
  const pathname = usePathname();

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Use useLayoutEffect to scroll before paint
  useLayoutEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
