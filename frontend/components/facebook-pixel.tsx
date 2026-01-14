"use client";

import Script from "next/script";
import posthog from "posthog-js";
import { Suspense, useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT } from "./cookie-banner";

const FB_PIXEL_ID = "1797213360812301";

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    fbq: any;
  }
}

const FacebookPixelInstance = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const checkConsent = () => {
      const consent = posthog.has_opted_in_capturing();
      setHasConsent(consent);
    };

    checkConsent();

    // Listen for updates from CookieBanner
    const handleUpdate = () => {
      checkConsent();
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleUpdate);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    if (hasConsent && typeof window.fbq !== "undefined") {
      window.fbq("track", "PageView");
    }
  }, [hasConsent]);

  if (!hasConsent) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export const FacebookPixel = () => {
  return (
    <Suspense fallback={null}>
      <FacebookPixelInstance />
    </Suspense>
  );
};
