"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
