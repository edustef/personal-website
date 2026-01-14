import posthog from "posthog-js";
import { getBaseUrl } from "./lib/utils";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: `${getBaseUrl()}/magical-app`,
    cookieless_mode: "on_reject",
    defaults: "2025-05-24",
    opt_out_capturing_by_default: true,
  });
}
