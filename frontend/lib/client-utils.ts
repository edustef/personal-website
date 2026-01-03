"use client";

import { toast } from "sonner";

export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error);
    toast.error(error.name, {
      description: error.message,
      duration: Number.POSITIVE_INFINITY,
    });
  } else {
    console.error(error);
    toast.error("Unknown error", {
      description: "Check the console for more details",
      duration: Number.POSITIVE_INFINITY,
    });
  }
}
