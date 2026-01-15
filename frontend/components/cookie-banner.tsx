"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

export const COOKIE_CONSENT_EVENT = "cookie-consent-updated";
export const SHOW_COOKIE_BANNER_EVENT = "show-cookie-banner";
const COOKIE_CONSENT_KEY = "cookie-consent-choice-made";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackingConsent, setTrackingConsent] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ tracking: boolean }>;
      setTrackingConsent(customEvent.detail.tracking);
    };

    const handleShowBanner = () => {
      setIsVisible(true);
      setIsExpanded(false);
      setTrackingConsent(posthog.has_opted_in_capturing());
    };

    const checkConsent = () => {
      if (typeof window === "undefined") return;

      const hasExplicitChoice = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!hasExplicitChoice) {
        setIsVisible(true);
        setIsExpanded(false);
      } else {
        setTrackingConsent(posthog.has_opted_in_capturing());
      }
    };

    checkConsent();

    window.addEventListener(COOKIE_CONSENT_EVENT, handleUpdate);
    window.addEventListener(SHOW_COOKIE_BANNER_EVENT, handleShowBanner);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleUpdate);
      window.removeEventListener(SHOW_COOKIE_BANNER_EVENT, handleShowBanner);
    };
  }, []);

  const handleAcceptAll = () => {
    posthog.opt_in_capturing();
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { tracking: true } })
    );
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    if (trackingConsent) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, {
        detail: { tracking: trackingConsent },
      })
    );
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card/95 p-6 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col gap-6">
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 w-full">
                      {/* Necessary Cookies */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch disabled checked id="necessary" />
                            <Label
                              htmlFor="necessary"
                              className="text-sm font-semibold text-foreground/60"
                            >
                              Necessary Cookies
                            </Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Necessary cookies enable core functionalities. The
                          website cannot function properly without these
                          cookies. They can only be disabled by changing your
                          browser settings.
                        </p>
                      </div>

                      {/* Analytics & Marketing */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              id="tracking"
                              checked={trackingConsent}
                              onCheckedChange={setTrackingConsent}
                              className="data-[state=checked]:bg-primary"
                            />
                            <Label
                              htmlFor="tracking"
                              className="text-sm font-semibold text-primary"
                            >
                              Analytics & Marketing Cookies
                            </Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Analytics & Marketing cookies help us to improve our
                          website by collecting and reporting information on how
                          you use it.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-lg font-bold tracking-tight">
                    This website uses cookies
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Some cookies are necessary and enable core functionalities
                    such as security and accessibility. For more information on
                    how these cookies work please see our{" "}
                    <a
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-foreground transition-colors"
                    >
                      Data Protection Policy
                    </a>
                    .
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                  {!isExpanded ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsExpanded(true)}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Manage cookies settings
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                      >
                        Accept
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsExpanded(false)}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Close cookies settings
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                      >
                        Save changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
