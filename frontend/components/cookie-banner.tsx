"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

export const COOKIE_CONSENT_EVENT = "cookie-consent-updated";
export const SHOW_COOKIE_BANNER_EVENT = "show-cookie-banner";
const COOKIE_CONSENT_KEY = "cookie-consent-choice-made";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
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

  const handleRejectOptional = () => {
    posthog.opt_out_capturing();
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { tracking: false } })
    );
    setTrackingConsent(false);
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
                      {/* Essential storage */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch disabled checked id="necessary" />
                            <Label
                              htmlFor="necessary"
                              className="text-sm font-semibold text-foreground/60"
                            >
                              {t("essential.title")}
                            </Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t("essential.description")}
                        </p>
                      </div>

                      {/* Optional analytics and marketing */}
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
                              {t("optional.title")}
                            </Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t("optional.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-lg font-bold tracking-tight">
                    {t("title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("description")}{" "}
                    <Link
                      href="/privacy-policy"
                      className="transition-colors hover:text-foreground"
                    >
                      {t("privacyLink")}
                    </Link>
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
                        {t("manage")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRejectOptional}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        {t("reject")}
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                      >
                        {t("accept")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsExpanded(false)}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        {t("close")}
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                      >
                        {t("save")}
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
