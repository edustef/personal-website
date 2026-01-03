import posthog from "posthog-js";
import { getBaseUrl } from "./lib/utils";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
  api_host: `${getBaseUrl()}/magical-app`,
  cookieless_mode: "always",
  defaults: "2025-05-24",
});
